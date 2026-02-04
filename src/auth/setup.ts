import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Login once and save storage state to auth/auth.json
 * Run: npm run auth:generate
 */
async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com/');
  await page.fill('input[data-test="username"]', 'standard_user');
  await page.fill('input[data-test="password"]', 'secret_sauce');
  await page.click('input[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');

  await page.waitForTimeout(1000);

  const storage = await context.storageState();
  const outDir = path.resolve('auth');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  fs.writeFileSync(path.join(outDir, 'auth.json'), JSON.stringify(storage, null, 2));
  console.log('✅ Saved auth/auth.json');

  await browser.close();
}

run().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
