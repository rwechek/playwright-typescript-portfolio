import { Page, Locator } from '@playwright/test';

export class FileUploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedFilesHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    // El input oculto o nativo donde se selecciona el archivo
    this.fileInput = page.locator('#file-upload');
    this.uploadButton = page.locator('#file-submit');
    this.uploadedFilesHeader = page.locator('#uploaded-files');
  }

  async goto() {
    await this.page.goto('/upload', {
      waitUntil: "domcontentloaded",
      timeout: 60000, // Opcional: darle un respiro de 60s solo a la navegación inicial
    });
  }

  async uploadFile(filePath: string) {
    // Playwright maneja la subida asignando la ruta del archivo directamente al input
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }
}