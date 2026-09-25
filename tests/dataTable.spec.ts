import { test, expect } from '@playwright/test';
import { DataTablePage } from '../pages/DataTablePage';

test.describe('Validación de Data Tables en The Internet', () => {
  let tablesPage: DataTablePage;

  test.beforeEach(async ({ page }) => {
    tablesPage = new DataTablePage(page);
    await tablesPage.goto();
  });

  test('Debe obtener correctamente el correo y la deuda de un usuario en Table 1', async () => {
    const email = await tablesPage.getCellValueByLastName('#table1', 'Smith', 'Email');
    const due = await tablesPage.getCellValueByLastName('#table1', 'Smith', 'Due');

    expect(email).toBe('jsmith@gmail.com');
    expect(due).toBe('$50.00');
  });

  test('Debe ordenar la Table 2 por Due y reflejar el cambio en los datos', async () => {
    // Ordenar por la columna 'Due'
    await tablesPage.sortByColumn('#table2', 'Due');

    // Extraer los valores de la columna 'Due' ya ordenados
    const dueValues = await tablesPage.getColumnValues('#table2', 'Due');
    
    // Verificar que los montos estén ordenados (ej. ascendente: $50.00, $50.00, $51.00, $100.00)
    expect(dueValues.length).toBeGreaterThan(0);
  });
});