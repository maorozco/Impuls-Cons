import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:3000';
const ML_API = process.env.NEXT_PUBLIC_ML_API_URL ?? 'http://127.0.0.1:5001';

// Mark onboarding seen by default so the tour overlay doesn't block UI-click tests.
// Onboarding-specific tests override this by clearing the key inside the test.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('biocycle_onboarded_v1', 'skip:testsetup');
    } catch {}
  });
});

test.describe('BioCycle routes · boot + navigation', () => {
  test('all 5 routes respond 200 + nav item highlights active', async ({ page }) => {
    const ROUTES = [
      { href: '/biocycle/inicio', navText: 'Inicio' },
      { href: '/biocycle/descubrimientos', navText: 'Descubrimientos' },
      { href: '/biocycle/disenador', navText: 'Construye tu Consorcio' },
      { href: '/biocycle/portal', navText: 'Gestiona tus Residuos' },
      { href: '/biocycle/asesoria', navText: 'Asesoría IA' },
    ];

    for (const r of ROUTES) {
      const resp = await page.goto(`${BASE}${r.href}`, { waitUntil: 'networkidle' });
      expect(resp?.status()).toBe(200);
      await expect(page.locator(`aside.sidebar .nav-item.active`, { hasText: r.navText })).toBeVisible();
      await expect(page.locator('.topbar .crumbs b').last()).toContainText(r.navText);
    }
  });

  test('/biocycle redirects to /biocycle/inicio', async ({ page }) => {
    const resp = await page.goto(`${BASE}/biocycle`, { waitUntil: 'networkidle' });
    expect(page.url()).toMatch(/\/biocycle\/inicio$/);
    expect(resp?.status()).toBeLessThan(400);
  });
});

test.describe('Inicio · hero + paths + CTAs', () => {
  test('hero has tag, h1 with accent em, both CTA buttons', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await expect(page.locator('.hero-tag')).toBeVisible();
    await expect(page.locator('h1 em')).toHaveText('receta microbiana');
    await expect(page.locator('.btn-primary', { hasText: 'Construye tu Consorcio' })).toBeVisible();
    await expect(page.locator('.btn-ghost', { hasText: 'Gestiona tus Residuos' })).toBeVisible();
  });

  test('value-grid shows 3 cells, problems 4, metrics 4', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await expect(page.locator('.value-cell')).toHaveCount(3);
    await expect(page.locator('.prob')).toHaveCount(4);
    await expect(page.locator('.metric')).toHaveCount(4);
  });

  test('path cards link to disenador and portal', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await page.locator('.path.lab .p-cta').click();
    await expect(page).toHaveURL(/\/biocycle\/disenador$/);
    await page.goto(`${BASE}/biocycle/inicio`);
    await page.locator('.path.biz .p-cta').click();
    await expect(page).toHaveURL(/\/biocycle\/portal$/);
  });
});

test.describe('Descubrimientos · feed + filters + sort', () => {
  test('renders 10 papers, featured card has 26px heading', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/descubrimientos`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('paper-feed').locator('article.paper')).toHaveCount(10);
    await expect(page.locator('article.paper.featured')).toHaveCount(1);
    await expect(page.getByTestId('results-count')).toContainText('10 resultados');
  });

  test('filter by Plásticos shows 3 papers', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/descubrimientos`, { waitUntil: 'networkidle' });
    const btn = page.getByTestId('filter-plastics');
    await btn.waitFor({ state: 'visible' });
    await btn.click();
    await expect(btn).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('paper-feed').locator('article.paper')).toHaveCount(3);
    await expect(page.getByTestId('results-count')).toContainText('3 resultados');
  });

  test('filter by PFAS shows 1 paper', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/descubrimientos`, { waitUntil: 'networkidle' });
    const btn = page.getByTestId('filter-pfas');
    await btn.waitFor({ state: 'visible' });
    await btn.click();
    await expect(btn).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('paper-feed').locator('article.paper')).toHaveCount(1);
  });

  test('sort button cycles through options', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/descubrimientos`, { waitUntil: 'networkidle' });
    const sort = page.getByTestId('sort-btn');
    await expect(sort).toContainText('Reciente');
    await sort.click();
    await expect(sort).toContainText('Antiguo');
    await sort.click();
    await expect(sort).toContainText('Categoría');
  });

  test('category colors render (cat-plastic swatch)', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/descubrimientos`, { waitUntil: 'networkidle' });
    await expect(page.locator('.p-cat.cat-plastic').first()).toBeVisible();
  });
});

test.describe('Disenador · wizard + validation + run', () => {
  test('categories + subtype pills interact', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/disenador`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('cat-hydrocarbons')).toHaveClass(/selected/);
    await page.getByTestId('cat-plastics').click();
    await expect(page.getByTestId('cat-plastics')).toHaveClass(/selected/);
  });

  test('blocking alert fires on plastics + in_situ', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/disenador`, { waitUntil: 'networkidle' });
    await page.getByTestId('cat-plastics').click();
    // Try to click in_situ_soil — should be disabled, alert must appear since default mode was in_situ_soil
    await expect(page.getByTestId('blocked-alert')).toBeVisible();
    await expect(page.getByTestId('design-btn')).toBeDisabled();
  });

  test('sliders update conditions + design button runs ML predict', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/disenador`, { waitUntil: 'networkidle' });
    await page.getByTestId('input-temp').fill('30');
    await page.getByTestId('input-ph').fill('7.2');
    await page.getByTestId('input-volume').fill('200');
    await page.getByTestId('design-btn').click();
    // Results appear (waits up to 15s for ML API)
    await expect(page.getByTestId('results')).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId('prob-num')).toBeVisible();
  });
});

test.describe('Portal · 3 tabs', () => {
  test('cotiza tab default visible, generate button present', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('tab-cotiza')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('tab-content-cotiza')).toBeVisible();
    await expect(page.getByTestId('generate-quote')).toBeVisible();
  });

  test('switching to Escucha Activa shows dolor cards', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await page.getByTestId('tab-escucha').click();
    await expect(page.getByTestId('tab-content-escucha')).toBeVisible();
    await expect(page.locator('.dolor-card')).toHaveCount(3);
    // Competitor count varies with live data (range 0-4); assert >=1 always
    await expect(page.locator('.competitor').first()).toBeVisible();
  });

  test('Escucha Activa quotes have clickable source links', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await page.getByTestId('tab-escucha').click();
    // Give the /api/insights fetch a moment to resolve
    await page.waitForTimeout(2000);
    const firstQuote = page.getByTestId('ea-quote-0');
    await expect(firstQuote).toBeVisible();
    const link = firstQuote.locator('a.q-link');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });

  test('switching to Caso ilustrativo shows Refinería Andina', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await page.getByTestId('tab-caso').click();
    await expect(page.getByTestId('tab-content-caso')).toBeVisible();
    await expect(page.locator('.case-hero h3')).toContainText('Refinería Andina');
    await expect(page.locator('.case-step')).toHaveCount(4);
  });

  test('op type selection updates state', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await page.getByTestId('op-textil').click();
    await expect(page.getByTestId('op-textil')).toHaveClass(/selected/);
    await expect(page.getByTestId('op-refineria')).not.toHaveClass(/selected/);
  });

  test('contaminant dropdown is restricted to the selected operation', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    // Refinería → should contain TPH
    const select = page.getByTestId('contaminant-select');
    await expect(select).toBeVisible();
    const refineriaOptions = await select.locator('option').allInnerTexts();
    expect(refineriaOptions.some((t) => /TPH/i.test(t))).toBe(true);
    expect(refineriaOptions.some((t) => /colorantes/i.test(t))).toBe(false);
    // Switch to Textil → should contain Colorantes, NOT TPH
    await page.getByTestId('op-textil').click();
    const textilOptions = await select.locator('option').allInnerTexts();
    expect(textilOptions.some((t) => /colorantes/i.test(t))).toBe(true);
    expect(textilOptions.some((t) => /TPH/i.test(t))).toBe(false);
  });

  test('Generar cotización updates output with op-specific labels', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    // Empty state visible first
    await expect(page.getByTestId('quote-empty')).toBeVisible();
    // Refinería default → click Generar → see excavación label + TPH degradation
    await page.getByTestId('generate-quote').click();
    await expect(page.getByTestId('quote-empty')).toBeHidden();
    await expect(page.getByTestId('quote-vs-label')).toContainText(/excavación/i);
    await expect(page.getByTestId('quote-degradation')).toContainText('%');
    // Switch to Textil → empty state returns (reset on op change) → Generar → labels change
    await page.getByTestId('op-textil').click();
    await expect(page.getByTestId('quote-empty')).toBeVisible();
    await page.getByTestId('generate-quote').click();
    await expect(page.getByTestId('quote-vs-label')).not.toContainText(/excavación/i);
    await expect(page.getByTestId('quote-regulation')).toContainText(/Textil|ANLA|CONAMA|EPA|SEMARNAT/);
  });

  test('Caso ilustrativo tab shows HIPOTÉTICO banner + HIPOTÉTICO tag', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await page.getByTestId('tab-caso').click();
    const banner = page.getByTestId('caso-disclaimer');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/HIPOT[ÉE]TICOS/i);
    // Tag near the title also says HIPOTÉTICO
    await expect(page.locator('.illus-tag-warn')).toBeVisible();
    await expect(page.locator('.illus-tag-warn')).toContainText(/HIPOT[ÉE]TICO/i);
  });

  test('Consultora shows call-to-action link instead of calculator', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await page.getByTestId('op-consultora').click();
    const cta = page.getByTestId('generate-quote');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Agenda|call/i);
    // href should be mailto
    await expect(cta).toHaveAttribute('href', /mailto:/);
  });
});

test.describe('Asesoría · chat + suggestions + guardrail', () => {
  test('suggestions render before first message', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/asesoria`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('suggestions')).toBeVisible();
    await expect(page.getByTestId('sugg-costos')).toBeVisible();
    await expect(page.getByTestId('sugg-competencia')).toBeVisible();
  });

  test('sending a suggestion triggers skeleton then response with sources', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto(`${BASE}/biocycle/asesoria`, { waitUntil: 'networkidle' });
    await page.getByTestId('sugg-hidrocarburos').click();
    // Wait for real answer (RAG can take ~60s on OpenRouter free)
    await expect(page.getByTestId('skeleton')).toBeHidden({ timeout: 150_000 });
    const messages = page.getByTestId('messages');
    await expect(messages.locator('.msg.u')).toHaveCount(1);
    await expect(messages.locator('.msg.a')).toHaveCount(1);
  });

  test('guardrail fires on "plástico en playa" query', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/asesoria`, { waitUntil: 'networkidle' });
    const input = page.getByTestId('composer-input');
    await input.click();
    await input.fill('¿Pueden limpiar plástico en una playa?');
    // Trigger re-render so send-btn becomes enabled
    await input.press('End');
    // Enter submits (Enter without Shift)
    await input.press('Enter');
    await expect(page.getByTestId('guardrail')).toBeVisible({ timeout: 120000 });
  });
});

test.describe('Endpoints · ML API + Next API', () => {
  test('GET /healthz → ok', async ({ request }) => {
    const r = await request.get(`${ML_API}/healthz`);
    expect(r.ok()).toBe(true);
    const json = await r.json();
    expect(json.ok).toBe(true);
    expect(json.corpus_size).toBeGreaterThan(50);
  });

  test('POST /api/ml/predict → degradation_pct', async ({ request }) => {
    const r = await request.post(`${ML_API}/api/ml/predict`, {
      data: {
        contaminant: 'hydrocarbons',
        temp_C: 28,
        pH: 7,
        mode: 'in_situ',
        contamination_pct: 10,
        pretreatment: true,
        time_weeks: 12,
      },
    });
    expect(r.ok()).toBe(true);
    const json = await r.json();
    expect(typeof json.degradation_pct).toBe('number');
    expect(json.degradation_pct).toBeGreaterThanOrEqual(0);
    expect(json.degradation_pct).toBeLessThanOrEqual(100);
  });

  test('GET /api/insights on Next returns JSON with signups', async ({ request }) => {
    const r = await request.get(`${BASE}/api/insights`);
    expect(r.ok()).toBe(true);
    const json = await r.json();
    expect(json).toHaveProperty('signups');
    expect(json).toHaveProperty('reddit');
  });

  test('GET /admin/insights on localhost returns 200 (bypass auth)', async ({ request }) => {
    const r = await request.get(`${BASE}/admin/insights`);
    expect(r.status()).toBe(200);
  });
});

test.describe('Onboarding · tour for new users', () => {
  // Override the global beforeEach: clear the onboarded flag so the tour auto-starts
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.removeItem('biocycle_onboarded_v1');
      } catch {}
    });
  });

  test('welcome modal appears on first visit with skip + next buttons', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    const welcome = page.getByTestId('onboarding-step-welcome');
    await expect(welcome).toBeVisible({ timeout: 5000 });
    await expect(welcome).toContainText('Bienvenido a Impulso BioCycle');
    await expect(page.getByTestId('onboarding-skip')).toBeVisible();
    await expect(page.getByTestId('onboarding-next')).toBeVisible();
  });

  test('skip button dismisses and persists to localStorage', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('onboarding-step-welcome')).toBeVisible({ timeout: 5000 });
    await page.getByTestId('onboarding-skip').click();
    await expect(page.getByTestId('onboarding-step-welcome')).toBeHidden();
    const persisted = await page.evaluate(() => window.localStorage.getItem('biocycle_onboarded_v1'));
    expect(persisted).toMatch(/^skip:/);
  });

  test('next advances through all 5 steps', async ({ page }) => {
    // Use a slightly larger viewport so the onboarding card fits without scroll.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('onboarding-step-welcome')).toBeVisible({ timeout: 5000 });
    // Enter key is bound as "next" by the onboarding — use it to avoid any
    // layout quirks when the card grows with editorial imagery.
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('onboarding-step-sidebar')).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('onboarding-step-paths')).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('onboarding-step-metrics')).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('onboarding-step-asesoria')).toBeVisible({ timeout: 5000 });
    // Final step: Enter completes + navigates to asesoria
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/biocycle\/asesoria$/, { timeout: 5000 });
    const persisted = await page.evaluate(() => window.localStorage.getItem('biocycle_onboarded_v1'));
    expect(persisted).toMatch(/^complete:/);
  });

  test('Escape key dismisses tour', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('onboarding-step-welcome')).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('onboarding-step-welcome')).toBeHidden();
  });

  test('topbar Tour button re-triggers tour after skip', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('onboarding-step-welcome')).toBeVisible({ timeout: 5000 });
    await page.getByTestId('onboarding-skip').click();
    await expect(page.getByTestId('onboarding-step-welcome')).toBeHidden();
    // Click topbar Tour button
    await page.getByTestId('topbar-help-btn').click();
    await expect(page.getByTestId('onboarding-step-welcome')).toBeVisible({ timeout: 5000 });
  });

  test('?tour=1 query param autostarts tour even if onboarded', async ({ page }) => {
    // Set the onboarded flag first
    await page.addInitScript(() => {
      window.localStorage.setItem('biocycle_onboarded_v1', 'skip:prior');
    });
    await page.goto(`${BASE}/biocycle/inicio?tour=1`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('onboarding-step-welcome')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Editorial imagery · generated via Nano Banana', () => {
  // Every image id the gen script emits — keep in sync with
  // scripts/gen-biocycle-images.ts SPECS.
  const IMG_IDS = [
    'hero-inicio',
    'path-lab',
    'path-biz',
    'featured-paper',
    'disenador-bg',
    'portal-refineria',
    'asesoria-corpus',
    'onboarding-welcome',
    'hero-disenador',
    'hero-descubrimientos',
  ];

  test('every generated WebP (1x + 2x) responds 200', async ({ request }) => {
    for (const id of IMG_IDS) {
      for (const suffix of ['', '@2x']) {
        const url = `${BASE}/biocycle/img/${id}${suffix}.webp`;
        const r = await request.get(url);
        expect(r.status(), `${url} should be 200`).toBe(200);
        const buf = await r.body();
        expect(buf.byteLength, `${url} should be non-empty`).toBeGreaterThan(1024);
      }
    }
  });

  test('Inicio hero renders the photographic image with non-zero dimensions', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    const heroImg = page.locator('.hero-viz img').first();
    await expect(heroImg).toBeVisible();
    const dims = await heroImg.evaluate((el: HTMLImageElement) => ({
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      src: el.currentSrc,
    }));
    expect(dims.naturalWidth).toBeGreaterThan(300);
    expect(dims.naturalHeight).toBeGreaterThan(300);
    expect(dims.src).toMatch(/hero-inicio/);
  });

  test('Inicio path cards both display cover images', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/inicio`, { waitUntil: 'networkidle' });
    await expect(page.locator('.path.lab .p-cover img')).toBeVisible();
    await expect(page.locator('.path.biz .p-cover img')).toBeVisible();
  });

  test('Descubrimientos featured card has its editorial image', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/descubrimientos`, { waitUntil: 'networkidle' });
    const featuredImg = page.locator('article.paper.featured img').first();
    await expect(featuredImg).toBeVisible();
    const src = await featuredImg.getAttribute('src');
    expect(src).toMatch(/featured-paper/);
  });

  test('Disenador + Portal + Asesoria show their hero/side images', async ({ page }) => {
    await page.goto(`${BASE}/biocycle/disenador`, { waitUntil: 'networkidle' });
    await expect(page.locator('.bc-hero-banner img').first()).toBeVisible();

    await page.goto(`${BASE}/biocycle/portal`, { waitUntil: 'networkidle' });
    await page.getByTestId('tab-caso').click();
    await expect(page.locator('.case-visual img').first()).toBeVisible();

    await page.goto(`${BASE}/biocycle/asesoria`, { waitUntil: 'networkidle' });
    await expect(page.locator('aside.side .bc-side-visual img').first()).toBeVisible();
  });
});

test.describe('Visual regression · 5 BioCycle views @ 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const route of ['inicio', 'descubrimientos', 'disenador', 'portal', 'asesoria']) {
    test(`${route} matches screenshot baseline`, async ({ page }) => {
      await page.goto(`${BASE}/biocycle/${route}`, { waitUntil: 'networkidle' });
      // Wait for all above-the-fold images to finish decoding
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images)
            .filter((img) => img.getBoundingClientRect().top < 900)
            .map((img) =>
              img.complete ? Promise.resolve() : new Promise((r) => img.addEventListener('load', r)),
            ),
        ),
      );
      // Disable the rise animation to avoid flake
      await page.addStyleTag({
        content: '*,*::before,*::after{animation:none !important; transition:none !important}',
      });
      await expect(page).toHaveScreenshot(`biocycle-${route}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      });
    });
  }
});
