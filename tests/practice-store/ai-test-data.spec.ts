// tests/practice-store/ai-test-data.spec.ts

import { test, expect } from '@playwright/test';
import { generateTestData } from '../../ai-agent/test-data-generator';

interface CustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

test.describe('AI Agent - Test Data & Fixture Generator @ci', () => {
  test('debe generar un payload de cliente válido para la prueba de checkout', async () => {
    test.setTimeout(60000); // 60s por latencia esperada del LLM
    
    // 1. Solicitamos al agente datos sintéticos estructurados especificando el contrato JSON esperado
    const customerData = await generateTestData<CustomerPayload>(
      'Cliente para pasarela de comercio electrónico',
      1,
      'Debe incluir: firstName, lastName, email (con dominio @testqa.com), un objeto address con (street, city: "Madrid", state, zipCode), y paymentMethod.'
    );

    // 2. Imprimimos el resultado en consola para verificar
    console.log('\n========================================');
    console.log('⚡ [TEST DATA REPORT]:');
    console.log(JSON.stringify(customerData, null, 2));
    console.log('========================================\n');

    // 3. Aserciones de validación
    expect(customerData).toBeDefined();
    expect(customerData.email).toContain('@testqa.com');
    expect(customerData.address.city).toBe('Madrid');
    expect(customerData.paymentMethod).toBeTruthy();
  });
});