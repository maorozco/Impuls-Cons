/**
 * Pain Synthesizer Agent — weekly roll-up, Sonnet 4.7.
 */

import { query, isDbMock, closeDb } from '../shared/db';
import { callLlm, isLlmMock, llmStub, providerLabel } from '../shared/llm';
import { lintBannedPhrases } from '../shared/banned';
import { sanitizeForPrompt } from '../shared/sanitize';
import { FIXTURE_MODE, MODEL_SONNET, log } from '../shared/config';

const WINDOW_DAYS = 7;
const TOP_N_POSTS = 100;

interface ThemeOutput {
  theme: string;
  avatar_match: string;
  quote_count: number;
  top_quotes: Array<{ quote: string; url: string; subreddit: string }>;
}

interface SynthesisOutput {
  themes: ThemeOutput[];
  source_posts_count: number;
}

interface SourcePost {
  id: number;
  title: string;
  body: string | null;
  subreddit: string;
  url: string;
  avatar_match: string | null;
  pain_intensity: number | null;
}

const SYSTEM_PROMPT = `You are a pain synthesizer for Impulso BioCycle.

Reading real complaints from Reddit, your job is to identify the top 5 recurring pain themes (in the last 7 days) and provide verbatim quotes that make the pain concrete.

**Output:** strict JSON:
{
  "themes": [
    {
      "theme": "Short descriptive label (≤60 chars)",
      "avatar_match": "remediation_pm_usa" | "hseq_latam" | "compliance_eu" | "apac" | "mixed",
      "quote_count": <number>,
      "top_quotes": [
        { "quote": "verbatim ≤180 chars", "url": "<post url>", "subreddit": "<subreddit name>" }
      ]
    }
  ],
  "source_posts_count": <number>
}

**Rules:**
- Quotes must be verbatim substrings. NO paraphrase. NO invention.
- Up to 3 quotes per theme; skip themes with <2 supporting quotes.
- Focus on real pain, not marketing noise.
- Output JSON only.`;

function buildUserMessage(posts: SourcePost[]): string {
  const lines = posts.map(
    (p) =>
      `<post id="${p.id}" subreddit="${p.subreddit}" url="${p.url}" avatar="${p.avatar_match ?? 'none'}" pain="${p.pain_intensity ?? 0}">\n${sanitizeForPrompt(p.title)}\n${sanitizeForPrompt(p.body ?? '')}\n</post>`,
  );
  return `Here are ${posts.length} high-pain posts from the last ${WINDOW_DAYS} days. Extract the top 5 pain themes as JSON.\n\n${lines.join('\n\n')}`;
}

async function synthesize(posts: SourcePost[]): Promise<SynthesisOutput> {
  if (isLlmMock()) return llmStub('synthesize', posts) as SynthesisOutput;
  const text = await callLlm(
    {
      system: SYSTEM_PROMPT,
      user: buildUserMessage(posts),
      maxTokens: 4096,
      modelHint: 'synthesizer',
      cacheSystem: true,
    },
    MODEL_SONNET,
  );
  if (!text) throw new Error('[synthesizer] empty response');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('[synthesizer] no JSON');
  return JSON.parse(match[0]) as SynthesisOutput;
}

async function fetchSourcePosts(): Promise<SourcePost[]> {
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
      url: string;
    }>;
    return posts.map((p, idx) => ({
      id: idx + 1,
      title: p.title,
      body: p.body ?? null,
      subreddit: p.subreddit,
      url: p.url,
      avatar_match: null,
      pain_intensity: 4,
    }));
  }

  const res = await query<SourcePost>(
    `SELECT p.id, p.title, p.body, p.subreddit, p.url,
            c.avatar_match, c.pain_intensity
     FROM reddit_posts p
     INNER JOIN reddit_classifications c ON c.post_ref = p.id
     WHERE p.fetched_at > NOW() - INTERVAL '${WINDOW_DAYS} days'
       AND c.pain_intensity >= 3
     ORDER BY c.pain_intensity DESC
     LIMIT $1`,
    [TOP_N_POSTS],
  );
  return res.rows;
}

async function insertSynthesis(out: SynthesisOutput, model: string) {
  if (isDbMock()) {
    log('info', `[synthesizer] [mock-db] would insert synthesis with ${out.themes.length} themes`);
    log('info', '[synthesizer] result', JSON.stringify(out, null, 2));
    return;
  }
  await query(
    `INSERT INTO pain_synthesis
       (window_start, window_end, themes, source_posts_count, synthesizer_model)
     VALUES (NOW() - INTERVAL '${WINDOW_DAYS} days', NOW(), $1, $2, $3)`,
    [JSON.stringify(out.themes), out.source_posts_count, model],
  );
}

async function main() {
  log('info', `[synthesizer] starting (fixture=${FIXTURE_MODE}, llmMock=${isLlmMock()})`);

  const posts = await fetchSourcePosts();
  log('info', `[synthesizer] ${posts.length} high-pain posts in window`);
  if (posts.length === 0) {
    log('info', '[synthesizer] nothing to synthesize');
    await closeDb();
    return;
  }

  const out = await synthesize(posts);
  for (const t of out.themes) {
    for (const q of t.top_quotes) {
      const hits = lintBannedPhrases(q.quote);
      if (hits.length > 0) {
        log('warn', `[synthesizer] theme "${t.theme}" has banned phrases`, hits);
      }
    }
  }

  const modelUsed = isLlmMock() ? 'stub' : `${providerLabel()}/${MODEL_SONNET}`;
  await insertSynthesis(out, modelUsed);
  log('info', `[synthesizer] synthesized ${out.themes.length} themes via ${modelUsed}`);

  await closeDb();
}

main().catch((err) => {
  log('error', '[synthesizer] fatal', err);
  process.exit(1);
});
