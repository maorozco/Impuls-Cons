/**
 * POST /api/rag/answer — proxy to ml-api FastAPI for RAG chat.
 *
 * The browser can't reach 127.0.0.1 inside the Replit Reserved VM, so
 * the client always calls this relative endpoint. The server forwards
 * the body to ml-api on loopback (default http://127.0.0.1:5001).
 *
 * Forward body: { query, locale, top_k, history }
 * Forward response: { text, sources, provider, guardrail_triggered }
 *
 * Timeout: 120s (chat can touch upstream LLM providers with fallback chain).
 */
import { NextResponse } from 'next/server';

const ML_API = process.env.ML_API_URL ?? 'http://127.0.0.1:5001';

// Run on Node runtime (fetch+AbortSignal.timeout available in 18+).
export const runtime = 'nodejs';
// Never cache — chat answers are conversational + stateful.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const upstream = await fetch(`${ML_API}/api/rag/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(120_000),
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
