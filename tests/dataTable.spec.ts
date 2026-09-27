import { test, expect } from "@playwright/test";
import { DataTablePage } from "../pages/DataTablePage";

test.describe("Validación de Data Tables en The Internet", () => {
  let tablesPage: DataTablePage;

  test.beforeEach(async ({ page }) => {
    tablesPage = new DataTablePage(page);
    await tablesPage.goto();
  });

  test("Debe obtener correctamente el correo y la deuda de un usuario en Table 1", async () => {
    const email = await tablesPage.getCellValueByLastName(
      "#table1",
      "Smith",
      "Email",
    );
    const due = await tablesPage.getCellValueByLastName(
      "#table1",
      "Smith",
      "Due",
    );

    expect(email).toBe("jsmith@gmail.com");
    expect(due).toBe("$50.00");
  });

  test("Debe ordenar la Table 2 por Due y reflejar el cambio en los datos", async () => {
    // Ordenar por la columna 'Due'
    await tablesPage.sortByColumn("#table2", "Due");

    // Extraer los valores de la columna 'Due' ya ordenados
    const dueValues = await tablesPage.getColumnValues("#table2", "Due");

    // Verificar que los montos estén ordenados (ej. ascendente: $50.00, $50.00, $51.00, $100.00)
    expect(dueValues.length).toBeGreaterThan(0);
  });

  test("Debe ordenar la Table 2 por la columna Last Name y reflejar el cambio en el orden de los datos a dos clic", async () => {
    //. Ordena ascendente.
    const arrayLastName: string[] = ["Smith", "Bach", "Doe", "Conway"].sort(
      (a, b) => (a > b ? 1 : -1),
    );

    //. Ordena descendente.
    const arrayLastNameDesc: string[] = [...arrayLastName].sort((a, b) =>
      a > b ? -1 : 1,
    );

    // Primer y segundo clic.
    await tablesPage.sortByColumn("#table2", "Last Name"); // Primer click
    await tablesPage.sortByColumn("#table2", "Last Name"); // Segundo click

    //. Extraer los valores de la columna 'Last Name' ya ordenados
    const lastNameValues = await tablesPage.getColumnValues(
      "#table2",
      "Last Name",
    );

    //. Debe concidir
    await expect(lastNameValues).toEqual(
      expect.arrayContaining(arrayLastNameDesc),
    );
  });

  test("Debería activar la acción Editar para editar a Frank Bach después de ordenar la tabla por Last Name", async ({
    page,
  }) => {
    // 1. Hacer clic en la cabecera "Last Name" para ordenar la tabla
    await tablesPage.sortByColumn("#table1", "Last Name");

    // 2. Ubicar la fila de "Frank Smith" en la Tabla 1
    const filaUsuario = page.locator("#table1 tbody tr", {
      hasText: "fbach@yahoo.com",
    });

    // 3. Hacer clic en el enlace "edit" dentro de esa fila específica
    await filaUsuario.getByRole("link", { name: "edit" }).click();

    // 4. Aserción: El sitio web de ejemplo reacciona cambiando la URL a '#edit'
    await expect(page).toHaveURL(/.*#edit/);
  });

  test("Debería activar la acción Eliminar para eliminar a Jason Doe después de ordenar la tabla por Last Name", async ({
    page,
  }) => {
    // 1. Hacer clic en la cabecera "Last Name" para ordenar la tabla
    await tablesPage.sortByColumn("#table1", "Last Name");

    // 2. Ubicar la fila de "Jason Doe" en la Tabla 1
    const filaUsuario = page.locator("#table1 tbody tr", {
      hasText: "jdoe@hotmail.com",
    });

    // 2. Hacer clic en el enlace "delete" dentro de esa fila específica
    await filaUsuario.getByRole("link", { name: "delete" }).click();

    // 3. Aserción: El sitio web de ejemplo reacciona cambiando la URL a '#delete'
    await expect(page).toHaveURL(/.*#delete/);
  });

  test("Debería poder sumar todos los valores asociados a la columna Due", async ({
  }) => {
    const dueValues = await tablesPage.getColumnValues("#table1", "Due");

    // 1. Limpiar el signo $ y convertir CADA texto en un número decimal (float)
    const dueNumbers = dueValues.map((dueText) => {
      const cleanText = dueText.replace(/\$/, "").trim();
      return parseFloat(cleanText); // Transforma "50.00" en el número 50
    });

    // 2. Sumar todos los números del array usando .reduce()
    const totalSuma = dueNumbers.reduce(
      (acumulado, valorActual) => acumulado + valorActual,
      0,
    );

    // 3. (Opcional) Si quieres formatear el resultado de vuelta a dos decimales
    const totalFormateado = totalSuma.toFixed(2);

    expect(totalSuma).toBeCloseTo(251.00, 2);

  });
});
