import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(process.cwd(), 'auth', 'authState.json');

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on',
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts',
      teardown: undefined, 
    },
    {
      name: 'chromium',
      use: { 
        baseURL: 'https://www.saucedemo.com',
        trace: 'on-first-retry', 
        screenshot: 'only-on-failure', 
        video: 'retain-on-failure', 
      },
      dependencies: ['setup'],
    },
  ],
  reporter: [['html', { open: 'never' }]],
});