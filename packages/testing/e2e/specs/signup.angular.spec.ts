import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../selectors/test-selectors';
import { clearLocalStorage, clearSessionStorage, waitForLoadingToComplete } from '../helpers/test-helpers';

test.describe('Angular Signup Flow', () => {
  const TEST_USER = {
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
  };

  test.beforeEach(async ({ page }) => {
    await clearLocalStorage(page);
    await clearSessionStorage(page);
    await page.goto('http://localhost:4200/signup');
    await page.waitForLoadState('networkidle');
  });

  test('successful signup', async ({ page }) => {
    // Fill in signup form
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).fill(TEST_USER.password);
    await page.getByTestId(TEST_IDS.SIGNUP_CONFIRM_PASSWORD).fill(TEST_USER.confirmPassword);
    
    // Submit form
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    
    // Wait for loading to complete
    await waitForLoadingToComplete(page);
    
    // Should redirect to dashboard after successful signup
    await expect(page.getByTestId(TEST_IDS.DASHBOARD)).toBeVisible();
  });

  test('validation errors', async ({ page }) => {
    // Test invalid email
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).fill('invalid-email');
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();
    
    // Test password mismatch
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).fill(TEST_USER.password);
    await page.getByTestId(TEST_IDS.SIGNUP_CONFIRM_PASSWORD).fill('DifferentPassword123!');
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();
    
    // Test password requirements
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).fill('weak');
    await page.getByTestId(TEST_IDS.SIGNUP_CONFIRM_PASSWORD).fill('weak');
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();
  });

  test('existing email error', async ({ page }) => {
    // First signup
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).fill(TEST_USER.password);
    await page.getByTestId(TEST_IDS.SIGNUP_CONFIRM_PASSWORD).fill(TEST_USER.confirmPassword);
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await waitForLoadingToComplete(page);
    
    // Try to signup again with same email
    await page.goto('http://localhost:4200/signup');
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).fill(TEST_USER.password);
    await page.getByTestId(TEST_IDS.SIGNUP_CONFIRM_PASSWORD).fill(TEST_USER.confirmPassword);
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.SIGNUP_ERROR)).toContainText('already exists');
  });
}); 