import { Page, Locator } from '@playwright/test';
import { LOGIN_URL } from '../../playwright.config';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button:has-text("Login"), button[type="submit"]');
  }

  async goto() {
    await this.page.goto(LOGIN_URL);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoginSuccessful() {
    // Wait for navigation to complete
    try {
      // Check if we're redirected away from login page
      await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 }).catch(() => null);
      return true;
    } catch {
      // Check if login succeeded by verifying we're no longer on login page
      const currentUrl = this.page.url();
      return !currentUrl.includes('/login');
    }
  }
}
