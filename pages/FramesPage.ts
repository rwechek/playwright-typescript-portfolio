import { Page, Locator } from "@playwright/test";

export class FramesPage {
  readonly page: Page;
  readonly nestedFrameLink: Locator;
  readonly iFrameLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nestedFrameLink = page.getByRole("link", { name: "Nested Frames" });
    this.iFrameLink = page.getByRole("link", { name: "iFrame" });
  }

  async goto() {
    await this.page.goto("/frames");
  }

  async gotoNested() {
    await this.nestedFrameLink.click();
  }

  async gotoIframe() {
    await this.iFrameLink.click();
  }

  // Localizador para el set de marcos superiores
  private get topFrame() {
    return this.page.frameLocator('frame[name="frame-top"]');
  }

  // Localizador del iFrame mediante su ID
  private get editorFrame() {
    return this.page.frameLocator('#mce_0_ifr');
  }

  // Localizador del cuerpo del editor dentro del iFrame
  get editorBody() {
    return this.editorFrame.locator('#tinymce');
  }

  // Sub-marcos dentro del marco superior
  get leftFrame() {
    return this.topFrame.frameLocator('frame[name="frame-left"]');
  }

  get middleFrame() {
    return this.topFrame.frameLocator('frame[name="frame-middle"]');
  }

  get rightFrame() {
    return this.topFrame.frameLocator('frame[name="frame-right"]');
  }

  // Marco inferior (está al nivel de la página principal, no dentro de top)
  get bottomFrame() {
    return this.page.frameLocator('frame[name="frame-bottom"]');
  }

}
