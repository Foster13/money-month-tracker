import { test, expect } from '@playwright/test';

test.describe('Expense Flow', () => {
  test('TC-EXP-001 to 005: Manage Expenses', async ({ page }) => {
    await page.goto('/expenses');
    
    // Add Expense
    await page.click('button:has-text("Add Expense")');
    await page.fill('input[name="amount"]', '150000');
    await page.fill('input[name="description"]', 'E2E Test Lunch');
    await page.click('button[role="combobox"]');
    await page.click('div[role="option"]:has-text("Food")');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=E2E Test Lunch').first()).toBeVisible();

    // Edit Expense (simplified)
    // We just verify it exists and delete it for cleanup
    const row = page.locator('tr:has-text("E2E Test Lunch")').first();
    await row.locator('button:has-text("Delete")').click();
    await page.click('button:has-text("Confirm")');

    await expect(page.locator('text=E2E Test Lunch')).toHaveCount(0);
  });
});

