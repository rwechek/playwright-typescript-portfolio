// src/ai-agent/test-scaffolder.ts

import { generateText, LanguageModel } from 'ai';
import { z } from 'zod';
import { AI_MODELS } from './config';
import { TEST_SCAFFOLDER_PROMPTS } from './prompts/test-scaffolder.prompt';

// Esquema Zod para asegurar que el agente devuelva la estructura esperada por el test
const ScaffolderResponseSchema = z.object({
  testName: z.string().describe('Nombre descriptivo para la prueba de Playwright'),
  targetUrl: z.string().describe('URL objetivo analizada'),
  playwrightCode: z.string().describe('Código fuente ejecutable de Playwright en TypeScript'),
});

export type ScaffolderResult = z.infer<typeof ScaffolderResponseSchema>;

/**
 * Genera un script de prueba E2E estructurado en Playwright y TypeScript a partir de un requerimiento,
 * utilizando Gemini (por defecto AI_MODELS.advanced).
 */
export async function generateContextualTest(
  targetUrl: string,
  requirement: string,
  domSnippet?: string,
  model: LanguageModel = AI_MODELS.advanced
): Promise<ScaffolderResult> {
  console.log(`⚡ [TestScaffolder] Generando código de prueba estructurado con Gemini...`);

  const systemPrompt = `
    ${TEST_SCAFFOLDER_PROMPTS.system}
    IMPORTANTE: Debes responder ÚNICAMENTE con un objeto JSON válido que contenga las siguientes claves exactas:
    - "testName": string
    - "targetUrl": string
    - "playwrightCode": string (código puro de Playwright en TypeScript, sin bloques markdown de etiquetas si es posible dentro del string)
  `;

  const userPrompt = `
    URL Objetivo: ${targetUrl}
    Requerimiento / Historia de Usuario: ${requirement}
    ${domSnippet ? `Fragmento DOM de apoyo:\n${domSnippet}` : ''}
  `;

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
  });

  // Limpiamos posibles bloques de código markdown envolventes
  const cleanedText = text.replace(/```json\s*([\s\S]*?)\s*```/, '$1').replace(/```\s*([\s\S]*?)\s*```/, '$1').trim();
  
  const parsedJson = JSON.parse(cleanedText);
  const validatedResult = ScaffolderResponseSchema.parse(parsedJson);

  return validatedResult;
}