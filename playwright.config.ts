import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }]], 
  use: {
    baseURL: 'https://www.saucedemo.com',
    storageState: 'auth/authState.json', 
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});