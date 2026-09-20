// pages/DynamicLoadingPage.ts
import { Page, Locator } from '@playwright/test';

export class DynamicLoadingPage {
  readonly page: Page;
  readonly dynamicLoadingLink: Locator;
  readonly example1Link: Locator;
  readonly startButton: Locator;
  readonly finishText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dynamicLoadingLink = page.getByRole('link', { name: 'Dynamic Loading' });
    this.example1Link = page.getByRole('link', { name: 'Example 1: Element on page that is hidden' });
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.finishText = page.locator('#finish h4');
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/');
  }

  async navigateToExample1() {
    await this.dynamicLoadingLink.click();
    await this.example1Link.click();
  }

  async startLoading() {
    await this.startButton.click();
  }
}