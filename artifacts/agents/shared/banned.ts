/**
 * Banned-phrase linter for agent outputs.
 *
 * Sources:
 * - marketing/ADS-HOOKS.md §6 (banned ad phrases)
 * - .research-synthesis.md §11 (no-prometer list)
 * - marketing/AI-ML-MOAT.md §5 (AI/ML cannot-promise list)
 *
 * Any output that matches is flagged; callers decide whether to block or annotate.
 */

export const BANNED_SUBSTRINGS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /limpiam?os? (los? )?oc[eé]anos?/i, reason: 'ADS-HOOKS §6 — "limpiar océanos"' },
  { pattern: /clean(?:ing)? the oceans?/i, reason: 'ADS-HOOKS §6 — "clean the ocean"' },
  { pattern: /el pl[aá]stico desaparece/i, reason: 'research-synthesis §11 — produce monómeros, no "desaparece"' },
  { pattern: /plastic disappears?/i, reason: 'research-synthesis §11 — plastic produces monomers' },
  { pattern: /c[aá]psulas? (en|para) playa/i, reason: 'research-synthesis §11 — cápsulas no funcionan en campo abierto' },
  { pattern: /capsules? on (the )?beach/i, reason: 'research-synthesis §11 — capsules do not work on beaches' },
  { pattern: /alphafold.{0,20}(designs?|designing|dise[ñn]a|disenando)/i, reason: 'AI-ML-MOAT §5 — AlphaFold Server es CC-BY-NC-SA' },
  { pattern: /(usamos|we use) alphafold/i, reason: 'AI-ML-MOAT §5 — AlphaFold Server es CC-BY-NC-SA, usar ESMFold/OpenFold' },
  { pattern: /liberad[oa]s? al (ambiente|medio)/i, reason: 'research-synthesis §11 — UE no aprueba GMO remediación' },
  { pattern: /released into (the )?environment/i, reason: 'research-synthesis §11 — UE no aprueba GMO remediación' },
  { pattern: /100% biodegrada/i, reason: 'research-synthesis §11 — sin %100 sin disclaimer' },
  { pattern: /saas (listo|ready)/i, reason: 'research-synthesis §11 — SaaS is phase 2-3, not ready' },
  { pattern: /guarantee(?:d)?\s+(remediation|degradation|cleanup)/i, reason: 'AI-ML-MOAT §5 — no guarantees without pilot data' },
  { pattern: /garantizamos (limpieza|remediaci[oó]n)/i, reason: 'AI-ML-MOAT §5 — no garantizar sin piloto' },
  { pattern: /(\bcarbios\b).{0,40}(matches?|iguales?|equivalent)/i, reason: 'ADS-HOOKS §6 — no competimos con Carbios en mismo plano' },
  { pattern: /en d[ií]as.{0,30}(playa|beach|campo|field)/i, reason: 'research-synthesis §11 — tiempos de lab no aplican en campo' },
];

export interface BannedHit {
  phrase: string;
  reason: string;
  snippet: string;
}

export function lintBannedPhrases(text: string): BannedHit[] {
  const hits: BannedHit[] = [];
  for (const rule of BANNED_SUBSTRINGS) {
    const m = rule.pattern.exec(text);
    if (m) {
      const start = Math.max(0, m.index - 40);
      const end = Math.min(text.length, m.index + m[0].length + 40);
      hits.push({
        phrase: m[0],
        reason: rule.reason,
        snippet: text.slice(start, end).replace(/\s+/g, ' ').trim(),
      });
    }
  }
  return hits;
}

export function stripBannedPhrases(text: string): { cleaned: string; hits: BannedHit[] } {
  const hits = lintBannedPhrases(text);
  let cleaned = text;
  for (const h of hits) {
    cleaned = cleaned.replace(h.phrase, `[BLOCKED: ${h.reason}]`);
  }
  return { cleaned, hits };
}
