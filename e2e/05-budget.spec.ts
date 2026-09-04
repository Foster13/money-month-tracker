import { test, expect } from '@playwright/test';

test.describe('Budget Flow', () => {
  test('TC-BDG-001 & 002: Set Budget and Verify Progress', async ({ page }) => {
    await page.goto('/budget');
    
    // Set Budget for Food
    await page.click('button:has-text("Set Budget")'); // Replace with actual trigger
    // Fill in budget modal
    await page.fill('input[name="amount"]', '3000000');
    await page.click('button:has-text("Save")');

    // Verify progress is rendered
    await expect(page.locator('.progress-bar')).toBeVisible(); // adjust selector
  });
});

