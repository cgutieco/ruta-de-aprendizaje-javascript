# 02. Memoización y Caching

**Caching** es guardar resultados para evitar recalcularlos. Es una de las optimizaciones más efectivas.

---

## 1. Memoización (Revisitada)

Ya vimos memoización en capítulos anteriores. Aquí va un patrón avanzado con `WeakMap` para evitar memory leaks.

```javascript
function memoize(fn) {
    const cache = new WeakMap();

    return function (...args) {
        // Usar el primer argumento como key (si es objeto)
        const key = args[0];

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Uso
const expensiveOperation = memoize((obj) => {
    // Operación costosa
    return obj.data.map((x) => x * 2);
});
```

---

## 2. HTTP Caching

### Cache-Control

```http
Cache-Control: max-age=3600, public
```

- **`max-age=3600`:** Cachear por 1 hora.
- **`public`:** Puede ser cacheado por CDNs.
- **`private`:** Solo cachear en el navegador del usuario.
- **`no-cache`:** Siempre revalidar con el servidor.
- **`no-store`:** No cachear nunca (datos sensibles).

### ETag (Entity Tag)

El servidor devuelve un hash del contenido. Si el contenido no cambió, devuelve `304 Not Modified`.

```http
ETag: "abc123"
If-None-Match: "abc123"
→ 304 Not Modified
```

---

## 3. Service Workers para Caching Offline

```javascript
// sw.js
const CACHE_NAME = "v1";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(["/", "/styles.css", "/app.js"]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Si está en caché, devolverlo
            return response || fetch(event.request);
        })
    );
});
```

---

## 4. LocalStorage vs SessionStorage vs IndexedDB

|                  | LocalStorage         | SessionStorage  | IndexedDB           |
|------------------|----------------------|-----------------|---------------------|
| **Persistencia** | Permanente           | Sesión del tab  | Permanente          |
| **Tamaño**       | ~5-10MB              | ~5-10MB         | Cientos de MB       |
| **API**          | Síncrona             | Síncrona        | Asíncrona           |
| **Uso**          | Preferencias simples | Estado temporal | Datos estructurados |

### Cuándo Usar Cada Uno

- **LocalStorage:** Tema oscuro/claro, idioma.
- **SessionStorage:** Formulario multi-paso (wizards).
- **IndexedDB:** Aplicaciones offline complejas (emails, documentos).

---

## 5. Estrategia: Stale-While-Revalidate

```javascript
async function fetchWithCache(url) {
    const cached = await caches.match(url);

    // Devolver caché inmediatamente (si existe)
    if (cached) {
        // Pero actualizar en segundo plano
        fetch(url).then((fresh) => {
            caches.open("v1").then((cache) => cache.put(url, fresh));
        });

        return cached;
    }

    // Si no hay caché, fetch normal
    const response = await fetch(url);
    caches.open("v1").then((cache) => cache.put(url, response.clone()));
    return response;
}
```

Esta estrategia da respuestas instantáneas mientras mantiene los datos actualizados.
