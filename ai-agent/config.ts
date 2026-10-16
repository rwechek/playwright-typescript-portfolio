import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';
import path from 'path';

// Aseguramos que dotenv cargue las variables si se ejecuta de forma aislada
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Si tu .env usa GEMINI_API_KEY, la inyectamos para que el SDK la reconozca como GOOGLE_GENERATIVE_AI_API_KEY
if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
}

export const AI_MODELS = {
  // Modelo ultra rápido y eficiente para clasificación de logs y tareas ligeras
  fast: google('gemini-3.5-flash-lite'),
  
  // Usamos temporalmente Flash Lite para respetar el límite de 5 RPM del nivel gratuito en 3.8 Flash
  advanced: google('gemini-3.5-flash-lite'),
  // advanced: google('gemini-3.8-flash'), // Descomentar cuando se active facturación o plan superior
};