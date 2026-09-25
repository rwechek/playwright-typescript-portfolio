import { Page, Locator } from "@playwright/test";

export class DataTablePage {
  readonly page: Page;
  readonly table1: Locator;
  readonly table2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table1 = page.locator("#table1");
    this.table2 = page.locator("#table2");
  }

  async goto() {
    await this.page.goto("/tables");
  }

  /**
   * Obtiene el valor de una celda específica buscando por el Apellido (Last Name)
   * en la tabla seleccionada (#table1 o #table2).
   */
  async getCellValueByLastName(
    tableSelector: "#table1" | "#table2",
    lastName: string,
    columnName:
      | "Last Name"
      | "First Name"
      | "Email"
      | "Due"
      | "Web Site"
      | "Action",
  ): Promise<string> {
    const table = this.page.locator(tableSelector);

    // Obtener las cabeceras para encontrar el índice de la columna objetivo
    const headers = await table.locator("thead tr th").allTextContents();
    const colIndex = headers.findIndex(
      (header) => header.trim() === columnName,
    );

    if (colIndex === -1) {
      throw new Error(
        `La columna '${columnName}' no fue encontrada en la tabla.`,
      );
    }

    // Iterar sobre las filas del cuerpo de la tabla
    const rows = table.locator("tbody tr");
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator("td");
      const rowLastName = await cells.nth(0).textContent();

      if (rowLastName?.trim() === lastName) {
        return (await cells.nth(colIndex).textContent())?.trim() || "";
      }
    }

    throw new Error(
      `No se encontró el registro con el apellido '${lastName}'.`,
    );
  }

  /**
   * Hace clic en una cabecera para ordenar la tabla.
   */
  async sortByColumn(
    tableSelector: "#table1" | "#table2",
    columnName: "Last Name" | "First Name" | "Email" | "Due" | "Web Site",
  ): Promise<void> {
    const table = this.page.locator(tableSelector);
    const header = table.locator("thead tr th", { hasText: columnName });
    await header.click();
  }

  /**
   * Obtiene todos los valores de una columna específica como un arreglo.
   */
  async getColumnValues(
    tableSelector: "#table1" | "#table2",
    columnName: "Last Name" | "First Name" | "Email" | "Due" | "Web Site",
  ): Promise<string[]> {
    const table = this.page.locator(tableSelector);
    const headers = await table.locator("thead tr th").allTextContents();
    const colIndex = headers.findIndex(
      (header) => header.trim() === columnName,
    );

    if (colIndex === -1) {
      throw new Error(`La columna '${columnName}' no fue encontrada.`);
    }

    const rows = table.locator("tbody tr");
    const values: string[] = [];
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const cellText = await rows
        .nth(i)
        .locator("td")
        .nth(colIndex)
        .textContent();
      if (cellText) {
        values.push(cellText.trim());
      }
    }

    return values;
  }
}
