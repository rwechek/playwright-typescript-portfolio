// src/ai-agent/test-data-generator.ts

import { generateText, LanguageModel } from 'ai';
import { AI_MODELS } from './config';
import { TEST_DATA_GENERATOR_PROMPTS } from './prompts/test-data-generator.prompt';

/**
 * Genera datos de prueba dinámicos y fixtures estructurados en JSON 
 * utilizando Gemini 3.8 Flash y prompts desacoplados.
 */
export async function generateTestData<T = any>(
  entityType: string,
  count: number = 1,
  constraints?: string,
  model: LanguageModel = AI_MODELS.advanced
): Promise<T> {
  console.log(`⚡ [TestDataGenerator] Generando datos estructurados para "${entityType}" con Gemini 3.8 Flash...`);

  const result = await generateText({
    model,
    system: TEST_DATA_GENERATOR_PROMPTS.system,
    prompt: TEST_DATA_GENERATOR_PROMPTS.user(entityType, count, constraints)
  });

  const cleanedText = result.text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleanedText) as T;
  } catch (error) {
    throw new Error(`[TestDataGenerator] No se pudo parsear la respuesta a JSON válido:\n${result.text}`);
  }
}