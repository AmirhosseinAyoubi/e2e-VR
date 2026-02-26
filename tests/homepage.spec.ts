import { test, expect } from '@playwright/test';
import { dismissCookies } from './helpers/cookies';

const BASE = 'https://www.vr.fi/en';

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE);
        await dismissCookies(page);
    });

    test('should load with the correct title', async ({ page }) => {
        await expect(page).toHaveTitle(
            'Welcome on a journey together with us – trains are a climate-friendly way to travel - VR'
        );
    });

    test('should display the VR logo', async ({ page }) => {
        await expect(page.locator('[data-testid="vr-logo"]')).toBeVisible();
    });

    test('should display the journey search hero section', async ({ page }) => {
        const hero = page.locator('[data-testid^="journeySearchHero-"]');
        await expect(hero).toBeVisible({ timeout: 10_000 });
    });


    test('should display the departure station input after opening the drawer', async ({ page }) => {
        const fromButton = page.locator('[data-testid="from-station-picker-button"]');
        await expect(fromButton).toBeVisible({ timeout: 10_000 });
        await fromButton.click();


        const fromInput = page.getByLabel('Where are you leaving from?');
        await expect(fromInput).toBeVisible({ timeout: 5_000 });
    });


    test('should display the destination station input after opening the drawer', async ({ page }) => {

        const fromButton = page.locator('[data-testid="to-station-picker-button"]');
        await expect(fromButton).toBeVisible({ timeout: 10_000 });
        await fromButton.click();
        const toInput = page.getByLabel('Where are you going to?');
        await expect(toInput).toBeVisible({ timeout: 10_000 });
    });

    test('should display at least one promotional content block', async ({ page }) => {
        const promo = page.locator(
            '[data-testid^="decorativeImageWithText-"], [data-testid^="halfImageHalfText-"]'
        ).first();
        await expect(promo).toBeVisible({ timeout: 10_000 });
    });

    test('should have a skip-to-content link for accessibility', async ({ page }) => {
        const skipLink = page.locator('[data-testid="skip-to-content-link"]');
        await expect(skipLink).toBeAttached(); // present in DOM even if visually hidden
    });

    
    test('homepage should not log JS errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', err => errors.push(err.message));

    await page.reload();

    expect(errors).toEqual([]);
    });

    test('cookies should stay dismissed after reload', async ({ page }) => {
    await page.reload();

    const banner = page.locator('[data-testid="cookie-banner"]');
    await expect(banner).toBeHidden();
    });

});
