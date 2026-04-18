import { test, expect, type Page } from '@playwright/test';

async function waitForImage(page: Page, selector: string) {
  const img = page.locator(selector).first();
  await img.waitFor({ state: 'visible' });
  await expect
    .poll(
      async () =>
        img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 10),
      { timeout: 10000 },
    )
    .toBe(true);
}

async function scrollAll(page: Page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let i = 1; i <= 14; i++) {
      window.scrollTo(0, (h * i) / 14);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
}

test.describe('Visual QA — generated hero images render in both variants', () => {
  test('V1 dark: dashboard, consortium, molecule images load', async ({ page }) => {
    await page.goto('/es');
    await scrollAll(page);

    await waitForImage(page, 'img[src*="hero-dashboard-dark"]');
    await waitForImage(page, 'img[src*="consortium-abstract"]');
    await waitForImage(page, 'img[src*="molecule-enzyme"]');

    await page.screenshot({ path: 'test-results/v1-fullpage-with-images.png', fullPage: true });
  });

  test('V2 light: dashboard-light, petri, molecule images load', async ({ page }) => {
    await page.goto('/es/v2');
    await scrollAll(page);

    await waitForImage(page, 'img[src*="hero-dashboard-light"]');
    await waitForImage(page, 'img[src*="petri-culture"]');
    await waitForImage(page, 'img[src*="molecule-enzyme"]');

    await page.screenshot({ path: 'test-results/v2-fullpage-with-images.png', fullPage: true });
  });

  test('V1: screenshot of dashboard preview section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/es');
    await page.waitForLoadState('networkidle');
    const img = page.locator('img[src*="hero-dashboard-dark"]').first();
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await img.screenshot({ path: 'test-results/v1-dashboard-image.png' });
  });

  test('V2: screenshot of dashboard preview section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/es/v2');
    await page.waitForLoadState('networkidle');
    const img = page.locator('img[src*="hero-dashboard-light"]').first();
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await img.screenshot({ path: 'test-results/v2-dashboard-image.png' });
  });

  test('V1: screenshot of Dream section (with consortium image)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/es');
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { name: /Imagina un mundo/ });
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/v1-dream-section.png', fullPage: false });
  });

  test('V2: screenshot of Dream section (with petri image)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/es/v2');
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { name: /Imagina un mundo/ });
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/v2-dream-section.png', fullPage: false });
  });
});
