import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly endpoint: string = "/inventory.html";

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continue: Locator;
  readonly finish: Locator;
  readonly checkout: Locator;
  readonly shoppingCartLink: Locator;
  readonly textFinish: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continue = page.locator('[data-test="continue"]');
    this.finish = page.locator('[data-test="finish"]');
    this.checkout = page.locator('[data-test="checkout"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.textFinish = page.locator('[data-test="complete-header"]');
  }

  // Localizador de mensajes desde el ingreso al carrito de compras y los pasos de ckeckout.
  async getYourCartMessage() {
    return this.page.locator('[data-test="title"]');
  }

  // Localizador del mensaje final de la compra.
  async getYourFinishMessage() {
    return this.textFinish;
  }

   /**
   * Método de negocio para completar el formulario.
   */
  async fillForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
    await this.continue.click();
  }
}
