import { test,expect} from '../src/fixtures/test';
import { ProductPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { faker } from '@faker-js/faker';


// Helper function to generate random zip code (5 digits)
function getRandomZipCode(): string {
  return Math.floor(Math.random() * 90000 + 10000).toString();
}

test('Complete checkout flow', async ({ page }) => {
  // Navigate to products (already logged in via injection)
  await page.goto('/inventory.html');
  console.log("Şu anki URL:", page.url());

  // Add Backpack to cart
  const productPage = new ProductPage(page);
  await productPage.addBackpackToCart();

  // ASSERT: Remove button is visible
  await expect(productPage.removeBackpackButton).toBeVisible();

  // ASSERT: Remove button color is red
  const color = await productPage.removeBackpackButton.evaluate(el =>
    window.getComputedStyle(el).color
  );

  expect(color).toBe('rgb(226, 35, 26)');

  // Go to cart
  await productPage.goToCart();

  // Proceed to checkout
  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();

  // Fill checkout info with random real data
  const checkoutPage = new CheckoutPage(page);
  const randomFirstName = faker.person.firstName();
  const randomLastName = faker.person.lastName();
  const randomZipCode = getRandomZipCode();
  
  console.log(`Testing with: ${randomFirstName} ${randomLastName} ${randomZipCode}`);
  
  await checkoutPage.fillCheckoutInfo(randomFirstName, randomLastName, randomZipCode);
  await checkoutPage.finishCheckout();

  // Verify success message
  const completeMsg = await checkoutPage.getCompleteMessage();
  expect(completeMsg).toContain('Thank you for your order');
});
