import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/practice-store/HomePage";

test.describe("Practice Software Testing - Catálogo y ordenamiento", () => {
  let homePage: HomePage;

  // Se ejecuta ANTES de cada test de forma automática
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    // Asegurar que al menos una tarjeta de producto sea visible en la UI
    await expect(homePage.productCardTitles.first()).toBeVisible({
      timeout: 7000,
    });
  });

  // Se ejecuta DESPUÉS de cada test para limpiar el estado del navegador
  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("Debería validar el ordenamiento de productos A-Z y Z-A", async ({
    page,
  }) => {
    // 1. VALIDAR ORDENAMIENTO A-Z (Ascendente)
    await homePage.clickSortAsc();

    await expect(homePage.productCardTitles.first()).toContainText(
      "Adjustable Wrench",
    );
    await expect(homePage.productCardTitles.nth(1)).toContainText(
      "Angled Spanner",
    );

    // 2. VALIDAR ORDENAMIENTO Z-A (Descendente)
    await homePage.clickSortDesc();
    await page.waitForTimeout(1000);

    await expect(homePage.productCardTitles.first()).not.toContainText(
      "Adjustable Wrench",
    );
    await expect(homePage.productCardTitles.first()).toContainText("Wood Saw");
  });

  test("Debería validar el ordenamiento de productos Precio Alto-Bajo y Bajo-Alto", async ({
    page,
  }) => {
    // 1. VALIDAR ORDENAMIENTO Alto-Bajo (Descendente)
    await homePage.clickSortByPriceHighLow();

    /*
     * Reintentos nativos con expect.poll(): La función anónima se reintentará de forma
     * automática hasta que el texto devuelto contenga "Drawer Tool Cabinet" o se alcance
     * el tiempo límite de 5 segundos. Esto le da el respiro exacto a Angular para procesar
     * la respuesta de la API y actualizar el DOM tras el clic en el filtro, eliminando
     * el flakiness.
     *
     */
    await expect
      .poll(
        async () => {
          return await homePage.productCardTitles.first().textContent();
        },
        {
          timeout: 5000,
          message:
            "Esperando a que la lista se ordene por precio de alto a bajo",
        },
      )
      .toContain("Drawer Tool Cabinet");

    await expect(homePage.productCardTitles.nth(1)).toContainText(
      "Tool Cabinet",
    );

    // 2. VALIDAR ORDENAMIENTO Bajo-Alto (Ascendente)
    await homePage.clickSortByPriceLowHigh();

    await expect
      .poll(
        async () => {
          return await homePage.productCardTitles.first() ?? "";
        },
        {
          timeout: 5000,
          message:
            "Esperando a que la lista se ordene por precio de bajo a alto",
        },
      )
      .not.toContain("Drawer Tool Cabinet");

    await expect(homePage.productCardTitles.first()).toContainText("Washers");
  });

  test("Debería validar el ordenamiento de productos Co2 alto o bajo", async ({
    page,
  }) => {
    // 1. VALIDAR ORDENAMIENTO Co2 Bajo (Ascendente)
    await homePage.clickSortByCo2Asc();

    await expect
      .poll(
        async () => {
          return await homePage.productCardTitles.first().textContent();
        },
        {
          timeout: 5000,
          message: "Esperando a que la lista se ordene por Co2 alto o bajo",
        },
      )
      .toContain("Wood Saw");

    await expect(homePage.productCardTitles.nth(1)).toContainText(
      "Safety Goggles",
    );

    // 2. VALIDAR ORDENAMIENTO Co2 Alto (Descendente)
    await homePage.clickSortByCo2Desc();

    await expect
      .poll(
        async () => {
          return await homePage.productCardTitles.first() ?? "";
        },
        {
          timeout: 5000,
          message: "Esperando a que la lista se ordene por Co2 alto o bajo",
        },
      )
      .not.toContain("Wood Saw");

    await expect(homePage.productCardTitles.first()).toContainText(
      "Cordless Drill 12V",
    );
  });

  test("Debería validar la búsqueda de un producto a partir del introducido en la caja de texto", async ({
    page,
  }) => {
    await homePage.searchProduct("Hammer");
    await page.waitForTimeout(1000);

    await expect(homePage.productCardTitles.first()).toContainText("Hammer");
  });

  test("Debería validar el filtro por la categoría", async ({ page }) => {
    const categoriaAProbar = "Hammer";
    await homePage.clickFilterByCategory(categoriaAProbar);

    await expect(
      page.getByRole("checkbox", {
        name: categoriaAProbar,
        includeHidden: true,
      }),
    ).toBeChecked();

    await page.waitForTimeout(1000);

    await expect(homePage.productCardTitles.first()).toContainText("Hammer");
  });

  test("Debería validar que todos los productos ecológicos tengan estrictamente la calificación B", async ({
    page,
  }) => {
    await homePage.clickFilterByEcoFriendly();
    await page.waitForTimeout(500);

    const calificacionesEcologicas = await homePage.getEcoFriendlyRatings();

    for (const calificacion of calificacionesEcologicas) {
      expect(calificacion).toBe("B");
    }
  });

  test("Debería filtrar productos por rango de precios de forma correcta", async ({
    page,
  }) => {
    const precioMinimoEsperado = 30;

    // Mover el slider mínimo hacia la derecha (30 pasos)
    await homePage.moveMinSlider("Right", 30);

    await page.waitForTimeout(2000);

    const preciosProductos = await homePage.getProductPrices();
    expect(preciosProductos.length).toBeGreaterThan(0);

    for (const precio of preciosProductos) {
      expect(precio).toBeGreaterThanOrEqual(precioMinimoEsperado);
      expect(precio).toBeLessThanOrEqual(100);
    }
  });
});
