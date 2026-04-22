#!/usr/bin/env tsx
/**
 * gen-biocycle-images.ts — generate editorial images for the BioCycle product
 * app using Google Gemini 2.5 Flash Image (Nano Banana), falling back to Imagen
 * 4 Fast if Nano Banana is rate-limited or refuses the prompt.
 *
 * Usage:
 *   tsx scripts/gen-biocycle-images.ts            # generate all missing
 *   tsx scripts/gen-biocycle-images.ts --force    # regenerate all
 *   tsx scripts/gen-biocycle-images.ts hero,path-lab  # subset by ids
 *
 * Cost: ~$0.04 per Nano Banana image, ~$0.04 per Imagen 4 fast.
 * Budget for the full set (10 images) is <$0.50.
 *
 * Secrets: loads GOOGLE_API_KEY from herramientas-claude/.env.
 *
 * Output: PNG byte streams are decoded and saved to
 * artifacts/landing/public/biocycle/img/<id>.png with a matching
 * <id>.meta.json storing the prompt + model used (for provenance + future
 * regeneration).
 */

import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'artifacts/landing/public/biocycle/img');
const ENV_PATH = resolve(
  process.env.HOME ?? '/Users/justindiaz',
  'Documents/herramientas-claude/.env',
);

// ── palette / style guard ─────────────────────────────────────────────
const PALETTE = [
  '#004D2C forest deep green (primary)',
  '#00C853 bright spring green',
  '#00D9F5 electric cyan',
  '#C4FF00 bioluminescent lime',
  '#FAFCF9 paper white',
  '#0E2A1C ink near-black',
].join(', ');

const STYLE_CARD = `
STYLE CONTRACT (always obey):
- Editorial, scientific, cinematic. Not stock photo, not cartoon, not clipart, not AI-slop.
- Palette restricted to: ${PALETTE}.
- Composition: rule-of-thirds, generous negative space, natural light or subtle volumetric glow.
- Photorealism where biological subjects appear; poster-like when abstract.
- NO text, NO watermarks, NO logos, NO hands holding phones, NO smiling stock faces.
- NO hazard tape, NO cartoonish Petri dishes, NO generic "science lab" tropes.
- 16:9 framing unless otherwise specified. Native resolution.
`.trim();

// ── image manifest ────────────────────────────────────────────────────
interface Spec {
  id: string;
  aspect: '16:9' | '4:5' | '1:1';
  prompt: string;
}

const SPECS: Spec[] = [
  {
    id: 'hero-inicio',
    aspect: '16:9',
    prompt: `Editorial macro photograph of a single translucent spherical alginate capsule about 3mm in diameter, suspended at the center of the frame against a deep forest-green out-of-focus background. Inside the capsule, visible microscopic bacterial clusters and fungal hyphae rendered as elegant organic patterns — small teal-green dots and lime-tinted filaments arranged as a micro-ecosystem. The capsule catches a single warm rim-light from the upper right creating a soft bioluminescent glow, with golden bokeh behind it. Shot with shallow depth of field, scientific-journal cover aesthetic (think Nature or Cell), Kinfolk editorial warmth. No text, no labels, no UI, no hands. The capsule is the only subject — small, precise, alive.`,
  },
  {
    id: 'path-lab',
    aspect: '4:5',
    prompt: `A vertical portrait of a LATAM female scientist in her thirties, short dark hair, no makeup, wearing a lab coat over a fitted navy sweater. She is examining a small glass fermenter with subtle teal liquid, framed in a modern university microbiology lab with matte black fume hoods visible out of focus behind her. Natural window light rakes from the right. Hyperreal, editorial magazine style. She looks focused, not smiling, caught mid-thought.`,
  },
  {
    id: 'path-biz',
    aspect: '4:5',
    prompt: `A vertical view of a contained industrial bioreactor system installed on a clean concrete floor inside an oil refinery's auxiliary plant. Two forest-green stainless steel vessels about 2m tall, connected by cyan-colored piping and a thin lime-green sensor cable. A faint golden refinery skyline is visible through tall frosted windows at dusk. No people. Feels like the alternative future of waste treatment — quiet, modular, industrial.`,
  },
  {
    id: 'featured-paper',
    aspect: '16:9',
    prompt: `Abstract editorial illustration of a PET-degrading enzyme (FAST-PETase) captured at the moment of cleaving a plastic polymer chain. Ribbon diagram of the protein rendered in forest green and electric cyan, with the substrate chain unraveling into smaller monomer beads glowing lime. A soft bokeh of scientific paper pages blurs behind. Dark paper-white background. Feels like the cover of Nature Chemical Biology.`,
  },
  {
    id: 'disenador-bg',
    aspect: '16:9',
    prompt: `Abstract poster-style render of molecules transforming into clean monomers inside a flowing cyan liquid. Organic filaments of hyphae weaving through the scene, lit from below with lime-green bioluminescence. No text, no labels. Evokes computation, chemistry, and movement. Paper-white negative space on the right third — space for UI to be overlaid. Editorial science visualization.`,
  },
  {
    id: 'portal-refineria',
    aspect: '16:9',
    prompt: `A cinematic side-long shot of a Colombian Andes refinery at golden hour — not the whole plant, just two cylindrical steel tanks and a service road in the foreground, with faint Andean mountains in muted teal behind. The middle tank has a small retrofitted biorreactor module bolted to its side with visible cyan piping. Photorealistic, documentary tone, no people. Tells the story of retrofitting rather than replacement.`,
  },
  {
    id: 'asesoria-corpus',
    aspect: '16:9',
    prompt: `Abstract visualization of a scientific knowledge graph: 60 paper thumbnails rendered as small floating cards in 3D space, connected by thin lime-green lines of varying opacity that represent citations. Cards are photographed from above with soft depth-of-field, forest-green background, a single card pulled forward in focus showing a ribbon diagram. Evokes an interconnected corpus of 61 peer-reviewed sources.`,
  },
  {
    id: 'onboarding-welcome',
    aspect: '1:1',
    prompt: `Centered square editorial illustration of an abstract microbial consortium rendered as four interlocking organic shapes — a green sphere, a cyan curve, a lime spiral, and a darker green hexagon — floating in a clean paper-white space with subtle drop shadows. No text. Evokes the four avatars (lab, enterprise, regulator, investor) converging on the same problem. Minimalist and warm.`,
  },
  {
    id: 'hero-disenador',
    aspect: '16:9',
    prompt: `Wide over-the-shoulder perspective of a scientist's hands typing conditions into a holographic interface while a glowing cyan 3D model of a microbial consortium rotates in front of her — each microorganism color-coded (bacteria in cyan, fungi in lime, yeast in forest green). Subtle lime lighting from below. Photorealistic, not sci-fi cliché. Feels like a product demo from 2030.`,
  },
  {
    id: 'hero-descubrimientos',
    aspect: '16:9',
    prompt: `Top-down editorial still life of scientific papers fanned out across a forest-green felt surface, each paper lit with a single warm spotlight, with one paper slightly lifted — shown with a small teal biofilm sample mounted on its corner. Classical museum aesthetic. No text visible on papers, just the abstract suggestion of figures and tables. The atmosphere of peer-reviewed rigor, but warm, not sterile.`,
  },
];

// ── .env loader ───────────────────────────────────────────────────────
async function loadApiKey(): Promise<string> {
  try {
    const raw = await readFile(ENV_PATH, 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*GOOGLE_API_KEY\s*=\s*"?([^"'\s]+)"?\s*$/);
      if (m) return m[1];
    }
  } catch {
    // fall through
  }
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;
  throw new Error(`GOOGLE_API_KEY not found in ${ENV_PATH} or env.`);
}

// ── provider calls ────────────────────────────────────────────────────
async function callNanoBanana(apiKey: string, prompt: string): Promise<Buffer | null> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['Image'] },
      }),
    },
  );
  if (!resp.ok) {
    console.warn(`[nano-banana] HTTP ${resp.status}: ${(await resp.text()).slice(0, 120)}`);
    return null;
  }
  const data = (await resp.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
    }>;
  };
  for (const cand of data.candidates ?? []) {
    for (const part of cand.content?.parts ?? []) {
      const b64 = part.inlineData?.data;
      if (b64) return Buffer.from(b64, 'base64');
    }
  }
  console.warn('[nano-banana] no image in response');
  return null;
}

async function callImagen4Fast(
  apiKey: string,
  prompt: string,
  aspect: '16:9' | '4:5' | '1:1',
): Promise<Buffer | null> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: aspect },
      }),
    },
  );
  if (!resp.ok) {
    console.warn(`[imagen-4] HTTP ${resp.status}: ${(await resp.text()).slice(0, 120)}`);
    return null;
  }
  const data = (await resp.json()) as {
    predictions?: Array<{ bytesBase64Encoded?: string }>;
  };
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  return b64 ? Buffer.from(b64, 'base64') : null;
}

// ── orchestrator ──────────────────────────────────────────────────────
async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const idsArg = args.find((a) => !a.startsWith('--'));
  const requestedIds = idsArg ? idsArg.split(',').map((s) => s.trim()) : null;

  const apiKey = await loadApiKey();
  await mkdir(OUT_DIR, { recursive: true });

  const targets = SPECS.filter((s) => !requestedIds || requestedIds.includes(s.id));
  console.log(`[gen-images] generating ${targets.length} images to ${OUT_DIR}`);

  let okCount = 0;
  let failCount = 0;
  for (const spec of targets) {
    const outPng = resolve(OUT_DIR, `${spec.id}.png`);
    const outMeta = resolve(OUT_DIR, `${spec.id}.meta.json`);
    if (!force && (await exists(outPng))) {
      console.log(`[skip] ${spec.id} (exists)`);
      continue;
    }

    const fullPrompt = `${STYLE_CARD}\n\nSUBJECT:\n${spec.prompt}\n\nOutput a single photographic image, ${spec.aspect} aspect ratio.`;
    console.log(`[gen] ${spec.id} …`);

    let bytes = await callNanoBanana(apiKey, fullPrompt);
    let modelUsed = 'gemini-2.5-flash-image';
    if (!bytes) {
      console.log(`[gen] ${spec.id} → trying Imagen 4 fast`);
      bytes = await callImagen4Fast(apiKey, fullPrompt, spec.aspect);
      modelUsed = 'imagen-4.0-fast-generate-001';
    }
    if (!bytes) {
      console.error(`[fail] ${spec.id} — both providers declined`);
      failCount++;
      continue;
    }
    await writeFile(outPng, bytes);
    await writeFile(
      outMeta,
      JSON.stringify(
        {
          id: spec.id,
          aspect: spec.aspect,
          model: modelUsed,
          bytes: bytes.length,
          generated_at: new Date().toISOString(),
          prompt: spec.prompt,
        },
        null,
        2,
      ),
    );
    console.log(`[ok]   ${spec.id} → ${(bytes.length / 1024).toFixed(0)} KB via ${modelUsed}`);
    okCount++;
    // Be polite to the quota
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`\n[done] ok=${okCount} fail=${failCount} skipped=${targets.length - okCount - failCount}`);
  if (failCount > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
