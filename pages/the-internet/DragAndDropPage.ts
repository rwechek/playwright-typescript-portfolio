import { Page, Locator } from "@playwright/test";

export class DragAndDropPage {
  readonly page: Page;
  readonly squareA: Locator;
  readonly squareB: Locator;

  constructor(page: Page) {
    this.page = page;
    this.squareA = page.locator("#column-a");
    this.squareB = page.locator("#column-b");
  }

  async goto() {
    await this.page.goto("/drag_and_drop", {
      waitUntil: "domcontentloaded",
      timeout: 60000, // Opcional: darle un respiro de 60s solo a la navegación inicial
    });
  }
}
