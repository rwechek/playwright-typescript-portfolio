import { Page, Locator } from "@playwright/test";

export class MultipleWindowsPage {
  readonly page: Page;
  readonly multipleWindowsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.multipleWindowsLink = page.getByRole('link', { name: 'Click Here' });
  }

  async goto() {
    await this.page.goto("/windows");
  }

  async clickMultipleWindowsLink(){
    await this.multipleWindowsLink.click();
  }

}
