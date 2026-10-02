import { Page, Locator } from "@playwright/test";

export class MultipleWindowsPage {
  readonly page: Page;
  readonly multipleWindowsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.multipleWindowsLink = page.getByRole('link', { name: 'Click Here' });
  }

  async goto() {
    await this.page.goto("/windows", {
      waitUntil: "domcontentloaded",
      timeout: 60000, // Opcional: darle un respiro de 60s solo a la navegación inicial
    });
  }

  async clickMultipleWindowsLink(){
    await this.multipleWindowsLink.click();
  }

}
