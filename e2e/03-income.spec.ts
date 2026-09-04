import { test, expect } from '@playwright/test';

test.describe('Income Flow', () => {
  test('TC-INC-001 & 005: Add and Delete Income', async ({ page }) => {
    await page.goto('/income');
    
    // Test Adding Income
    await page.click('button:has-text("Add Income")'); 
    // Fill out form
    await page.fill('input[name="amount"]', '5000000');
    await page.fill('input[name="description"]', 'E2E Test Salary');
    // Select Category (Salary)
    await page.click('button[role="combobox"]');
    await page.click('div[role="option"]:has-text("Salary")');
    await page.click('button:has-text("Save")');

    // Verify it appeared in the list
    await expect(page.locator('text=E2E Test Salary').first()).toBeVisible();

    // Test Deleting Income (Cleanup)
    const row = page.locator('tr:has-text("E2E Test Salary")').first();
    await row.locator('button:has-text("Delete")').click(); // Adjust selector based on UI
    await page.click('button:has-text("Confirm")'); // Assuming a confirm dialog

    // Verify it's gone
    await expect(page.locator('text=E2E Test Salary')).toHaveCount(0);
  });
});
