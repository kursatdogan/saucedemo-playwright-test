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
      // Bu proje test raporlarında kalabalık yapmaz
      teardown: undefined, 
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // BURASI ÇOK ÖNEMLİ: Ana test bu dosyayı okuyarak açılmalı
        storageState: authFile, 
      },
      // BURASI ÇOK ÖNEMLİ: Setup bitmeden bu projeyi başlatma
      dependencies: ['setup'],
    },
  ],
});