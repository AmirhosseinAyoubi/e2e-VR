import { test, expect, Locator } from '@playwright/test';
import { dismissCookies } from './helpers/cookies';

const BASE = 'https://www.vr.fi/en';

async function firstVisible(locator: Locator): Promise<Locator | null> {
  const count = await locator.count();
  for (let i = 0; i < count; i += 1) {
    const candidate = locator.nth(i);
    if (await candidate.isVisible().catch(() => false)) {
      return candidate;
    }
  }
  return null;
}

async function clickFirstVisible(candidates: Locator[]): Promise<Locator> {
  for (const candidate of candidates) {
    const visible = await firstVisible(candidate);
    if (visible) {
      await visible.click();
      return visible;
    }
  }

  throw new Error('No visible candidate locator found.');
}

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await dismissCookies(page);
  });

  test('vr logo should link back to the homepage', async ({ page }) => {
    const logoLink = page.getByRole('link', { name: /vr\.fi front page/i });
    await expect(logoLink).toBeVisible();

    await logoLink.click();
    await expect(page).toHaveURL(/\/en(?:\/|$|\?)/, { timeout: 15_000 });
  });

  test('login button should navigate to the login page', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();

    await loginButton.click();
    await expect(page).toHaveURL(/(login|kirjaudu)/i, { timeout: 15_000 });
  });

  test('should switch language to finnish', async ({ page }) => { 
    await clickFirstVisible([
      page.getByRole('banner').getByRole('link', { name: /fi:\s*suomi|^fi$/i }),
      page.locator('[data-testid*="language"]').getByRole('link', { name: /fi|suomeksi|suomi/i }),
      page.locator('[data-testid*="language"]').getByRole('button', { name: /fi|suomeksi|suomi/i }),
      page.getByRole('link', { name: /fi|suomeksi|suomi/i }),
      page.getByRole('button', { name: /fi|suomeksi|suomi/i }),
      page.locator('a[href="/"]'),
    ]);

    await expect(page).not.toHaveURL(/\/en(?:\/|$|\?)/, { timeout: 15_000 });
    await expect(page.locator('html')).toHaveAttribute('lang', /fi/i, { timeout: 15_000 });
  });

  test('should switch language to swedish', async ({ page }) => {
    await clickFirstVisible([
      page.getByRole('banner').getByRole('link', { name: /sv:\s*svenska|^sv$/i }),
      page.locator('[data-testid*="language"]').getByRole('link', { name: /sv|svenska/i }),
      page.locator('[data-testid*="language"]').getByRole('button', { name: /sv|svenska/i }),
      page.getByRole('link', { name: /sv|svenska/i }),
      page.getByRole('button', { name: /sv|svenska/i }),
      page.locator('a[href="/sv"]'),
    ]);

    await expect(page).toHaveURL(/\/sv(?:\/|$|\?)/, { timeout: 15_000 });
    await expect(page.locator('html')).toHaveAttribute('lang', /sv/i, { timeout: 15_000 });
  });

  test('navbar menu button should toggle navigation open', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /menu/i });
    await expect(menuButton).toBeVisible();

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', /true/i);

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', /false/i);
  });

  test('navigation menu should contain train tickets link', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();

    const trainTicketsLink = page.getByRole('link', { name: /train tickets/i }).first();
    await expect(trainTicketsLink).toBeVisible({ timeout: 10_000 });
  });

  test('search button should open the search modal', async ({ page }) => {
    await clickFirstVisible([
      page.getByRole('banner').getByRole('button', { name: /^search$/i }),
      page.getByRole('banner').getByRole('link', { name: /^search$/i }),
      page.locator('[data-testid*="search"]').getByRole('button'),
      page.locator('[data-testid*="search"]').getByRole('link'),
      page.getByRole('button', { name: /search|etsi|haku/i }),
      page.getByRole('link', { name: /search|etsi|haku/i }),
      page.locator('[aria-label*="search" i]'),
      page.locator('[aria-label*="etsi" i]'),
    ]);

    const searchDialog = page.locator('[data-testid="search-navigation-modal"]');
    await expect(searchDialog).toBeVisible({ timeout: 10_000 });
  });

  test('search modal should close when close button is clicked', async ({ page }) => {
    await clickFirstVisible([
      page.getByRole('banner').getByRole('button', { name: /^search$/i }),
      page.getByRole('banner').getByRole('link', { name: /^search$/i }),
      page.locator('[data-testid*="search"]').getByRole('button'),
      page.locator('[data-testid*="search"]').getByRole('link'),
      page.getByRole('button', { name: /search|etsi|haku/i }),
      page.getByRole('link', { name: /search|etsi|haku/i }),
      page.locator('[aria-label*="search" i]'),
      page.locator('[aria-label*="etsi" i]'),
    ]);

    const searchDialog = page.locator('[data-testid="search-navigation-modal"]');
    await expect(searchDialog).toBeVisible({ timeout: 10_000 });

    const searchInput = searchDialog
      .locator('input[type="search"], input[type="text"], [role="combobox"]')
      .first();
    await expect(searchInput).toBeVisible();

    const closeButton =
      (await firstVisible(searchDialog.getByRole('button', { name: /close|sulje/i }))) ??
      (await firstVisible(searchDialog.locator('[aria-label*="close" i], [aria-label*="sulje" i]')));
    expect(closeButton).not.toBeNull();

    await closeButton!.click();

    await expect(searchDialog).toBeHidden({ timeout: 10_000 });
  });
});
