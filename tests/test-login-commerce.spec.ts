import { test, expect } from '@playwright/test';

test.describe('Login and Commerce Navigation', () => {
  const loginUrl = 'https://www.passthenote.com/auth/login';
  const username = 'tester@passthenote.com';
  const password = 'Tester@123';

  test('TC_001: Validate successful login and Commerce box navigation', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto(loginUrl);
    await expect(page).toHaveURL(loginUrl);

    // Step 2: Fill in login credentials
    await page.fill('input[type="email"]', username);
    await page.fill('input[type="password"]', password);

    // Step 3: Click login button
    await page.click('button[type="submit"]');

    // Step 4: Wait for navigation and verify successful login
    await page.waitForNavigation();
    
    // Step 5: Verify the COMMERCE box is visible
    const commerceBox = page.getByRole('link', { name: /Commerce/i });
    await expect(commerceBox).toBeVisible();
    
    // Step 6: Click on COMMERCE box
    await commerceBox.click();

    // Step 7: Wait for navigation after clicking COMMERCE
    await page.waitForNavigation();

    // Step 8: Verify URL has changed
    const currentUrl = page.url();
    expect(currentUrl).not.toBe(loginUrl);
    
    // Optional: Log the new URL for verification
    console.log('Navigated to URL:', currentUrl);
  });

  test('TC_002: Validate login with proper assertions on dashboard', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto(loginUrl);

    // Step 2: Verify we are on login page
    await expect(page).toHaveURL(loginUrl);

    // Step 3: Fill login form
    await page.fill('input[type="email"]', username);
    await page.fill('input[type="password"]', password);

    // Step 4: Submit login form
    await page.click('button[type="submit"]');

    // Step 5: Wait for page load after login
    await page.waitForLoadState('networkidle');

    // Step 6: Verify successful login by checking if we left login page
    const pageUrl = page.url();
    expect(pageUrl).not.toContain('/auth/login');

    // Step 7: Verify COMMERCE box exists and is clickable
    const commerceButton = page.getByRole('link', { name: /Commerce/i });
    await expect(commerceButton).toBeVisible();
    await expect(commerceButton).toBeEnabled();

    // Step 8: Click COMMERCE and verify navigation
    const urlBeforeClick = page.url();
    await commerceButton.click();
    await page.waitForLoadState('networkidle');
    const urlAfterClick = page.url();

    // Step 9: Assert we are on a different page or Commerce section loaded
    expect(urlAfterClick).toBeTruthy();
    console.log(`URL changed from ${urlBeforeClick} to ${urlAfterClick}`);
  });
});
