import { test as setup, expect } from "@playwright/test";
import * as path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/");

  // Follows TC-AUTH-002: Login via test1@gmail.com
  await page.fill('input[type="email"]', "test1@gmail.com");
  await page.fill('input[type="password"]', "123anjing");
  await page.click('button[type="submit"]');

  // Verify successful login
  await expect(page.locator("text=Personal Finance").first()).toBeVisible({ timeout: 10000 });
  await expect(page).toHaveURL("/");

  // Save storage state
  await page.context().storageState({ path: authFile });
});
