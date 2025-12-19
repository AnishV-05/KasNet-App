# reg-kasnetdigital-dashboardtransaction-web

Este es un proyecto de microfrontend para un dashboard de transacciones construido con React 19, TypeScript, Redux Toolkit y Webpack Module Federation.

## 🚀 Tecnologías Principales

- **React 19** - Librería de UI
- **TypeScript 5** - Tipado estático
- **Redux Toolkit** - Manejo de estado global
- **Webpack 5** - Module bundler con Module Federation
- **Styled Components** - CSS-in-JS
- **React Hook Form** - Manejo de formularios
- **i18next** - Internacionalización
- **Jest + Testing Library** - Testing

## 📋 Requisitos Previos

Antes de empezar a trabajar con este proyecto, asegúrate de tener:

- **Node.js** (versión 18 o superior recomendada)
- **Yarn 4.5.3** como gestor de paquetes
- Configuración del archivo `.yarnrc.yml` para acceder a paquetes privados (si aplica)

## 📦 Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
yarn install
```

## 🛠️ Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Desarrollo** | `yarn dev` | Inicia el servidor de desarrollo en el puerto 3200 |
| **Build** | `yarn build` | Genera el build de producción en la carpeta `dist/` |
| **Servir** | `yarn serve` | Sirve el build de producción en el puerto 3300 |
| **Tests** | `yarn test` | Ejecuta tests en archivos modificados |
| **Tests All** | `yarn test:all` | Ejecuta todos los tests del proyecto |
| **Lint** | `yarn lint` | Ejecuta ESLint en archivos TypeScript |
| **Format Check** | `yarn format:check` | Verifica el formato del código con Prettier |
| **Format Fix** | `yarn format:fix` | Corrige el formato del código con Prettier |
| **Type Check** | `yarn type-check` | Verifica los tipos de TypeScript |
| **Generate API** | `yarn generate-api` | Genera código de API desde OpenAPI spec |

## 🌿 Convención de Ramas

### Ramas Principales

| Rama | Descripción |
|------|-------------|
| `develop` | Rama que contiene todo el código desarrollado por sprint |
| `review` | Rama que homologa los cambios del equipo y es válida para QAs |
| `production` | Rama de solo lectura que contiene el código utilizado en producción |

### Ramas de Soporte

Son temporales, el nombre es variable y usa un prefijo. Se originan de las ramas principales y retornan (merge) a una rama principal.

| Prefijo | Descripción |
|---------|-------------|
| `feature/` | Rama de corta duración asociada a la historia de usuario |
| `epic/` | Rama de larga duración que sirve como rama integradora de las ramas features |
| `release/` | Rama pre productiva que contiene features listos. Formato: `release/<version>` |
| `fix/` | Rama creada a partir de errores reportados por usuarios/negocio. Formato: `fix/<name>` |
| `hotfix/` | Rama generada a partir de errores de producción. Formato: `hotfix/<version>` |
| `spike/` | Rama para validar pruebas de concepto (PoC), después de su uso, eliminarse. Formato: `spike/<name>` |

## 📝 Convención de Commits

Para llevar un orden en los commits se tiene que hacer `commit` en el siguiente formato con los tipos permitidos. También puedes seguir esta convención: https://www.conventionalcommits.org/en/v1.0.0/

```bash
# Ejemplo usando el tipo 'feat'
git commit -m "feat: add new functionality"
```

| Prefijo | Descripción |
|---------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Un bugfix o hotfix |
| `perf` | Mejoras por performance o algún cambio relacionado |
| `test` | Creación de tests (unit, e2e, integration, etc) |
| `docs` | Documentación realizada |
| `chore` | Cambios en configuración, dependencias, etc |
| `refactor` | Refactorización de código |
| `style` | Cambios de formato, espacios, etc |

## 🌍 Internacionalización (i18n)

`i18next` es una librería de internacionalización escrita en JavaScript que provee soporte para múltiples idiomas, pluralización, formatos de fechas y monedas, y más. En este proyecto la usamos para no tener textos hardcodeados.

Para ayudarte a acceder a los textos rápidamente mediante VSCode se recomienda usar la extensión [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally).

Las traducciones globales se encuentran en: `src/locales/es/general.i18n.json`

### Ejemplo con i18n

**Archivo de traducción** (`src/locales/es/general.i18n.json`):
```json
{
  "welcome": "bienvenido",
  "welcomeDynamicFriend": "bienvenido {{ name }} amigo"
}
```

**Uso en componente**:
```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <div>{t('welcome')}</div> {/* Traducción normal */}
      <div>{t('welcomeDynamicFriend', { name: 'John Doe' })}</div> {/* Traducción dinámica */}
    </>
  );
};
```

**Resultado**:
```html
<div>bienvenido</div>
<div>bienvenido John Doe amigo</div>
```

### Traducciones por Componente

También puedes usar traducciones únicas para cada componente:

```tsx
import { useTranslation } from 'react-i18next';
import HomeData from './Home.i18n.json';

function Home() {
  const { t } = useTranslation('HomeData');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## 📁 Estructura del Proyecto

```
├── infra/                   # Configuración de infraestructura (IAC con Pulumi)
├── .github/                 # Workflows de GitHub Actions
├── public/                  # Archivos estáticos
│   ├── animations/          # Animaciones de Kasnet KDS
│   ├── brands/              # Logos de Kasnet KDS
│   ├── fonts/               # Fuentes de Kasnet KDS
│   ├── icons/               # Iconos de Kasnet KDS
│   └── images/              # Imágenes del proyecto
├── scripts/                 # Scripts de utilidad
│   ├── copy-tokens.js       # Script para exportación de tokens de KDS
│   └── api-generator.ts     # Configuración para generación de API
├── src/                     # Código fuente de la aplicación
│   ├── __mocks__/           # Mocks para testing (MSW)
│   ├── assets/              # Recursos estáticos del código
│   │   ├── fonts/           # Fuentes personalizadas
│   │   ├── icons/           # Iconos SVG
│   │   └── styles/          # Estilos globales (SCSS)
│   ├── config/              # Configuración de la aplicación
│   │   ├── constants.ts     # Constantes globales
│   │   ├── envs.ts          # Variables de entorno
│   │   └── i18n.config.ts   # Configuración de i18next
│   ├── locales/             # Archivos de traducción
│   │   └── es/              # Traducciones en español
│   ├── modules/             # Módulos de la aplicación
│   │   ├── redux/           # Estado global con Redux Toolkit
│   │   │   ├── api/         # RTK Query APIs
│   │   │   ├── slices/      # Redux slices
│   │   │   ├── constants/   # Constantes de Redux
│   │   │   ├── helpers/     # Helpers de Redux
│   │   │   └── store.tsx    # Configuración del store
│   │   ├── screens/         # Pantallas/páginas de la aplicación
│   │   │   └── home/        # Pantalla de inicio
│   │   └── shared/          # Código compartido
│   │       ├── analytics/   # Integración con analytics
│   │       ├── components/  # Componentes reutilizables
│   │       ├── constants/   # Constantes compartidas
│   │       ├── context/     # React contexts
│   │       ├── hooks/       # Custom hooks
│   │       ├── storage/     # Manejo de storage
│   │       └── utils/       # Funciones de utilidad
│   ├── app.tsx              # Componente principal de la app
│   ├── bootstrap.ts         # Inicialización de la aplicación
│   ├── index.ts             # Punto de entrada para Module Federation
│   ├── main.tsx             # Punto de entrada principal
│   └── router.tsx           # Configuración de rutas
├── .env.example             # Ejemplo de variables de entorno
├── .yarnrc.yml              # Configuración de Yarn
├── commitlint.config.js     # Configuración de commitlint
├── jest.config.ts           # Configuración de Jest
├── package.json             # Dependencias y scripts
├── sonar-project.properties # Configuración de SonarQube
├── tsconfig.json            # Configuración de TypeScript
└── webpack.config.js        # Configuración de Webpack
```

## 🏗️ Arquitectura

### src/modules

El directorio `modules` contiene la lógica principal de la aplicación organizada en:

- **redux/**: Manejo de estado global
  - `api/`: APIs generadas con RTK Query
  - `slices/`: Redux slices para diferentes features
  - `store.tsx`: Configuración del store de Redux
  - `constants/`: Constantes para reducer paths y tags
  - `helpers/`: Funciones auxiliares para queries

- **screens/**: Componentes de pantalla/página
  - Cada pantalla tiene su propia carpeta con componentes, estilos y lógica
  - Ejemplo: `home/` contiene la pantalla principal

- **shared/**: Código compartido entre módulos
  - `components/`: Componentes UI reutilizables
  - `hooks/`: Custom hooks de React
  - `utils/`: Funciones de utilidad
  - `analytics/`: Integración con Amplitude
  - `storage/`: Manejo de localStorage/sessionStorage
  - `context/`: React contexts globales

### src/config

Configuración centralizada de la aplicación:
- `envs.ts`: Variables de entorno tipadas
- `constants.ts`: Constantes globales
- `i18n.config.ts`: Configuración de internacionalización

### src/assets

Recursos estáticos del código fuente:
- `fonts/`: Fuentes Poppins
- `icons/`: Iconos SVG personalizados
- `styles/`: Estilos globales SCSS (reset, fonts, globals)

## 🔌 Module Federation

Este proyecto utiliza **Webpack Module Federation** para funcionar como un microfrontend que puede ser consumido por otras aplicaciones.

### Configuración

```javascript
new ModuleFederationPlugin({
  name: 'home',
  filename: 'remoteEntry.js',
  exposes: {
    './index': './src/router',
  },
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
    'react-router-dom': { singleton: true, eager: true },
    i18next: { singleton: true, eager: true },
    'react-i18next': { singleton: true, eager: true },
  },
})
```

- **Nombre del módulo**: `home`
- **Archivo expuesto**: `remoteEntry.js`
- **Punto de entrada**: `./src/router` (exporta las rutas del microfrontend)
- **Dependencias compartidas**: React, React DOM, React Router, i18next

## 🧪 Pruebas Unitarias

Para las pruebas unitarias se utiliza **Jest** y **Testing Library**, que permiten escribir pruebas con una sintaxis clara y sencilla, además de proporcionar una cobertura de código integrada.

### Ubicación de Tests

- **Mocks**: `src/__mocks__/`
  - `handlers/`: Handlers de MSW para simular APIs
  - `datum/`: Data de prueba
  - `mswServer.ts`: Configuración de MSW para Node
  - `mswWorker.ts`: Configuración de MSW para browser

### Ejecutar Tests

```bash
# Tests en archivos modificados
yarn test

# Todos los tests
yarn test:all
```

### Reportes

La ejecución de las pruebas genera reportes de cobertura que pueden ser visualizados en la carpeta de reportes generada por Jest.

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
VITE_API_EXTERNAL_URL=https://example.com
KASNET_APPNAME=kn-dashboardtransaction-web
KASNET_LANDING_APPNAME=reg-kasnetdigital-dashboardtransaction-web
ANALYTICS_API_KEY=your-amplitude-key
API_MOCKING=false
ENV="DEV"
```

## 📄 Licencia

MIT
