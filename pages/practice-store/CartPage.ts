import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly linkCartpage: Locator;
  readonly cartItemRows: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantityInput: Locator;
  readonly itemSubtotal: Locator;
  readonly proceedCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItemRows = page.locator("tbody tr");
    this.itemPrice = page.locator("tbody tr td:nth-child(2)");
    this.itemQuantityInput = page.locator("tbody tr td:nth-child(3) input");
    this.itemSubtotal = page.locator("tbody tr td:nth-child(4)");
    this.proceedCheckoutButton = page.locator('[data-test="proceed-1"]');
    this.linkCartpage = page.locator('[data-test="nav-cart"]');
  }

  /**
   * Navega a la vista del carrito de compras y asegura la carga de red
   */
  async goto(): Promise<void> {
    await this.linkCartpage.click();
  }

  /**
   * Obtiene el texto del subtotal de forma limpia
   */
  async getSubtotal(): Promise<string> {
    // 1. Asegurarnos de que al menos una fila del carrito ya se renderizó en el DOM
    await expect(this.page.locator("tbody tr").first()).toBeVisible({
      timeout: 15000,
    });

    // 2. Validar y extraer el subtotal con seguridad
    await expect(this.itemSubtotal).toBeVisible({ timeout: 15000 });
    return (await this.itemSubtotal.textContent())?.trim() || "";
  }

  /**
   * Hace clic en el botón para proceder al pago con validación de visibilidad
   */
  async proceedToCheckout(): Promise<void> {
    await expect(this.proceedCheckoutButton).toBeVisible({ timeout: 5000 });
    await this.proceedCheckoutButton.click();
  }
}
