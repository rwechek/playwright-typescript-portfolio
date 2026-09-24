import { test, expect } from '@playwright/test';
import { JavaScriptAlertsPage } from '../pages/JavaScriptAlertsPage';

test.describe('Pruebas de JavaScript Alerts', () => {
  let alertsPage: JavaScriptAlertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new JavaScriptAlertsPage(page);
    await alertsPage.goto();
  });

  test('Debería aceptar una alerta simple de JS', async ({ page }) => {
    // Escuchar el evento de diálogo antes de hacer clic en el botón
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });

    await alertsPage.clickJsAlert();
    await expect(alertsPage.resultText).toHaveText('You successfully clicked an alert');
  });

  test('Debería aceptar un cuadro de confirmación de JS', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await alertsPage.clickJsConfirm();
    await expect(alertsPage.resultText).toHaveText('You clicked: Ok');
  });

  test('Debería introducir texto y aceptar un prompt de JS', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('¡Hola desde Playwright!');
    });

    await alertsPage.clickJsPrompt();
    await expect(alertsPage.resultText).toHaveText('You entered: ¡Hola desde Playwright!');
  });
});