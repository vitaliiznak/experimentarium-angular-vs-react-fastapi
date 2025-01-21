import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../specs',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  // Only run screenshot tests
  testMatch: '**/screenshots.spec.ts',
  use: {
    ...devices['Desktop Chrome'],
    screenshot: 'on',
    video: 'off',
    baseURL: 'http://localhost:4200',
  },
  // Single project for screenshots
  projects: [
    {
      name: 'screenshots',
      use: { viewport: { width: 1280, height: 720 } },
    }
  ]
}); 