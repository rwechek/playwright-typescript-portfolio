import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/practice-store/HomePage";
import { ProductPage } from "../../pages/practice-store/ProductPage";
import { CartPage } from "../../pages/practice-store/CartPage";

test.describe("Practice Software Testing - Flujo de Carrito", () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);

    await homePage.goto();
    await expect(homePage.productCardTitles.first()).toBeVisible({ timeout: 10000 });
  });

  test("Debería buscar, seleccionar, agregar un producto al carrito y verificar la vista de checkout", async ({
    page,
  }) => {
    // 1. Buscar un producto del catálogo
    await homePage.searchProduct("Pliers");
    await expect(homePage.productCards.first()).toBeVisible();

    // 2. Entrar al detalle del primer producto
    await homePage.clickFirstProduct();
    await expect(page).toHaveURL(/\/product\/.+/);

    // 3. Agregar el producto al carrito y verificar contador
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText("1");

    // 4. Avanzar a la sinopsis del carrito
    await productPage.goToCart();
    await expect(page).toHaveURL(/\/checkout/);

    // 5. Validar los elementos del carrito usando CartPage
    await expect(cartPage.cartItemRows.first()).toBeVisible();
    const subtotal = await cartPage.getSubtotal();
    expect(subtotal.length).toBeGreaterThan(0);
  });
});