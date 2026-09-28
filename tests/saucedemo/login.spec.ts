import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';

test.describe('Pruebas de Autenticación en SauceDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Debe iniciar sesión exitosamente con el usuario estándar', async ({ page }) => {
    // 1. Iniciar sesión con credenciales válidas
    await loginPage.login('standard_user', 'secret_sauce');

    // 2. Aserción: Verificar que la URL cambió al inventario
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Debe mostrar un mensaje de error al intentar iniciar sesión con un usuario bloqueado', async () => {
    // 1. Intentar iniciar sesión con un usuario bloqueado por el sistema
    await loginPage.login('locked_out_user', 'secret_sauce');

    // 2. Obtener el texto del mensaje de error
    const errorMessage = await loginPage.getErrorMessage();

    // 3. Aserción: Validar que el mensaje indique el bloqueo de la cuenta
    expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
  });
});