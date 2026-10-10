import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/practice-store/HomePage";
import { ProductPage } from "../../pages/practice-store/ProductPage";
import { CartPage } from "../../pages/practice-store/CartPage";
import { CheckoutPage } from "../../pages/practice-store/CheckoutPage";
import dotenv from "dotenv";

dotenv.config();

test.describe("Practice Software Testing - Flujo de Compra y Checkout", () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await homePage.goto();
    await expect(homePage.productCardTitles.first()).toBeVisible({
      timeout: 7000,
    });
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("Debería agregar un producto, validar subtotal, iniciar sesión como invitado y completar el pago", async ({
    page,
  }) => {
    test.setTimeout(60000);

    // 1. Seleccionar el primer producto desde el catálogo
    await homePage.clickFirstProduct();

    // 2. Agregar al carrito y validar contador
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText("1");

    // 3. Ir a la vista del carrito y validar subtotal
    await cartPage.goto();

    const subtotalText = await cartPage.getSubtotal();
    expect(subtotalText.length).toBeGreaterThan(0);

    // 4. Proceder al pago inicial
    await cartPage.proceedToCheckout();

    // 5. Ejecutar el flujo de invitado mediante el Page Object
    await checkoutPage.fillGuestDetails({
      email: process.env.GUEST_EMAIL || "test.guest@example.com",
      firstName: process.env.GUEST_FIRST_NAME || "Rafael",
      lastName: process.env.GUEST_LAST_NAME || "Casas",
    });

    // 6. Ejecutar el flujo de dirección (Billing Address) mediante el Page Object
    await checkoutPage.fillBillingAddress({
      country: process.env.USER_COUNTRY || "Colombia",
      postcode: process.env.USER_POSTCODE || "110111",
      houseNumber: process.env.USER_HOUSE_NUMBER || "123",
    });

    // 7. Llenar el formulario de pago
    await checkoutPage.fillPayment({
      cardNumber: process.env.PAYMENT_NUMBER || "",
      expirationDate: process.env.PAYMENT_EXPIRATION_DATE || "",
      cvv: process.env.PAYMENT_CVV || "",
      cardHolder: process.env.PAYMENT_NAME || "",
    });

    // 8. Asegurar el cierre del test validando la confirmación de la orden
    await checkoutPage.assertOrderSuccess();
  });
});