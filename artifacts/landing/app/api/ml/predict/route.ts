/**
 * POST /api/ml/predict — proxy to ml-api FastAPI for ML prediction.
 *
 * Forward body: { contaminant, temp_C, pH, mode, contamination_pct,
 *                 pretreatment, time_weeks }
 * Forward response: { degradation_pct, confidence, n_training_samples }
 *
 * Timeout: 15s (the Gradient Boosting predictor runs in <200ms;
 * 15s covers cold-start + network).
 */
import { NextResponse } from 'next/server';

const ML_API = process.env.ML_API_URL ?? 'http://127.0.0.1:5001';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const upstream = await fetch(`${ML_API}/api/ml/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(15_000),
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json(
      {
        error: 'ml_api_unreachable',
        detail: `could not reach ml-api at ${ML_API}: ${msg}`,
      },
      { status: 502 },
    );
  }
}
