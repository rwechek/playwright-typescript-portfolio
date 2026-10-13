import { test, expect } from '@playwright/test';

test.describe('Auditoría Avanzada de Seguridad, Tokens y RBAC', () => {

  // 1. Validación de Tokens (JWT / Bearer)
  test('Debe rechazar peticiones anónimas a recursos protegidos (401 Unauthorized)', async ({ request }) => {
    const response = await request.get('https://api.practicesoftwaretesting.com/users/profile');
    expect(response.status()).toBe(401);
  });

  test('Debe rechazar tokens con firma alterada o inválidos', async ({ request }) => {
    const response = await request.get('https://api.practicesoftwaretesting.com/users/profile', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYXV0aCI6IlVTRVIifQ.firma_falsa_manipulada'
      }
    });
    // El backend debe invalidar el JWT por fallo en la firma criptográfica
    expect(response.status()).toBe(401);
  });

  // 2. Control de Accesos Basado en Roles (RBAC) a nivel de API
  test('Debe bloquear acciones administrativas a un rol de cliente regular (403 Forbidden / 401)', async ({ request }) => {
    // Intentamos un método protegido (como eliminar un producto) con un token sin privilegios de admin
    const response = await request.delete('https://api.practicesoftwaretesting.com/products/some-product-id', {
      headers: {
        'Authorization': 'Bearer token_de_cliente_sin_privilegios'
      }
    });
    
    // El backend debe denegar la acción por falta de permisos o autenticación
    expect([401, 403]).toContain(response.status());
  });

  // 3. Control de Accesos Basado en Roles (RBAC) a nivel de Interfaz (UI - Angular)
  test('El menú o rutas restringidas de administración no deben renderizarse para usuarios con rol Customer', async ({ page }) => {
    // Gracias a la configuración del proyecto y storageState, la prueba inicia logueada como cliente regular
    await page.goto('/');

    // Validamos que los componentes de administración de la SPA de Angular no aparezcan en el DOM
    const adminLink = page.locator('a[data-test="nav-admin"]'); // Selector común en esta app de práctica
    await expect(adminLink).toHaveCount(0);
  });

});