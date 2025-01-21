import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../specs',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'angular',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200'
      },
      testMatch: /.*angular\.spec\.ts/,
    },
    {
      name: 'react',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173'
      },
      testMatch: /.*react\.spec\.ts/,
    }
  ]
}); 