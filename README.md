# 🚀 Playwright TypeScript E2E Portfolio + Autonomous AI Agents

Portafolio técnico avanzado de automatización de pruebas End-to-End (E2E) desarrollado con **Playwright**, **TypeScript** y el patrón de diseño **Page Object Model (POM)**. Además, incorpora un ecosistema innovador de **6 Agentes de Inteligencia Artificial Autónomos** impulsados por el **Vercel AI SDK** y los modelos de **Google Gemini**, resolviendo tareas complejas de ingeniería de calidad y pruebas de contrato.

---

## 🤖 Suite de Agentes de IA Integrados (`ai-agent/`)

El núcleo inteligente del proyecto utiliza **prompts desacoplados** (`ai-agent/prompts/`), tipado estricto con **Zod** y manejo de resiliencia:

1. **Test Scaffolder (`ai-scaffolder.spec.ts`):** Genera código E2E robusto en Playwright a partir de historias de usuario y análisis del DOM.
2. **Failure Analyzer (`ai-failure-analyzer.spec.ts`):** Diagnostica fallos de CI/CD cruzando logs de ejecución y Page Objects para sugerir correcciones exactas.
3. **Self-Healing Agent (`ai-self-healing.spec.ts`):** Repara selectores rotos en tiempo de ejecución comparando el selector fallido con el DOM actual de la página.
4. **Test Data Generator (`ai-test-data.spec.ts`):** Genera payloads de API y fixtures estructurados y realistas bajo demanda.
5. **API Contract Validator (`ai-api-contract-validator.spec.ts`):** Sincroniza y audita contratos de red entre frontend y backend, apoyado por utilidades dedicadas (`ai-agent/helpers/`).
6. **UX & Accessibility Auditor (`ai-ux-accessibility-auditor.spec.ts`):** Audita normativas de accesibilidad (**WCAG 2.1/2.2**), atributos ARIA, contrastes y semántica visual.

---

## 🛠️ Stack Tecnológico y Requisitos

* **Entorno de Ejecución:** Node.js (v18+ LTS recomendado)
* **Lenguaje:** TypeScript (Tipado estricto)
* **Framework de Automatización:** Playwright Test
* **Orquestación de IA:** Vercel AI SDK (`@ai-sdk/google`, `ai`, `zod`)
* **Modelos de IA (Google Gemini):** 
  * *Fast:* `gemini-3.5-flash-lite` (Diagnósticos rápidos y alta concurrencia)
  * *Advanced:* `gemini-3.8-flash` / `gemini-3.5-flash-lite` (Razonamiento complejo y validación de contratos)
* **Pruebas de API / Contractuales:** Postman Collections & Newman CLI
* **Integración Continua:** GitHub Actions (`.github/workflows/playwright.yml`)

---

## 📂 Estructura Real del Proyecto

```text
playwright-ts-portfolio/
│
├── .auth/                        # Estados de autenticación guardados para pruebas
├── .github/
│   └── workflows/
│       └── playwright.yml        # Pipeline de CI/CD automatizado
│
├── ai-agent/                     # Ecosistema de Agentes de IA
│   ├── helpers/                  # Utilidades (ej. contract-test.helper.ts)
│   ├── prompts/                  # System y User prompts desacoplados
│   │   ├── api-contract-validator.prompt.ts
│   │   ├── failure-analyzer.prompt.ts
│   │   ├── self-healing.prompt.ts
│   │   ├── test-data-generator.prompt.ts
│   │   ├── test-scaffolder.prompt.ts
│   │   └── ux-accessibility-auditor.prompt.ts
│   ├── api-contract-validator.ts
│   ├── config.ts                 # Configuración centralizada de SDK y modelos Gemini
│   ├── failure-analyzer.ts
│   ├── self-healing.ts
│   ├── test-data-generator.ts
│   ├── test-scaffolder.ts
│   └── ux-accessibility-auditor.ts
│
├── pages/                        # Page Object Model (POM)
│   ├── practice-store/           # CartPage, CheckoutPage, HomePage, LoginPage, ProductPage
│   └── saucedemo/                # CheckoutPage, InventoryPage, LoginPage
│
├── postman/                      # Colecciones y entornos de API (Reqres & Petstore)
│   ├── petstore.collection.json
│   ├── petstore.openapi
│   ├── petstore3.environment.json
│   ├── reqres.collection.json
│   └── reqres.environment.json
│
├── tests/                        # Suites de pruebas E2E y Agentes IA
│   ├── practice-store/           # Tests funcionales + Tests de Agentes IA (@ci)
│   └── saucedemo/                # Tests de inventario, login y checkout
│
├── .env                          # Variables de entorno locales (Privado)
├── .env.example                  # Plantilla de variables de entorno
├── playwright.config.ts          # Configuración centralizada de proyectos y baseURLs
├── package.json
└── tsconfig.json
```
⚙️ Configuración y Puesta en Marcha

1. Clonar el repositorio:

git clone [https://github.com/rwechek/playwright-ts-portfolio.git]

cd playwright-ts-portfolio

2. Instalar dependencias y navegadores:

npm ci
npx playwright install chromium --with-deps

3. Configurar las Variables de Entorno (.env):

Crea un archivo .env en la raíz del proyecto basándote en tus credenciales:

GEMINI_API_KEY=tu_clave_de_api_de_google_ai_studio
TEST_CUSTOMER_EMAIL=tu_correo_de_prueba
TEST_CUSTOMER_PASSWORD=tu_contraseña_de_prueba

🏃‍♂️ Comandos de Ejecución Local

Ejecutar la suite completa de Agentes de IA (etiquetados con @ci):

npx playwright test --grep "@ci"

Ejecutar pruebas de un proyecto específico (ej. Practice Store):

npx playwright test --project=practice-store-chromium

Ejecutar pruebas con interfaz gráfica interactiva (UI Mode):

npx playwright test --ui

🔄 Integración Continua (CI/CD)

El proyecto cuenta con un workflow automatizado en GitHub Actions (playwright.yml) que se encarga de:

1. Configurar Node.js y descargar las dependencias del proyecto.
2. Ejecutar validaciones de API mediante colecciones de Postman con Newman.
3. Ejecutar de forma optimizada la suite de pruebas E2E y los Agentes de IA (--grep "@ci").
4. Inyectar de manera segura el secreto GEMINI_API_KEY configurado en el repositorio para las llamadas a Google Gemini.



