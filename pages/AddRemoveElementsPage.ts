import { Page, Locator } from "@playwright/test";

export class AddRemoveElementsPage {
  readonly page: Page;
  readonly Addbutton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Addbutton = page.getByRole("button", { name: "Add Element" });
  }

  async goto() {
    await this.page.goto("/add_remove_elements/");
  }

  async add() {
    await this.Addbutton.click();
  }

  async removeAll(contentButtons) {
    const initialAmount = await contentButtons.count();
    for (let i = 0; i < initialAmount; i++) {
      // Siempre hacemos clic en .first() porque al borrar uno, el siguiente pasa a ser el primero
      await contentButtons.first().click();
    }
  }
}
