/**
 * /admin/insights — internal dashboard for the founder + panel Q&A.
 *
 * Protected by HTTP Basic Auth via middleware (see ../../middleware.ts).
 * Renders the same payload as /api/insights plus a drafts review table.
 *
 * Brand-consistent dark theme (Fase 0 · E3.2).
 */

import { desc, sql } from 'drizzle-orm';
import { db, isMockMode } from '@/lib/db';
import {
  agentDrafts,
  competitorMentions,
  painSynthesis,
  redditClassifications,
  waitlist,
  waitlistResponses,
} from '@/drizzle/schema';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Stats {
  mode: 'live' | 'mock';
  signups: { total: number; last_7d: number; green: number; yellow: number; red: number };
  reddit: { posts: number; classifications: number; highPain7d: number };
  synthesisLast: { themes: number; createdAt: string | null };
  topCompetitors: Array<{ competitor: string; count: number; avg: number }>;
  pendingDrafts: Array<{
    id: number;
    kind: string;
    content: string;
    bannedHits: string[];
    createdAt: string;
  }>;
}

function mockStats(): Stats {
  return {
    mode: 'mock',
    signups: { total: 42, last_7d: 18, green: 11, yellow: 21, red: 10 },
    reddit: { posts: 315, classifications: 287, highPain7d: 64 },
    synthesisLast: { themes: 5, createdAt: new Date().toISOString() },
    topCompetitors: [
      { competitor: 'AECOM', count: 5, avg: -0.42 },
      { competitor: 'Veolia', count: 4, avg: -0.15 },
      { competitor: 'Carbios', count: 3, avg: 0.05 },
    ],
    pendingDrafts: [
      {
        id: 1,
        kind: 'slide_quote',
        content:
          '[FIXTURE] "We got a notice from EPA on PFAS and no one knows the cost." — r/PFAS. Deck-ready opener.',
        bannedHits: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        kind: 'tweet',
        content:
          '[FIXTURE] Top dolor detectado esta semana en r/PFAS: parálisis frente al EPA PFAS NPDWR 2027. El $3K piloto vale 1% de la consultora tradicional.',
        bannedHits: [],
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

async function loadStats(): Promise<Stats> {
  if (isMockMode) return mockStats();
  try {
    const [total] = await db.select({ c: sql<number>`count(*)::int` }).from(waitlist);
    const [last7] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(waitlist)
      .where(sql`created_at > now() - interval '7 days'`);
    const tierRows = await db
      .select({ tier: waitlistResponses.tier, c: sql<number>`count(*)::int` })
      .from(waitlistResponses)
      .groupBy(waitlistResponses.tier);
    const tierMap = new Map(tierRows.map((r) => [r.tier, r.c]));

    const [posts] = await db.select({ c: sql<number>`count(*)::int` }).from(sql`reddit_posts`);
    const [cls] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(redditClassifications);
    const [highPain] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(redditClassifications)
      .where(sql`classified_at > now() - interval '7 days' and pain_intensity >= 3`);

    const [synth] = await db
      .select({ themes: painSynthesis.themes, createdAt: painSynthesis.createdAt })
      .from(painSynthesis)
      .orderBy(desc(painSynthesis.createdAt))
      .limit(1);

    const comps = await db
      .select({
        competitor: competitorMentions.competitor,
        c: sql<number>`count(*)::int`,
        avg: sql<number>`coalesce(avg(sentiment)::float, 0)`,
      })
      .from(competitorMentions)
      .where(sql`detected_at > now() - interval '7 days'`)
      .groupBy(competitorMentions.competitor)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    const drafts = await db
      .select()
      .from(agentDrafts)
      .where(sql`approved = false and rejected = false`)
      .orderBy(desc(agentDrafts.createdAt))
      .limit(15);

    return {
      mode: 'live',
      signups: {
        total: total?.c ?? 0,
        last_7d: last7?.c ?? 0,
        green: tierMap.get('green') ?? 0,
        yellow: tierMap.get('yellow') ?? 0,
        red: tierMap.get('red') ?? 0,
      },
      reddit: {
        posts: posts?.c ?? 0,
        classifications: cls?.c ?? 0,
        highPain7d: highPain?.c ?? 0,
      },
      synthesisLast: {
        themes: (synth?.themes ?? []).length,
        createdAt: synth?.createdAt?.toISOString() ?? null,
      },
      topCompetitors: comps.map((r) => ({
        competitor: r.competitor,
        count: r.c,
        avg: Number(r.avg.toFixed(2)),
      })),
      pendingDrafts: drafts.map((d) => ({
        id: d.id,
        kind: d.kind,
        content: d.content,
        bannedHits: (d.bannedPhraseHits as string[]) ?? [],
        createdAt: d.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[admin/insights] query error, falling back to mock', err);
    return mockStats();
  }
}

export default async function AdminInsightsPage() {
  const stats = await loadStats();
  return (
    <main className="min-h-screen bg-[#0A1F12] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#C4FF00]">
              Admin · Insights
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Pipeline multi-agente · panel Q&amp;A en vivo · BioCycle 2026
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wider ${
              stats.mode === 'live'
                ? 'bg-[#C4FF00]/15 text-[#C4FF00] ring-1 ring-[#C4FF00]/30'
                : 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stats.mode === 'live' ? 'bg-[#C4FF00]' : 'bg-amber-400'
              } animate-pulse`}
            />
            {stats.mode}
          </span>
        </header>

        <Section title="Waitlist">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Metric label="Total signups" value={stats.signups.total} />
            <Metric label="Últimos 7 días" value={stats.signups.last_7d} />
            <Metric
              label="Respuestas survey"
              value={stats.signups.green + stats.signups.yellow + stats.signups.red}
            />
            <Metric label="🟢 Verde" value={stats.signups.green} accent="emerald" />
            <Metric label="🟡 Amarillo" value={stats.signups.yellow} accent="amber" />
            <Metric label="🔴 Rojo" value={stats.signups.red} accent="rose" />
          </div>
        </Section>

        <Section title="Pipeline de investigación (Reddit)">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Posts capturados" value={stats.reddit.posts} />
            <Metric label="Clasificados" value={stats.reddit.classifications} />
            <Metric label="Alta pena últimos 7d" value={stats.reddit.highPain7d} />
          </div>
          <p className="mt-3 text-xs text-white/50">
            Última síntesis:{' '}
            <span className="font-mono text-white/70">
              {stats.synthesisLast.createdAt ?? 'nunca'}
            </span>{' '}
            · {stats.synthesisLast.themes} temas extraídos
          </p>
        </Section>

        <Section title="Top competidores mencionados (7d)">
          {stats.topCompetitors.length === 0 ? (
            <EmptyState icon="🎯" message="Sin menciones esta semana." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.03] text-xs uppercase tracking-wider text-white/50">
                    <th className="px-4 py-3 text-left font-mono">Competidor</th>
                    <th className="px-4 py-3 text-left font-mono">Menciones</th>
                    <th className="px-4 py-3 text-left font-mono">Sentimiento (avg)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topCompetitors.map((c) => (
                    <tr
                      key={c.competitor}
                      className="border-t border-white/5 transition-colors hover:bg-white/[0.04]"
                    >
                      <td className="px-4 py-3 font-medium text-white/90">{c.competitor}</td>
                      <td className="px-4 py-3 font-mono tabular-nums text-white/70">
                        {c.count}
                      </td>
                      <td
                        className={`px-4 py-3 font-mono tabular-nums ${
                          c.avg > 0.1
                            ? 'text-emerald-300'
                            : c.avg < -0.1
                              ? 'text-rose-300'
                              : 'text-white/50'
                        }`}
                      >
                        {c.avg >= 0 ? '+' : ''}
                        {c.avg.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        <Section title="Drafts pendientes de revisión">
          <p className="mb-4 text-xs text-white/50">
            El Pitch Feeder Agent propone contenido. Humanos aprueban antes de publicar.
            Cualquier draft con frases banneadas se marca con badge rojo abajo.
          </p>
          {stats.pendingDrafts.length === 0 ? (
            <EmptyState icon="✓" message="Sin drafts pendientes — todo aprobado o el feeder no ha corrido aún." />
          ) : (
            <div className="space-y-3">
              {stats.pendingDrafts.map((d) => (
                <div
                  key={d.id}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-[#00D9F5]/40 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-[#00D9F5]/5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-[#00D9F5]/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#00D9F5]">
                      {d.kind}
                    </span>
                    <span className="font-mono text-[10px] text-white/40">
                      {new Date(d.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="leading-relaxed text-white/90">{d.content}</p>
                  {d.bannedHits.length > 0 && (
                    <div className="mt-4 rounded-lg border-l-2 border-rose-400 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
                      <span className="font-bold">⚠️ {d.bannedHits.length} frase(s) banneada(s):</span>{' '}
                      {d.bannedHits.join('; ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          Impulso BioCycle · admin · {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-white/90">{title}</h2>
      {children}
    </section>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'emerald' | 'amber' | 'rose';
}) {
  const color =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
        ? 'text-amber-300'
        : accent === 'rose'
          ? 'text-rose-300'
          : 'text-[#C4FF00]';
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-white/20 hover:bg-white/[0.05]">
      <div className={`text-3xl font-extrabold tabular-nums leading-none ${color}`}>
        {value.toLocaleString()}
      </div>
      <div className="mt-2 text-xs text-white/60">{label}</div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 text-sm text-white/50">{message}</p>
    </div>
  );
}
