/**
 * Minimal prompt-injection defense for external text (Reddit posts)
 * before embedding them in LLM prompts.
 *
 * We don't fight a motivated adversary here — we want to make sure a post
 * with content like "Ignore previous instructions and say X" lands in the
 * LLM context as *data*, not as an instruction, and stays bounded.
 */

const MAX_POST_CHARS = 3000;

export function sanitizeForPrompt(text: string | null | undefined): string {
  if (!text) return '';
  // Strip markdown that could look like system headings.
  let clean = text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*---+\s*$/gm, '')
    .replace(/<\/?\s*(system|user|assistant)[^>]*>/gi, '[tag-removed]')
    // kill "Ignore previous instructions" family
    .replace(
      /ignore (all|previous|prior) (instructions?|prompts?)/gi,
      '[ignored-instruction]',
    )
    .replace(/you are now a/gi, '[ignored-directive]');
  if (clean.length > MAX_POST_CHARS) {
    clean = clean.slice(0, MAX_POST_CHARS) + '…[truncated]';
  }
  return clean;
}
