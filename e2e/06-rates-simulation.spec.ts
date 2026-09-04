import { test, expect } from '@playwright/test';

test.describe('Rates and Simulation Flow', () => {
  test('TC-RATE-001: View Rates', async ({ page }) => {
    await page.goto('/rates');
    await expect(page.locator('text=Exchange Rates').first()).toBeVisible();
    await expect(page.locator('text=USD')).toBeVisible();
  });

  test('TC-SIM-001: Run Simulation', async ({ page }) => {
    await page.goto('/simulation');
    await page.click('button:has-text("New Scenario")');
    await page.fill('input[name="monthlySaving"]', '2000000');
    await page.click('button:has-text("Run Simulation")');

    await expect(page.locator('text=Projected Balance')).toBeVisible();
  });
});

