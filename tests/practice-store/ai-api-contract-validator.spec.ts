// tests/practice-store/ai-api-contract-validator.spec.ts

import { test, expect } from '@playwright/test';
import { validateApiContract } from '../../ai-agent/api-contract-validator';

test.describe('Agente IA: API Contract Validator @ci', () => {
  
  test('Debe validar el contrato del endpoint de productos de la tienda de práctica', async ({ request }) => {
    // Ampliamos el timeout de Playwright a 90s para margen de seguridad en CI/CD
    test.setTimeout(90000);

    // 1. Petición HTTP al endpoint original de Practice Software Testing
    const endpointUrl = 'https://api.practicesoftwaretesting.com/products?page=1';
    console.log(`[Test] Realizando petición GET a: ${endpointUrl}`);
    
    const response = await request.get(endpointUrl);
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();

    // 2. Definimos el contrato esperado completo y detallado para entornos de CI/CD
    const expectedContract = `
      Estructura esperada del JSON para la paginación de productos:
      - current_page: number (página actual)
      - data: Array de objetos de productos. Cada producto DEBE contener obligatoriamente:
        - id: string (identificador único)
        - name: string (nombre del producto)
        - description: string (descripción detallada)
        - price: number (precio del producto)
        - in_stock: boolean (estado de disponibilidad)
        - is_location_offer: boolean
        - is_rental: boolean
        - co2_rating: string
        - is_eco_friendly: boolean
        - product_image: object (detalles de la imagen)
        - category: object (detalles de la categoría)
        - brand: object (detalles de la marca)
      - per_page: number (elementos por página)
      - total: number (total de elementos en el servidor)
      - from: number (índice inicial del bloque)
      - to: number (índice final del bloque)
      - last_page: number (última página disponible)
    `;

    // 3. Ejecutamos el agente validador
    const report = await validateApiContract({
      endpoint: endpointUrl,
      expectedContract,
      actualResponseData: responseBody,
    });

    // 4. Imprimimos el reporte detallado en la consola (visible en GitHub Actions)
    console.log('--- REPORTE DE CONTRATO DE API (GEMINI AI) ---');
    console.log(JSON.stringify(report, null, 2));

    // 5. Aseveraciones de Playwright
    expect(report).toBeDefined();
    expect(typeof report.isValid).toBe('boolean');
    expect(report.isValid, `El contrato falló: ${report.recommendation}`).toBeTruthy();
  });

});