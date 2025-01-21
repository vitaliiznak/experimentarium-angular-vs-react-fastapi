import { Page } from '@playwright/test';

export async function loginUser(page: Page, email: string, password: string) {
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
}

export async function logoutUser(page: Page) {
  await page.getByTestId('logout-button').click();
}

export async function waitForLoadingToComplete(page: Page) {
  await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' });
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => window.localStorage.clear());
}

export async function clearSessionStorage(page: Page) {
  await page.evaluate(() => window.sessionStorage.clear());
} 