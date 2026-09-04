import { test, expect } from '@playwright/test';

// Reset storage state for auth tests so we start logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Auth Flow', () => {
  test('TC-AUTH-002: Login Pengguna (button click)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test1@gmail.com');
    await page.fill('input[type="password"]', '123anjing');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Money Month Tracker')).toBeVisible({ timeout: 10000 });
  });

  test('TC-AUTH-003: Login Pengguna (Enter key)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test1@gmail.com');
    await page.fill('input[type="password"]', '123anjing');
    await page.press('input[type="password"]', 'Enter');

    await expect(page.getByText('Money Month Tracker')).toBeVisible({ timeout: 10000 });
  });

  // TC-AUTH-001 (Register) is skipped in automated run to avoid creating junk users, 
  // or it could be implemented with dynamic emails and deleted. YAGNI for now.
});
