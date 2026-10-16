// src/ai-agent/failure-analyzer.ts

import { generateText, LanguageModel } from 'ai';
import { AI_MODELS } from './config';
import { FAILURE_ANALYZER_PROMPTS } from './prompts/failure-analyzer.prompt';

/**
 * Analiza un log de error de Playwright junto con el código fuente afectado 
 * utilizando el modelo rápido (Gemini 3.5 Flash Lite).
 */
export async function analyzeTestFailure(
  errorLog: string, 
  sourceCode?: string, 
  model: LanguageModel = AI_MODELS.fast
) {
  console.log(`⚡ [FailureAnalyzer] Analizando log y código fuente con Gemini 3.5 Flash Lite...`);

  const result = await generateText({
    model,
    system: FAILURE_ANALYZER_PROMPTS.system,
    prompt: FAILURE_ANALYZER_PROMPTS.user(errorLog, sourceCode)
  });

  const cleanedText = result.text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    return {
      summary: "No se pudo parsear el JSON estructurado devuelto por el modelo.",
      category: "UNKNOWN",
      fileReference: "Desconocida",
      suggestedFix: result.text
    };
  }
}