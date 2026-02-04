# SauceDemo Playwright QA Framework

A clean, maintainable Playwright + TypeScript QA automation framework for the SauceDemo e-commerce application. Built with Page Object Model (POM) pattern and optimized for CI/CD.

## 🎯 Key Features

- **Page Object Model**: Clean separation of concerns with dedicated page classes
- **Storage State Authentication**: Skip UI login in tests for faster execution (~2-3x speed improvement)
- **CI/CD Ready**: Configured for GitHub Actions with proper reporters and artifacts
- **Clean Architecture**: Simple, readable code suitable for senior QA engineers
- **TypeScript Support**: Full type safety with minimal configuration
- **Comprehensive Reporting**: HTML reports, JUnit XML for CI, screenshots and videos on failure

## 📁 Project Structure

```
soucedemo_playwright_qa/
├── src/
│   ├── pages/              # Page Object Model classes
│   │   ├── BasePage.ts     # Common page utilities
│   │   ├── LoginPage.ts    # Login page actions
│   │   ├── InventoryPage.ts # Product listing page
│   │   └── CartPage.ts     # Shopping cart page
│   ├── fixtures/
│   │   └── test.ts         # Custom test fixtures and page objects
│   ├── auth/
│   │   └── setup.ts        # Authentication setup script
│   └── utils/              # Utilities (for future expansion)
├── tests/
│   ├── auth.spec.ts        # Login/authentication tests
│   └── shopping.spec.ts    # Shopping workflow tests (uses storage state)
├── auth/
│   └── authState.json      # Generated browser storage state (auto-created)
├── playwright.config.ts    # Playwright configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Authentication Storage State

This creates a persistent login session so tests don't need to log in every time:

```bash
npx ts-node src/auth/setup.ts
```

This generates `auth/authState.json` which tests will reuse.

### 3. Run Tests

#### Run all tests (with pre-authenticated state)
```bash
npm test
```

#### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

#### Run specific test file
```bash
npx playwright test tests/shopping.spec.ts
```

#### Run single test
```bash
npx playwright test -g "should add product to cart"
```

#### Debug mode (step through with inspector)
```bash
npm run test:debug
```

#### UI mode (interactive test runner)
```bash
npm run test:ui
```

### 4. View HTML Report

```bash
npm run report
```

## 🏗️ Architecture Explanation

### Page Object Model (POM)

Each page has a dedicated class with:
- **Selectors**: Centralized element references
- **Actions**: User interactions (click, fill, etc.)
- **Assertions**: Page state verification

**Example:**

```typescript
// src/pages/LoginPage.ts
export class LoginPage extends BasePage {
  readonly usernameInput = 'input[data-test="username"]';
  readonly passwordInput = 'input[data-test="password"]';

  async login(username: string, password: string) {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.page.waitForURL('**/inventory.html');
  }
}
```

**Using in tests:**

```typescript
test('should login', async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  
  const isInventoryVisible = await inventoryPage.isInventoryDisplayed();
  expect(isInventoryVisible).toBeTruthy();
});
```

### Storage State Authentication

**How it works:**

1. `src/auth/setup.ts` logs in once and saves browser cookies/storage to `auth/authState.json`
2. Tests use `test.use({ storageState: 'auth/authState.json' })` to reuse the session
3. Tests skip the login UI entirely, running in ~3 seconds instead of ~10 seconds

**When to regenerate:**

```bash
# After credentials change or session expires
npx ts-node src/auth/setup.ts
```

### Test Organization

- **auth.spec.ts**: Tests that exercise the login UI directly (no storage state)
- **shopping.spec.ts**: Tests that use pre-authenticated state (fast tests)

## 🧪 Example Test

```typescript
import { test, expect } from '../src/fixtures/test';

test.describe('Shopping - With Auth Storage State', () => {
  // Reuse saved login session for all tests in this suite
  test.use({
    storageState: 'auth/authState.json',
  });

  test('should add product to cart', async ({ inventoryPage, cartPage }) => {
    // Arrange: Already logged in, navigate to inventory
    await inventoryPage.goto();

    // Act: Add product to cart
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    // Assert: Verify cart updated
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe('1');
  });
});
```

## 🔧 Configuration

### playwright.config.ts

Key settings:

```typescript
{
  testDir: './tests',              // Where tests live
  retries: process.env.CI ? 1 : 0, // Retry failed tests on CI
  workers: process.env.CI ? 1 : 1, // Serial on CI, parallel locally
  timeout: 30 * 1000,              // 30 second test timeout
}
```

### Adding New Tests

1. Create page object in `src/pages/`
2. Add to fixture in `src/fixtures/test.ts`
3. Create test file in `tests/` ending with `.spec.ts`

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Setup auth
        run: npx ts-node src/auth/setup.ts
      
      - name: Run tests
        run: npm test
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 🐛 Debugging

### Interactive Mode
```bash
npm run test:debug
```
Opens Playwright Inspector to step through tests.

### Inspect Element
```bash
npx codegen https://www.saucedemo.com
```
Generate selectors by clicking elements.

### View Traces
```bash
npx playwright show-trace trace.zip
```

## 📝 Test Credentials

- **Username**: `standard_user`
- **Password**: `secret_sauce`

## 🤔 FAQ

**Q: Why use storage state?**
A: Skips the login UI (~7s) for each test. Tests run 3x faster while still testing the authenticated flow.

**Q: Can I test login itself?**
A: Yes! `auth.spec.ts` tests login without using storage state. Use these for login validation.

**Q: How do I add a new page object?**
A: Create `src/pages/YourPage.ts`, extend `BasePage`, add to `src/fixtures/test.ts`, use in tests.

**Q: How do I run tests on CI?**
A: Set `CI=true` environment variable. Config automatically adjusts workers, retries, and reporters.

## 📚 Resources

- [Playwright Docs](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Storage State](https://playwright.dev/docs/auth)
- [TypeScript Setup](https://playwright.dev/docs/intro)

## ✅ Checklist for Production

- [ ] Generate auth state: `npx ts-node src/auth/setup.ts`
- [ ] Run locally: `npm test`
- [ ] Check report: `npm run report`
- [ ] Set CI environment variable for CI runs
- [ ] Configure GitHub Actions (see example above)
- [ ] Add credentials to CI secrets (never commit)

---

**Built with ❤️ for reliable QA automation**
