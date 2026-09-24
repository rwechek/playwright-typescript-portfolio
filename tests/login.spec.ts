// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Validar redirección de autenticación usando POM', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await expect(page).toHaveURL(/.*login/);
});

test('Debería iniciar sesión exitosamente con credenciales válidas', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // 1. Navegar y llegar a la página de login
  await loginPage.goto();

  // 2. Ejecutar login con las credenciales provistas por la página
  await loginPage.login('tomsmith', 'SuperSecretPassword!');

  // 3. Validar redirección a la zona segura y mensaje de éxito
  await expect(page).toHaveURL(/.*secure/);
  await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
});