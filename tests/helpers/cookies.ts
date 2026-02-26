import { Page } from '@playwright/test';

export async function dismissCookies(page: Page): Promise<void> {
    const modal = page.locator('[data-testid="cookie-consent-modal"]');
    try {
        await modal.waitFor({ state: 'visible', timeout: 6000 });
        await modal.locator('button').first().click();
        await modal.waitFor({ state: 'hidden', timeout: 4000 });
    } catch {
    }
}
