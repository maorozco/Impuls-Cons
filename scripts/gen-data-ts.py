#!/usr/bin/env python3
"""Regenerate artifacts/landing/lib/biocycle-data.ts from impulso-biocycle/data.py.

This is the single source of truth for the scientific data (consortia, papers,
success probabilities, degradation curves). Python Streamlit and TypeScript
Next.js both read the SAME numbers — so when the Python is updated, run this
script to refresh the TS side.

Run: ./scripts/gen-data-ts.py
"""

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "artifacts" / "impulso-biocycle"))

import data  # type: ignore  # noqa: E402

TS_OUT = ROOT / "artifacts" / "landing" / "lib" / "biocycle-data.ts"


def escape_ts_string(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def to_ts_dict(obj):
    """JSON-serialize a Python dict/list/primitive with TS-friendly formatting."""
    return json.dumps(obj, ensure_ascii=False, indent=2)


def render() -> str:
    unique_microorganisms = len(
        {m["microorganism"] for v in data.CONSORTIA_DATA.values() for m in v}
    )
    total_contaminants = len(data.CONSORTIA_DATA)
    aggregate_publications = sum(data.PUBLICATIONS_COUNT.values())
    total_discoveries = len(data.DISCOVERIES)

    banner = f"""// AUTO-GENERATED from artifacts/impulso-biocycle/data.py
// DO NOT EDIT BY HAND — run `./scripts/gen-data-ts.py` to regenerate.
// Source of truth is the Python file; this file exists so Next.js can import
// the same scientific data (consortia, discoveries, success probabilities,
// degradation curves) that the Streamlit app uses.
"""

    body = [
        banner,
        "/* eslint-disable */",
        "",
        "export interface ConsortiumMember {",
        "  microorganism: string;",
        "  safety: string;",
        "  role: string;",
        "  /** Some entries in data.py use a string ('15%') rather than number — accept both. */",
        "  proportion: number | string;",
        "  optimal_range: string;",
        "}",
        "",
        "export interface Discovery {",
        "  title: string;",
        "  category: string;",
        "  year: number;",
        "  institution: string;",
        "  description: string;",
        "  result: string;",
        "  link: string;",
        "  color: string;",
        "}",
        "",
        "export interface DegradationCurves {",
        "  biocycle: number[];",
        "  natural: number[];",
        "  convencional: number[];",
        "}",
        "",
        f"export const UNIQUE_MICROORGANISMS = {unique_microorganisms};",
        f"export const TOTAL_CONTAMINANTS = {total_contaminants};",
        f"export const AGGREGATE_PUBLICATIONS = {aggregate_publications};",
        f"export const TOTAL_DISCOVERIES = {total_discoveries};",
        "",
        "export const SUBTYPES: Record<string, string[]> =",
        to_ts_dict(data.SUBTYPES) + ";",
        "",
        "export const CONSORTIA_DATA: Record<string, ConsortiumMember[]> =",
        to_ts_dict(data.CONSORTIA_DATA) + ";",
        "",
        "export const DISCOVERIES: Discovery[] =",
        to_ts_dict(data.DISCOVERIES) + ";",
        "",
        "export const SUCCESS_PROBABILITIES: Record<string, number> =",
        to_ts_dict(data.SUCCESS_PROBABILITIES) + ";",
        "",
        "export const PUBLICATIONS_COUNT: Record<string, number> =",
        to_ts_dict(data.PUBLICATIONS_COUNT) + ";",
        "",
        "export const DEGRADATION_CURVES: Record<string, DegradationCurves> =",
        to_ts_dict(data.DEGRADATION_CURVES) + ";",
        "",
        "export const CATEGORY_COLORS: Record<string, string> =",
        to_ts_dict(data.CATEGORY_COLORS) + ";",
        "",
    ]
    return "\n".join(body)


def main() -> int:
    TS_OUT.parent.mkdir(parents=True, exist_ok=True)
    contents = render()
    TS_OUT.write_text(contents, encoding="utf-8")
    print(f"✓ wrote {TS_OUT.relative_to(ROOT)}  ({len(contents):,} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
