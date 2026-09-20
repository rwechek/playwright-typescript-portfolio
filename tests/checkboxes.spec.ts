// tests/checkboxes.spec.ts
import { test, expect } from '@playwright/test';
import { CheckboxesPage } from '../pages/CheckboxesPage';

test('Debería validar y modificar el estado de los checkboxes', async ({ page }) => {
  const checkboxesPage = new CheckboxesPage(page);

  // 1. Navegar al inicio y entrar a la sección de Checkboxes
  await checkboxesPage.goto();
  await checkboxesPage.clickCheckboxesLink();

  await expect(page).toHaveURL(/.*checkboxes/);

  // 2. Estado inicial por defecto en the-internet:
  // Checkbox 1 está desmarcado (false), Checkbox 2 está marcado (true)
  const firstCheckbox = checkboxesPage.checkboxes.nth(0);
  const secondCheckbox = checkboxesPage.checkboxes.nth(1);

  await expect(firstCheckbox).not.toBeChecked();
  await expect(secondCheckbox).toBeChecked();

  // 3. Modificar estados
  await checkboxesPage.checkFirst();
  await checkboxesPage.uncheckSecond();

  // 4. Validar nuevos estados
  await expect(firstCheckbox).toBeChecked();
  await expect(secondCheckbox).not.toBeChecked();
});