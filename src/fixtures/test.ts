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

  // KLASÖRÜN VARLIĞINDAN EMİN OLALIM
  const authDir = path.join(process.cwd(), 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }

  await page.context().storageState({ path: 'auth/authState.json' });
  await browser.close();
}

setup();