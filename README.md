# Playwright Automation Portfolio (TypeScript + POM)

Repositorio de práctica y portafolio técnico enfocado en la automatización de pruebas end-to-end (E2E) utilizando **Playwright**, **TypeScript** y el patrón de diseño **Page Object Model (POM)**. Las pruebas se ejecutan sobre escenarios web interactivos para validar flujos reales de usuario, esperas asíncronas y manejo de componentes de interfaz.

---

## 🚀 Tecnologías y Herramientas Utilizadas
* **TypeScript:** Tipado estricto para mayor mantenibilidad y robustez del código.
* **Playwright:** Framework moderno para pruebas web rápidas y confiables.
* **Page Object Model (POM):** Patrón de diseño para desacoplar la lógica de las páginas de los scripts de prueba.
* **Node.js:** Entorno de ejecución de JavaScript/TypeScript.

---

## 📂 Estructura del Proyecto

```text
playwright-portafolio/
│
├── pages/                  # Clases con los selectores y acciones (POM)
│   ├── LoginPage.ts
│   ├── CheckboxesPage.ts
│   └── DynamicLoadingPage.ts
│
├── tests/                  # Archivos de pruebas E2E
│   ├── login.spec.ts
│   ├── checkboxes.spec.ts
│   └── dynamic-loading.spec.ts
│
├── package.json
└── tsconfig.json
