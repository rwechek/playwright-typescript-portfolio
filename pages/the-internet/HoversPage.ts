import { Page, Locator } from '@playwright/test';

export class HoversPage {
  readonly page: Page;
  readonly figures: Locator;
  readonly userNames: Locator;

  constructor(page: Page) {
    this.page = page;
    // Cada contenedor de usuario en la página de hovers
    this.figures = page.locator('.figure');
    // El texto del nombre que aparece al hacer hover
    this.userNames = page.locator('.figcaption h5');
  }

  async goto() {
    await this.page.goto('/hovers');
  }

  async hoverFigure(index: number) {
    await this.figures.nth(index).hover();
  }

  getUserNameLocator(index: number): Locator {
    return this.userNames.nth(index);
  }
}