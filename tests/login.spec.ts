import { test, expect } from './fixtures';
import { CREDENTIALS } from '../playwright.config';

test.describe('Login Tests', () => {
  test('Should successfully login with valid credentials', async ({ loginPage, page }) => {
    // Navigate to login page
    await loginPage.goto();

    // Verify login page is loaded
    await expect(page).toHaveURL(/.*login.*/);

    // Perform login
    await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);

    // Verify successful login
    const isSuccessful = await loginPage.isLoginSuccessful();
    expect(isSuccessful).toBe(true);

    // Additional verification: Check if user is logged in (verify page title or element)
    const title = await page.title();
    expect(title).not.toContain('Login');
  });
});
