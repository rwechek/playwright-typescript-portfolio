// pages/CheckboxesPage.ts
import { Page, Locator } from '@playwright/test';

export class CheckboxesPage {
  readonly page: Page;
  readonly checkboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkboxes = page.locator('input[type="checkbox"]');
  }

  async goto() {
    await this.page.goto('/checkboxes');
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