import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/practice-store/HomePage';
import { ProductPage } from '../../pages/practice-store/ProductPage';

test.describe('Practice Software Testing - Detalle de Producto', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);

    await homePage.goto();
    await expect(homePage.productCardTitles.first()).toBeVisible({ timeout: 10000 });
  });

  test('Debería navegar a los detalles del primer producto al seleccionarlo', async ({ page }) => {
    await homePage.clickFirstProduct();
  });

  test('Debería agregar un producto al carrito desde la página de detalles y verificar el contador', async ({ page }) => {
    await homePage.clickFirstProduct();

    // Interactuamos con la página de producto de forma modular
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText('1');
  });
});