import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'https://www.saucedemo.com',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});

