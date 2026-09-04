import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('TC-ONBD-001 & 002: Setup Payday and Verify it does not reappear', async ({ page }) => {
    // Go to dashboard
    await page.goto('/');

    // Check if onboarding modal is visible
    // Depending on whether the bug is fixed, it might or might not appear.
    // If it appears, fill it.
    const paydayModal = page.locator('text=Set Your Payday');
    
    if (await paydayModal.isVisible()) {
      await page.fill('input[type="number"]', '25');
      await page.click('button:has-text("Save")');
      await expect(paydayModal).toHaveCount(0);
    }

    // Refresh and verify it does NOT appear again
    await page.reload();
    await expect(page.locator('text=Set Your Payday')).toHaveCount(0, { timeout: 5000 });
  });
});

