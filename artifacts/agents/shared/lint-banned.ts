/**
 * CLI: lint a file or stdin for banned phrases.
 *
 * Usage:
 *   tsx shared/lint-banned.ts ../../marketing/PITCH-OUTLINE.md
 *   cat deck.md | tsx shared/lint-banned.ts
 */

import { readFile } from 'node:fs/promises';
import { lintBannedPhrases } from './banned';

async function readStdin(): Promise<string> {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function main() {
  const path = process.argv[2];
  const text = path ? await readFile(path, 'utf-8') : await readStdin();
  const hits = lintBannedPhrases(text);
  if (hits.length === 0) {
    console.log('✓ No banned phrases detected.');
    process.exit(0);
  }
  console.log(`✗ ${hits.length} banned phrases detected:\n`);
  for (const h of hits) {
    console.log(`  - "${h.phrase}"`);
    console.log(`      reason: ${h.reason}`);
    console.log(`      snippet: …${h.snippet}…\n`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
