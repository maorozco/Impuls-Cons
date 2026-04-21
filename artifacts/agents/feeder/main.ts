/**
 * Pitch Feeder Agent — writes candidate drafts to agent_drafts.
 * Humans approve in /admin/insights. Never auto-posts.
 */

import { query, isDbMock, closeDb } from '../shared/db';
import { callLlm, isLlmMock, llmStub, providerLabel } from '../shared/llm';
import { lintBannedPhrases } from '../shared/banned';
import { FIXTURE_MODE, MODEL_SONNET, log } from '../shared/config';

type DraftKind = 'slide_quote' | 'tweet' | 'newsletter';

interface DraftOutput {
  kind: DraftKind;
  content: string;
  sources: string[];
  banned_phrase_hits: string[];
}

interface FeederOutput {
  drafts: DraftOutput[];
}

interface PainSynthesisSnapshot {
  themes: Array<{
    theme: string;
    avatar_match: string;
    quote_count: number;
    top_quotes: Array<{ quote: string; url: string; subreddit: string }>;
  }>;
  source_posts_count: number;
}

const SYSTEM_PROMPT = `You help Impulso BioCycle turn weekly Reddit pain synthesis into pitch-ready and build-in-public content.

**Hard rules — if broken, the output is rejected:**
- NEVER promise: "clean the ocean", "plastic disappears", "capsules on beaches", GMO release, AlphaFold commercial use, "SaaS ready", guaranteed remediation, Carbios parity.
- ALWAYS preserve verbatim Reddit quotes when citing — do not paraphrase.
- ALWAYS attach the pivot A+C context implicitly: plastic = biorreactor contenido, cápsulas = only for soil HC/pesticides.
- Tone: human, warm, transparent.

**Output format — strict JSON:**
{
  "drafts": [
    { "kind": "slide_quote", "content": "...", "sources": ["<url>"], "banned_phrase_hits": [] },
    { "kind": "slide_quote", "content": "...", "sources": ["<url>"], "banned_phrase_hits": [] },
    { "kind": "tweet", "content": "<≤270 chars>", "sources": ["<url>"], "banned_phrase_hits": [] },
    { "kind": "tweet", "content": "...", "sources": ["<url>"], "banned_phrase_hits": [] },
    { "kind": "newsletter", "content": "<2-3 paragraphs>", "sources": ["<url>"], "banned_phrase_hits": [] }
  ]
}

Generate: 2 slide_quote, 2 tweet, 1 newsletter. Output JSON only.`;

function buildUserMessage(synthesis: PainSynthesisSnapshot): string {
  const lines = synthesis.themes.map(
    (t, i) =>
      `Theme ${i + 1}: ${t.theme} (avatar: ${t.avatar_match}, quotes: ${t.quote_count})\n` +
      t.top_quotes.map((q) => `  - "${q.quote}" — r/${q.subreddit} (${q.url})`).join('\n'),
  );
  return `Last week's synthesis (${synthesis.themes.length} themes):\n\n${lines.join('\n\n')}\n\nGenerate pitch-ready drafts as JSON.`;
}

async function generate(synthesis: PainSynthesisSnapshot): Promise<FeederOutput> {
  if (isLlmMock()) return llmStub('feeder', synthesis) as FeederOutput;
  const text = await callLlm(
    {
      system: SYSTEM_PROMPT,
      user: buildUserMessage(synthesis),
      maxTokens: 2048,
      modelHint: 'feeder',
      cacheSystem: true,
    },
    MODEL_SONNET,
  );
  if (!text) throw new Error('[feeder] empty response');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('[feeder] no JSON');
  return JSON.parse(match[0]) as FeederOutput;
}

async function fetchLatestSynthesis(): Promise<PainSynthesisSnapshot | null> {
  if (isDbMock()) {
    return {
      themes: [
        {
          theme: '[FIXTURE] EPA PFAS deadline anxiety',
          avatar_match: 'remediation_pm_usa',
          quote_count: 5,
          top_quotes: [
            {
              quote: 'We got a formal notice last week. Legacy AFFF use…',
              url: 'https://reddit.com/r/PFAS/comments/f1x01',
              subreddit: 'PFAS',
            },
          ],
        },
      ],
      source_posts_count: 10,
    };
  }
  const res = await query<{ themes: unknown; source_posts_count: number }>(
    `SELECT themes, source_posts_count FROM pain_synthesis
     ORDER BY created_at DESC LIMIT 1`,
  );
  const row = res.rows[0];
  if (!row) return null;
  const themes = typeof row.themes === 'string' ? JSON.parse(row.themes) : row.themes;
  return {
    themes: themes as PainSynthesisSnapshot['themes'],
    source_posts_count: row.source_posts_count,
  };
}

async function insertDrafts(drafts: DraftOutput[]) {
  if (isDbMock()) {
    log('info', `[feeder] [mock-db] would insert ${drafts.length} drafts`);
    drafts.forEach((d, i) => {
      const flag = d.banned_phrase_hits.length > 0 ? ' ⚠️BANNED' : '';
      log('info', `  [${i + 1}] ${d.kind}${flag}: ${d.content.slice(0, 120)}...`);
    });
    return;
  }
  for (const d of drafts) {
    await query(
      `INSERT INTO agent_drafts (kind, content, sources, banned_phrase_hits)
       VALUES ($1, $2, $3, $4)`,
      [d.kind, d.content, JSON.stringify(d.sources ?? []), JSON.stringify(d.banned_phrase_hits ?? [])],
    );
  }
}

async function main() {
  log('info', `[feeder] starting (fixture=${FIXTURE_MODE}, llmMock=${isLlmMock()})`);
  const synthesis = await fetchLatestSynthesis();
  if (!synthesis) {
    log('info', '[feeder] no synthesis available — skipping');
    await closeDb();
    return;
  }

  const out = await generate(synthesis);

  for (const d of out.drafts) {
    const hits = lintBannedPhrases(d.content);
    if (hits.length > 0) {
      d.banned_phrase_hits = hits.map((h) => `${h.phrase} (${h.reason})`);
      log('warn', `[feeder] draft has banned phrases`, d.banned_phrase_hits);
    }
  }

  await insertDrafts(out.drafts);

  const banned = out.drafts.filter((d) => d.banned_phrase_hits.length > 0).length;
  log('info', `[feeder] wrote ${out.drafts.length} drafts (${banned} flagged)`);

  await closeDb();
}

main().catch((err) => {
  log('error', '[feeder] fatal', err);
  process.exit(1);
});
