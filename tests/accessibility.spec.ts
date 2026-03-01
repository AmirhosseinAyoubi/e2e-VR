import { test, expect } from '@playwright/test';
import { dismissCookies } from './helpers/cookies.ts';

const BASE = 'https://www.vr.fi/en';


test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE);
        await dismissCookies(page);
    });

    test('Are there promotional content', async ({ page }) => {
        const promos = page.locator('[data-testid="decorativeImageWithText-"], [data-testid^="halfImageHalfText-"]');
        const promoCount = await promos.count();
        for(let i=0;i< promoCount;i++)
        {
            await expect(promos.nth(i)).toBeVisible();
        }
    });

    test('Is there accessibility statement available', async ({ page }) => {
        const accessibilityLink = await page.getByRole('link', { name: 'Accessibility statement' });
        await expect(accessibilityLink).toBeVisible();
        accessibilityLink.click();
        await page.waitForLoadState('domcontentloaded');
        await expect(page.getByTestId('ContentfulFullwidthImageHeader__title')).toContainText('Accessibility statement');

        await expect(page.getByTestId('stripeHeadingWithRichText-52ZNw82yotS7O0pzzYXPu4')
        .getByTestId('contentful-stripe-heading-with-rich-text__title'))
        .toContainText('Accessibility statement for vr.fi online service');

        await expect(page.getByTestId('stripeHeadingWithRichText-52ZNw82yotS7O0pzzYXPu4')
        .getByTestId('contentful-stripe-heading-with-rich-text__body'))
        .toContainText('Digital service accessibility status');

        await expect(page.getByTestId('stripeHeadingWithRichText-52ZNw82yotS7O0pzzYXPu4')
        .getByTestId('contentful-stripe-heading-with-rich-text__body'))
        .toContainText('VR’s website vr.fi meets critical accessibility requirements.');

        await expect(page.getByTestId('stripeHeadingWithRichText-7zqbIrp6XpxFIu0LiMvrxn')
        .getByTestId('contentful-stripe-heading-with-rich-text__title'))
        .toContainText('Accessibility statement for the VR Matkalla application');

        await expect(page.getByTestId('stripeHeadingWithRichText-7zqbIrp6XpxFIu0LiMvrxn')
        .getByTestId('contentful-stripe-heading-with-rich-text__body'))
        .toContainText('Digital service accessibility status');

        await expect(page.getByTestId('stripeHeadingWithRichText-7zqbIrp6XpxFIu0LiMvrxn')
        .getByTestId('contentful-stripe-heading-with-rich-text__body'))
        .toContainText('VR’s mobile application VR Matkalla meets critical accessibility requirements.');

        
    });

    test('Check that moving by tab works', async ({ page }) => {
        await page.getByTestId('from-station-picker-button').click();
        await page.getByTestId('station-search-input').fill('Oulu');
        await page.getByRole('option', { name: 'Oulu', exact: true }).click();
        await page.keyboard.press('Tab');
        await page.keyboard.type('Helsinki')
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        const searchButton = page.getByTestId('search-button')
        await expect(searchButton).toBeVisible(); // fails for webkit for some odd reason
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
        await expect(page.locator('h1')).toContainText('Select outbound journey');
    
    });
});
