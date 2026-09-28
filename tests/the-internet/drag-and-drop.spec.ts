import { test, expect } from "@playwright/test";
import { DragAndDropPage } from "../../pages/the-internet/DragAndDropPage";

test.describe("Validación de Drag and drop para herokuapp", () => {
  let dragAndDropPage: DragAndDropPage;

  test.beforeEach(async ({ page }) => {
    dragAndDropPage = new DragAndDropPage(page);
    await dragAndDropPage.goto();
  });
  test("Debe posicionarse en el cuadrado A y B correctamente y trasladar de A a B.", async () => {
    await dragAndDropPage.squareA.dragTo(dragAndDropPage.squareB);
    await expect(dragAndDropPage.squareA).toHaveText('B');
    await expect(dragAndDropPage.squareB).toHaveText('A');
  });
});
