// tests/dynamic-loading.spec.ts
import { test, expect } from '@playwright/test';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';

test('Debería manejar la carga dinámica y mostrar "Hello World!"', async ({ page }) => {
  const dynamicPage = new DynamicLoadingPage(page);

  // 1. Navegar al Ejemplo 1 de Carga Dinámica
  await dynamicPage.goto();
  await dynamicPage.navigateToExample1();

  await expect(page).toHaveURL(/.*dynamic_loading\/1/);

  // 2. Hacer clic en el botón Start para disparar el indicador de carga
  await dynamicPage.startLoading();

  // 3. Validar que el texto final aparece correctamente 
  // (Playwright esperará automáticamente a que el elemento pase de oculto a visible)
  await expect(dynamicPage.finishText).toHaveText('Hello World!');
});

test('Debería manejar la carga dinámica y mostrar "Hello World! a posteriori"', async ({ page }) => {
  const dynamicPage = new DynamicLoadingPage(page);

  // 1. Navegar al Ejemplo 2 de Carga Dinámica
  await dynamicPage.goto();
  await dynamicPage.navigateToExample2();

  await expect(page).toHaveURL(/.*dynamic_loading\/2/);

  // 2. Hacer clic en el botón Start para disparar el indicador de carga
  await dynamicPage.startLoading();

  // 3. Validar que el texto final aparece correctamente 
  // (Playwright esperará 10 segundos a que el elemento se registre en el DOM)
  await expect(dynamicPage.finishText).toHaveText('Hello World!' , { timeout: 10000 });

  // Espera explícita de hasta 10 segundos a que aparezca en el DOM
  //await dynamicPage.finishText.waitFor({ state: 'visible', timeout: 10000 }); 

  //await expect(dynamicPage.finishText).toHaveText('Hello World!');

});