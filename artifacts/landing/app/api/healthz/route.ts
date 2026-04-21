/**
 * GET /api/healthz — proxy to ml-api /healthz (status banner in Asesoría).
 * Browser can't reach 127.0.0.1, so we forward from the Next server.
 */
import { NextResponse } from 'next/server';

const ML_API = process.env.ML_API_URL ?? 'http://127.0.0.1:5001';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const upstream = await fetch(`${ML_API}/healthz`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 503 },
    );
  }
}
