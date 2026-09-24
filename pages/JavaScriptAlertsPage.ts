import { Page, Locator } from '@playwright/test';

export class JavaScriptAlertsPage {
  readonly page: Page;
  readonly jsAlertButton: Locator;
  readonly jsConfirmButton: Locator;
  readonly jsPromptButton: Locator;
  readonly resultText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jsAlertButton = page.locator('button[onclick="jsAlert()"]');
    this.jsConfirmButton = page.locator('button[onclick="jsConfirm()"]');
    this.jsPromptButton = page.locator('button[onclick="jsPrompt()"]');
    this.resultText = page.locator('#result');
  }

  async goto() {
    await this.page.goto('/javascript_alerts');
  }

  async clickJsAlert() {
    await this.jsAlertButton.click();
  }

  async clickJsConfirm() {
    await this.jsConfirmButton.click();
  }

  async clickJsPrompt() {
    await this.jsPromptButton.click();
  }
}