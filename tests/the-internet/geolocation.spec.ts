import { test, expect } from '@playwright/test';
import { GeolocationPage } from '../../pages/GeolocationPage';

test.describe('Validación de Geolocation en herokuapp', () => {
  
  test('Debe simular coordenadas geográficas y reflejarlas en la interfaz', async ({ page, context }) => {
    // 1. Otorgar permisos de geolocalización al contexto de prueba
    await context.grantPermissions(['geolocation']);

    // 2. Establecer coordenadas geográficas falsas (ej. latitud y longitud específicas)
    await context.setGeolocation({ latitude: 19.4326, longitude: -99.1332 });

    const geolocationPage = new GeolocationPage(page);
    await geolocationPage.goto();

    // 3. Hacer clic en el botón de la página
    await geolocationPage.clickWhereAmI();

    // 4. Validar mediante Web-First Assertions que los valores coincidan con los inyectados
    await expect(geolocationPage.latCoord).toHaveText('19.4326');
    await expect(geolocationPage.longCoord).toHaveText('-99.1332');
  });
});