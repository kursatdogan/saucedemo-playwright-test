import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Bu satır setup'ın boş başlamasını sağlar
setup.use({ storageState: { cookies: [], origins: [] } }); 

const authFile = path.join(process.cwd(), 'auth', 'authState.json');

setup('authenticate', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL('**/inventory.html');

  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.context().storageState({ path: authFile });
});