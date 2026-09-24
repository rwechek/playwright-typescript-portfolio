// pages/DynamicLoadingPage.ts
import { Page, Locator } from '@playwright/test';

export class DynamicLoadingPage {
  readonly page: Page;
  readonly dynamicloading: Locator;
  readonly example1Link: Locator;
  readonly example2Link: Locator;
  readonly startButton: Locator;
  readonly finishText: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.example1Link = page.getByRole('link', { name: 'Example 1: Element on page that is hidden' });
    this.example2Link = page.getByRole('link', { name: 'Example 2: Element rendered after the fact' });
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.finishText = page.locator('#finish h4');
  }

  async goto() {
    await this.page.goto('/dynamic_loading');
  }

  async navigateToExample1() {
    await this.example1Link.click();
  }

  async navigateToExample2() {
    await this.example2Link.click();
  }

  async startLoading() {
    await this.startButton.click();
  }
}