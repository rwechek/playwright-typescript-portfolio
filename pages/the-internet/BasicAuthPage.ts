import { Page } from "@playwright/test";

export class BasicAuthPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // Opción limpia: inyectar credenciales directamente en la URL para autenticación automática
    await this.page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');
  }

  // Localizador para el mensaje de éxito que aparece tras autenticarse
  async getSuccessMessage() {
    return this.page.locator('div.example p');
  }
}