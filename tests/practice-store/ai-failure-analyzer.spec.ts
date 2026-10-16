import { test, expect } from '@playwright/test';
import { analyzeTestFailure } from '../../ai-agent/failure-analyzer';

// tests/practice-store/ai-failure-analyzer.spec.ts

test.describe('AI Agent - Test Failure Analyzer (Modular & Contextual)', () => {
  test('debe analizar un log de CI/CD junto con el fragmento de código y sugerir el parche @ci', async () => {
    
    // 1. Simulamos el log de error real de GitHub Actions
    const mockCIErrorLog = `
      1) [practice-store-chromium] › tests/practice-store/checkout-flow.spec.ts:32:7 › Flow › Checkout
      Error: expect(locator).toBeVisible() failed

      Locator: locator('[data-test="payment-success-message"]')
      Expected: visible
      Timeout: 15000ms
      Error: element(s) not found

      Call log:
        - Expect "toBeVisible" locator('[data-test="payment-success-message"]') with timeout 15000ms
        - waiting for locator('[data-test="payment-success-message"]')
           at ../pages/practice-store/CheckoutPage.ts:131
    `;

    // 2. Simulamos el código fuente de la clase o Page Object involucrado
    const mockSourceCode = `
      // ../pages/practice-store/CheckoutPage.ts
      async verifyOrderSuccess() {
        // Línea 131: Intentamos validar un mensaje que a veces demora en renderizarse
        await expect(this.page.locator('[data-test="payment-success-message"]')).toBeVisible();
      }
    `;

    // 3. Invocamos al analizador pasando ambos contextos
    const analysis = await analyzeTestFailure(mockCIErrorLog, mockSourceCode);

    // 4. Mostramos el resultado detallado en consola
    console.log('\n========================================');
    console.log('⚡ [AI AGENT REPORT] Diagnóstico con Código Fuente:');
    console.log(`• Causa Raíz: ${analysis.summary}`);
    console.log(`• Categoría: ${analysis.category}`);
    console.log(`• Referencia de Archivo: ${analysis.fileReference}`);
    console.log(`• Solución Sugerida:\n${analysis.suggestedFix}`);
    console.log('========================================\n');

    // 5. Aserciones robustas
    expect(analysis).toBeDefined();
    expect(['ASSERTION_ERROR', 'NETWORK_TIMEOUT']).toContain(analysis.category);
    expect(analysis.fileReference).toBeTruthy();
    expect(analysis.suggestedFix).toBeTruthy();
  });
});