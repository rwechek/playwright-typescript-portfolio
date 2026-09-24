import { test, expect } from '@playwright/test';
import { DropdownPage } from '../pages/DropdownPage';

test('Debería dar clic a la opcion 1', async ({ page }) => {

    const dropdownPage = new DropdownPage(page);

     // 1. Ir a la pagina
     await dropdownPage.goto();

     // 2. Hacer click opcion 1
     await dropdownPage.clickOpt('Option 1');

     await expect(dropdownPage.dropdown).toHaveValue('1');

     await page.screenshot({ path: `test-results/dropdown/dropdownOpt1.png` });

});

test('Debería dar clic a la opcion 2', async ({ page }) => {

    const dropdownPage = new DropdownPage(page);

     // 1. Ir a la pagina
     await dropdownPage.goto();

     // 2. Hacer click opcion 2
     await dropdownPage.clickOpt('Option 2');

     await expect(dropdownPage.dropdown).toHaveValue('2');

     await page.screenshot({ path: `test-results/dropdown/dropdownOpt2.png` });

});