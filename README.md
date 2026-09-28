# Playwright Automation Portfolio (TypeScript + POM)

Repositorio de práctica y portafolio técnico enfocado en la automatización de pruebas end-to-end (E2E) utilizando **Playwright**, **TypeScript** y el patrón de diseño **Page Object Model (POM)**. Las pruebas se ejecutan sobre escenarios web interactivos para validar flujos reales de usuario, esperas asíncronas y manejo de componentes de interfaz.

---

## 🚀 Tecnologías y Herramientas Utilizadas
- **TypeScript:** Tipado estricto para mayor mantenibilidad y robustez del código.
- **Playwright:** Framework moderno para pruebas web rápidas y confiables.
- **Page Object Model (POM):** Patrón de diseño para desacoplar la lógica de las páginas de los scripts de prueba.
- **Node.js:** Entorno de ejecución de JavaScript/TypeScript.

---

## 📂 Estructura del Proyecto

```text
playwright-portafolio/
│
├── pages/                  # Clases con los selectores y acciones (POM)
│   ├── AddRemoveElementsPage.ts
│   ├── BasicAuthPage.ts
│   ├── CheckboxesPage.ts
│   ├── DataTablePage.ts
│   ├── DragAndDropPage.ts
│   ├── DropdownPage.ts
│   ├── DynamicLoadingPage.ts
│   ├── FileUploadPage.ts
│   ├── FramesPage.ts
│   ├── GeolocationPage.ts
│   ├── HoversPage.ts
│   ├── InfiniteScrollPage.ts
│   ├── JavaScriptAlertsPage.ts
│   ├── LoginPage.ts
│   └── MultipleWindowsPage.ts
│
├── tests/                  # Archivos de pruebas E2E
│   ├── addRemoveElements.spec.ts
│   ├── basic-auth.spec.ts
│   ├── checkboxes.spec.ts
│   ├── dataTable.spec.ts
│   ├── drag-and-drop.spec.ts
│   ├── dropdown.spec.ts
│   ├── dynamic-loading.spec.ts
│   ├── file-upload.spec.ts
│   ├── frames.spec.ts
│   ├── geolocation.spec.ts
│   ├── hovers.spec.ts
│   ├── infiniteScroll.spec.ts
│   ├── javascript-alerts.spec.ts
│   ├── login.spec.ts
│   └── multipleWindows.spec.ts
│
├── package.json
└── tsconfig.json