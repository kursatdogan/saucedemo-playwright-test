# Test Strategy & Architecture — Checkout Flow

## Framework Choice

- Stack: Playwright + TypeScript
- Reasons:
  - Modern, fast, and supports headless browsers out-of-the-box.
  - First-class support for parallelism, traces, screenshots, and videos.
  - TypeScript improves maintainability and catches mistakes early — valuable for senior QA ownership.
  - Easy CI integration (GitHub Actions/GitLab) and artifact production (HTML/JUnit).

## High-Level Test Plan — Checkout Flow

1. Preconditions
   - User is authenticated (programmatic login via storage state). Use `standard_user`.
2. Test Steps
   - Navigate to `/inventory.html`.
   - Verify product listing is visible.
   - Add `Sauce Labs Backpack` to cart.
   - Open cart and verify item present.
   - Proceed to checkout, fill in `FirstName`, `LastName`, `PostalCode`.
   - Complete the purchase and verify the success message `Thank you for your order`.
3. Assertions
   - Inventory page visible after navigation.
   - Cart contains expected product and count matches.
   - Checkout final page contains success message.
4. Clean-up
   - (Optional) Remove items from cart or use a fresh storage state per test run.

## The "Hybrid" Approach — Bypass UI for Setup

- What we do:
  - Use programmatic session injection (cookies/localStorage) to skip login UI for main tests.

- Gains:
  - Significant speed-up: skipping UI login removes ~5-10 seconds per test.
  - Tests focus on critical flows (business logic) rather than repetitive auth steps.
  - Easier to run stable tests in CI with deterministic state.

- Risks / Coverage lost:
  - We reduce coverage of the login UI itself. If login UI is flaky, these tests won't catch it.
  - Mitigation: keep a small number of dedicated UI tests for login (`auth.spec.ts`) that run less frequently.

- Recommendation:
  - Hybrid model: programmatic login for primary flow tests, plus a small set of UI-based authentication tests to validate the login screen.

## Notes on Selectors

- Use `data-test` attributes where available.
- Prefer accessible roles and text selectors when appropriate.
- Avoid brittle XPaths and auto-generated IDs.

## Delivery

- Provide a `src/auth/setup.ts` script that generates `auth/auth.json` (storage state).
- Tests can load this file through fixtures to start tests already authenticated.

*** End of strategy document ***
