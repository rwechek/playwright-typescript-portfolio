// ai-agent/helpers/contract-test.helper.ts
import { Page } from '@playwright/test';
import { validateApiContract, ContractValidationReport } from '../api-contract-validator';

/**
 * Intercepta una llamada API específica durante la navegación de Playwright y valida su contrato.
 */
export async function assertApiContract(
  page: Page,
  urlPattern: string | RegExp,
  expectedContract: string
): Promise<ContractValidationReport> {
  // Esperar a que ocurra la respuesta de red que coincida con el patrón
  const response = await page.waitForResponse(urlPattern);
  const responseJson = await response.json().catch(() => null);

  if (!responseJson) {
    throw new Error(`[assertApiContract] Could not parse JSON response from intercepted URL: ${response.url()}`);
  }

  // Ejecutar el agente validador
  const report = await validateApiContract({
    endpoint: response.url(),
    expectedContract,
    actualResponseData: responseJson,
  });

  return report;
}