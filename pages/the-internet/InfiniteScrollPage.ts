import { Page, Locator } from "@playwright/test";

export class InfiniteScrollPage {
  readonly page: Page;
  readonly addedParagraphs: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addedParagraphs = page.locator(".jscroll-added");
  }

  async goto() {
    await this.page.goto("/infinite_scroll");
  }

  // Método para hacer scroll hacia el final de la página de forma nativa
  async scrollToBottom() {
    // Opción A: Presionar la tecla 'End' imita perfectamente a un usuario real
    await this.page.keyboard.press("End");

    // Opción B (Alternativa si 'End' no te convence): Mover la rueda del mouse hacia abajo
    // await this.page.mouse.wheel(0, 2000);
  }
}
