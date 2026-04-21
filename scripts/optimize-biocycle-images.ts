#!/usr/bin/env tsx
/**
 * optimize-biocycle-images.ts — converts generated PNGs to WebP (quality 85)
 * and writes a parallel set of 2× (retina) and 1× variants per id.
 *
 * Target pixel widths per aspect are tuned for the largest container:
 *   16:9 → 1920×1080 (2×) and 960×540 (1×)
 *   4:5  → 1080×1350 (2×) and 540×675  (1×)
 *   1:1  → 1080×1080 (2×) and 540×540  (1×)
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Allow override when running from a sibling workspace (tsx resolution):
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = SCRIPT_DIR.endsWith('/scripts')
  ? resolve(SCRIPT_DIR, '..')
  : resolve(SCRIPT_DIR, '../..');
const IN_DIR =
  process.env.BIOCYCLE_IMG_DIR ??
  resolve(REPO_ROOT, 'artifacts/landing/public/biocycle/img');

interface Meta {
  id: string;
  aspect: '16:9' | '4:5' | '1:1';
  model?: string;
  bytes?: number;
}

const WIDTHS: Record<Meta['aspect'], { retina: number; standard: number }> = {
  '16:9': { retina: 1920, standard: 960 },
  '4:5': { retina: 1080, standard: 540 },
  '1:1': { retina: 1080, standard: 540 },
};

async function main() {
  const files = await readdir(IN_DIR);
  const metas = files.filter((f) => f.endsWith('.meta.json'));
  console.log(`[optimize] processing ${metas.length} images`);

  let totalOrig = 0;
  let totalOptim = 0;

  for (const metaFile of metas) {
    const meta = JSON.parse(await readFile(resolve(IN_DIR, metaFile), 'utf8')) as Meta;
    const pngPath = resolve(IN_DIR, `${meta.id}.png`);
    const pngBuf = await readFile(pngPath);
    totalOrig += pngBuf.length;
    const widths = WIDTHS[meta.aspect] ?? WIDTHS['16:9'];

    for (const [tag, w] of [
      ['@2x', widths.retina],
      ['', widths.standard],
    ] as const) {
      const outPath = resolve(IN_DIR, `${meta.id}${tag}.webp`);
      const info = await sharp(pngBuf)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 85, effort: 5 })
        .toFile(outPath);
      totalOptim += info.size;
      console.log(
        `[ok] ${meta.id}${tag}.webp → ${(info.size / 1024).toFixed(0)} KB (${info.width}×${info.height})`,
      );
    }
  }

  console.log(
    `\n[done] PNG total: ${(totalOrig / 1024 / 1024).toFixed(1)} MB · WebP total: ${(totalOptim / 1024 / 1024).toFixed(1)} MB (${(
      (totalOptim / totalOrig) *
      100
    ).toFixed(0)}%)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
