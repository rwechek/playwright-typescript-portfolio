import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly linkCartpage: Locator;
  readonly cartItemRows: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantityInput: Locator;
  readonly itemSubtotal: Locator;
  readonly proceedCheckoutButton: Locator;
  readonly grandTotal: Locator;
  readonly deleteButtons: Locator; // Nuevo localizador para el botón de eliminar

  constructor(page: Page) {
    this.page = page;
    this.cartItemRows = page.locator("tbody tr");
    this.itemPrice = page.locator("tbody tr td:nth-child(2)");
    this.itemQuantityInput = page.locator("tbody tr td:nth-child(3) input");
    this.itemSubtotal = page.locator("tbody tr td:nth-child(4)");
    this.proceedCheckoutButton = page.locator('[data-test="proceed-1"]');
    this.linkCartpage = page.locator('[data-test="nav-cart"]');
    // Localizador robusto para los botones de eliminar fila en la tabla del carrito
    // En el constructor o propiedades de CartPage.ts:
    this.deleteButtons = page.locator("tbody tr .btn.btn-danger");
    this.grandTotal = page.locator('[data-test="cart-total"]');
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
    return (await this.itemSubtotal.first().textContent())?.trim() || "";
  }

  /**
   * Hace clic en el botón para proceder al pago con validación de visibilidad
   */
  async proceedToCheckout(): Promise<void> {
    await expect(this.proceedCheckoutButton).toBeVisible({ timeout: 5000 });
    await this.proceedCheckoutButton.click();
  }

  /**
   * Retorna la cantidad de filas/ítems actuales en el carrito de forma resiliente
   */
  async getCartItemsCount(): Promise<number> {
    try {
      // Intentamos esperar a que al menos una fila esté presente (útil al cargar o con ítems)
      await this.cartItemRows.first().waitFor({ state: "attached", timeout: 2000 });
    } catch {
      // Si el timeout expira, asumimos con seguridad que el carrito está vacío (0 filas)
    }
    
    return await this.cartItemRows.count();
  }

  /**
   * Extrae los precios unitarios de cada producto en el carrito como números
   */
  async getItemPrices(): Promise<number[]> {
    const count = await this.itemPrice.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.itemPrice.nth(i).textContent();
      if (text) {
        const cleanPrice = parseFloat(text.replace(/[^0-9.-]+/g, ""));
        prices.push(cleanPrice);
      }
    }
    return prices;
  }

  /**
   * Extrae los subtotales de cada fila del carrito como números
   */
  async getItemSubtotals(): Promise<number[]> {
    const count = await this.itemSubtotal.count();
    const subtotals: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.itemSubtotal.nth(i).textContent();
      if (text) {
        const cleanSubtotal = parseFloat(text.replace(/[^0-9.-]+/g, ""));
        subtotals.push(cleanSubtotal);
      }
    }
    return subtotals;
  }

  /**
   * Elimina un producto del carrito según su índice (base 0)
   */
  async removeProductAtIndex(index: number): Promise<void> {
    const deleteBtn = this.deleteButtons.nth(index);
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
    await deleteBtn.click();
  }

  /**
   * Obtiene el total general del carrito (ideal para múltiples productos)
   */
  async getGrandTotalNumber(): Promise<number> {
    await expect(this.grandTotal.first()).toBeVisible({ timeout: 15000 });
    const text = (await this.grandTotal.first().textContent())?.trim() || "";
    const cleanNumber = parseFloat(text.replace(/[^0-9.-]+/g, ""));
    return isNaN(cleanNumber) ? 0 : cleanNumber;
  }
}
