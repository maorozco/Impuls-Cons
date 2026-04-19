import { NextResponse } from 'next/server';
import { db, isMockMode } from '@/lib/db';
import { waitlist, waitlistResponses } from '@/drizzle/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  if (isMockMode) {
    return new NextResponse('Base de datos no disponible en modo mock', { status: 503 });
  }

  const [emails, responses] = await Promise.all([
    db.select().from(waitlist).orderBy(desc(waitlist.createdAt)),
    db.select().from(waitlistResponses).orderBy(desc(waitlistResponses.score)),
  ]);

  const responseMap = new Map(responses.map((r) => [r.email, r]));

  const rows = emails.map((e) => {
    const r = responseMap.get(e.email);
    return [
      e.id,
      e.email,
      e.locale,
      e.country ?? '',
      e.utmSource ?? '',
      e.utmMedium ?? '',
      e.utmCampaign ?? '',
      e.variant,
      new Date(e.createdAt).toISOString(),
      r?.role ?? '',
      r?.sector ?? '',
      `"${(r?.pain ?? '').replace(/"/g, "'")}"`,
      r?.timeline ?? '',
      r?.callIntent ?? '',
      r?.score ?? '',
      r?.tier ?? '',
    ].join(',');
  });

  const header =
    'id,email,idioma,pais,utm_source,utm_medium,utm_campaign,variante,fecha_registro,rol,sector,problema,urgencia,llamada,puntaje,tier';
  const csv = [header, ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="impulso-waitlist-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
