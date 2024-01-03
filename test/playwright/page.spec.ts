import { SERVICE_URL } from '@/app/utils/constants';
import { test, expect } from '@playwright/test';

test.describe('Landing page end-to-end tests', () => {
  test('user journey works without throwing error', async ({ page }) => {
    await page.goto(SERVICE_URL);

    const searchInput = await page.getByPlaceholder('type something here');

    await searchInput.click();
    await searchInput.press('CapsLock');
    await searchInput.fill('What is an HRT prescription?');
    await searchInput.press('Enter');
    await expect(page.getByText('Answer')).toBeVisible();
    await expect(page.getByText('Trusted Sources')).toBeVisible();
    await page.getByRole('link', { name: 'Ask New Question' }).click();
    await expect(page.getByText('Submit')).toBeVisible();
    await expect(page).toHaveTitle(/NHS Interactive/);
    await expect(page.getByPlaceholder('type something here')).toBeVisible();
  });

  test('Github link', async ({ page }) => {
    await page.goto(SERVICE_URL);

    const githubPagePromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Github Profile' }).first().click();
    const githubPage = await githubPagePromise;

    await expect(githubPage).toHaveURL(/.*github/);
  });
});