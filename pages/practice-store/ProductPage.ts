import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Botón de añadir al carrito por su atributo nativo data-test
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    
    // El contador del carrito
    this.cartBadge = page.locator('#lblCartCount');
    
    // Icono del carrito usando .or() en lugar de selector CSS con comas
    this.cartIcon = page.locator('[data-test="nav-cart"]').or(page.locator('.fa-shopping-cart'));
  }

  /**
   * Hace clic en el botón de añadir al carrito y espera de forma segura 
   * a que el contador de la UI se actualice con el nuevo producto.
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.scrollIntoViewIfNeeded();
    await this.addToCartButton.click();
    
    // Espera segura basada en el contenido del contador del carrito
    await this.page.waitForFunction(
      (elemento) => elemento.textContent.trim() !== "" && elemento.textContent.trim() !== "0", 
      await this.cartBadge.elementHandle()
    );
  }

  /**
   * Navega hacia la página de revisión del carrito de compras
   */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }
}