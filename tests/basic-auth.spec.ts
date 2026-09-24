import { test, expect } from "@playwright/test";
import { BasicAuthPage } from "../pages/BasicAuthPage";

test("Debería autenticarse exitosamente con Basic Auth", async ({ page }) => {
  const basicAuthPage = new BasicAuthPage(page);

  // 1. Ir a la página con credenciales integradas
  await basicAuthPage.goto();

  // 2. Aserción: Verificar que el mensaje de éxito contenga el texto esperado
  const successMessage = await basicAuthPage.getSuccessMessage();
  await expect(successMessage).toContainText("Congratulations! You must have the proper credentials.");
});