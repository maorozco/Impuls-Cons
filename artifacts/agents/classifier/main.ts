/**
 * Classifier Agent — Anthropic Haiku 4.5.
 *
 * For each reddit_post without a classification, extracts structured tags:
 *   { contaminant_type, region, severity, pain_intensity, avatar_match, banned_phrase_hits }
 */

import { query, isDbMock, closeDb } from '../shared/db';
import { callLlm, getProvider, isLlmMock, llmStub, providerLabel } from '../shared/llm';
import { lintBannedPhrases } from '../shared/banned';
import { sanitizeForPrompt } from '../shared/sanitize';
import { FIXTURE_MODE, MODEL_HAIKU, log } from '../shared/config';

const BATCH_SIZE = 20;

interface ClassifyOutput {
  post_ref: number;
  contaminant_type: string;
  region: string;
  severity: number;
  pain_intensity: number;
  avatar_match: string;
  banned_phrase_hits: string[];
}

interface PostToClassify {
  id: number;
  title: string;
  body: string | null;
  subreddit: string;
}

const SYSTEM_PROMPT = `You are a research classifier for Impulso BioCycle, an AI platform that designs microbial consortia for bioremediation.

You tag Reddit posts with structured fields. Be honest and conservative — when in doubt, use "none".

**Fields to extract per post:**
- contaminant_type: one of "hydrocarbons" | "pfas" | "plastics" | "soil_ag" | "mining" | "water_treatment" | "none"
- region: "USA" | "LATAM" | "EU" | "APAC" | "global" (infer from context, regulation references, language)
- severity: 1-5 (1=mild concern, 5=active crisis/lawsuit/deadline)
- pain_intensity: 1-5 (how frustrated is the author)
- avatar_match: one of "remediation_pm_usa" | "hseq_latam" | "compliance_eu" | "apac" | "none"

**Banned topics — if the post promotes any of these, list the matching phrase in banned_phrase_hits:**
- "clean the ocean with bacteria" / "limpiamos océanos"
- "plastic disappears in days" in field conditions
- capsules on beaches / cápsulas en playa
- AlphaFold commercial use claims
- GMO release into environment

**Output format:** Return a JSON array. One object per post, preserving post_ref exactly as given.`;

function buildUserMessage(posts: PostToClassify[]): string {
  const lines = posts.map(
    (p) =>
      `<post id="${p.id}" subreddit="${p.subreddit}">\nTITLE: ${sanitizeForPrompt(p.title)}\nBODY: ${sanitizeForPrompt(p.body ?? '')}\n</post>`,
  );
  return `Classify these ${posts.length} Reddit posts. Return a JSON array matching the schema described in the system prompt.\n\n${lines.join('\n\n')}`;
}

function safeParse(raw: string): ClassifyOutput[] | null {
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return null;
    return parsed as ClassifyOutput[];
  } catch {
    return null;
  }
}

async function classifyBatch(posts: PostToClassify[]): Promise<ClassifyOutput[]> {
  if (isLlmMock()) return llmStub('classify', posts) as ClassifyOutput[];

  const text = await callLlm(
    {
      system: SYSTEM_PROMPT,
      user: buildUserMessage(posts),
      maxTokens: 4096,
      modelHint: 'classifier',
      cacheSystem: true,
    },
    MODEL_HAIKU,
  );
  if (!text) return [];
  const parsed = safeParse(text);
  if (!parsed) {
    log('warn', '[classifier] unparseable response', { sample: text.slice(0, 200) });
    return [];
  }
  return parsed;
}

async function fetchPendingPosts(limit = 200): Promise<PostToClassify[]> {
  if (isDbMock()) {
    const { readFile } = await import('node:fs/promises');
    const { dirname, resolve } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const p = resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures/reddit-posts.json');
    const raw = await readFile(p, 'utf-8');
    const posts = JSON.parse(raw) as Array<{
      post_id: string;
      subreddit: string;
      title: string;
      body?: string | null;
    }>;
    return posts.slice(0, limit).map((p, idx) => ({
      id: idx + 1,
      title: p.title,
      body: p.body ?? null,
      subreddit: p.subreddit,
    }));
  }

  const res = await query<PostToClassify>(
    `SELECT p.id, p.title, p.body, p.subreddit
     FROM reddit_posts p
     LEFT JOIN reddit_classifications c ON c.post_ref = p.id
     WHERE c.id IS NULL
     LIMIT $1`,
    [limit],
  );
  return res.rows;
}

async function insertClassifications(classifications: ClassifyOutput[], model: string) {
  if (isDbMock()) {
    log('info', `[classifier] [mock-db] would insert ${classifications.length} classifications`);
    log('debug', '[classifier] sample classification', classifications[0]);
    return classifications.length;
  }
  let inserted = 0;
  for (const c of classifications) {
    const res = await query<{ id: number }>(
      `INSERT INTO reddit_classifications
         (post_ref, contaminant_type, region, severity, pain_intensity, avatar_match, banned_phrase_hits, classifier_model)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (post_ref) DO NOTHING
       RETURNING id`,
      [
        c.post_ref,
        c.contaminant_type,
        c.region,
        c.severity,
        c.pain_intensity,
        c.avatar_match,
        JSON.stringify(c.banned_phrase_hits ?? []),
        model,
      ],
    );
    if (res.rowCount > 0) inserted++;
  }
  return inserted;
}

async function main() {
  log('info', `[classifier] starting (fixture=${FIXTURE_MODE}, llmMock=${isLlmMock()})`);

  const posts = await fetchPendingPosts(200);
  log('info', `[classifier] ${posts.length} pending posts`);
  if (posts.length === 0) {
    await closeDb();
    return;
  }

  const allResults: ClassifyOutput[] = [];
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE);
    log('info', `[classifier] batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} posts)`);
    const results = await classifyBatch(batch);

    for (const r of results) {
      const post = batch.find((p) => p.id === r.post_ref);
      if (!post) continue;
      const hits = lintBannedPhrases(`${post.title} ${post.body ?? ''}`);
      if (hits.length > 0) {
        r.banned_phrase_hits = [
          ...(r.banned_phrase_hits ?? []),
          ...hits.map((h) => `${h.phrase} (${h.reason})`),
        ];
      }
    }
    allResults.push(...results);
  }

  const modelUsed = isLlmMock() ? 'stub' : `${providerLabel()}/${MODEL_HAIKU}`;
  const inserted = await insertClassifications(allResults, modelUsed);
  log('info', `[classifier] inserted ${inserted} classifications via ${modelUsed}`);

  await closeDb();
}

main().catch((err) => {
  log('error', '[classifier] fatal', err);
  process.exit(1);
});
