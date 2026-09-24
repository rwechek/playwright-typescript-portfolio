import { test, expect } from "@playwright/test";
import { AddRemoveElementsPage } from "../pages/AddRemoveElementsPage";

test("Debería dar clic al botón de adicionar un elemento", async ({ page }) => {
  const addRemoveElementsPage = new AddRemoveElementsPage(page);

  // 1. Ir a la pagina
  await addRemoveElementsPage.goto();

  // 2. Contenedor de botones
  const contentButtons = page.locator('#elements button');
  
  // 3. Hacer click Add/Remove Elements
  await addRemoveElementsPage.add();
  await addRemoveElementsPage.add();
  await addRemoveElementsPage.add();

  /*
  await page.screenshot({
    path: `test-results/AddRemoveElements/AddElements.png`,
  });
  */

  // 4. Aserción: Verificar que efectivamente se crearon 3 botones
  await expect(contentButtons).toHaveCount(3);

  // 5. Eliminamos todos los botones creados.
  await addRemoveElementsPage.removeAll(contentButtons);

  // 6. Completar el test verificando que ya NO existen elementos
  // Esta es la aserción final que asegura que la página regresó a su estado original
  await expect(contentButtons).toHaveCount(0); 
  /*
  await page.screenshot({
    path: `test-results/AddRemoveElements/DeleteElements.png`,
  });
  */
});
