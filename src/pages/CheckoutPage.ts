import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  firstNameInput = '[data-test="firstName"]';
  lastNameInput = '[data-test="lastName"]';
  postalCodeInput = '[data-test="postalCode"]';
  continueBtn = '[data-test="continue"]';
  finishBtn = '[data-test="finish"]';
  completeHeader = '[data-test="complete-header"]';

  constructor(page: Page) {
    super(page);
  }

  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, zipCode);
    await this.click(this.continueBtn);
  }

  async finishCheckout() {
    await this.click(this.finishBtn);
  }

  async getCompleteMessage() {
    return this.text(this.completeHeader);
  }
}
