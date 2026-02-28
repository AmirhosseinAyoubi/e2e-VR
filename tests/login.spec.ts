import { test, expect } from '@playwright/test';
import { dismissCookies } from './helpers/cookies.ts';
import { log } from 'console';

const BASE = 'https://www.vr.fi/en';
function generateRandomEmail()
{
    const randomName_1 = Math.random().toString(36).substring(2,10);
    const randomName_2 = Math.random().toString(36).substring(2,10);
    const email = `${randomName_1}.${randomName_2}@example.com`;
    return email;
}

test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE);
        await dismissCookies(page);
    });

    test('Should navigate to login page', async ({ page }) => {
        await page.getByTestId('login-link').click();
        await expect(page).toHaveTitle(
            'Log in - VR'
        );
    });

    test('Assert warning text when trying to log in on empty fill', async ({ page }) => {
        await page.getByTestId('login-link').click();
        await expect(page).toHaveTitle(
            'Log in - VR'
        );
        
        // navigation to login page
        const loginButton = page.getByRole('button', { name: 'Log in', exact: true });
        await expect(loginButton).toBeVisible();
        loginButton.click();

        // check that email warning becomes visible and the color on the text is red
        const emailDescription = page.locator('#email-desc');
        const emailTitle = page.getByText('Email', { exact: true });
        await expect(emailTitle).toHaveCSS('color', 'rgb(249, 114, 83)');
        await expect(emailDescription).toBeVisible();
        await expect(emailDescription).toContainText('Enter your email address');
        await expect(emailDescription).toHaveCSS('color', 'rgb(249, 114, 83)');

        // check that password warning becomes visible and the color on the text is red
        const passwordDescription = page.locator('#password-desc');
        const passwordTitle = page.getByText('Password', { exact: true });
        await expect(passwordTitle).toHaveCSS('color', 'rgb(249, 114, 83)');
        await expect(passwordDescription).toBeVisible();
        await expect(passwordDescription).toContainText('Enter your passwordDid you forget your password?');
        await expect(passwordDescription).toHaveCSS('color', 'rgb(249, 114, 83)');
    });

    test('test login with made up email and pass', async ({ page }) => {
        await page.getByTestId('login-link').click();
        await expect(page).toHaveTitle(
            'Log in - VR'
        );

        const email = generateRandomEmail();
        await page.locator('#email').fill(email);
        await expect(page.locator('#email')).toHaveValue(email);

        // test show/hide pass is visible when clicked and the visual is changed
        await page.locator('#password').fill('password');
        
        await page.getByRole('button', { name: 'Log in', exact: true }).click();

        const modalLabel = page.locator('#modal_label')
        const modalDescription = page.locator('#modal_desc')
        const modalButton = page.getByRole('button', { name: 'Close' });

        await expect(modalLabel).toBeVisible( {timeout : 10_000});
        await expect(modalLabel).toContainText('Login failed');
        await expect(modalDescription).toContainText('Wrong email or password');
        await expect(modalDescription).toBeVisible();
        await expect(modalButton).toBeVisible();
        await modalButton.click();
        await expect(modalLabel).toBeHidden();
        await expect(modalDescription).toBeHidden();
        await expect(modalButton).toBeHidden();
    });

    test('check that password text functions correctly', async ({ page }) => {
        await page.getByTestId('login-link').click();
        await expect(page).toHaveTitle(
            'Log in - VR'
        );
        const email = generateRandomEmail();    
        const emailInput = page.locator('#email');
        await emailInput.fill(email);
        await expect(emailInput).toHaveValue(email);

        // test show/hide pass is visible when clicked and the visual is changed
        const passwordInput = page.locator('#password')
        await passwordInput.fill('password');
        await expect(passwordInput).toHaveValue('password');

        await expect(page.getByRole('button', { name: 'Show password' })).toBeVisible();
        await expect(passwordInput).toHaveAttribute('type','password');
        await page.getByRole('button', { name: 'Show password' }).click();
        await expect(passwordInput).toHaveAttribute('type','text');
        await expect(page.getByRole('button', { name: 'Hide password' })).toBeVisible();
    });
});
