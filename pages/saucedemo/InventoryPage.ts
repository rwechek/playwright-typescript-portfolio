import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly endpoint: string = '/inventory.html';
  
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.endpoint);
  }

  /**
   * Agrega un producto al carrito transformando su nombre al formato data-test (minúsculas y guiones).
   * Ejemplo: "Sauce Labs Backpack" -> "sauce-labs-backpack"
   */
  async addProductToCart(productName: string): Promise<void> {
    const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
    const addToCartButton = this.page.locator(`[data-test="add-to-cart-${formattedName}"]`);
    await addToCartButton.click();
  }

  /**
   * Remueve un producto del carrito basado en su nombre exacto.
   */
  async removeProductFromCart(productName: string): Promise<void> {
    const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButton = this.page.locator(`[data-test="remove-${formattedName}"]`);
    await removeButton.click();
  }

  /**
   * Obtiene el número actual de elementos mostrados en el badge del carrito.
   */
  async getCartItemCount(): Promise<string> {
    return await this.shoppingCartBadge.textContent() || '0';
  }

  /**
   * Selecciona una opción en el menú de ordenamiento:
   * 'az' (A to Z), 'za' (Z to A), 'lohi' (Price low to high), 'hilo' (Price high to low)
   */
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Obtiene todos los precios de los productos actuales en formato numérico.
   */
  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItems.locator('[data-test="inventory-item-price"]').allTextContents();
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Navega hacia la pantalla del carrito de compras.
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }
}