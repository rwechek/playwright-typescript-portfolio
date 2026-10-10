import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/practice-store/HomePage';

test.describe('Practice Software Testing - Catálogo y Búsqueda', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    // Aseguramos que la página cargue los elementos iniciales del catálogo
    await expect(homePage.productCardTitles.first()).toBeVisible({ timeout: 10000 });
  });

  test('Debería buscar un producto exitosamente en el catálogo', async ({ page }) => {
    // 1. Realizar la búsqueda de una herramienta (ej. "Pliers")
    await homePage.searchProduct('Pliers');

    // Espera inteligente con reintento automático en el test
    await expect(homePage.productCardTitles.first()).toContainText(
      new RegExp('Pliers', "i"),
      { timeout: 10000 }
    );

    // 2. Validar que se muestren resultados y que contengan el criterio buscado
    await expect(homePage.productCards.first()).toBeVisible();
    
    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    
    // Verificamos que al menos los productos devueltos tengan relación con la búsqueda
    const matchFound = titles.some((title) => title.toLowerCase().includes('pliers'));
    expect(matchFound).toBeTruthy();
  });
});