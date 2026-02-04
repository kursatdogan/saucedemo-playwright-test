import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  checkoutBtn = '[data-test="checkout"]';

  constructor(page: Page) {
    super(page);
  }

  async proceedToCheckout() {
    await this.click(this.checkoutBtn);
  }
}
