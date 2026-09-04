import { test, expect } from '@playwright/test';

test.describe('Settings Flow', () => {
  test('TC-SET-003: Update Payday in Settings', async ({ page }) => {
    await page.goto('/settings');
    await page.fill('input[name="payday"]', '27');
    await page.click('button:has-text("Save Settings")');
    await expect(page.locator('text=Settings saved')).toBeVisible();
  });

  test('TC-SET-005: Export Data', async ({ page }) => {
    await page.goto('/settings');
    
    // We can just verify the export button triggers a download
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export JSON")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.json');
  });
});

