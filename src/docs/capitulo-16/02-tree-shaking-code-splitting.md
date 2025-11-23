# 02. Tree Shaking y Code Splitting

Dos técnicas esenciales para optimizar el tamaño del bundle: **tree shaking** (eliminar código muerto) y **code
splitting** (dividir código en chunks).

---

## 1. Tree Shaking

**Definición:** Eliminar código que nunca se usa.

### Cómo Funciona

Los bundlers analizan el grafo de dependencias y eliminan exports que no se importan.

```javascript
// utils.js
export function usada() {
    return "Sí se usa";
}

export function noUsada() {
    return "Nunca se importa";
}

// main.js
import {usada} from "./utils.js";

console.log(usada());

// Bundle final NO incluye noUsada()
```

### Requisitos para Tree Shaking

1. **Usar ES Modules (`import`/`export`).**
2. **No usar CommonJS (`require`/`module.exports`).**
3. **Marcar side effects en `package.json`.**

```json
{
  "name": "mi-libreria",
  "sideEffects": false
}
```

Si tienes archivos con side effects (ej: CSS, polyfills):

```json
{
  "sideEffects": [
    "*.css",
    "src/polyfills.js"
  ]
}
```

### Verificar Tree Shaking

```bash
# Vite
npm run build

# Ver tamaño del bundle
ls -lh dist/assets/*.js
```

---

## 2. Code Splitting

**Definición:** Dividir el código en múltiples archivos (chunks) que se cargan bajo demanda.

### Beneficios

- **Carga inicial más rápida:** Solo cargas lo necesario.
- **Mejor caché:** Cambios en una ruta no invalidan todo el bundle.

### Estrategias

#### Route-based Splitting

```javascript
// React Router
import {lazy, Suspense} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<About/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
```

#### Component-based Splitting

```javascript
// Cargar componente pesado solo cuando se necesita
const HeavyChart = lazy(() => import("./HeavyChart"));

function Dashboard() {
    const [showChart, setShowChart] = useState(false);

    return (
        <div>
            <button onClick={() => setShowChart(true)}>Mostrar gráfico</button>
            {showChart && (
                <Suspense fallback={<div>Cargando...</div>}>
                    <HeavyChart/>
                </Suspense>
            )}
        </div>
    );
}
```

#### Vendor Splitting

```javascript
// vite.config.js
export default {
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    utils: ["lodash", "date-fns"],
                },
            },
        },
    },
};
```

---

## 3. Dynamic Imports

```javascript
// Importación dinámica
async function loadModule() {
    const module = await import("./heavy-module.js");
    module.doSomething();
}

// Con condición
if (user.isPremium) {
    const {PremiumFeature} = await import("./premium.js");
    new PremiumFeature();
}
```

---

## 4. Preload y Prefetch

```javascript
// Preload: Alta prioridad, necesario pronto
<link rel="preload" href="/critical.js" as="script">

    // Prefetch: Baja prioridad, para navegación futura
    <link rel="prefetch" href="/next-page.js" as="script">
```

En Vite:

```javascript
// Prefetch automático
const About = lazy(() => import(/* webpackPrefetch: true */ "./About"));
```

---

## 5. Análisis del Bundle

```bash
# Vite
npm install -D rollup-plugin-visualizer

# vite.config.js
import {visualizer} from 'rollup-plugin-visualizer';

export default {
    plugins: [visualizer({open: true})]
};
```

Genera un reporte visual mostrando qué ocupa más espacio.

---

## 6. Conclusión

**Checklist de optimización:**

- ✅ Usar ES Modules
- ✅ Marcar `sideEffects` en `package.json`
- ✅ Code splitting por rutas
- ✅ Lazy load componentes pesados
- ✅ Separar vendors
- ✅ Analizar bundle regularmente
