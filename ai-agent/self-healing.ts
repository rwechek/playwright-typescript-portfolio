// src/ai-agent/self-healing.ts

import { generateText, LanguageModel } from 'ai';
import { AI_MODELS } from './config';
import { SELF_HEALING_PROMPTS } from './prompts/self-healing.prompt';

export interface HealedSelectorResult {
  healedSelector: string;
  confidenceScore: number;
  reasoning: string;
  fallbackSelector?: string;
}

/**
 * Agente de Auto-Curación que repara selectores rotos comparándolos 
 * con el DOM actual en tiempo de ejecución.
 */
export async function healSelector(
  failedSelector: string,
  currentDomSnippet: string,
  elementDescription?: string,
  model: LanguageModel = AI_MODELS.fast
): Promise<HealedSelectorResult> {
  console.log(`⚡ [SelfHealingAgent] Buscando nuevo selector para: "${failedSelector}"...`);

  const result = await generateText({
    model,
    system: SELF_HEALING_PROMPTS.system,
    prompt: SELF_HEALING_PROMPTS.user(failedSelector, currentDomSnippet, elementDescription)
  });

  const cleanedText = result.text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanedText) as HealedSelectorResult;
  } catch {
    return {
      healedSelector: failedSelector,
      confidenceScore: 0,
      reasoning: "Error al parsear la respuesta estructurada del modelo.",
      fallbackSelector: failedSelector
    };
  }
}