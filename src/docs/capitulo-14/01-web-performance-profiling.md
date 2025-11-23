# 01. Web Performance Profiling

Antes de optimizar, necesitas **medir**. "No optimices ciegamente" es la regla de oro. Las herramientas de profiling te
muestran dónde están los cuellos de botella.

---

## 1. Chrome DevTools Performance Panel

**Cómo abrir:** DevTools → Performance → Grabar.

**Qué muestra:**

- **Flamegraph:** Qué funciones están consumiendo tiempo.
- **Main Thread:** Actividad del hilo principal (scripts, rendering, painting).
- **Network:** Peticiones HTTP.
- **Screenshots:** Cómo se ve la página durante la carga.

### Interpretación

- **Long Tasks (tareas largas):** Bloques rojos >50ms. Bloquean el hilo principal.
- **Forced Reflow/Layout Thrashing:** Ciclos de lectura-escritura del DOM que fuerzan recalcular el layout.

---

## 2. Lighthouse

Lighthouse es una herramienta automatizada de auditoría.

```bash
# CLI
npm install -g lighthouse
lighthouse https://example.com --view
```

O desde DevTools → Lighthouse → Generar reporte.

**Categorías:**

- Performance
- Accessibility
- Best Practices
- SEO
- PWA

---

## 3. Core Web Vitals

Google usa estas métricas para rankear páginas.

### LCP (Largest Contentful Paint)

**Qué mide:** Tiempo hasta que el elemento más grande visible se renderiza.

**Meta:** <2.5s

**Cómo mejorar:**

- Optimizar imágenes (WebP, lazy loading).
- Usar CDN.
- Crítico CSS inline.

### FID (First Input Delay)

**Qué mide:** Tiempo desde que el usuario interactúa hasta que el navegador responde.

**Meta:** <100ms

**Cómo mejorar:**

- Dividir JavaScript en chunks pequeños.
- Usar Web Workers para código pesado.
- `requestIdleCallback` para tareas no críticas.

### CLS (Cumulative Layout Shift)

**Qué mide:** Cambios inesperados en el layout (elementos que "saltan").

**Meta:** <0.1

**Cómo mejorar:**

- Reservar espacio para imágenes (width/height).
- Evitar insertar contenido dinámico encima del fold.
- Usar `font-display: swap` con cuidado.

---

## 4. Identificando Bottlenecks

**Checklist:**

1. ¿Hay scripts bloqueantes en `<head>`? → Usa `defer` o `async`.
2. ¿Hay imágenes sin optimizar? → Comprime y usa formatos modernos.
3. ¿Hay muchas peticiones HTTP? → Combina archivos o usa HTTP/2.
4. ¿Código JavaScript pesado? → Code splitting con lazy imports.
