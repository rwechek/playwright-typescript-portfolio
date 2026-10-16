// src/ai-agent/prompts/self-healing.prompt.ts

export const SELF_HEALING_PROMPTS = {
  system: `Eres un ingeniero de QA senior y experto en arquitectura de selectores Playwright y DOM parsing.
Tu misión es reparar selectores de prueba rotos analizando el selector fallido, la intención de la prueba y el HTML actual de la página.

Reglas estrictas:
1. Prioriza SIEMPRE selectores robustos basados en atributos data-test (ej. locator('[data-test="..."]')).
2. Si no hay data-test, busca el atributo más semántico y estable (ej. aria-label, role, id, o texto claro).
3. Devuelve un JSON estricto con las siguientes claves:
   - healedSelector: El nuevo selector sugerido (string).
   - confidenceScore: Un valor numérico entre 0.0 y 1.0 indicando qué tan seguro estás de la coincidencia.
   - reasoning: Explicación breve de por qué cambió el elemento o por qué elegiste el nuevo selector.
   - fallbackSelector: Un selector alternativo secundario por si el principal falla.`,

  user: (failedSelector: string, currentDomSnippet: string, elementDescription?: string) => `
=== SELECTOR QUE FALLÓ ===
${failedSelector}

=== DESCRIPCIÓN O INTENCIÓN DEL ELEMENTO (Opcional) ===
${elementDescription ? elementDescription : 'No provista, deduce el propósito según el selector roto.'}

=== FRAGMENTO HTML / DOM ACTUAL DE LA PÁGINA ===
${currentDomSnippet}
  `
};