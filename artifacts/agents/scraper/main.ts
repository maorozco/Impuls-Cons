/**
 * Scraper Agent — Reddit via Apify.
 *
 * - FIXTURE mode (AGENT_FIXTURE_MODE=true): reads fixtures/reddit-posts.json.
 *   No network calls. Deterministic. Used in dev + CI.
 * - LIVE mode: calls Apify actor `trudax/reddit-scraper` per-subreddit.
 *
 * Output: inserts into `reddit_posts` with ON CONFLICT DO NOTHING
 * (dedupe by (subreddit, post_id)).
 */

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApifyClient } from 'apify-client';
import { query, isDbMock, closeDb } from '../shared/db';
import { FIXTURE_MODE, getSubreddits, log } from '../shared/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface RawPost {
  post_id: string;
  subreddit: string;
  title: string;
  body?: string | null;
  author?: string | null;
  url: string;
  upvotes?: number;
  num_comments?: number;
  posted_at?: string | null;
}

async function loadFixturePosts(): Promise<RawPost[]> {
  const p = resolve(__dirname, '../fixtures/reddit-posts.json');
  const raw = await readFile(p, 'utf-8');
  return JSON.parse(raw) as RawPost[];
}

/**
 * Direct Reddit public JSON API (no auth, ~60 req/min anonymous).
 * Used as the production path — avoids paid Apify actor rental and runs anywhere.
 * Kept as `fetchApifyPosts`-compatible in signature so the rest of the pipeline stays the same.
 */
async function fetchRedditPublic(subreddits: string[]): Promise<RawPost[]> {
  const all: RawPost[] = [];
  const UA = 'ImpulsoBioCycle/0.1 (research; contact: hola@biocycle.ai)';
  const PER_SUB_LIMIT = Number(process.env.REDDIT_PER_SUB_LIMIT ?? 50);

  for (const sub of subreddits) {
    try {
      const url = `https://www.reddit.com/r/${sub}/new.json?limit=${PER_SUB_LIMIT}&raw_json=1`;
      const resp = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!resp.ok) {
        log('warn', `[scraper] r/${sub} → ${resp.status}`);
        continue;
      }
      const data = (await resp.json()) as {
        data?: { children?: Array<{ data?: Record<string, unknown> }> };
      };
      const children = data.data?.children ?? [];
      for (const c of children) {
        const d = c.data;
        if (!d) continue;
        const postId = String(d.id ?? '');
        const subredditName = String(d.subreddit ?? sub);
        if (!postId) continue;
        all.push({
          post_id: postId,
          subreddit: subredditName,
          title: String(d.title ?? ''),
          body: (d.selftext as string | null) || null,
          author: (d.author as string | null) ?? null,
          url: `https://reddit.com${d.permalink ?? `/r/${sub}/comments/${postId}`}`,
          upvotes: Number(d.ups ?? d.score ?? 0),
          num_comments: Number(d.num_comments ?? 0),
          posted_at: d.created_utc ? new Date(Number(d.created_utc) * 1000).toISOString() : null,
        });
      }
      log('info', `[scraper] r/${sub} → ${children.length} posts`);
      // Be polite to Reddit's anonymous tier
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      log('warn', `[scraper] r/${sub} threw`, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return all;
}

async function fetchApifyPosts(subreddits: string[]): Promise<RawPost[]> {
  const apiToken = process.env.APIFY_API_KEY;
  if (!apiToken || process.env.SCRAPER_BACKEND === 'reddit') {
    return fetchRedditPublic(subreddits);
  }
  const client = new ApifyClient({ token: apiToken });

  const input = {
    startUrls: subreddits.map((s) => ({ url: `https://www.reddit.com/r/${s}/new/` })),
    skipComments: true,
    maxItems: 50,
    maxPostCount: 50,
    searchSort: 'new',
    searchTime: 'week',
    proxy: { useApifyProxy: true },
  };

  log('info', `[scraper] launching Apify actor for ${subreddits.length} subreddits`);
  try {
    const run = await client.actor('trudax/reddit-scraper').call(input, { timeout: 300 });
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    log('info', `[scraper] Apify returned ${items.length} items`);
    return normalizeApifyItems(items as Array<Record<string, unknown>>);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log('warn', `[scraper] Apify actor failed (${msg.slice(0, 120)}) — falling back to Reddit public API`);
    return fetchRedditPublic(subreddits);
  }
}

function normalizeApifyItems(items: Array<Record<string, unknown>>): RawPost[] {

  const normalized: RawPost[] = [];
  for (const raw of items as Array<Record<string, unknown>>) {
    const postId =
      (raw.id as string) ?? (raw.postId as string) ?? (raw.parsedId as string) ?? '';
    const subredditName =
      (raw.parsedCommunityName as string) ??
      (raw.subredditName as string) ??
      (raw.subreddit as string) ??
      '';
    const url = (raw.url as string) ?? `https://reddit.com${raw.permalink ?? ''}`;
    if (!postId || !subredditName) continue;
    normalized.push({
      post_id: postId,
      subreddit: subredditName,
      title: (raw.title as string) ?? '',
      body: ((raw.body ?? raw.text ?? raw.selftext) as string | null) ?? null,
      author: ((raw.username ?? raw.author) as string | null) ?? null,
      url,
      upvotes: (raw.upVotes as number) ?? (raw.upvotes as number) ?? 0,
      num_comments: (raw.numberOfComments as number) ?? (raw.numComments as number) ?? 0,
      posted_at: ((raw.createdAt as string | null) ?? null),
    });
  }
  return normalized;
}

async function insertPosts(posts: RawPost[]): Promise<number> {
  if (posts.length === 0) return 0;
  if (isDbMock()) {
    log('info', `[scraper] [mock-db] would insert ${posts.length} posts`);
    return posts.length;
  }
  let inserted = 0;
  for (const p of posts) {
    const res = await query<{ id: number }>(
      `INSERT INTO reddit_posts
         (post_id, subreddit, title, body, author, url, upvotes, num_comments, posted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (subreddit, post_id) DO NOTHING
       RETURNING id`,
      [
        p.post_id,
        p.subreddit,
        p.title,
        p.body ?? null,
        p.author ?? null,
        p.url,
        p.upvotes ?? 0,
        p.num_comments ?? 0,
        p.posted_at ? new Date(p.posted_at) : null,
      ],
    );
    if (res.rowCount > 0) inserted++;
  }
  return inserted;
}

async function main() {
  const subreddits = getSubreddits();
  log('info', `[scraper] starting (fixture=${FIXTURE_MODE}, dbMock=${isDbMock()})`);
  log('info', `[scraper] target subreddits: ${subreddits.length}`);

  const posts = FIXTURE_MODE ? await loadFixturePosts() : await fetchApifyPosts(subreddits);
  log('info', `[scraper] fetched ${posts.length} posts`);

  const inserted = await insertPosts(posts);
  log('info', `[scraper] inserted ${inserted} new posts (deduped by (subreddit, post_id))`);

  if (!isDbMock()) {
    const res = await query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM reddit_posts`,
    );
    const total = res.rows[0]?.total;
    if (typeof total === 'number') log('info', `[scraper] reddit_posts total rows: ${total}`);
  }

  await closeDb();
}

main().catch((err) => {
  log('error', '[scraper] fatal', err);
  process.exit(1);
});
