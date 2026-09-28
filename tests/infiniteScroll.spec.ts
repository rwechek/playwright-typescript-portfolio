import { test, expect } from "@playwright/test";
import { InfiniteScrollPage } from "../pages/InfiniteScrollPage";

test.describe("Validación de Infinite Scroll para herokuapp", () => {
  let infiniteScrollPage: InfiniteScrollPage;

  test.beforeEach(async ({ page }) => {
    infiniteScrollPage = new InfiniteScrollPage(page);
    await infiniteScrollPage.goto();
  });

  test("Debe cargar más contenido dinámico al realizar scroll hacia abajo", async () => {
    // 1. Contamos cuántos párrafos hay inicialmente al cargar la página
    const initialCount = await infiniteScrollPage.addedParagraphs.count();
    
    // 2. Primer desplazamiento
    await infiniteScrollPage.scrollToBottom();
    // Esperamos a que incremente en 1
    await expect(infiniteScrollPage.addedParagraphs).toHaveCount(initialCount + 1);

    // 3. Pequeña pausa táctica para que la página asimile el contenido nuevo y recalcule su altura total
    await infiniteScrollPage.page.waitForTimeout(500);

    // 4. Segundo desplazamiento
    await infiniteScrollPage.scrollToBottom();
    // Ahora sí esperará de forma segura el cuarto elemento (initialCount + 2)
    await expect(infiniteScrollPage.addedParagraphs).toHaveCount(initialCount + 2);
  });
});
