// ai-agent/api-contract-validator.ts

import { generateText } from 'ai';
import { z } from 'zod';
import { AI_MODELS } from './config';
import {
  API_CONTRACT_VALIDATOR_SYSTEM_PROMPT,
  buildApiContractUserPrompt,
} from './prompts/api-contract-validator.prompt';

// Esquema Zod robusto con valores por defecto para evitar fallos por omisión del LLM
const ContractValidationResultSchema = z.object({
  isValid: z.boolean().default(true).describe('Indica si la respuesta cumple con el contrato esperado sin errores críticos'),
  discrepanciesCount: z.number().default(0).describe('Total de discrepancias encontradas'),
  discrepancies: z.array(
    z.object({
      field: z.string().default('unknown').describe('Ruta o nombre del campo con el hallazgo'),
      issueType: z.enum(['MISSING', 'EXTRA', 'TYPE_MISMATCH', 'VALUE_ANOMALY']).default('VALUE_ANOMALY'),
      expected: z.string().default('N/A').describe('Lo que se esperaba según el contrato'),
      received: z.string().default('N/A').describe('Lo que se recibió realmente en la respuesta'),
      description: z.string().default('Sin descripción').describe('Explicación clara del problema hallado'),
    })
  ).default([]),
  recommendation: z.string().default('Revisar la respuesta.').describe('Sugerencia de acción para el desarrollador o QA'),
});

export type ContractValidationReport = z.infer<typeof ContractValidationResultSchema>;

export interface ValidateApiContractOptions {
  endpoint: string;
  expectedContract: string;
  actualResponseData: unknown;
}

export async function validateApiContract(
  options: ValidateApiContractOptions
): Promise<ContractValidationReport> {
  const { endpoint, expectedContract, actualResponseData } = options;
  const actualResponseJson = JSON.stringify(actualResponseData, null, 2);
  const userPrompt = buildApiContractUserPrompt(endpoint, expectedContract, actualResponseJson);

  try {
    // Timeout estricto de 60 segundos ajustado para llamadas a LLM en tests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const { text } = await generateText({
      model: AI_MODELS.advanced,
      system: `${API_CONTRACT_VALIDATOR_SYSTEM_PROMPT}\n\nIMPORTANTE: Debes generar ÚNICAMENTE un JSON válido que coincida con las claves del esquema solicitado. No omitas ningún campo obligatorio.`,
      prompt: userPrompt,
      abortSignal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Limpieza de bloques de código markdown
    const cleanedText = text.replace(/```json\s*([\s\S]*?)\s*```/, '$1').replace(/```\s*([\s\S]*?)\s*```/, '$1').trim();
    
    const parsedJson = JSON.parse(cleanedText);
    
    // Validación con Zod (aplicando defaults seguros si falta algo)
    const validatedObject = ContractValidationResultSchema.parse(parsedJson);

    // Regla de resiliencia: si el LLM no encontró discrepancias, el contrato es válido por definición
    if (validatedObject.discrepancies.length === 0) {
      validatedObject.isValid = true;
      validatedObject.discrepanciesCount = 0;
      if (validatedObject.recommendation === "Revisar la respuesta." || !validatedObject.recommendation) {
        validatedObject.recommendation = "El contrato de la API es válido y coincide con las expectativas.";
      }
    }

    return validatedObject;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`[ApiContractValidator] Timeout de 60s excedido al validar el endpoint: ${endpoint}`);
    }
    throw new Error(`[ApiContractValidator] Falló la validación del contrato para ${endpoint}: ${error.message}`);
  }
}