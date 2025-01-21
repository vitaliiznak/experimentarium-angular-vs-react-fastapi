import { test } from '@playwright/test';
import { loginUser, waitForLoadingToComplete } from '../helpers/test-helpers';
import { TEST_IDS } from '../selectors/test-selectors';

test.describe('Capture Screenshots', () => {
  // Add a tag to identify screenshot tests
  test.describe.configure({ tag: '@screenshots' });

  // Create test user credentials
  const TEST_USER = {
    name: 'Screenshot Test User',
    email: `screenshot-test-${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };

  test('capture Angular pages', async ({ page }) => {
    // Signup page
    await page.goto('http://localhost:4200/auth/signup');
    await page.waitForLoadState('networkidle');
    
    // Take signup page screenshot
    await page.screenshot({ 
      path: './screenshots/angular/signup.png',
      fullPage: true 
    });

    // Create new user
    await page.getByTestId(TEST_IDS.SIGNUP_NAME).locator('input').fill(TEST_USER.name);
    await page.getByTestId(TEST_IDS.SIGNUP_EMAIL).locator('input').fill(TEST_USER.email);
    await page.getByTestId(TEST_IDS.SIGNUP_PASSWORD).locator('input').fill(TEST_USER.password);
    await page.getByTestId(TEST_IDS.SIGNUP_SUBMIT).click();
    await waitForLoadingToComplete(page);

    // Logout to prepare for login screenshots
    await page.getByTestId(TEST_IDS.LOGOUT_BUTTON).click();
    await waitForLoadingToComplete(page);

    // Login page
    await page.goto('http://localhost:4200/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Take login page screenshot
    await page.screenshot({ 
      path: './screenshots/angular/login.png',
      fullPage: true 
    });

    // Login and capture dashboard
    try {
      await loginUser(page, TEST_USER.email, TEST_USER.password);
      await waitForLoadingToComplete(page);
      
      // Wait for navigation to /home and for the page to be fully loaded
      await page.waitForURL('**/home');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector(`[data-testid="${TEST_IDS.DASHBOARD}"]`, { state: 'visible' });
      
      // Add a small delay to ensure all animations are complete
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: './screenshots/angular/dashboard.png',
        fullPage: true 
      });
    } catch (error) {
      console.error('Failed to login or capture authenticated pages:', error);
      throw error;
    }
  });

  test('capture React pages', async ({ page }) => {
    // React Login
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: './screenshots/react-login.png',
      fullPage: true 
    });

    // Login and capture dashboard
    try {
      await loginUser(page, TEST_USER.email, TEST_USER.password);
      await waitForLoadingToComplete(page);
      
      // Wait for navigation to /home and for the page to be fully loaded
      await page.waitForURL('**/home');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector(`[data-testid="${TEST_IDS.DASHBOARD}"]`, { state: 'visible' });
      
      // Add a small delay to ensure all animations are complete
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: './screenshots/react-dashboard.png',
        fullPage: true 
      });
    } catch (error) {
      console.error('Failed to login or capture React dashboard:', error);
      throw error;
    }
  });
});