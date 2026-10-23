import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.describe('Pruebas de Estrés y Concurrencia - SauceDemo', () => {

  test('Worker 1: Login masivo y verificación de inventario bajo carga @ci', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.waitForTimeout(500);
    const firstItem = page.locator('.inventory_item_name').first();
    await expect(firstItem).toBeVisible();
  });

  test('Worker 2: Interrupción de sesión por condición de carrera @ci', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    
    // Simular click y colisión inmediata de navegación concurrente
    await page.locator('#login-button').click();
    
    // Forzamos redirección abruptly para simular colisión de sesión/red
    await page.goto('https://www.saucedemo.com/');

    // Esta aserción fallará por la colisión de estado/redirección
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 2000 });
    await expect(page.locator('.title')).toHaveText('Products');
  });

});