
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly addBackpackBtn: Locator;
  readonly removeBackpackButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.addBackpackBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.removeBackpackButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async addBackpackToCart() {
    await this.addBackpackBtn.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}