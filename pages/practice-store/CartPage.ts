import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItemRows: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantityInput: Locator;
  readonly itemSubtotal: Locator;
  readonly proceedCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItemRows = page.locator('tbody tr');
    this.itemPrice = page.locator('tbody tr td:nth-child(2)');
    this.itemQuantityInput = page.locator('tbody tr td:nth-child(3) input');
    this.itemSubtotal = page.locator('tbody tr td:nth-child(4)');
    this.proceedCheckoutButton = page.locator('[data-test="proceed-1"]');
  }

  /**
   * Navega a la vista del carrito de compras y asegura la carga de red
   */
  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Obtiene el texto del subtotal de forma limpia
   */
  async getSubtotal(): Promise<string> {
    await expect(this.itemSubtotal).toBeVisible({ timeout: 5000 });
    return (await this.itemSubtotal.textContent())?.trim() || '';
  }

  /**
   * Hace clic en el botón para proceder al pago con validación de visibilidad
   */
  async proceedToCheckout(): Promise<void> {
    await expect(this.proceedCheckoutButton).toBeVisible({ timeout: 5000 });
    await this.proceedCheckoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}