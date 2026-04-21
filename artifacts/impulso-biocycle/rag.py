"""RAG module for Impulso BioCycle — retrieval over curated science corpus.

Design goals:
  1. Works offline (no network) using TF-IDF retrieval + legacy keyword fallback.
  2. Upgrades gracefully to LLM generation when ANTHROPIC_API_KEY is present.
  3. Zero extra heavy deps — uses sklearn (already installed for the ML model)
     and optionally the `anthropic` SDK.

Corpus sources:
  - data.DISCOVERIES (10 peer-reviewed papers)
  - data.CONSORTIA_DATA (33 contaminant-consortium pairs)
  - Optional: ~/Downloads/Proyectos_investigacion/*.md (DB_*.md databases)

Guardrails:
  - System prompt enforces .research-synthesis.md §11 no-prometer list.
  - All outputs annotated with their sources.
  - Falls back to keyword response from `asesoria_ia.RESPONSES` if LLM unavailable.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Iterable

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from data import CONSORTIA_DATA, DISCOVERIES, PUBLICATIONS_COUNT, SUCCESS_PROBABILITIES


@dataclass
class Doc:
    """A single retrievable document."""

    doc_id: str
    title: str
    body: str
    source: str  # "discoveries" | "consortia" | "research_docs"
    url: str | None = None
    metadata: dict | None = None


@dataclass
class Retrieval:
    doc: Doc
    score: float


# ────────────────────────────────────────────────────────────────────────
# Corpus ingestion
# ────────────────────────────────────────────────────────────────────────


def _ingest_discoveries() -> list[Doc]:
    docs: list[Doc] = []
    for d in DISCOVERIES:
        body = (
            f"{d['description']}\nResultado: {d['result']}\n"
            f"Institución: {d['institution']} ({d['year']}). Categoría: {d['category']}."
        )
        docs.append(
            Doc(
                doc_id=f"discovery:{d['title'][:40]}",
                title=d['title'],
                body=body,
                source="discoveries",
                url=d.get('link'),
                metadata={'year': d['year'], 'category': d['category']},
            )
        )
    return docs


def _ingest_consortia() -> list[Doc]:
    docs: list[Doc] = []
    for subtipo, members in CONSORTIA_DATA.items():
        lines = [
            f"Consorcio microbiano BSL-1/GRAS para: {subtipo}",
            "",
            "Composición:",
        ]
        for m in members:
            lines.append(
                f"- {m['microorganism']} ({m.get('safety', 'BSL-1')}): "
                f"{m['role']}. {m['proportion']}%. Rango óptimo: {m.get('optimal_range', 'n/d')}."
            )
        pubs = PUBLICATIONS_COUNT.get(subtipo, 0)
        prob = SUCCESS_PROBABILITIES.get(subtipo, 0)
        lines.append(
            f"\nRespaldado por ~{pubs} publicaciones peer-reviewed. "
            f"Probabilidad de éxito base: {prob}%."
        )
        docs.append(
            Doc(
                doc_id=f"consortium:{subtipo}",
                title=f"Consorcio — {subtipo}",
                body="\n".join(lines),
                source="consortia",
                metadata={'subtipo': subtipo, 'publications': pubs, 'success_prob': prob},
            )
        )
    return docs


def _ingest_research_docs() -> list[Doc]:
    """Optional ingestion of external research markdown docs.

    Skipped silently if the directory doesn't exist (e.g. CI environment).
    """
    docs: list[Doc] = []
    base = Path.home() / "Downloads" / "Proyectos_investigacion"
    if not base.is_dir():
        return docs

    for md in sorted(base.glob("DB_*.md")):
        try:
            text = md.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        # Chunk large files into ~2000-char pieces on paragraph boundaries
        chunks = _chunk_text(text, target_chars=2000)
        for i, chunk in enumerate(chunks):
            docs.append(
                Doc(
                    doc_id=f"research:{md.stem}:{i}",
                    title=f"{md.stem} (sección {i + 1})",
                    body=chunk,
                    source="research_docs",
                    metadata={'file': md.name},
                )
            )
    return docs


def _chunk_text(text: str, target_chars: int = 2000) -> list[str]:
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    for p in paragraphs:
        if current_len + len(p) > target_chars and current:
            chunks.append("\n\n".join(current))
            current, current_len = [], 0
        current.append(p)
        current_len += len(p) + 2
    if current:
        chunks.append("\n\n".join(current))
    return chunks


# ────────────────────────────────────────────────────────────────────────
# Retrieval — TF-IDF
# ────────────────────────────────────────────────────────────────────────


class Retriever:
    def __init__(self, docs: list[Doc]):
        self.docs = docs
        self._vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            lowercase=True,
            stop_words=None,  # keep Spanish stopwords — they carry signal
            sublinear_tf=True,
        )
        corpus = [f"{d.title}\n{d.body}" for d in docs]
        self._matrix = self._vectorizer.fit_transform(corpus) if corpus else None

    def search(self, query: str, top_k: int = 4) -> list[Retrieval]:
        if self._matrix is None or not self.docs:
            return []
        q = self._vectorizer.transform([query])
        sims = cosine_similarity(q, self._matrix).flatten()
        top_idx = np.argsort(sims)[::-1][:top_k]
        return [Retrieval(doc=self.docs[i], score=float(sims[i])) for i in top_idx if sims[i] > 0.0]


@lru_cache(maxsize=1)
def get_retriever() -> Retriever:
    docs = _ingest_discoveries() + _ingest_consortia() + _ingest_research_docs()
    return Retriever(docs)


# ────────────────────────────────────────────────────────────────────────
# Generation — Claude via anthropic SDK (optional)
# ────────────────────────────────────────────────────────────────────────


# ────────────────────────────────────────────────────────────────────────
# LLM provider selection — Anthropic preferred, OpenRouter fallback
# ────────────────────────────────────────────────────────────────────────


def get_llm_provider() -> str:
    """Returns "anthropic" | "openrouter" | "none"."""
    pref = os.environ.get("LLM_PROVIDER", "auto").lower()
    has_anthropic = bool(os.environ.get("ANTHROPIC_API_KEY", "").strip())
    has_openrouter = bool(os.environ.get("OPENROUTER_API_KEY", "").strip())

    if pref == "anthropic" and has_anthropic:
        return "anthropic"
    if pref == "openrouter" and has_openrouter:
        return "openrouter"
    if pref == "auto":
        if has_anthropic:
            return "anthropic"
        if has_openrouter:
            return "openrouter"
    return "none"


SYSTEM_PROMPT = """Eres el asistente de Impulso BioCycle, una plataforma de IA que diseña consorcios microbianos para biorremediación.

**Tono:** humano, transparente, basado en ciencia. Directo pero cálido. Bilingüe ES/EN según cómo pregunte el usuario.

**Reglas duras — rompes el pitch si las violas:**
1. NUNCA prometer "cápsulas que degradan plástico en playas/ríos/campo abierto".
2. NUNCA prometer que "el plástico desaparece" — aclarar que produce monómeros (TPA+EG) que requieren recuperación.
3. NUNCA dar tiempos de degradación de campo basados en datos de lab (FAST-PETase en días sólo aplica a 50°C + PET amorfo triturado).
4. NUNCA sugerir liberación de microorganismos genéticamente modificados al ambiente.
5. NUNCA competir con Carbios en el mismo plano — son categorías distintas (centralizado vs distribuido).
6. SIEMPRE aclarar TRL del sistema integrado: 3–4. Componentes individuales: 7–9.
7. SIEMPRE mencionar disclaimer si das resultados: "estimación basada en literatura peer-reviewed; condiciones reales varían según el sitio".
8. NUNCA afirmar SaaS "listo" — primer cliente real es piloto 90 días / ~$3,000 USD con lab universitario.
9. NO usar AlphaFold en claims comerciales (licencia CC-BY-NC-SA) — usamos ESMFold / OpenFold (Apache 2.0).

**Pivote actual (A+C):**
- Plástico → biorreactor enzimático contenido (output: monómeros vendibles $800–1,600/ton).
- Cápsulas → sólo para suelos con hidrocarburos/pesticidas (décadas de evidencia in-situ).

**Cómo responder:**
- Cita las fuentes que recuperaste usando formato [Fuente: <título>] al final de cada afirmación.
- Si la pregunta está fuera del corpus, di honestamente "no tengo ese dato; te puedo conectar con el equipo".
- Respuestas en 150–400 palabras, estructuradas con bullets cuando aplique.
- Si el usuario pide algo que viola las reglas duras, redirige al pivote A+C explicándolo.

**Formato final:** markdown limpio, sin emojis decorativos (emojis solo si el usuario los usa primero).
"""


def _build_context(retrievals: list[Retrieval]) -> str:
    lines: list[str] = []
    for i, r in enumerate(retrievals, start=1):
        lines.append(
            f"<fuente {i} id=\"{r.doc.doc_id}\" source=\"{r.doc.source}\" score=\"{r.score:.3f}\">\n"
            f"Título: {r.doc.title}\n"
            f"Contenido: {r.doc.body}\n"
            + (f"URL: {r.doc.url}\n" if r.doc.url else "")
            + f"</fuente {i}>"
        )
    return "\n\n".join(lines)


def is_llm_available() -> bool:
    return get_llm_provider() != "none"


def llm_label() -> str:
    """Short string describing the active provider/model — shown in UI."""
    p = get_llm_provider()
    if p == "anthropic":
        return f"Anthropic · {os.environ.get('ANTHROPIC_CHAT_MODEL', 'claude-sonnet-4-6')}"
    if p == "openrouter":
        return f"OpenRouter · {os.environ.get('OPENROUTER_CHAT_MODEL', 'google/gemini-2.0-flash-exp:free')} (dev)"
    return "sin proveedor LLM"


HistoryTurn = tuple[str, str]  # (role, content)


def _build_anthropic_messages(
    query: str, context: str, history: list[HistoryTurn] | None
) -> list[dict]:
    """Construct messages[] for Anthropic. History is prepended turn-by-turn; the
    final user turn carries both the question and the RAG context."""
    msgs: list[dict] = []
    if history:
        for role, content in history:
            if role in ("user", "assistant") and content:
                msgs.append({"role": role, "content": content})
        # Ensure the last message is NOT already assistant (Anthropic rejects that).
        if msgs and msgs[-1]["role"] != "user":
            msgs.append({"role": "user", "content": _user_prompt(query, context)})
        else:
            # Replace the last user msg with the full RAG-contextualized version.
            msgs[-1] = {"role": "user", "content": _user_prompt(query, context)}
    else:
        msgs.append({"role": "user", "content": _user_prompt(query, context)})
    return msgs


def _call_anthropic(
    query: str, context: str, history: list[HistoryTurn] | None = None
) -> str:
    from anthropic import Anthropic  # lazy import

    client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    response = client.messages.create(
        model=os.environ.get("ANTHROPIC_CHAT_MODEL", "claude-sonnet-4-6"),
        max_tokens=1024,
        system=[
            {"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}},
        ],
        messages=_build_anthropic_messages(query, context, history),
    )
    return "".join(
        block.text for block in response.content if getattr(block, "type", None) == "text"
    )


def _build_openai_messages(
    query: str, context: str, history: list[HistoryTurn] | None
) -> list[dict]:
    msgs: list[dict] = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        for role, content in history:
            if role in ("user", "assistant") and content:
                msgs.append({"role": role, "content": content})
        if msgs[-1]["role"] != "user":
            msgs.append({"role": "user", "content": _user_prompt(query, context)})
        else:
            msgs[-1] = {"role": "user", "content": _user_prompt(query, context)}
    else:
        msgs.append({"role": "user", "content": _user_prompt(query, context)})
    return msgs


def _call_openrouter(
    query: str, context: str, history: list[HistoryTurn] | None = None
) -> str:
    """OpenRouter exposes an OpenAI-compatible API at https://openrouter.ai/api/v1."""
    from openai import OpenAI  # lazy import — openai is already a common dep

    client = OpenAI(
        api_key=os.environ["OPENROUTER_API_KEY"],
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": os.environ.get("NEXT_PUBLIC_SITE_URL", "https://biocycle.ai"),
            "X-Title": "Impulso BioCycle Asesoria",  # ASCII only — OpenAI SDK strict
        },
    )
    model = os.environ.get("OPENROUTER_CHAT_MODEL", "google/gemini-2.0-flash-exp:free")
    resp = client.chat.completions.create(
        model=model,
        max_tokens=1024,
        messages=_build_openai_messages(query, context, history),
    )
    return resp.choices[0].message.content or ""


def _user_prompt(query: str, context: str) -> str:
    return (
        f"Pregunta del usuario: {query}\n\n"
        f"Contexto recuperado de nuestra base de ciencia:\n{context}\n\n"
        "Responde usando SOLO la información del contexto y tu conocimiento general seguro de biorremediación. "
        "Cita las fuentes como [Fuente: <título>]. "
        "Si hay historial de conversación previo, mantén coherencia con lo ya respondido."
    )


def answer(
    query: str,
    legacy_fallback: str | None = None,
    history: list[HistoryTurn] | None = None,
) -> tuple[str, list[Retrieval]]:
    """Generate an answer using RAG.

    Retrieval runs on `query` alone (history degrades embedding precision).
    Generation includes `history` to keep the conversation coherent.

    Returns (markdown_answer, retrievals). Falls back gracefully if the LLM
    call fails or no provider is configured.
    """
    retriever = get_retriever()
    retrievals = retriever.search(query, top_k=4)

    provider = get_llm_provider()
    if provider == "none":
        return (legacy_fallback or _build_offline_answer(query, retrievals)), retrievals

    context = _build_context(retrievals)
    try:
        if provider == "anthropic":
            text = _call_anthropic(query, context, history)
        elif provider == "openrouter":
            text = _call_openrouter(query, context, history)
        else:
            text = ""
        if text.strip():
            return text, retrievals
    except ImportError:
        # SDK not installed — silent fallback
        pass
    except Exception:  # noqa: BLE001 — network/rate-limit/etc must not break chat
        pass

    return (legacy_fallback or _build_offline_answer(query, retrievals)), retrievals


def _tokenize(text: str) -> list[str]:
    """Split a string into lowercase content tokens (strip punct, drop stop-words)."""
    import re

    stop = {
        # Spanish stop-words (short list — enough to filter "qué", "para", etc.)
        "a", "al", "algún", "alguna", "alguno", "ante", "con", "cómo", "cuál", "cuándo",
        "cuántos", "de", "del", "donde", "dónde", "el", "en", "es", "está", "la", "las",
        "lo", "los", "me", "mi", "o", "para", "pero", "por", "porque", "qué", "que",
        "quiero", "si", "son", "su", "sus", "te", "tiene", "tu", "un", "una", "unos",
        "unas", "y",
        # English
        "a", "an", "and", "are", "as", "at", "be", "for", "from", "has", "have", "in",
        "is", "it", "its", "of", "on", "or", "that", "the", "this", "to", "was", "were",
        "what", "when", "where", "which", "who", "why", "with",
    }
    tokens = [t for t in re.findall(r"[a-záéíóúñü0-9]+", text.lower()) if len(t) >= 3]
    return [t for t in tokens if t not in stop]


def extract_excerpt(doc_body: str, query: str, max_chars: int = 420) -> tuple[str, list[str]]:
    """Pull the most relevant ~2-sentence window of `doc_body` that contains
    query keywords. Returns (excerpt, highlight_tokens).

    Strategy:
      1. Tokenize the query (content words only).
      2. Split body into sentences (crude punctuation split — good enough).
      3. Score each sentence by how many query tokens appear.
      4. Take the best sentence + one neighbor on each side, capped at max_chars.
      5. If nothing matches, return the first max_chars of the body (so the user
         still sees something).
    """
    import re

    body = (doc_body or "").strip()
    if not body:
        return "", []
    q_tokens = _tokenize(query)

    sentences = re.split(r"(?<=[\.\?\!])\s+", body)
    if not sentences:
        return body[:max_chars], q_tokens

    if not q_tokens:
        return body[:max_chars].rstrip() + ("…" if len(body) > max_chars else ""), []

    def score(sentence: str) -> int:
        low = sentence.lower()
        return sum(1 for t in q_tokens if t in low)

    scored = [(i, score(s)) for i, s in enumerate(sentences)]
    best_idx, best_score = max(scored, key=lambda x: x[1])
    if best_score == 0:
        return body[:max_chars].rstrip() + ("…" if len(body) > max_chars else ""), q_tokens

    lo = max(0, best_idx - 1)
    hi = min(len(sentences), best_idx + 2)
    chunk = " ".join(sentences[lo:hi]).strip()
    if len(chunk) > max_chars:
        chunk = chunk[:max_chars].rstrip() + "…"
    if lo > 0:
        chunk = "…" + chunk
    return chunk, [t for t in set(q_tokens) if t in chunk.lower()]


def _build_offline_answer(query: str, retrievals: Iterable[Retrieval]) -> str:
    """When no LLM is available, summarize retrievals into a useful offline answer."""
    top = list(retrievals)
    if not top:
        return (
            "No encontré fuentes directamente relevantes en la base de ciencia. "
            "Te recomiendo reformular la pregunta — o contactar al equipo para preguntas fuera del corpus."
        )
    lines = [
        f"**Modo offline — recuperé {len(top)} fuentes relevantes** "
        "(para respuestas completas con IA, configure `ANTHROPIC_API_KEY`).",
        "",
    ]
    for r in top:
        lines.append(f"### {r.doc.title} (_{r.doc.source}_)")
        # First ~2 sentences as preview
        preview = r.doc.body.replace("\n", " ")
        if len(preview) > 400:
            preview = preview[:400] + "…"
        lines.append(preview)
        if r.doc.url:
            lines.append(f"[Enlace]({r.doc.url})")
        lines.append("")
    lines.append(
        "\n---\n*Resultados basados en TF-IDF sobre la base de ciencia de BioCycle. "
        "Para conversación en lenguaje natural, active la IA conversacional (ANTHROPIC_API_KEY).*"
    )
    return "\n".join(lines)
