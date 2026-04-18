import { test, expect, type Page } from '@playwright/test';

async function scrollThroughSections(page: Page) {
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, (height * i) / steps);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
}

test.describe('Variant B (/[lang]/v2) — light editorial landing', () => {
  test('ES: hero renders same copy in editorial/serif aesthetic', async ({ page }) => {
    await page.goto('/es/v2');

    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('La gestión de residuos sigue siendo un dolor de cabeza.');
    await expect(h1).toContainText('Tu consultor lleva 3 años y');

    // Accent word rendered with the v2 accent class
    const accent = h1.locator('span.italic').first();
    await expect(accent).toBeVisible();

    // Hero subcopy from the shared messages file
    await expect(
      page.getByText('No estamos lanzando otra consultoría.', { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByText('Reservado para quienes creen que la ciencia', { exact: false }),
    ).toBeVisible();

    // v2-theme wrapper is present → confirms the light aesthetic scope
    await expect(page.locator('.v2-theme')).toBeVisible();

    await page.screenshot({ path: 'test-results/v2-es-hero.png', fullPage: false });
  });

  test('ES: scroll journey reaches every v2 section + Final CTA', async ({ page }) => {
    await page.goto('/es/v2');
    await scrollThroughSections(page);

    await expect(
      page.getByRole('heading', { name: /Tres formas de sumarte al cambio/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Con quienes estamos construyendo/ }),
    ).toBeVisible();
    await expect(
      page.getByText('Los primeros 100 no son clientes.', { exact: false }),
    ).toBeVisible();

    await expect(page.getByText('Manuela Orozco', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Justin Jiménez', { exact: true }).first()).toBeVisible();

    await page.screenshot({ path: 'test-results/v2-es-fullpage.png', fullPage: true });
  });

  test('EN: hero renders same copy in editorial aesthetic', async ({ page }) => {
    await page.goto('/en/v2');

    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('Waste management is still a headache.');
    await expect(h1).toContainText('Your contractor has been at it 3 years and');

    await expect(
      page.getByText("We're not launching another consulting firm.", { exact: false }),
    ).toBeVisible();

    await page.screenshot({ path: 'test-results/v2-en-hero.png', fullPage: false });
  });

  test('ES: signup form submits and routes to the v2 thank-you page', async ({ page }) => {
    await page.goto('/es/v2');

    // Fill hero form — mock DB mode returns OK without persisting
    const email = `smoke-b-${Date.now()}@example.com`;
    await page.locator('#v2-hero-email').fill(email);
    await page.getByRole('button', { name: /Sumarme|Join|Unirme/i }).first().click();

    // Expect redirect to /es/v2/thank-you?email=
    await expect(page).toHaveURL(new RegExp(`/es/v2/thank-you\\?email=${encodeURIComponent(email)}`));

    // Thank-you shell renders inside v2 theme
    await expect(page.locator('.v2-theme')).toBeVisible();
  });
});
