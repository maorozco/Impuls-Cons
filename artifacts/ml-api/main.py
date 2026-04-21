"""FastAPI backend for ML predictions + RAG answers.

Reuses the Python logic from artifacts/impulso-biocycle/ — no code duplication.
Runs alongside Next.js in dev (port 5001) and as a Replit Reserved VM in prod.

Endpoints:
    GET  /healthz
    POST /api/ml/predict    → degradation_pct + confidence
    POST /api/rag/answer    → text + sources + provider label
"""
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ─ Reuse existing Python modules from impulso-biocycle ───────────────
ROOT = Path(__file__).resolve().parent.parent.parent
BIOCYCLE_DIR = ROOT / "artifacts" / "impulso-biocycle"
sys.path.insert(0, str(BIOCYCLE_DIR))

# Load env vars from (in order): repo .env, ml-api/.env, impulso-biocycle/.env.
# In Replit secrets are injected as real env vars so all of these are no-ops —
# load_dotenv only fills in what's missing without overriding.
load_dotenv(ROOT / ".env", override=False)
load_dotenv(Path(__file__).parent / ".env", override=False)
load_dotenv(BIOCYCLE_DIR / ".env", override=False)

import data as biocycle_data  # type: ignore  # noqa: E402
from ml_model import get_predictor  # type: ignore  # noqa: E402
import rag as rag_module  # type: ignore  # noqa: E402


app = FastAPI(
    title="Impulso BioCycle ML API",
    version="0.1.0",
    description="ML predictions + RAG answers for the Next.js biocycle app.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Add Replit app URL here once deployed, e.g. "https://biocycle-landing.X.replit.app"
        *os.environ.get("ALLOWED_ORIGINS", "").split(","),
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ─ Health ────────────────────────────────────────────────────────────
@app.get("/healthz")
def healthz() -> dict[str, Any]:
    retriever = rag_module.get_retriever()
    return {
        "ok": True,
        "model": "gradient_boosting",
        "corpus_size": len(retriever.docs),
        "llm_provider": rag_module.get_llm_provider(),
        "unique_microorganisms": biocycle_data.UNIQUE_MICROORGANISMS,
        "total_contaminants": biocycle_data.TOTAL_CONTAMINANTS,
        "aggregate_publications": biocycle_data.AGGREGATE_PUBLICATIONS,
    }


# ─ ML predict ────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    contaminant: str = Field(..., examples=["hydrocarbons"])
    temp_C: float = 30.0
    pH: float = 7.0
    mode: str = Field("in_situ", examples=["in_situ", "bioreactor"])
    contamination_pct: float = 10.0
    pretreatment: bool = False
    time_weeks: int = 12


class PredictResponse(BaseModel):
    degradation_pct: float
    confidence: str
    n_training_samples: int


@app.post("/api/ml/predict", response_model=PredictResponse)
def ml_predict(req: PredictRequest) -> PredictResponse:
    try:
        predictor = get_predictor()
        pct = predictor.predict(
            contaminant=req.contaminant,
            temp_C=req.temp_C,
            pH=req.pH,
            mode=req.mode,
            contamination_pct=req.contamination_pct,
            pretreatment=req.pretreatment,
            time_weeks=req.time_weeks,
        )
        return PredictResponse(
            degradation_pct=float(pct),
            confidence="moderate",  # R² ≈ 0.55 on 43 samples
            n_training_samples=43,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ml predict failed: {e}")


# ─ RAG answer ────────────────────────────────────────────────────────
class ChatTurn(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class RagRequest(BaseModel):
    query: str
    locale: str = "es"
    top_k: int = 4
    # Optional conversation history — the backend uses this only to contextualize
    # the LLM generation step. Retrieval still runs on `query` alone (standard
    # practice; mixing history into embeddings degrades precision).
    history: list[ChatTurn] | None = None


class RagSource(BaseModel):
    doc_id: str
    title: str
    source: str
    score: float
    url: str | None = None
    # Literal passage from the doc that matched the query, for in-app preview.
    excerpt: str | None = None
    # Tokens from the query that should be highlighted in the excerpt.
    excerpt_highlights: list[str] = []


class RagResponse(BaseModel):
    text: str
    sources: list[RagSource]
    provider: str


@app.post("/api/rag/answer", response_model=RagResponse)
def rag_answer(req: RagRequest) -> RagResponse:
    try:
        history_tuples = (
            [(t.role, t.content) for t in (req.history or [])][-12:] or None
        )
        text, retrievals = rag_module.answer(req.query, history=history_tuples)
        sources = []
        for r in retrievals[: req.top_k]:
            excerpt, highlights = rag_module.extract_excerpt(r.doc.body, req.query)
            sources.append(
                RagSource(
                    doc_id=r.doc.doc_id,
                    title=r.doc.title,
                    source=r.doc.source,
                    score=float(r.score),
                    url=r.doc.url,
                    excerpt=excerpt,
                    excerpt_highlights=highlights,
                )
            )
        return RagResponse(
            text=text,
            sources=sources,
            provider=rag_module.llm_label(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"rag answer failed: {e}")


# ─ Static data passthrough (discoveries, consortia lookup) ───────────
@app.get("/api/data/consortium")
def consortium(subtype: str) -> dict:
    """Look up a consortium by contaminant subtype."""
    consortium_data = biocycle_data.CONSORTIA_DATA.get(subtype)
    if consortium_data is None:
        raise HTTPException(status_code=404, detail=f"subtype '{subtype}' not found")
    return {
        "subtype": subtype,
        "members": consortium_data,
        "publications": biocycle_data.PUBLICATIONS_COUNT.get(subtype, 0),
        "base_success": biocycle_data.SUCCESS_PROBABILITIES.get(subtype, 0),
    }


if __name__ == "__main__":
    import argparse
    import uvicorn

    parser = argparse.ArgumentParser(description="Impulso BioCycle ML API")
    parser.add_argument(
        "--host",
        default=os.environ.get("ML_API_HOST", "127.0.0.1"),
        help="Bind host (default 127.0.0.1 · loopback only · set 0.0.0.0 for public)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.environ.get("PORT", os.environ.get("ML_API_PORT", 5001))),
        help="Bind port (default 5001)",
    )
    parser.add_argument(
        "--reload",
        action="store_true",
        help="Enable uvicorn auto-reload (dev only)",
    )
    args = parser.parse_args()

    uvicorn.run(
        "main:app" if args.reload else app,
        host=args.host,
        port=args.port,
        reload=args.reload,
    )
