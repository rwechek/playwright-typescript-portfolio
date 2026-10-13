import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly productCardTitles: Locator;
  readonly sortDropdown: Locator;
  readonly productCategoryEcoFriendly: Locator;
  readonly productRating: Locator;
  readonly pricePrices: Locator;
  readonly priceSliderHandleMin: Locator;
  readonly priceSliderHandleMax: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator("#search-query");
    this.searchButton = page.locator('button[type="submit"]');
    this.productCards = page.locator(".card");
    this.productCardTitles = page.locator(".card-title");
    this.sortDropdown = page.locator('[data-test="sort"]');
    this.productCategoryEcoFriendly = page.getByRole("checkbox", {
      name: "Eco-Friendly Products",
      includeHidden: true,
    });
    this.productRating = page.locator(".co2-letter.active.rating-b");
    this.pricePrices = page.locator('[data-test="product-price"]');
    this.priceSliderHandleMin = page.locator(".ngx-slider-pointer-min");
    this.priceSliderHandleMax = page.locator(".ngx-slider-pointer-max");
  }

  async goto() {
    await this.page.goto("/");

    // Hacemos que el propio goto() espere a que el catálogo cargue los productos
    await this.productCardTitles
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
  }

  /**
   * Hace clic en la primera tarjeta de producto visible en el catálogo
   * asegurando que esté completamente renderizada y acoplada al DOM.
   */
  async clickFirstProduct() {
    const firstTitle = this.productCardTitles.first();

    // 1. Esperamos inteligentemente a que el título tenga texto real
    // (garantiza que la API respondió, los datos se pintaron y Angular hizo el binding del router).
    await expect(firstTitle).not.toBeEmpty({ timeout: 10000 });

    // 2. Hacemos clic en el título ya listo y activo
    await firstTitle.click();

    // 3. Validamos con polling automático que la SPA actualizó la URL
    await expect(this.page).toHaveURL(/\/product\/[A-Z0-9]+/, {
      timeout: 10000,
    });
  }

  /**
   * Hace clic en un producto del catálogo según su índice (base 0)
   */
  /**
   * Hace clic en un producto del catálogo según su índice (base 0) de forma totalmente sincronizada con Angular
   */
  async clickProductByIndex(index: number): Promise<void> {
    const targetTitle = this.productCardTitles.nth(index);

    // 1. Esperamos inteligentemente a que el título en ese índice tenga texto real
    await expect(targetTitle).not.toBeEmpty({ timeout: 10000 });

    // 2. Hacemos clic en el título ya listo y activo
    await targetTitle.click();

    // 3. Validamos con polling automático que la SPA actualizó la URL al detalle del producto
    await expect(this.page).toHaveURL(/\/product\/[A-Z0-9]+/, {
      timeout: 10000,
    });
  }

  /**
   * Realiza la búsqueda de un producto utilizando el input y el botón centralizado
   */
  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async clickSortAsc() {
    await this.sortDropdown.selectOption("name,asc");
  }

  async clickSortDesc() {
    await this.sortDropdown.selectOption("name,desc");
  }

  async clickSortByPriceHighLow() {
    await this.sortDropdown.selectOption("price,desc");
  }

  async clickSortByPriceLowHigh() {
    await this.sortDropdown.selectOption("price,asc");
  }

  async clickSortByCo2Asc() {
    await this.sortDropdown.selectOption("co2_rating,asc");
  }

  async clickSortByCo2Desc() {
    await this.sortDropdown.selectOption("co2_rating,desc");
  }

  async clickFilterByCategory(categoryName: string) {
    const categoryCheckbox = this.page.getByRole("checkbox", {
      name: categoryName,
      includeHidden: true,
    });
    await categoryCheckbox.check({ force: true });
  }

  async clickFilterByEcoFriendly() {
    await this.productCategoryEcoFriendly.click({ force: true });
  }

  async getProductTitles(): Promise<string[]> {
    return await this.productCardTitles.allTextContents();
  }

  /**
   * Obtiene todos los precios de los productos visibles como números (float)
   */
  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.pricePrices.allTextContents();
    return priceTexts.map((text) => {
      const cleanText = text.replace(/[^0-9.]/g, "");
      return parseFloat(cleanText);
    });
  }

  /**
   * Mueve el slider de precio usando el teclado
   */
  async moveMinSlider(direction: "Left" | "Right", steps: number) {
    await this.priceSliderHandleMin.focus();
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.press(`Arrow${direction}`);
    }
  }

  async getEcoFriendlyRatings(): Promise<string[]> {
    const ecoCards = this.productCards.filter({ hasText: "ECO" });
    const activeEcoLetters = ecoCards.locator(".co2-letter.active");
    const ratings = await activeEcoLetters.allTextContents();
    return ratings.map((text) => text.trim().toUpperCase());
  }
}
