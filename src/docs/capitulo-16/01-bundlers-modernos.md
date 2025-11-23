# 01. Bundlers Modernos

Los **bundlers** transforman tu código modular en archivos optimizados para producción. En 2025, los bundlers más
relevantes son **Vite**, **esbuild** y **Webpack**.

---

## 1. ¿Qué Hace un Bundler?

1. **Resuelve dependencias:** Sigue los `import`/`export` y crea un grafo de dependencias.
2. **Transpila:** Convierte código moderno (TS, JSX) a JavaScript compatible.
3. **Optimiza:** Minifica, elimina código muerto (tree shaking), divide código (code splitting).
4. **Empaqueta:** Genera archivos finales para el navegador.

---

## 2. Vite

**Filosofía:** Desarrollo ultra-rápido usando ESM nativo + esbuild.

### Características

- **Dev server instantáneo:** No bundlea en desarrollo, sirve módulos ESM directamente.
- **HMR (Hot Module Replacement):** Actualiza módulos sin recargar la página.
- **Build con Rollup:** Para producción usa Rollup (optimizado).

### Configuración Básica

```javascript
// vite.config.js
import {defineConfig} from "vite";

export default defineConfig({
    root: "./src",
    build: {
        outDir: "../dist",
        minify: "esbuild",
        sourcemap: true,
    },
    server: {
        port: 3000,
        open: true,
    },
});
```

### Cuándo Usar Vite

- Proyectos nuevos (React, Vue, Svelte).
- Necesitas dev server rápido.
- No tienes configuración legacy compleja.

---

## 3. esbuild

**Filosofía:** Velocidad extrema. Escrito en Go.

### Características

- **10-100x más rápido** que Webpack/Rollup.
- **Minificación nativa.**
- **Transpilación de TS/JSX sin configuración.**

### Uso Básico

```javascript
// build.js
import * as esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["es2020"],
    outfile: "dist/bundle.js",
});
```

### Limitaciones

- No tiene HMR nativo (necesitas wrappers como Vite).
- Menos plugins que Webpack.

### Cuándo Usar esbuild

- Builds extremadamente rápidos.
- Librerías (no apps completas).
- Como transpilador dentro de otro bundler.

---

## 4. Webpack

**Filosofía:** Configuración completa y flexible.

### Características

- **Ecosistema maduro:** Miles de plugins y loaders.
- **Code splitting avanzado.**
- **Optimizaciones granulares.**

### Configuración Básica

```javascript
// webpack.config.js
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    optimization: {
        minimize: true,
    },
};
```

### Cuándo Usar Webpack

- Proyectos legacy que ya lo usan.
- Necesitas configuración muy específica.
- Builds complejos con múltiples entradas.

---

## 5. Comparación

| Feature         | Vite   | esbuild | Webpack  |
|-----------------|--------|---------|----------|
| Velocidad dev   | ⚡⚡⚡    | ⚡⚡⚡     | ⚡        |
| Velocidad build | ⚡⚡     | ⚡⚡⚡     | ⚡        |
| HMR             | ✅      | ❌       | ✅        |
| Plugins         | 🟢     | 🟡      | 🟢🟢     |
| Configuración   | Simple | Simple  | Compleja |
| Madurez         | 🟢     | 🟡      | 🟢🟢     |

---

## 6. Conclusión

**Recomendación 2025:**

- **Proyectos nuevos:** Vite.
- **Librerías:** esbuild.
- **Proyectos legacy:** Webpack (migrar gradualmente a Vite).
