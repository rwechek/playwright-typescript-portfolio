import { test, expect } from '@playwright/test';
import { MultipleWindowsPage } from '../pages/MultipleWindowsPage';

test('Debería abrir una nueva ventana y mostrar "New Window"', async ({ page, context }) => {
    const multipleWindowsPage = new MultipleWindowsPage(page);

    // 1. Navegar a la página de multiple windows.
    await multipleWindowsPage.goto();

    // 2. Escuchar el evento y hacer clic al mismo tiempo (Evita condiciones de carrera)
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        multipleWindowsPage.clickMultipleWindowsLink()
    ]);

    // 3. Asegurar que la nueva página haya cargado completamente
    await newPage.waitForLoadState();

    // 4. Validar el texto en la nueva ventana
    await expect(newPage.locator('h3')).toHaveText('New Window');
});
