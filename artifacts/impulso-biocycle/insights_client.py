"""Client for the Escucha Activa panel.

Reads the same aggregate data as the landing /api/insights endpoint, but
directly from Postgres so the Streamlit app doesn't need the landing to be
reachable. Cached snapshots on disk are used as Plan-B when the DB is down
on pitch day.
"""

from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

import streamlit as st

# ────────────────────────────────────────────────────────────────────────
# Types
# ────────────────────────────────────────────────────────────────────────


@dataclass
class PainTheme:
    theme: str
    avatar_match: str
    quote_count: int
    top_quote: dict | None = None  # {quote, subreddit, url}


@dataclass
class CompetitorStat:
    name: str
    mentions: int
    avg_sentiment: float


@dataclass
class InsightsSnapshot:
    updated_at: str
    mode: str  # "live" | "mock" | "snapshot"
    source: str  # "db" | "cache" | "api" | "fixture"
    signups_total: int = 0
    signups_last_7d: int = 0
    countries: int = 0
    posts_classified_total: int = 0
    high_pain_7d: int = 0
    top_pains: list[PainTheme] = field(default_factory=list)
    top_competitors: list[CompetitorStat] = field(default_factory=list)


# ────────────────────────────────────────────────────────────────────────
# Fixture — shown when DB + API + cache all unavailable
# ────────────────────────────────────────────────────────────────────────


def _fixture_snapshot() -> InsightsSnapshot:
    return InsightsSnapshot(
        updated_at=datetime.utcnow().isoformat() + "Z",
        mode="mock",
        source="fixture",
        signups_total=42,
        signups_last_7d=18,
        countries=7,
        posts_classified_total=287,
        high_pain_7d=64,
        top_pains=[
            PainTheme(
                theme="EPA PFAS deadline anxiety",
                avatar_match="remediation_pm_usa",
                quote_count=12,
                top_quote={
                    "quote": "We got a formal notice last week. Our incumbent quoted $18M for pump-and-treat.",
                    "subreddit": "PFAS",
                    "url": "https://reddit.com/r/PFAS/comments/f1x01",
                },
            ),
            PainTheme(
                theme="Hidrocarburos en suelos — contratistas poco confiables",
                avatar_match="hseq_latam",
                quote_count=7,
                top_quote={
                    "quote": "Hicimos remediación con biorremediación y en 18 meses nadie nos dio un baseline.",
                    "subreddit": "colombia",
                    "url": "https://reddit.com/r/colombia/comments/f1x02",
                },
            ),
            PainTheme(
                theme="Glifosato residuals — monitoreo ANLA 2026",
                avatar_match="hseq_latam",
                quote_count=4,
                top_quote={
                    "quote": "Varias operaciones en los Llanos están fallando los nuevos umbrales de monitoreo.",
                    "subreddit": "enviroengineering",
                    "url": "https://reddit.com/r/enviroengineering/comments/f1x07",
                },
            ),
        ],
        top_competitors=[
            CompetitorStat("AECOM", 5, -0.42),
            CompetitorStat("Veolia", 4, -0.15),
            CompetitorStat("Carbios", 3, 0.05),
        ],
    )


# ────────────────────────────────────────────────────────────────────────
# DB loader
# ────────────────────────────────────────────────────────────────────────


def _db_snapshot() -> InsightsSnapshot | None:
    url = os.environ.get("DATABASE_URL", "").strip()
    if not url or any(s in url for s in ("placeholder", "localhost.invalid", "example.com")):
        return None
    try:
        import psycopg2  # type: ignore
        from psycopg2.extras import RealDictCursor  # type: ignore
    except ImportError:
        return None

    try:
        with psycopg2.connect(url, connect_timeout=4) as conn:
            conn.autocommit = True
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT count(*)::int AS c FROM waitlist")
                signups_total = cur.fetchone()["c"] or 0

                cur.execute(
                    "SELECT count(*)::int AS c FROM waitlist "
                    "WHERE created_at > now() - interval '7 days'"
                )
                signups_7d = cur.fetchone()["c"] or 0

                cur.execute("SELECT count(DISTINCT country)::int AS c FROM waitlist WHERE country IS NOT NULL")
                countries = cur.fetchone()["c"] or 0

                cur.execute("SELECT count(*)::int AS c FROM reddit_classifications")
                classified = cur.fetchone()["c"] or 0

                cur.execute(
                    "SELECT count(*)::int AS c FROM reddit_classifications "
                    "WHERE classified_at > now() - interval '7 days' AND pain_intensity >= 3"
                )
                high_pain = cur.fetchone()["c"] or 0

                cur.execute(
                    "SELECT themes FROM pain_synthesis ORDER BY created_at DESC LIMIT 1"
                )
                row = cur.fetchone()
                themes_raw = (row or {}).get("themes") or []
                if isinstance(themes_raw, str):
                    themes_raw = json.loads(themes_raw)

                cur.execute(
                    "SELECT competitor, count(*)::int AS c, COALESCE(avg(sentiment)::float, 0) AS avg "
                    "FROM competitor_mentions "
                    "WHERE detected_at > now() - interval '7 days' "
                    "GROUP BY competitor ORDER BY c DESC LIMIT 5"
                )
                comp_rows = cur.fetchall()

        pains: list[PainTheme] = []
        for t in themes_raw[:5]:
            tq_list = t.get("topQuotes") or t.get("top_quotes") or []
            tq = tq_list[0] if tq_list else None
            pains.append(
                PainTheme(
                    theme=t.get("theme", ""),
                    avatar_match=t.get("avatarMatch") or t.get("avatar_match", "none"),
                    quote_count=t.get("quoteCount") or t.get("quote_count", 0),
                    top_quote=tq,
                )
            )

        return InsightsSnapshot(
            updated_at=datetime.utcnow().isoformat() + "Z",
            mode="live",
            source="db",
            signups_total=signups_total,
            signups_last_7d=signups_7d,
            countries=countries,
            posts_classified_total=classified,
            high_pain_7d=high_pain,
            top_pains=pains,
            top_competitors=[
                CompetitorStat(r["competitor"], r["c"], float(r["avg"])) for r in comp_rows
            ],
        )
    except Exception:
        return None


# ────────────────────────────────────────────────────────────────────────
# Cached snapshot — Plan B for pitch day if DB goes down
# ────────────────────────────────────────────────────────────────────────

_CACHE_FILE = Path(__file__).parent / ".insights_snapshot.json"


def _save_cache(snap: InsightsSnapshot) -> None:
    try:
        _CACHE_FILE.write_text(
            json.dumps(
                {
                    **snap.__dict__,
                    "top_pains": [t.__dict__ for t in snap.top_pains],
                    "top_competitors": [c.__dict__ for c in snap.top_competitors],
                    "saved_at": time.time(),
                }
            ),
            encoding="utf-8",
        )
    except OSError:
        pass


def _load_cache() -> InsightsSnapshot | None:
    if not _CACHE_FILE.is_file():
        return None
    try:
        raw: dict[str, Any] = json.loads(_CACHE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    try:
        return InsightsSnapshot(
            updated_at=raw["updated_at"],
            mode="snapshot",
            source="cache",
            signups_total=raw.get("signups_total", 0),
            signups_last_7d=raw.get("signups_last_7d", 0),
            countries=raw.get("countries", 0),
            posts_classified_total=raw.get("posts_classified_total", 0),
            high_pain_7d=raw.get("high_pain_7d", 0),
            top_pains=[PainTheme(**t) for t in raw.get("top_pains", [])],
            top_competitors=[CompetitorStat(**c) for c in raw.get("top_competitors", [])],
        )
    except (KeyError, TypeError):
        return None


# ────────────────────────────────────────────────────────────────────────
# Public API
# ────────────────────────────────────────────────────────────────────────


@st.cache_data(ttl=60, show_spinner=False)
def get_insights_snapshot() -> InsightsSnapshot:
    """Returns the freshest insights snapshot — preferring DB, falling
    back to cache, then fixture. Streamlit cache is 60 seconds.
    """
    snap = _db_snapshot()
    if snap is not None:
        _save_cache(snap)
        return snap
    cached = _load_cache()
    if cached is not None:
        return cached
    return _fixture_snapshot()
