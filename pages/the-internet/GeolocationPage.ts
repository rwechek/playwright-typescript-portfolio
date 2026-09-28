import { Page, Locator } from '@playwright/test';

export class GeolocationPage {
  readonly page: Page;
  readonly whereAmIButton: Locator;
  readonly latCoord: Locator;
  readonly longCoord: Locator;

  constructor(page: Page) {
    this.page = page;
    this.whereAmIButton = page.getByRole('button', { name: 'Where am I?' });
    this.latCoord = page.locator('#lat-value');
    this.longCoord = page.locator('#long-value');
  }

  async goto() {
    await this.page.goto('/geolocation');
  }

  async clickWhereAmI() {
    await this.whereAmIButton.click();
  }
}