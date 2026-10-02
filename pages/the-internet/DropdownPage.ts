import { Page, Locator } from "@playwright/test";

export class DropdownPage {
  readonly page: Page;
  readonly dropdown: Locator;
  readonly finishText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdown = page.locator("#dropdown");
    this.finishText = page.locator('#dropdown option:checked');
  }

  async goto() {
    await this.page.goto("/dropdown", {
      waitUntil: "domcontentloaded",
      timeout: 60000, // Opcional: darle un respiro de 60s solo a la navegación inicial
    });
  }

  async clickOpt(text: string) {
    await this.dropdown.selectOption({ label: text });
  }
}
