import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const test = base.extend({
  context: async ({ browser }, use) => {

    const storagePath = path.join(process.cwd(), 'auth', 'auth.json');

    const context = fs.existsSync(storagePath)
      ? await browser.newContext({ storageState: storagePath })
      : await browser.newContext();

    await use(context);
    await context.close();
  },
});

export { expect };