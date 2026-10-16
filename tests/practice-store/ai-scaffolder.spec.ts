// Ejemplo de tu archivo de pruebas (ahora totalmente compatible)
import { test, expect } from '@playwright/test';
import { generateContextualTest } from '../../ai-agent/test-scaffolder';

test.describe('AI Agent - Contextual Test Scaffolder @ci', () => {
  test('debe inspeccionar el DOM y generar un test de Playwright basado en la historia de usuario', async () => {
    const targetUrl = 'https://practicesoftwaretesting.com/#/';
    const userStory = 'El usuario debe poder visualizar la lista de productos en la página principal de la tienda';

    const result = await generateContextualTest(targetUrl, userStory);

    console.log('\n========================================');
    console.log('🤖 [AI AGENT REPORT] Test Generado:');
    console.log(`• Nombre: ${result.testName}`);
    console.log(`• URL Objetivo: ${result.targetUrl}`);
    console.log('\n--- Código Playwright Sugerido ---\n');
    console.log(result.playwrightCode);
    console.log('========================================\n');

    expect(result).toBeDefined();
    expect(result.playwrightCode).toBeTruthy();
    expect(result.playwrightCode.length).toBeGreaterThan(30);
  });
});