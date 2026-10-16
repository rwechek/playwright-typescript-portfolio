// ai-agent/ux-accessibility-auditor.ts

import { generateText } from 'ai';
import { z } from 'zod';
import { AI_MODELS } from './config';
import {
  UX_ACCESSIBILITY_AUDITOR_SYSTEM_PROMPT,
  buildUxAuditorUserPrompt,
} from './prompts/ux-accessibility-auditor.prompt';

const UxAuditResultSchema = z.object({
  isCompliant: z.boolean().default(true).describe('Indica si la página cumple con los estándares mínimos de accesibilidad y UX'),
  violationsCount: z.number().default(0).describe('Total de violaciones o anomalías encontradas'),
  violations: z.array(
    z.object({
      element: z.string().default('unknown').describe('Selector o etiqueta HTML del elemento afectado'),
      category: z.enum(['ACCESSIBILITY_WCAG', 'UX_PRACTICE', 'SEMANTIC_HTML', 'ARIA_ISSUE']).default('ACCESSIBILITY_WCAG'),
      severity: z.enum(['CRITICAL', 'MODERATE', 'MINOR']).default('MODERATE'),
      issue: z.string().default('Sin descripción').describe('Descripción del problema detectado'),
      recommendation: z.string().default('Revisar elemento.').describe('Sugerencia de corrección'),
    })
  ).default([]),
  generalAssessment: z.string().default('Auditoría completada con éxito.').describe('Resumen general de la auditoría'),
});

export type UxAuditReport = z.infer<typeof UxAuditResultSchema>;

export interface AuditUxAccessibilityOptions {
  url: string;
  domSnapshot: string;
}

export async function auditUxAccessibility(
  options: AuditUxAccessibilityOptions
): Promise<UxAuditReport> {
  const { url, domSnapshot } = options;
  const userPrompt = buildUxAuditorUserPrompt(url, domSnapshot);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const { text } = await generateText({
      model: AI_MODELS.advanced,
      system: `${UX_ACCESSIBILITY_AUDITOR_SYSTEM_PROMPT}\n\nIMPORTANTE: Debes generar ÚNICAMENTE un JSON válido que coincida con las claves del esquema solicitado. No omitas ningún campo requerido.`,
      prompt: userPrompt,
      abortSignal: controller.signal,
    });

    clearTimeout(timeoutId);

    const cleanedText = text.replace(/```json\s*([\s\S]*?)\s*```/, '$1').replace(/```\s*([\s\S]*?)\s*```/, '$1').trim();
    const parsedJson = JSON.parse(cleanedText);
    const validatedObject = UxAuditResultSchema.parse(parsedJson);

    // Regla de resiliencia
    if (validatedObject.violations.length === 0) {
      validatedObject.isCompliant = true;
      validatedObject.violationsCount = 0;
    }

    return validatedObject;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`[UxAccessibilityAuditor] Timeout de 60s excedido al auditar la URL: ${url}`);
    }
    throw new Error(`[UxAccessibilityAuditor] Falló la auditoría para ${url}: ${error.message}`);
  }
}