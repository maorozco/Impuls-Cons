import { test, expect, type Page } from '@playwright/test';

async function scrollThroughSections(page: Page) {
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, (height * i) / steps);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });
}

test.describe('Landing ES', () => {
  test('hero renders new copy with gradient accent', async ({ page }) => {
    await page.goto('/es');
    await expect(page).toHaveTitle(/La gestión de residuos ya no tiene que doler/);

    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('La gestión de residuos sigue siendo un dolor de cabeza.');
    await expect(h1).toContainText('Tu consultor lleva 3 años y');

    const accent = h1.locator('span.gradient-text');
    await expect(accent).toContainText('el sitio sigue contaminado.');

    await expect(
      page.getByText('No estamos lanzando otra consultoría.', { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText('Reservado para quienes creen que la ciencia', { exact: false })
    ).toBeVisible();

    await page.screenshot({
      path: 'test-results/es-hero.png',
      fullPage: false,
    });
  });

  test('scroll journey hits all updated section headlines', async ({ page }) => {
    await page.goto('/es');
    await scrollThroughSections(page);

    await expect(
      page.getByRole('heading', { name: /Tres formas de sumarte al cambio/ })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Por qué estamos construyendo esto/ })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Con quienes estamos construyendo/ })
    ).toBeVisible();
    await expect(
      page.getByText('Los primeros 100 no son clientes.', { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText('Y no tiene que seguir así.', { exact: false })
    ).toBeVisible();

    await expect(page.getByText('Manuela Orozco', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Justin Jiménez', { exact: true }).first()).toBeVisible();
    await expect(
      page.getByText('Disney, AT&T y el gobierno nacional', { exact: false })
    ).toBeVisible();

    await page.screenshot({
      path: 'test-results/es-fullpage.png',
      fullPage: true,
    });
  });
});

test.describe('Landing EN', () => {
  test('hero renders new copy with gradient accent', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/Waste management doesn't have to hurt anymore/);

    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('Waste management is still a headache.');
    await expect(h1).toContainText('Your contractor has been at it 3 years and');

    const accent = h1.locator('span.gradient-text');
    await expect(accent).toContainText('the site is still contaminated.');

    await expect(
      page.getByText("We're not launching another consulting firm.", { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText('Reserved for those who believe science can close', { exact: false })
    ).toBeVisible();

    await page.screenshot({
      path: 'test-results/en-hero.png',
      fullPage: false,
    });
  });

  test('scroll journey hits all updated section headlines', async ({ page }) => {
    await page.goto('/en');
    await scrollThroughSections(page);

    await expect(
      page.getByRole('heading', { name: /Three ways to join the change/ })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Why we're building this/ })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Who we're building with/ })
    ).toBeVisible();
    await expect(
      page.getByText("The first 100 aren't customers.", { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText("It doesn't have to stay this way.", { exact: false })
    ).toBeVisible();

    await expect(page.getByText('Manuela Orozco', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Justin Jiménez', { exact: true }).first()).toBeVisible();
    await expect(
      page.getByText('Disney, AT&T and the national government', { exact: false })
    ).toBeVisible();

    await page.screenshot({
      path: 'test-results/en-fullpage.png',
      fullPage: true,
    });
  });
});
