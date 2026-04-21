import 'dotenv/config';

/** Default subreddit list, USA-heavy per marketing/AVATAR-IDEAL.md + plan workstream A. */
export const DEFAULT_SUBREDDITS = [
  // USA — pain USA
  'environmental_science',
  'PFAS',
  'hazmat',
  'Geotech',
  'enviroengineering',
  'water',
  'oilandgasworkers',
  // LATAM — Colombia panel context
  'mexico',
  'colombia',
  'argentina',
  'chile',
  // General waste / sustainability
  'composting',
  'ZeroWaste',
  'collapse',
  'sustainability',
  'environment',
];

export function getSubreddits(): string[] {
  const raw = process.env.SUBREDDITS_JSON?.trim();
  if (!raw) return DEFAULT_SUBREDDITS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((s) => typeof s === 'string')) return parsed;
  } catch {
    // fall back to comma list
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return DEFAULT_SUBREDDITS;
}

export const FIXTURE_MODE = process.env.AGENT_FIXTURE_MODE === 'true';
export const DB_MOCK_MODE =
  process.env.MOCK_DB === 'true' ||
  !process.env.DATABASE_URL ||
  /placeholder|localhost\.invalid|example\.com/.test(process.env.DATABASE_URL ?? '');

// LLM mock active when: we're in fixture mode OR neither provider has a key.
const _hasLlm =
  !!process.env.ANTHROPIC_API_KEY?.trim() || !!process.env.OPENROUTER_API_KEY?.trim();
export const LLM_MOCK_MODE = FIXTURE_MODE || !_hasLlm;

export const MODEL_HAIKU = 'claude-haiku-4-5-20251001';
export const MODEL_SONNET = 'claude-sonnet-4-6';
export const MODEL_OPUS = 'claude-opus-4-7';

export const LOG_LEVEL = (process.env.LOG_LEVEL ?? 'info') as 'debug' | 'info' | 'warn' | 'error';

export function log(level: 'debug' | 'info' | 'warn' | 'error', msg: string, extra?: unknown) {
  const order = { debug: 0, info: 1, warn: 2, error: 3 };
  if (order[level] < order[LOG_LEVEL]) return;
  const ts = new Date().toISOString();
  const tag = level.toUpperCase().padEnd(5);
  if (extra !== undefined) {
    console.log(`[${ts}] ${tag} ${msg}`, extra);
  } else {
    console.log(`[${ts}] ${tag} ${msg}`);
  }
}
