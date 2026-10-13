import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Directorio donde guardaremos el estado de la sesión autenticada
const AUTH_FILE = path.join(__dirname, '../../.auth/customer.json');

setup('Autenticar vía API y guardar estado', async ({ request }) => {
  // Petición directa al endpoint de autenticación de Practice Software Testing
  const response = await request.post('https://api.practicesoftwaretesting.com/users/login', {
    data: {
      email: process.env.TEST_CUSTOMER_EMAIL,
      password: process.env.TEST_CUSTOMER_PASSWORD,
    },
  });

  expect(response.ok()).toBeTruthy();
  
  // Guardamos el estado de almacenamiento (tokens, cookies, localStorage) automáticamente
  await request.storageState({ path: AUTH_FILE });
});