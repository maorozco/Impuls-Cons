/**
 * Competitive Intel Agent.
 */

import { query, isDbMock, closeDb } from '../shared/db';
import { callLlm, isLlmMock } from '../shared/llm';
import { sanitizeForPrompt } from '../shared/sanitize';
import { FIXTURE_MODE, MODEL_HAIKU, log } from '../shared/config';

const COMPETITORS = [
  { name: 'Carbios', regex: /\bcarbios\b/i },
  { name: 'Novozymes', regex: /\bnovozymes\b/i },
  { name: 'Genomatica', regex: /\bgenomatica\b/i },
  { name: 'Pivot Bio', regex: /pivot[\s-]?bio/i },
  { name: 'Aquatech', regex: /\baquatech\b/i },
  { name: 'Veolia', regex: /\bveolia\b/i },
  { name: 'AECOM', regex: /\baecom\b/i },
  { name: 'Ginkgo Bioworks', regex: /\bginkgo\b/i },
  { name: 'Regenesis', regex: /\bregenesis\b/i },
  { name: 'EOS Remediation', regex: /\beos\s+remediation\b/i },
  { name: 'Protein Evolution', regex: /\bprotein\s+evolution\b/i },
  { name: 'Epoch Biodesign', regex: /\bepoch\s+biodesign\b/i },
  { name: 'Jacobs', regex: /\bjacobs engineering\b|\bjacobs\b(?=[^a-z]|$)/i },
  { name: 'ERM', regex: /\berm\b(?!\w)/i },
];

interface PostRow {
  id: number;
  title: string;
  body: string | null;
  url: string;
}

interface MentionCandidate {
  post_ref: number;
  competitor: string;
  context: string;
}

const CONTEXT_WINDOW = 220;

function extractContext(haystack: string, match: RegExpExecArray): string {
  const start = Math.max(0, match.index - CONTEXT_WINDOW / 2);
  const end = Math.min(haystack.length, match.index + match[0].length + CONTEXT_WINDOW / 2);
  return haystack.slice(start, end).replace(/\s+/g, ' ').trim();
}

function scanPost(p: PostRow): MentionCandidate[] {
  const text = `${p.title}\n${p.body ?? ''}`;
  const mentions: MentionCandidate[] = [];
  for (const c of COMPETITORS) {
    const m = c.regex.exec(text);
    if (m) {
      mentions.push({
        post_ref: p.id,
        competitor: c.name,
        context: extractContext(text, m),
      });
    }
  }
  return mentions;
}

async function scoreSentiment(mentions: MentionCandidate[]): Promise<number[]> {
  if (mentions.length === 0) return [];
  if (isLlmMock()) {
    return mentions.map((m) => {
      const c = m.context.toLowerCase();
      const neg = /expensive|overpriced|failed|bad|scam|greenwash|too slow|caro|fracas|no cumpl/.test(c);
      const pos = /impressive|good|recommend|worked|success|bien|bueno/.test(c);
      return neg ? -0.6 : pos ? 0.4 : 0;
    });
  }
  const text = await callLlm(
    {
      system: `You score sentiment of competitor mentions on a -1..+1 scale. -1 = very negative, 0 = neutral, +1 = very positive. Return a JSON array of numbers, one per mention, in order.`,
      user: mentions
        .map((m, i) => `#${i}: competitor=${m.competitor} context="${sanitizeForPrompt(m.context)}"`)
        .join('\n'),
      maxTokens: 1024,
      modelHint: 'classifier',
      cacheSystem: true,
    },
    MODEL_HAIKU,
  );
  if (!text) return mentions.map(() => 0);
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return mentions.map(() => 0);
  try {
    const arr = JSON.parse(match[0]);
    if (Array.isArray(arr)) {
      return arr.map((n) => (typeof n === 'number' ? Math.max(-1, Math.min(1, n)) : 0));
    }
  } catch {
    /* no-op */
  }
  return mentions.map(() => 0);
}

async function fetchPosts(): Promise<PostRow[]> {
  if (isDbMock()) {
    const { readFile } = await import('node:fs/promises');
    const { dirname, resolve } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const p = resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures/reddit-posts.json');
    const raw = await readFile(p, 'utf-8');
    const posts = JSON.parse(raw) as Array<{ title: string; body?: string | null; url: string }>;
    return posts.map((p, idx) => ({ id: idx + 1, title: p.title, body: p.body ?? null, url: p.url }));
  }
  const res = await query<PostRow>(
    `SELECT id, title, body, url FROM reddit_posts ORDER BY fetched_at DESC LIMIT 500`,
  );
  return res.rows;
}

async function insertMentions(mentions: MentionCandidate[], sentiments: number[]) {
  if (isDbMock()) {
    log('info', `[competitive] [mock-db] would insert ${mentions.length} mentions`);
    mentions.forEach((m, i) => {
      log('info', `  - ${m.competitor}: sentiment=${sentiments[i].toFixed(2)} — "${m.context.slice(0, 100)}..."`);
    });
    return;
  }
  for (let i = 0; i < mentions.length; i++) {
    await query(
      `INSERT INTO competitor_mentions (post_ref, competitor, context, sentiment)
       VALUES ($1, $2, $3, $4)`,
      [mentions[i].post_ref, mentions[i].competitor, mentions[i].context, sentiments[i]],
    );
  }
}

async function main() {
  log('info', `[competitive] starting (fixture=${FIXTURE_MODE}, llmMock=${isLlmMock()})`);
  const posts = await fetchPosts();
  log('info', `[competitive] scanning ${posts.length} posts`);

  const mentions: MentionCandidate[] = [];
  for (const p of posts) mentions.push(...scanPost(p));
  log('info', `[competitive] found ${mentions.length} competitor mentions`);

  if (mentions.length === 0) {
    await closeDb();
    return;
  }

  const sentiments = await scoreSentiment(mentions);
  await insertMentions(mentions, sentiments);

  const byCompetitor = new Map<string, { count: number; avgSentiment: number }>();
  mentions.forEach((m, i) => {
    const prev = byCompetitor.get(m.competitor) ?? { count: 0, avgSentiment: 0 };
    const newCount = prev.count + 1;
    byCompetitor.set(m.competitor, {
      count: newCount,
      avgSentiment: (prev.avgSentiment * prev.count + sentiments[i]) / newCount,
    });
  });
  log('info', '[competitive] digest:');
  for (const [name, stats] of byCompetitor.entries()) {
    log('info', `  ${name}: ${stats.count} mentions, avg sentiment ${stats.avgSentiment.toFixed(2)}`);
  }

  await closeDb();
}

main().catch((err) => {
  log('error', '[competitive] fatal', err);
  process.exit(1);
});
