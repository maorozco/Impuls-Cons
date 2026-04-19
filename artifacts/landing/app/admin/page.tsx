import { db, isMockMode } from '@/lib/db';
import { waitlist, waitlistResponses } from '@/drizzle/schema';
import { desc } from 'drizzle-orm';

const TIER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  green:  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: '🟢 Green'  },
  yellow: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   label: '🟡 Yellow' },
  red:    { bg: 'bg-red-500/15',     text: 'text-red-400',     label: '🔴 Red'    },
};

const ROLE_LABELS: Record<string, string> = {
  hseq_manager:             'HSEQ Manager',
  env_engineer:             'Ing. Ambiental',
  remediation_pm:           'PM Remediación',
  sustainability_director:  'Dir. Sostenibilidad',
  env_consultant:           'Consultor Ambiental',
  researcher:               'Investigador',
  founder:                  'Founder',
  other:                    'Otro',
};

const SECTOR_LABELS: Record<string, string> = {
  oil_gas:        'Petróleo y Gas',
  chemicals:      'Química',
  mining:         'Minería',
  water_utilities:'Agua/Utilities',
  manufacturing:  'Manufactura',
  agriculture:    'Agricultura',
  textile:        'Textil',
  defense:        'Defensa',
  consulting:     'Consultoría',
  government:     'Gobierno',
  academia:       'Academia',
  other:          'Otro',
};

const TIMELINE_LABELS: Record<string, string> = {
  this_week:      '⚡ Esta semana',
  three_months:   '📅 3 meses',
  six_to_twelve:  '📅 6–12 meses',
  next_year:      '🕐 El próximo año',
  no_timeline:    '—',
};

const CALL_LABELS: Record<string, string> = {
  yes_now:           '📞 Sí, ahora',
  yes_next_week:     '📞 Próxima semana',
  keep_posted:       '📧 Mantenme informado',
  wait_early_access: '⏳ Early access',
};

function fmt(date: Date | string) {
  return new Date(date).toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function AdminPage() {
  if (isMockMode) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 p-8">
        Base de datos no disponible en modo desarrollo. Despliega la app o configura DATABASE_URL.
      </main>
    );
  }

  const [emails, responses] = await Promise.all([
    db.select().from(waitlist).orderBy(desc(waitlist.createdAt)),
    db.select().from(waitlistResponses).orderBy(desc(waitlistResponses.score)),
  ]);

  const responseMap = new Map(responses.map((r) => [r.email, r]));

  const green  = responses.filter((r) => r.tier === 'green').length;
  const yellow = responses.filter((r) => r.tier === 'yellow').length;
  const red    = responses.filter((r) => r.tier === 'red').length;
  const noSurvey = emails.length - responses.length;

  const rows = emails.map((e) => ({ ...e, survey: responseMap.get(e.email) ?? null }));

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Impulso BioCycle</p>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
        </div>
        <a
          href="/admin/export"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          ⬇ Exportar CSV
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Total registros', value: emails.length, color: 'text-white' },
          { label: 'Encuestas',       value: responses.length, color: 'text-zinc-300' },
          { label: '🟢 Green',        value: green,   color: 'text-emerald-400' },
          { label: '🟡 Yellow',       value: yellow,  color: 'text-amber-400'   },
          { label: 'Sin encuesta',    value: noSurvey, color: 'text-zinc-500'   },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
            Todos los registros
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Tier</th>
                <th className="text-left px-4 py-3 font-medium">Score</th>
                <th className="text-left px-4 py-3 font-medium">Rol</th>
                <th className="text-left px-4 py-3 font-medium">Sector</th>
                <th className="text-left px-4 py-3 font-medium">Problema</th>
                <th className="text-left px-4 py-3 font-medium">Urgencia</th>
                <th className="text-left px-4 py-3 font-medium">Llamada</th>
                <th className="text-left px-4 py-3 font-medium">Fuente</th>
                <th className="text-left px-4 py-3 font-medium">Idioma</th>
                <th className="text-left px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const survey = row.survey;
                const tier = survey?.tier ?? null;
                const tierStyle = tier ? TIER_STYLES[tier] : null;
                const source = [row.utmSource, row.utmMedium].filter(Boolean).join(' / ') || '—';

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-900/50'}`}
                  >
                    <td className="px-4 py-3 text-zinc-500">{row.id}</td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-100 font-mono text-xs">{row.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      {tierStyle ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
                          {tierStyle.label}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-xs">Sin encuesta</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-center">
                      {survey ? (
                        <span className={tierStyle?.text ?? 'text-zinc-400'}>
                          {survey.score}/10
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {ROLE_LABELS[survey?.role ?? ''] ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {SECTOR_LABELS[survey?.sector ?? ''] ?? '—'}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      {survey?.pain ? (
                        <span className="text-zinc-400 text-xs line-clamp-2" title={survey.pain}>
                          {survey.pain}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">
                      {TIMELINE_LABELS[survey?.timeline ?? ''] ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">
                      {CALL_LABELS[survey?.callIntent ?? ''] ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">
                      {source}
                      {row.utmCampaign && (
                        <div className="text-zinc-600 mt-0.5" title={row.utmCampaign}>
                          camp. {row.utmCampaign.slice(0, 10)}…
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="uppercase text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                        {row.locale}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                      {fmt(row.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-zinc-800 text-xs text-zinc-600">
          {emails.length} registros · actualizado al cargar la página
        </div>
      </div>
    </main>
  );
}
