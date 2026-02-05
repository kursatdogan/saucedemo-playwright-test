import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const test = base.extend({
  storageState: async ({}, use) => {
    const authPath = path.join(process.cwd(), 'auth/authState.json');
    if (fs.existsSync(authPath)) {
      await use(authPath);
    } else {
      await use(undefined);
    }
  },
});

export { expect };