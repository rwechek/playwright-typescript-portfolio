// tests/practice-store/ai-ux-accessibility-auditor.spec.ts

import { test, expect } from '@playwright/test';
import { auditUxAccessibility } from '../../ai-agent/ux-accessibility-auditor';

test.describe('Agente IA: UX & Accessibility Auditor @ci', () => {
  
  test('Debe auditar la accesibilidad y UX de la página principal de la tienda', async ({ page }) => {
    // Timeout ampliado a 90s para el análisis del LLM
    test.setTimeout(90000);

    const targetUrl = 'https://practicesoftwaretesting.com/#/';
    console.log(`[Test] Navegando a: ${targetUrl}`);
    
    await page.goto(targetUrl);
    // Esperamos a que cargue la lista de productos principal
    await page.waitForSelector('.card', { timeout: 15000 }).catch(() => {});

    // Extraemos el contenido relevante del DOM o el cuerpo de la página
    const domSnapshot = await page.evaluate(() => {
      // Limpiamos scripts y estilos para enviar un DOM enfocado en semántica y UI
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('script, style, noscript').forEach(el => el.remove());
      return clone.innerHTML.substring(0, 15000); // Limitamos tamaño de tokens si es muy extenso
    });

    console.log(`[Test] Ejecutando auditoría de UX y Accesibilidad con Gemini...`);

    // Ejecutamos el agente auditor
    const report = await auditUxAccessibility({
      url: targetUrl,
      domSnapshot,
    });

    // Reporte detallado en consola
    console.log('--- REPORTE DE AUDITORÍA UX Y ACCESIBILIDAD (GEMINI AI) ---');
    console.log(JSON.stringify(report, null, 2));

    // Aseveraciones de Playwright
    expect(report).toBeDefined();
    expect(typeof report.isCompliant).toBe('boolean');
    expect(typeof report.violationsCount).toBe('number');

    if (!report.isCompliant) {
      console.warn(`⚠️ Se detectaron ${report.violationsCount} violaciones de accesibilidad/UX.`);
      report.violations.forEach((v, index) => {
        console.warn(`  [${index + 1}] Elemento: ${v.element} | Severidad: ${v.severity} | Categoría: ${v.category}`);
        console.warn(`      Problema: ${v.issue}`);
        console.warn(`      Sugerencia: ${v.recommendation}`);
      });
    }
  });

});