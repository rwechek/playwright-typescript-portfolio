// pages/CheckboxesPage.ts
import { Page, Locator } from '@playwright/test';

export class CheckboxesPage {
  readonly page: Page;
  readonly checkboxesLink: Locator;
  readonly checkboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkboxesLink = page.getByRole('link', { name: 'Checkboxes' });
    // Localizador para los checkboxes de la página
    this.checkboxes = page.locator('input[type="checkbox"]');
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/');
  }

  async clickCheckboxesLink() {
    await this.checkboxesLink.click();
  }

  // Método para seleccionar el primer checkbox
  async checkFirst() {
    await this.checkboxes.nth(0).check();
  }

  // Método para deseleccionar el segundo checkbox
  async uncheckSecond() {
    await this.checkboxes.nth(1).uncheck();
  }
}