import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';

test.describe('Pruebas del Inventario en SauceDemo', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Iniciar sesión antes de cada prueba de inventario
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Debe agregar y remover productos actualizando el badge del carrito', async () => {
    // Agregar dos productos
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartItemCount()).toBe('1');

    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartItemCount()).toBe('2');

    // Remover uno de ellos
    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartItemCount()).toBe('1');
  });

  test('Debe ordenar los productos correctamente por precio (de menor a mayor)', async () => {
    // Aplicar filtro de precio de menor a mayor ('lohi')
    await inventoryPage.sortBy('lohi');

    // Obtener la lista de precios resultante
    const prices = await inventoryPage.getProductPrices();

    // Validar mediante aserción lógica que cada precio sea menor o igual al siguiente
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });
});