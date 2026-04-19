import { db, isMockMode } from '@/lib/db';
import { waitlist, waitlistResponses } from '@/drizzle/schema';
import { desc } from 'drizzle-orm';
import LogoutButton from './LogoutButton';

const TIER: Record<string, { ring: string; badge: string; dot: string; label: string }> = {
  green:  { ring: 'ring-emerald-500/40',  badge: 'bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-400', label: 'Green'  },
  yellow: { ring: 'ring-amber-400/40',    badge: 'bg-amber-400/15  text-amber-300',   dot: 'bg-amber-400',   label: 'Yellow' },
  red:    { ring: 'ring-red-500/40',      badge: 'bg-red-500/15    text-red-300',      dot: 'bg-red-400',     label: 'Red'    },
};

const ROLES: Record<string, string> = {
  hseq_manager:            'HSEQ Manager',
  env_engineer:            'Ing. Ambiental',
  remediation_pm:          'PM Remediación',
  sustainability_director: 'Dir. Sostenibilidad',
  env_consultant:          'Consultor Ambiental',
  researcher:              'Investigador',
  founder:                 'Founder',
  other:                   'Otro',
};

const SECTORS: Record<string, string> = {
  oil_gas:        'Petróleo & Gas',
  chemicals:      'Química',
  mining:         'Minería',
  water_utilities:'Agua / Utilities',
  manufacturing:  'Manufactura',
  agriculture:    'Agricultura',
  textile:        'Textil',
  defense:        'Defensa',
  consulting:     'Consultoría',
  government:     'Gobierno',
  academia:       'Academia',
  other:          'Otro',
};

const TIMELINES: Record<string, string> = {
  this_week:     'Esta semana',
  three_months:  '3 meses',
  six_to_twelve: '6–12 meses',
  next_year:     'Próximo año',
  no_timeline:   'Sin timeline',
};

const CALLS: Record<string, { label: string; color: string }> = {
  yes_now:           { label: 'Llamada ya',          color: 'text-emerald-400' },
  yes_next_week:     { label: 'Llamada próx. semana', color: 'text-emerald-400' },
  keep_posted:       { label: 'Mantenme informado',   color: 'text-zinc-400'   },
  wait_early_access: { label: 'Early access',         color: 'text-amber-400'  },
};

function fmt(date: Date | string) {
  return new Date(date).toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function scoreColor(score: number) {
  if (score >= 7) return 'text-emerald-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

export default async function AdminPage() {
  if (isMockMode) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 p-8">
        Base de datos no disponible en modo desarrollo.
      </main>
    );
  }

  const [emails, responses] = await Promise.all([
    db.select().from(waitlist).orderBy(desc(waitlist.createdAt)),
    db.select().from(waitlistResponses).orderBy(desc(waitlistResponses.score)),
  ]);

  const responseMap = new Map(responses.map((r) => [r.email, r]));

  const rows = emails
    .map((e) => ({ ...e, survey: responseMap.get(e.email) ?? null }))
    .sort((a, b) => {
      const tierOrder = { green: 0, yellow: 1, red: 2 };
      const ta = tierOrder[a.survey?.tier ?? ''] ?? 3;
      const tb = tierOrder[b.survey?.tier ?? ''] ?? 3;
      if (ta !== tb) return ta - tb;
      return (b.survey?.score ?? -1) - (a.survey?.score ?? -1);
    });

  const green   = responses.filter((r) => r.tier === 'green').length;
  const yellow  = responses.filter((r) => r.tier === 'yellow').length;
  const noSurvey = emails.length - responses.length;
  const topScore = responses.reduce((max, r) => Math.max(max, r.score), 0);

  return (
    <main className="min-h-screen bg-[#090909] text-zinc-100">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-10 bg-[#090909]/90 backdrop-blur border-b border-zinc-800/60 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">Impulso BioCycle · Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/export"
            className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            ↓ CSV
          </a>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: emails.length,    label: 'Registros',  accent: 'text-white'        },
            { value: responses.length, label: 'Encuestas',  accent: 'text-zinc-300'     },
            { value: green,            label: 'Green',      accent: 'text-emerald-400'  },
            { value: noSurvey,         label: 'Sin enc.',   accent: 'text-zinc-500'     },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className={`text-3xl font-bold tabular-nums ${s.accent}`}>{s.value}</p>
              <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Lead cards ── */}
        <div>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
            Leads · ordenados por tier y score
          </h2>
          <div className="space-y-3">
            {rows.map((row) => {
              const s = row.survey;
              const tier = s?.tier ?? null;
              const t = tier ? TIER[tier] : null;
              const utmSource = [row.utmSource, row.utmMedium].filter(Boolean).join(' · ');
              const callInfo = CALLS[s?.callIntent ?? ''] ?? null;

              return (
                <div
                  key={row.id}
                  className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 ring-1 ${t ? t.ring : 'ring-transparent'}`}
                >
                  {/* Row 1: email + tier badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {t && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`} />}
                      {!t && <span className="w-2 h-2 rounded-full flex-shrink-0 bg-zinc-600" />}
                      <span className="font-mono text-sm text-white truncate">{row.email}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {t ? (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${t.badge}`}>
                          {t.label}
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-500">
                          Sin encuesta
                        </span>
                      )}
                      {s && (
                        <span className={`text-lg font-bold tabular-nums ${scoreColor(s.score)}`}>
                          {s.score}<span className="text-xs text-zinc-600">/10</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {s ? (
                    <>
                      {/* Row 2: role + sector chips */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {s.role && (
                          <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
                            {ROLES[s.role] ?? s.role}
                          </span>
                        )}
                        {s.sector && (
                          <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
                            {SECTORS[s.sector] ?? s.sector}
                          </span>
                        )}
                        {s.timeline && (
                          <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-md">
                            ⏱ {TIMELINES[s.timeline] ?? s.timeline}
                          </span>
                        )}
                        {callInfo && (
                          <span className={`text-xs bg-zinc-800 px-2.5 py-1 rounded-md ${callInfo.color}`}>
                            📞 {callInfo.label}
                          </span>
                        )}
                      </div>

                      {/* Row 3: pain */}
                      {s.pain && (
                        <blockquote className="border-l-2 border-zinc-700 pl-3 text-sm text-zinc-400 italic leading-relaxed">
                          "{s.pain}"
                        </blockquote>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">No completó la encuesta post-registro.</p>
                  )}

                  {/* Row 4: meta footer */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3 border-t border-zinc-800/60">
                    <span className="text-[11px] text-zinc-600">
                      {fmt(row.createdAt)}
                    </span>
                    <span className="text-[11px] text-zinc-600 uppercase">
                      {row.locale}
                    </span>
                    {utmSource && (
                      <span className="text-[11px] text-zinc-600">
                        utm: {utmSource}
                      </span>
                    )}
                    {row.utmCampaign && (
                      <span className="text-[11px] text-zinc-600">
                        camp: {row.utmCampaign}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700 pb-4">
          {emails.length} registros · snapshot al cargar
        </p>
      </div>
    </main>
  );
}
