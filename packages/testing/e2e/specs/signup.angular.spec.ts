import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../selectors/test-selectors';
import { clearLocalStorage, clearSessionStorage, waitForLoadingToComplete } from '../helpers/test-helpers';

test.describe('Angular Signup Flow', () => {
  const TEST_USER = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/auth/signup');
    await page.waitForLoadState('domcontentloaded');
    await clearLocalStorage(page);
    await clearSessionStorage(page);
    await page.waitForLoadState('networkidle');
  });

  test('successful signup', async ({ page }) => {
    // Fill in signup form
    await page.getByTestId(TEST_IDS.SIGNUP_NAME).locator('input').fill(TEST_USER.name);
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).locator('input').fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).locator('input').fill(TEST_USER.password);

    // Submit form
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();

    // Wait for loading to complete
    await waitForLoadingToComplete(page);

    // Should redirect to dashboard after successful signup
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
  });

  test('validation errors', async ({ page }) => {
    // Test empty name
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();

    // Test invalid email
    await page.getByTestId(TEST_IDS.SIGNUP_NAME).locator('input').fill(TEST_USER.name);
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).locator('input').fill('invalid-email');
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();

    // Test password requirements
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).locator('input').fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).locator('input').fill('weak');
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();
  });

  // New test for duplicate email
  test('duplicate email registration', async ({ page }) => {
    // First signup
    await page.getByTestId(TEST_IDS.SIGNUP_NAME).locator('input').fill(TEST_USER.name);
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).locator('input').fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).locator('input').fill(TEST_USER.password);
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();

    // Wait for first signup to complete
    await waitForLoadingToComplete(page);
    await page.waitForURL('**/home');

    // Logout first
    await page.getByTestId(TEST_IDS.LOGOUT_BUTTON).click();
    await waitForLoadingToComplete(page);
    await page.waitForURL('**/login');

    // Go back to signup page
    await page.goto('http://localhost:4200/auth/signup');
    await page.waitForLoadState('domcontentloaded');

    // Try to signup with same email
    await page.getByTestId(TEST_IDS.SIGNUP_NAME).locator('input').fill('Another User');
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).locator('input').fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).locator('input').fill('AnotherPassword123!');
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();

    // Should show error message
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toContainText('This email is already registered');
  });
}); 