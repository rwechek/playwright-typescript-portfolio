import { test, expect } from '@playwright/test';
import { HoversPage } from '../pages/HoversPage';

test.describe('Pruebas de Hovers', () => {
  let hoversPage: HoversPage;

  test.beforeEach(async ({ page }) => {
    hoversPage = new HoversPage(page);
    await hoversPage.goto();
  });

  test('Debería mostrar la información de todos los usuarios al pasar el cursor', async () => {
    const expectedUsers = [
      { index: 0, name: 'name: user1' },
      { index: 1, name: 'name: user2' },
      { index: 2, name: 'name: user3' },
    ];

    for (const user of expectedUsers) {
      // Hacer hover en cada figura según su índice
      await hoversPage.hoverFigure(user.index);
      
      // Obtener el localizador del nombre y validar
      const userName = hoversPage.getUserNameLocator(user.index);
      await expect(userName).toBeVisible();
      await expect(userName).toHaveText(user.name);
    }
  });
});