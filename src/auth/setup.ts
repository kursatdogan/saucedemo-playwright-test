import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function setup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // KRİTİK: Girişin başarılı olduğunu doğrula (Ürünler başlığını bekle)
  await page.waitForSelector('.inventory_list');

  const authDir = path.join(process.cwd(), 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.context().storageState({ path: 'auth/authState.json' });
  console.log("Auth state successfully saved!");
  await browser.close();
}

setup().catch(err => {
    console.error("Setup failed:", err);
    process.exit(1);
});