import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { CheckoutPage } from "../../pages/saucedemo/CheckoutPage";
import { InventoryPage } from "../../pages/saucedemo/InventoryPage";

test.describe("Pruebas del checkout del Inventario en SauceDemo", () => {
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    inventoryPage = new InventoryPage(page);

    // Iniciar sesión antes de cada prueba del ckeckout del inventario
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("Debe agregar unos productos al carrito desde la página de inventario, navegar al carrito y hacer clic en Checkout", async ({ page }) => {
    // Agregar el producto Sauce Labs Backpack.
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartItemCount()).toBe("1");

    // Agregar el producto Sauce Labs Bike Light.
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    expect(await inventoryPage.getCartItemCount()).toBe("2");

    // Hacer clic al enlace del carrito.
    await checkoutPage.shoppingCartLink.click();

    // Aserción: Verificar que la URL cambió al carrito.
    await expect(page).toHaveURL(/.*cart.html/);

    // Validar haber llegado al carrito.
    const successMessageShopping = await checkoutPage.getYourCartMessage();
    await expect(successMessageShopping).toContainText("Your Cart");

    // Hacer clic en botón checkout.
    await checkoutPage.checkout.click();

    // Aserción: Verificar que la URL cambió al checkout-step-one.
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // Aserción: Verificar que el texto corresponde a la página.
    const successMessageCheckout = await checkoutPage.getYourCartMessage();
    await expect(successMessageCheckout).toContainText(
      "Checkout: Your Information",
    );

  });

  test("Debe llenar el formulario (Nombre, Apellido y Código Postal) y continuar a la vista de resumen, presionar Finish y validar que aparezca el mensaje de éxito de la orden completada.", async ({ page }) => {

     // Agregar el producto Sauce Labs Backpack.
    await inventoryPage.addProductToCart("Sauce Labs Backpack");

    // Agregar el producto Sauce Labs Bike Light.
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");

    // Hacer clic al enlace del carrito.
    await checkoutPage.shoppingCartLink.click();

    // Hacer clic en botón checkout.
    await checkoutPage.checkout.click();

    // Llenar el formulario.
    await checkoutPage.fillForm('Rafael Casas','Wechek','112233');

    // Aserción: Verificar que la URL cambió al checkout-step-two.
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    // Aserción: Verificar que el texto corresponde a la página.
    const successMessageResume = await checkoutPage.getYourCartMessage();
    await expect(successMessageResume).toContainText(
      "Checkout: Overview",
    );

    // Hacer clic en el botón de finalizar.
    await checkoutPage.finish.click();

    // Aserción: Verificar que la URL cambió al checkout-step-two.
    await expect(page).toHaveURL(/.*checkout-complete.html/);

    // Aserción: Verificar que el texto corresponde a la página.
    const successMessageComplete = await checkoutPage.getYourFinishMessage();
    await expect(successMessageComplete).toContainText(
      "Thank you for your order!",
    );
    
  });
});
