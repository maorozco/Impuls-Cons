/**
 * GET /api/insights — public daily aggregate.
 *
 * Powers:
 *   - Build-in-public widget on the landing (above-the-fold signup counter)
 *   - Slide 5 of the pitch deck ("we listened to N complaints this week")
 *   - Daily tweet drafts from the Pitch Feeder agent
 *
 * Cached on the server for INSIGHTS_CACHE_TTL_SECONDS (default 300).
 *
 * Mock mode: when DATABASE_URL is missing, returns a deterministic fixture
 * so local dev + Replit agents can still render the widget.
 */

import { NextResponse } from 'next/server';
import { desc, sql } from 'drizzle-orm';
import { db, isMockMode } from '@/lib/db';
import { waitlist, painSynthesis, redditClassifications, competitorMentions } from '@/drizzle/schema';

export const revalidate = 300; // matches cache TTL; override via env if needed

interface InsightsResponse {
  updated_at: string;
  mode: 'live' | 'mock';
  signups: {
    total: number;
    last_7d: number;
    countries: number;
  };
  reddit: {
    posts_classified_total: number;
    high_pain_7d: number;
    top_avatars_7d: Array<{ avatar: string; count: number }>;
  };
  top_pains: Array<{
    theme: string;
    avatar_match: string;
    quote_count: number;
    top_quote: { quote: string; subreddit: string; url: string } | null;
  }>;
  top_competitors_7d: Array<{ competitor: string; mentions: number; avg_sentiment: number }>;
}

function mockPayload(): InsightsResponse {
  return {
    updated_at: new Date().toISOString(),
    mode: 'mock',
    signups: { total: 42, last_7d: 18, countries: 7 },
    reddit: {
      posts_classified_total: 287,
      high_pain_7d: 64,
      top_avatars_7d: [
        { avatar: 'remediation_pm_usa', count: 34 },
        { avatar: 'hseq_latam', count: 21 },
        { avatar: 'compliance_eu', count: 9 },
      ],
    },
    top_pains: [
      {
        theme: 'EPA PFAS deadline anxiety',
        avatar_match: 'remediation_pm_usa',
        quote_count: 12,
        top_quote: {
          quote: 'We got a formal notice last week. Our incumbent quoted $18M for pump-and-treat.',
          subreddit: 'PFAS',
          url: 'https://reddit.com/r/PFAS/comments/f1x01',
        },
      },
      {
        theme: 'Hidrocarburos en suelos — contratistas poco confiables',
        avatar_match: 'hseq_latam',
        quote_count: 7,
        top_quote: {
          quote: 'Hicimos remediación con biorremediación y en 18 meses nadie nos dio un baseline.',
          subreddit: 'colombia',
          url: 'https://reddit.com/r/colombia/comments/f1x02',
        },
      },
      {
        theme: 'Glifosato residuals — monitoreo ANLA 2026',
        avatar_match: 'hseq_latam',
        quote_count: 4,
        top_quote: {
          quote: 'Varias operaciones en los Llanos están fallando los nuevos umbrales de monitoreo.',
          subreddit: 'enviroengineering',
          url: 'https://reddit.com/r/enviroengineering/comments/f1x07',
        },
      },
    ],
    top_competitors_7d: [
      { competitor: 'AECOM', mentions: 5, avg_sentiment: -0.42 },
      { competitor: 'Veolia', mentions: 4, avg_sentiment: -0.15 },
      { competitor: 'Carbios', mentions: 3, avg_sentiment: 0.05 },
    ],
  };
}

async function livePayload(): Promise<InsightsResponse> {
  // Signups
  const [totalRow] = await db.select({ c: sql<number>`count(*)::int` }).from(waitlist);
  const [last7Row] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(waitlist)
    .where(sql`created_at > now() - interval '7 days'`);
  const countriesRows = await db
    .select({ country: waitlist.country })
    .from(waitlist);
  const countries = new Set(countriesRows.map((r) => r.country).filter(Boolean)).size;

  // Reddit stats
  const [classifiedRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(redditClassifications);
  const [highPainRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(redditClassifications)
    .where(sql`classified_at > now() - interval '7 days' and pain_intensity >= 3`);
  const avatarRows = await db
    .select({
      avatar: redditClassifications.avatarMatch,
      c: sql<number>`count(*)::int`,
    })
    .from(redditClassifications)
    .where(sql`classified_at > now() - interval '7 days'`)
    .groupBy(redditClassifications.avatarMatch)
    .orderBy(sql`count(*) desc`)
    .limit(4);

  // Latest synthesis themes
  const [latestSynth] = await db
    .select({ themes: painSynthesis.themes })
    .from(painSynthesis)
    .orderBy(desc(painSynthesis.createdAt))
    .limit(1);
  const themes = latestSynth?.themes ?? [];

  // Top competitors 7d
  const competitorRows = await db
    .select({
      competitor: competitorMentions.competitor,
      c: sql<number>`count(*)::int`,
      avg: sql<number>`coalesce(avg(sentiment)::float, 0)`,
    })
    .from(competitorMentions)
    .where(sql`detected_at > now() - interval '7 days'`)
    .groupBy(competitorMentions.competitor)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  return {
    updated_at: new Date().toISOString(),
    mode: 'live',
    signups: {
      total: totalRow?.c ?? 0,
      last_7d: last7Row?.c ?? 0,
      countries,
    },
    reddit: {
      posts_classified_total: classifiedRow?.c ?? 0,
      high_pain_7d: highPainRow?.c ?? 0,
      top_avatars_7d: avatarRows.map((r) => ({
        avatar: r.avatar ?? 'none',
        count: r.c,
      })),
    },
    top_pains: (themes as Array<Record<string, unknown>>).slice(0, 5).map((t) => {
      // Themes come from the Pain Synthesizer agent as JSON; the LLM emits
      // snake_case so accept both casings defensively.
      const topQuotes = (t.top_quotes ?? t.topQuotes) as
        | Array<{ quote: string; subreddit: string; url: string }>
        | undefined;
      const head = topQuotes?.[0];
      return {
        theme: String(t.theme ?? ''),
        avatar_match: String(t.avatar_match ?? t.avatarMatch ?? ''),
        quote_count: Number(t.quote_count ?? t.quoteCount ?? topQuotes?.length ?? 0),
        top_quote: head
          ? { quote: head.quote, subreddit: head.subreddit, url: head.url }
          : null,
      };
    }),
    top_competitors_7d: competitorRows.map((r) => ({
      competitor: r.competitor,
      mentions: r.c,
      avg_sentiment: Number(r.avg.toFixed(2)),
    })),
  };
}

export async function GET() {
  try {
    const payload = isMockMode ? mockPayload() : await livePayload();
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': `public, max-age=60, s-maxage=${process.env.INSIGHTS_CACHE_TTL_SECONDS ?? 300}`,
      },
    });
  } catch (err) {
    // Never 500 — the widget should degrade gracefully on the landing.
    // eslint-disable-next-line no-console
    console.error('[api/insights] error, falling back to mock', err);
    return NextResponse.json(
      { ...mockPayload(), mode: 'mock', error: 'live_unavailable' as const },
      { status: 200 },
    );
  }
}
