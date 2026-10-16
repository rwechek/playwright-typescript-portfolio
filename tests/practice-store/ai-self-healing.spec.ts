// tests/practice-store/ai-self-healing.spec.ts

import { test, expect } from '@playwright/test';
import { healSelector } from '../../ai-agent/self-healing';

test.describe('AI Agent - Self-Healing Selector Engine @ci', () => {
  test('debe curar un selector roto detectando la migración de un atributo data-test', async () => {
    
    // 1. Selector antiguo que solía funcionar en la versión previa del código
    const failedSelector = '[data-test="checkout-btn"]';
    
    // 2. Fragmento del nuevo DOM renderizado donde el equipo de frontend renombró el atributo
    const newDomSnippet = `
      <div class="checkout-container">
        <h3>Resumen de Compra</h3>
        <p>Total: $150.00</p>
        <button class="btn btn-primary btn-lg" data-test="btn-complete-purchase" type="submit">
          Finalizar Pedido
        </button>
      </div>
    `;

    // 3. Ejecutamos el motor de auto-curación
    const result = await healSelector(
      failedSelector, 
      newDomSnippet, 
      "Botón principal para enviar y pagar la compra en la pantalla de checkout"
    );

    // 4. Imprimimos el informe en consola
    console.log('\n========================================');
    console.log('⚡ [SELF-HEALING REPORT]:');
    console.log(`• Selector Roto Original: ${failedSelector}`);
    console.log(`• Nuevo Selector Curado:  ${result.healedSelector}`);
    console.log(`• Nivel de Confianza:    ${(result.confidenceScore * 100).toFixed(0)}%`);
    console.log(`• Selector Secundario:   ${result.fallbackSelector || 'N/A'}`);
    console.log(`• Justificación:         ${result.reasoning}`);
    console.log('========================================\n');

    // 5. Aserciones
    expect(result.healedSelector).toContain('btn-complete-purchase');
    expect(result.confidenceScore).toBeGreaterThan(0.7);
  });
});