import { test, expect } from '@playwright/test';

/**
 * SETUP STEPS:
 * 1. npm init -y (initialize Node.js project)
 * 2. npm install -D @playwright/test (install Playwright)
 * 3. npx playwright install (install browsers)
 * 
 * OBJECT DESTRUCTURING:
 * Extracts properties from objects into individual variables.
 * Example: const { url, username, psswd } = validUser
 * This avoids repetitive dot notation (validUser.url, validUser.username, etc.)
 */

const validUser = {
  url: "https://www.passthenote.com/auth/login",
  username: "tester@passthenote.com",
  psswd: "Tester@123"
}

const { url, username, psswd } = validUser


test('has title', async ({ page }) => {
  await page.goto(url);

  await page.getByPlaceholder('you@example.com').fill(username)

  await page.getByPlaceholder('Enter your password').fill(psswd)

  await page.getByRole("button",{name:'Sign In'}).click()

  await expect(page).toHaveURL(/app/)

  await page.screenshot({ path: 'example.png' });

});

