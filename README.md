# Playwright + Newman CI/CD: Contract-Driven Testing

Repositorio de automatización de pruebas de alta calidad que integra de forma nativa pruebas End-to-End (E2E) con **Playwright**, pruebas de API con **Newman (Postman)** y pruebas de contrato **OpenAPI (Contract-Driven Testing)**, todo ello orquestado mediante un pipeline robusto de Integración Continua (CI/CD) en **GitHub Actions**.

---

## 🚀 Tecnologías y Herramientas Utilizadas
- **Node.js:** v24.20.0 (Entorno de ejecución).
- **TypeScript:** Tipado estricto para mayor mantenibilidad y robustez del código.
- **Playwright:** Framework moderno para pruebas web E2E rápidas y confiables (con soporte multi-proyecto y Chromium).
- **Page Object Model (POM):** Patrón de diseño para desacoplar la lógica de las páginas web de los scripts de prueba.
- **Newman:** CLI oficial de Postman para la ejecución automatizada de colecciones de API.
- **OpenAPI to Postman (`openapi-to-postmanv2`):** Herramienta para la gestión, conversión y validación de contratos de API.
- **GitHub Actions:** Orquestador de CI/CD para la ejecución automática de la suite completa.

---

## 📂 Estructura Completa del Proyecto

```text
playwright-ts-portfolio/
│
├── .github/
│   └── workflows/
│       └── playwright.yml         # Pipeline de CI/CD en GitHub Actions
│
├── pages/                         # Clases con selectores y acciones (POM para Playwright)
│   ├── saucedemo/
│   │   ├── CheckoutPage.ts
│   │   ├── InventoryPage.ts
│   │   └── LoginPage.ts
│   │
│   └── the-internet/              # Clases para The Internet (Herokuapp)
│       ├── AddRemoveElementsPage.ts
│       ├── BasicAuthPage.ts
│       ├── CheckboxesPage.ts
│       ├── DataTablePage.ts
│       ├── DragAndDropPage.ts
│       ├── DropdownPage.ts
│       ├── DynamicLoadingPage.ts
│       ├── FileUploadPage.ts
│       ├── FramesPage.ts
│       ├── GeolocationPage.ts
│       ├── HoversPage.ts
│       ├── InfiniteScrollPage.ts
│       ├── JavaScriptAlertsPage.ts
│       ├── LoginPage.ts
│       └── MultipleWindowsPage.ts
│
├── postman/                       # Colecciones de Postman, esquemas y entornos
│   ├── petstore.collection.json
│   ├── petstore.openapi.json      # Especificación del contrato OpenAPI
│   ├── petstore3.environment.json
│   ├── reqres.collection.json
│   └── reqres.environment.json
│
├── tests/                         # Directorio principal de pruebas E2E (Playwright)
│   ├── saucedemo/                 # Suite E2E: SauceDemo (Comercio electrónico)
│   │   ├── checkout.spec.ts
│   │   ├── inventory.spec.ts
│   │   └── login.spec.ts
│   │
│   └── the-internet/              # Suite E2E: The Internet (Herokuapp)
│       ├── addRemoveElements.spec.ts
│       ├── basic-auth.spec.ts
│       ├── checkboxes.spec.ts
│       ├── dataTable.spec.ts
│       ├── drag-and-drop.spec.ts
│       ├── dropdown.spec.ts
│       ├── dynamic-loading.spec.ts
│       ├── file-upload.spec.ts
│       ├── frames.spec.ts
│       ├── geolocation.spec.ts
│       ├── hovers.spec.ts
│       ├── infiniteScroll.spec.ts
│       ├── javascript-alerts.spec.ts
│       ├── login.spec.ts
│       └── multipleWindows.spec.ts
│
├── .gitignore
├── package.json                   # Dependencias y scripts del proyecto
├── package-lock.json              # Versiones deterministas de dependencias
├── playwright.config.ts           # Configuración centralizada de Playwright (Proyectos, baseURLs, reintentos y trazas)
└── README.md                      # Documentación del proyecto
```

⚙️ Configuración e Instalación Local

1. Requisitos previos:
   - Tener instalado Node.js (versión recomendada: v24.20.0 o superior).

2. Clonar el repositorio:

    git clone [https://github.com/tu-usuario/playwright-ts-portfolio.git](https://github.com/tu-usuario/playwright-ts-portfolio.git)

    cd playwright-ts-portfolio

3. Instalar dependencias:
    npm ci

4. Instalar los navegadores de Playwright (Chromium con dependencias de sistema):
    npx playwright install chromium --with-deps

🛠️ Ejecución de Pruebas

1. Pruebas End-to-End (Playwright)
    El proyecto cuenta con proyectos configurados en playwright.config.ts para múltiples entornos web:

    - Ejecutar todas las pruebas E2E en modo headless:

        npx playwright test

    - Ejecutar un proyecto específico (ej. The Internet):

        npx playwright test --project=the-internet-chromium
    
    - Ejecutar un proyecto específico (ej. SauceDemo):

        npx playwright test --project=saucedemo-chromium

    - Ejecutar pruebas con la interfaz gráfica interactiva (UI Mode):

        npx playwright test --ui

2. Pruebas de API y Contrato (Newman)

    - Ejecutar pruebas de API (ReqRes):

        npx newman run postman/reqres.collection.json -e postman/reqres.environment.json

    - Ejecutar pruebas de Contrato (Swagger Petstore3):

        npx newman run postman/petstore.collection.json -e postman/petstore3.environment.json

🔄 Integración Continua (CI/CD)

El pipeline de GitHub Actions (.github/workflows/playwright.yml) automatiza la validación integral del sistema ante cada push o pull_request a las ramas principales (main / master). Las etapas del pipeline son:

1. Checkout & Entorno: Configuración limpia de Node.js (LTS) en un agente Linux (ubuntu-latest).

2. Instalación de Dependencias: Ejecución de npm ci y descarga de binarios optimizados de Chromium.

3. Validación de Contratos OpenAPI: Ejecución mediante Newman de las pruebas de contrato sobre Swagger Petstore 3 (postman/petstore.collection.json).

4. Pruebas de Integración API: Ejecución de la colección de ReqRes (postman/reqres.collection.json).

5. Pruebas E2E (Playwright): Ejecución de la suite completa con políticas de reintento (retries: 2 en CI) para prevenir falsos positivos.

6. Gestión de Artefactos: Compilación y subida automática del reporte HTML de Playwright (playwright-report/), con un periodo de retención de 30 días, garantizando su disponibilidad incluso si ocurren fallos en el pipeline (if: ${{ !cancelled() }}).

