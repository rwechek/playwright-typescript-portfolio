import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Gestiona el registro y transición como invitado
   */
  async fillGuestDetails(data: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const continueAsGuestTab = this.page.getByRole("tab", {
      name: "Continue as Guest",
    });
    if (await continueAsGuestTab.isVisible()) {
      await continueAsGuestTab.click();
    }

    await this.page.locator('[data-test="guest-email"]').fill(data.email);

    // Selectores con respaldo para nombre y apellido
    await this.page
      .locator(
        '[data-test="first-name"], [data-test="first_name"], input[formcontrolname="first_name"]',
      )
      .fill(data.firstName);
    await this.page
      .locator(
        '[data-test="last-name"], [data-test="last_name"], input[formcontrolname="last_name"]',
      )
      .fill(data.lastName);

    await this.page.locator('[data-test="guest-submit"]').click();

    // Botón intermedio de confirmación de invitado
    const proceedAfterGuestButton = this.page.getByRole("button", {
      name: "Proceed to checkout",
    });
    await expect(proceedAfterGuestButton).toBeVisible({ timeout: 5000 });
    await proceedAfterGuestButton.click();
  }

  /**
   * Rellena el formulario de Dirección (Billing Address) manejando la asincronía de Angular
   */
  async fillBillingAddress(data: {
    country: string;
    postcode: string;
    houseNumber: string;
  }) {
    const postcodeInput = this.page.locator('[data-test="postal_code"]');
    await postcodeInput.waitFor({ state: "attached", timeout: 20000 });

    await postcodeInput.fill(data.postcode);

    const houseNumberInput = this.page.locator('[data-test="house_number"]');
    await houseNumberInput.fill(data.houseNumber);

    const countryInput = this.page.locator('[data-test="country"]');
    const tagName = await countryInput.evaluate((el) =>
      el.tagName.toLowerCase(),
    );
    if (tagName === "select") {
      await countryInput.selectOption({ label: data.country });
    }

    const proceedAddressButton = this.page.locator('[data-test="proceed-3"]');
    await expect(proceedAddressButton).toBeEnabled({ timeout: 10000 });
    await proceedAddressButton.click();
  }

  /**
   * Rellena el formulario de pago (Payment) y confirma la transacción
   */
  async fillPayment(data: {
    paymentMethod?: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardHolder: string;
  }) {
    const paymentMethodSelect = this.page.locator(
      '[data-test="payment-method"]',
    );
    await expect(paymentMethodSelect).toBeVisible({ timeout: 10000 });
    await paymentMethodSelect.selectOption({
      label: data.paymentMethod || "Credit Card",
    });

    const cardNumberInput = this.page.locator(
      '[data-test="credit_card_number"]',
    );
    await cardNumberInput.fill(data.cardNumber);

    const expirationInput = this.page.locator('[data-test="expiration_date"]');
    await expirationInput.fill(data.expirationDate);

    const cvvInput = this.page.locator('[data-test="cvv"]');
    await cvvInput.fill(data.cvv);

    const cardHolderInput = this.page.locator('[data-test="card_holder_name"]');
    if (await cardHolderInput.isVisible()) {
      await cardHolderInput.fill(data.cardHolder);
    }

    const checkPaymentButton = this.page
      .locator("button")
      .filter({ hasText: /Check payment/i });
    await expect(checkPaymentButton).toBeEnabled({ timeout: 10000 });
    await checkPaymentButton.click();
  }

  /**
   * Verifica que el pago se haya completado exitosamente y aparezca el mensaje de confirmación
   */
  async assertOrderSuccess() {
    const successMessage = this.page.locator('[data-test="payment-success-message"]');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  }
}