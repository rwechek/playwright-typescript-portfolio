import { test, expect } from '@playwright/test';
import { FileUploadPage } from '../pages/FileUploadPage';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Pruebas de File Upload', () => {
  let uploadPage: FileUploadPage;
  const testFileName = 'test-upload.txt';
  const testFilePath = path.join(__dirname, testFileName);

  // Creamos un archivo temporal antes de ejecutar la prueba
  test.beforeEach(async ({ page }) => {
    fs.writeFileSync(testFilePath, 'Contenido de prueba para la subida de archivos.');
    uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
  });

  // Borramos el archivo temporal al terminar la prueba para mantener limpio el entorno
  test.afterEach(async () => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  test('Debería subir un archivo correctamente', async () => {
    await uploadPage.uploadFile(testFilePath);
    
    // Validar que aparezca el nombre del archivo en la pantalla de éxito
    await expect(uploadPage.uploadedFilesHeader).toHaveText(testFileName);
  });
});