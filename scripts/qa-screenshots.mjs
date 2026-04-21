#!/usr/bin/env node
/**
 * qa-screenshots.mjs — Visual regression sweep with Playwright.
 *
 * Captures Streamlit + Landing in desktop / mobile / tablet viewports.
 * Outputs to .qa-screenshots/v2/{streamlit,landing,landing-mobile,landing-tablet}/.
 *
 * Assumes BOTH Streamlit (:5000) AND Next.js (:3000) are already running.
 * Run via: ./scripts/qa-screenshots.mjs
 *
 * Streamlit is flaky with Playwright on consecutive radio clicks — we use
 * a fresh BrowserContext per page navigation per CLAUDE.md guidance.
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '.qa-screenshots', 'v2');

const STREAMLIT_URL = 'http://127.0.0.1:5000';
const LANDING_URL = 'http://127.0.0.1:3000';

const STREAMLIT_PAGES = [
  { name: '01-inicio', radio: '🏠 Inicio' },
  { name: '02-descubrimientos', radio: '📚 Descubrimientos' },
  { name: '03-disenador', radio: '🧬 Construye tu Consorcio' },
  { name: '04-portal-cotizar', radio: '🏭 Gestiona tus Residuos' },
  { name: '05-asesoria-ia', radio: '💬 Asesoría IA' },
];

const LANDING_PAGES = [
  { name: '01-home-es', path: '/es' },
  { name: '02-home-en', path: '/en' },
  { name: '03-thank-you-es', path: '/es/thank-you?email=test%40example.com' },
  { name: '04-admin-insights', path: '/admin/insights' },
];

const DESKTOP = { width: 1440, height: 900 };
const TABLET = { width: 768, height: 1024 };
const MOBILE = { width: 375, height: 667 };

let okCount = 0;
let failCount = 0;
const failures = [];
function pass(msg) { console.log(`  \x1b[32m✓\x1b[0m ${msg}`); okCount++; }
function fail(msg) { console.error(`  \x1b[31m✗\x1b[0m ${msg}`); failures.push(msg); failCount++; }
function section(msg) { console.log(`\n\x1b[36m${msg}\x1b[0m`); }

async function ensureLive(url, label) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok || res.status === 307) return true;
    fail(`${label} not reachable (HTTP ${res.status}). Run ./scripts/dev.sh first.`);
    return false;
  } catch (err) {
    fail(`${label} not reachable. Run ./scripts/dev.sh first. (${err.message})`);
    return false;
  }
}

async function captureStreamlit(browser) {
  await mkdir(join(OUT, 'streamlit'), { recursive: true });
  for (const p of STREAMLIT_PAGES) {
    const ctx = await browser.newContext({ viewport: DESKTOP });
    const page = await ctx.newPage();
    try {
      await page.goto(STREAMLIT_URL, { waitUntil: 'networkidle', timeout: 30000 });
      const label = page.locator(`label:has-text("${p.radio}")`).first();
      if (await label.count() > 0) {
        await label.click({ timeout: 5000 });
        await page.waitForTimeout(1500);
      }
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      await page.screenshot({
        path: join(OUT, 'streamlit', `${p.name}.png`),
        fullPage: true,
      });
      pass(`streamlit/${p.name}.png`);
    } catch (err) {
      fail(`streamlit/${p.name}: ${err.message}`);
    } finally {
      await ctx.close();
    }
  }

  // Portal extra tabs
  const ctx = await browser.newContext({ viewport: DESKTOP });
  const page = await ctx.newPage();
  try {
    await page.goto(STREAMLIT_URL, { waitUntil: 'networkidle' });
    await page.locator(`label:has-text("🏭 Gestiona tus Residuos")`).first().click();
    await page.waitForTimeout(1500);
    const tabs = ['🎧 Escucha Activa', '📊 Caso ilustrativo'];
    for (const tabName of tabs) {
      const tab = page.locator(`button:has-text("${tabName}")`).first();
      if (await tab.count() > 0) {
        await tab.click();
        await page.waitForTimeout(800);
        const fname = `06-portal-${tabName.replace(/[^\w]/g, '').toLowerCase()}.png`;
        await page.screenshot({
          path: join(OUT, 'streamlit', fname),
          fullPage: true,
        });
        pass(`streamlit/${fname}`);
      }
    }
  } catch (err) {
    fail(`portal tabs: ${err.message}`);
  } finally {
    await ctx.close();
  }
}

async function captureLanding(browser, viewport, subdir) {
  await mkdir(join(OUT, subdir), { recursive: true });
  for (const p of LANDING_PAGES) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    try {
      const resp = await page.goto(`${LANDING_URL}${p.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      if (!resp || (!resp.ok() && resp.status() !== 307)) {
        fail(`${subdir}/${p.name}: HTTP ${resp?.status() ?? 'no response'}`);
        continue;
      }
      await page.waitForTimeout(2200);
      await page.screenshot({
        path: join(OUT, subdir, `${p.name}.png`),
        fullPage: true,
      });
      pass(`${subdir}/${p.name}.png`);
    } catch (err) {
      fail(`${subdir}/${p.name}: ${err.message}`);
    } finally {
      await ctx.close();
    }
  }
}

async function main() {
  section('Pre-flight');
  const ok1 = await ensureLive(STREAMLIT_URL, 'Streamlit (:5000)');
  const ok2 = await ensureLive(`${LANDING_URL}/es`, 'Landing (:3000)');
  if (!ok1 || !ok2) {
    console.error('\n\x1b[31mAborting — start services first with ./scripts/dev.sh\x1b[0m');
    process.exit(1);
  }
  pass('Streamlit + Landing reachable');

  const browser = await chromium.launch({ headless: true });
  try {
    section(`Streamlit · desktop ${DESKTOP.width}×${DESKTOP.height}`);
    await captureStreamlit(browser);

    section(`Landing · desktop ${DESKTOP.width}×${DESKTOP.height}`);
    await captureLanding(browser, DESKTOP, 'landing');

    section(`Landing · tablet ${TABLET.width}×${TABLET.height}`);
    await captureLanding(browser, TABLET, 'landing-tablet');

    section(`Landing · mobile ${MOBILE.width}×${MOBILE.height} (iPhone SE)`);
    await captureLanding(browser, MOBILE, 'landing-mobile');
  } finally {
    await browser.close();
  }

  console.log(`\n\x1b[36m──────────────────────────────────────────\x1b[0m`);
  if (failCount === 0) {
    console.log(`\x1b[32m✓ ${okCount} screenshots captured. Output: .qa-screenshots/v2/\x1b[0m`);
    process.exit(0);
  } else {
    console.log(`\x1b[31m✗ ${failCount} failures, ${okCount} ok\x1b[0m`);
    failures.forEach((f) => console.log(`   - ${f}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
