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
        baseURL: 'https://www.saucedemo.com',
        trace: 'on-first-retry', // Sadece hata aldığında trace kaydeder (dosya boyutunu küçültür)
        screenshot: 'only-on-failure', // Sadece hata anında ekran görüntüsü alır
        video: 'retain-on-failure', // Sadece hata anında video kaydeder
      },
      // BURASI ÇOK ÖNEMLİ: Setup bitmeden bu projeyi başlatma
      dependencies: ['setup'],
    },
  ],
  reporter: [['html', { open: 'never' }]],
});