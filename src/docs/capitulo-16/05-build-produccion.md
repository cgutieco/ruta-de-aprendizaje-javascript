# 05. Build para Producción

El build de producción optimiza tu aplicación para máximo rendimiento y mínimo tamaño.

---

## 1. Comando de Build

```bash
# Vite
npm run build

# Genera carpeta dist/
```

---

## 2. Optimizaciones Automáticas

### Minificación

```javascript
// Antes (desarrollo)
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// Después (producción)
function calculateTotal(e) {
    return e.reduce((e, t) => e + t.price, 0);
}
```

### Tree Shaking

Elimina código no usado.

### Code Splitting

Divide el código en chunks.

---

## 3. Configuración de Build

```javascript
// vite.config.js
export default {
    build: {
        outDir: "dist",
        assetsDir: "assets",
        minify: "esbuild", // o 'terser'
        sourcemap: false, // true para debugging
        target: "es2020",
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                },
            },
        },
    },
};
```

---

## 4. Source Maps

```javascript
// Producción: false (más pequeño, menos debuggeable)
sourcemap: false;

// Staging: true (debugging)
sourcemap: true;

// Producción con source maps externos
sourcemap: "hidden"; // Genera .map pero no los referencia
```

---

## 5. Compresión de Assets

### Imágenes

```bash
npm install -D vite-plugin-imagemin

# vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default {
    plugins: [
        viteImagemin({
            gifsicle: {optimizationLevel: 7},
            optipng: {optimizationLevel: 7},
            mozjpeg: {quality: 80},
            svgo: {
                plugins: [{removeViewBox: false}]
            }
        })
    ]
};
```

### Gzip/Brotli

```bash
npm install -D vite-plugin-compression

# vite.config.js
import compression from 'vite-plugin-compression';

export default {
    plugins: [
        compression({
            algorithm: 'brotliCompress',
            ext: '.br'
        })
    ]
};
```

---

## 6. Análisis del Bundle

```bash
npm install -D rollup-plugin-visualizer

# vite.config.js
import {visualizer} from 'rollup-plugin-visualizer';

export default {
    plugins: [
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true
        })
    ]
};
```

---

## 7. Optimización de CSS

```javascript
// vite.config.js
export default {
    build: {
        cssCodeSplit: true, // Divide CSS por ruta
        cssMinify: true,
    },
};
```

---

## 8. Optimización de Fonts

```css
/* Preload fonts críticas */
<
link rel

=
"preload"
href

=
"/fonts/main.woff2"
as

=
"font"
type

=
"font/woff2"
crossorigin >
    /* Usar font-display */

@font-face {
    font-family: "MyFont";
    src: url("/fonts/main.woff2") format("woff2");
    font-display: swap; /* Muestra fallback mientras carga */
}
```

---

## 9. Remover Console Logs

```javascript
// vite.config.js
export default {
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
};
```

---

## 10. Cache Busting

Vite automáticamente agrega hashes a los archivos:

```
dist/assets/index-abc123.js
dist/assets/style-def456.css
```

Esto invalida el caché cuando cambia el contenido.

---

## 11. Verificar Build

```bash
# Build
npm run build

# Preview local
npm run preview

# Verificar tamaño
ls -lh dist/assets/

# Verificar compresión
gzip -c dist/assets/index-*.js | wc -c
```

---

## 12. Checklist de Producción

```javascript
// .env.production
VITE_API_URL = https
://api.myapp.com
VITE_ENABLE_ANALYTICS = true

// vite.config.js
export default {
    build: {
        minify: 'esbuild',
        sourcemap: false,
        target: 'es2020',
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom']
                }
            }
        }
    }
};
```

**Verificar:**

- ✅ Minificación activada
- ✅ Source maps desactivados (o hidden)
- ✅ Console logs removidos
- ✅ Imágenes optimizadas
- ✅ Compresión gzip/brotli
- ✅ Code splitting configurado
- ✅ Variables de entorno correctas

---

## 13. Conclusión

Un build optimizado puede reducir el tamaño del bundle en 50-80% y mejorar significativamente el rendimiento.
