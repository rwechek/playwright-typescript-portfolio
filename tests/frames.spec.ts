import { test, expect } from '@playwright/test';
import { FramesPage } from '../pages/FramesPage';

test('Debería interactuar y validar el texto de los diferentes Nested Frames', async ({ page }) => {
    const framesPage = new FramesPage(page);

    // 1. Ir a la página principal de los frames.
    await framesPage.goto();

    // 2. Ir a la página de los nested frames.
    await framesPage.gotoNested();

    // 3. ESPERA CRÍTICA: Asegurar que el frame principal esté adjunto y visible
    // Esto resuelve el error "element(s) not found"
    await expect(page.locator('frame[name="frame-top"]')).toBeVisible();

    // 4. Validar el texto del marco izquierdo (LEFT)
    await expect(framesPage.leftFrame.locator('body')).toHaveText('LEFT');

    // 5. Validar el texto del marco del medio (MIDDLE)
    // Nota: El marco del medio tiene el texto dentro de un div con id "content"
    await expect(framesPage.middleFrame.locator('#content')).toHaveText('MIDDLE');

    // 6. Validar el texto del marco derecho (RIGHT)
    await expect(framesPage.rightFrame.locator('body')).toHaveText('RIGHT');

    // 7. Validar el texto del marco inferior (BOTTOM)
    await expect(framesPage.bottomFrame.locator('body')).toHaveText('BOTTOM')

});

test('Debería leer y validar el texto existente dentro del iFrame', async ({ page }) => {
    const framesPage = new FramesPage(page);

    // 1. Navegar a la página
    await framesPage.goto();

    // 2. Ir a la página del Iframe
    await framesPage.gotoIframe();

    // 3. Validar el texto por defecto sin intentar escribir
    await expect(framesPage.editorBody).toHaveText('Your content goes here.');
});