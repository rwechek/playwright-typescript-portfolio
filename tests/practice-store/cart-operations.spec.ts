import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/practice-store/HomePage";
import { ProductPage } from "../../pages/practice-store/ProductPage";
import { CartPage } from "../../pages/practice-store/CartPage";

test.describe("Practice Software Testing - Operaciones y Cálculos del Carrito", () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);

    await homePage.goto();
    await expect(homePage.productCardTitles.first()).toBeVisible({
      timeout: 10000,
    });
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("Debería agregar tres productos, validar subtotales y eliminarlos secuencialmente hasta vaciar el carrito", async ({
    page,
  }) => {
    test.setTimeout(60000);

    // 1. Agregar el primer producto (índice 0)
    await homePage.clickProductByIndex(0);
    await productPage.addToCart();
    await expect
      .poll(async () => (await productPage.cartBadge.textContent()) ?? "", {
        timeout: 5000,
        message: "Esperando contador del carrito en 1",
      })
      .toBe("1");

    // 2. Volver al inicio y agregar el segundo producto (índice 1)
    await homePage.goto();
    await homePage.clickProductByIndex(1);
    await productPage.addToCart();
    await expect
      .poll(async () => (await productPage.cartBadge.textContent()) ?? "", {
        timeout: 5000,
        message: "Esperando contador del carrito en 2",
      })
      .toBe("2");

    // 3. Volver al inicio y agregar el tercer producto (índice 2)
    await homePage.goto();
    await homePage.clickProductByIndex(2);
    await productPage.addToCart();
    await expect
      .poll(async () => (await productPage.cartBadge.textContent()) ?? "", {
        timeout: 5000,
        message: "Esperando contador del carrito en 3",
      })
      .toBe("3");

    // 4. Ir a la vista del carrito
    await cartPage.goto();
    await expect(page).toHaveURL(/\/checkout/);

    // Validar que hay exactamente 3 ítems
    expect(await cartPage.getCartItemsCount()).toBe(3);

    // 5. Validar cálculo matemático con los 3 productos usando getGrandTotalNumber()
    const subtotals3 = await cartPage.getItemSubtotals();
    const sum3 = subtotals3.reduce((acc, curr) => acc + curr, 0);
    const displayedTotal3 = await cartPage.getGrandTotalNumber();
    expect(displayedTotal3).toBeCloseTo(sum3, 2);

    // --- CICLO DE ELIMINACIÓN SECUENCIAL ---

    // 6. Eliminar el primer producto (quedan 2)
    await cartPage.removeProductAtIndex(0);
    await expect
      .poll(async () => await cartPage.getCartItemsCount(), {
        timeout: 5000,
        message: "Esperando a que el carrito se reduzca a 2 ítems",
      })
      .toBe(2);

    const subtotals2 = await cartPage.getItemSubtotals();
    const sum2 = subtotals2.reduce((acc, curr) => acc + curr, 0);
    const displayedTotal2 = await cartPage.getGrandTotalNumber();
    expect(displayedTotal2).toBeCloseTo(sum2, 2);

    // 7. Eliminar el siguiente producto (queda 1)
    await cartPage.removeProductAtIndex(0);
    await expect
      .poll(async () => await cartPage.getCartItemsCount(), {
        timeout: 5000,
        message: "Esperando a que el carrito se reduzca a 1 ítem",
      })
      .toBe(1);

    const subtotals1 = await cartPage.getItemSubtotals();
    const sum1 = subtotals1.reduce((acc, curr) => acc + curr, 0);
    const displayedTotal1 = await cartPage.getGrandTotalNumber();
    expect(displayedTotal1).toBeCloseTo(sum1, 2);

    // 8. Eliminar el último producto (carrito vacío / 0 ítems)
    await cartPage.removeProductAtIndex(0);
    await expect
      .poll(async () => await cartPage.getCartItemsCount(), {
        timeout: 5000,
        message: "Esperando a que el carrito quede vacío",
      })
      .toBe(0);
  });
});