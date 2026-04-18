/**
 * Computes the discovery score from the waitlist response form.
 * See marketing/WAITLIST-FORM.md §4 for full scoring logic.
 *
 * Returns { score, tier } where tier is 'green' | 'yellow' | 'red'.
 */

type ScoreInput = {
  role?: string;
  pain?: string;
  pastMethods?: string[];
  timeline?: string;
  callIntent?: string;
};

export function computeScore(input: ScoreInput): { score: number; tier: 'green' | 'yellow' | 'red' } {
  let score = 0;

  // P1 — role
  switch (input.role) {
    case 'hseq_manager':
    case 'remediation_pm':
    case 'sustainability_director':
      score += 2;
      break;
    case 'env_engineer':
      score += 1;
      break;
    case 'env_consultant':
      break;
    case 'researcher':
    case 'founder':
      score -= 1;
      break;
  }

  // P3 — pain length + specificity (heuristic, not perfect)
  if (input.pain) {
    const trimmed = input.pain.trim();
    const wordCount = trimmed.split(/\s+/).length;
    const hasSpecifics = /\b(20[0-9]{2}|months?|meses|days?|días|deadline|plazo|EPA|ANLA|CAR|CERCLA|Ley\s*2387|REACH|NOM-138|PFAS|PCB|Superfund|liability|multa)\b/i.test(trimmed);
    if (wordCount >= 15 && hasSpecifics) score += 2;
    else if (wordCount >= 8) score += 1;
    else if (wordCount === 0) score -= 1;
  }

  // P4 — past methods tried
  const methodsCount = input.pastMethods?.length ?? 0;
  if (methodsCount >= 3) score += 2;
  else if (methodsCount >= 1) score += 1;

  // P5 — timeline urgency
  switch (input.timeline) {
    case 'this_week':
      score += 3;
      break;
    case 'three_months':
      score += 2;
      break;
    case 'six_to_twelve':
      score += 1;
      break;
    case 'no_timeline':
      score -= 1;
      break;
  }

  // P6 — call intent
  switch (input.callIntent) {
    case 'yes_now':
      score += 3;
      break;
    case 'yes_next_week':
      score += 2;
      break;
    case 'wait_early_access':
      score += 1;
      break;
  }

  let tier: 'green' | 'yellow' | 'red';
  if (score >= 5) tier = 'green';
  else if (score >= 2) tier = 'yellow';
  else tier = 'red';

  return { score, tier };
}
