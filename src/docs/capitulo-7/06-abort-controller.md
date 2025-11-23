# 06. AbortController y Cancelación

En el mundo real, los usuarios cambian de opinión. Hacen clic en "Buscar", luego borran el texto, luego escriben otra
cosa. Si no cancelas las peticiones anteriores, tendrás **Race Conditions** (la respuesta vieja llega después de la
nueva y sobrescribe la UI).

`AbortController` es la API estándar para cancelar operaciones asíncronas.

---

## 1. Cancelando Fetch

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch("/api/heavy-data", {signal})
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => {
        if (err.name === "AbortError") {
            console.log("Petición cancelada por el usuario");
        } else {
            console.error("Error real:", err);
        }
    });

// En algún momento (ej: usuario pulsa botón "Cancelar")
controller.abort();
```

Al llamar a `abort()`, la promesa del fetch se rechaza inmediatamente con un `DOMException` de nombre `AbortError`.

---

## 2. Patrón: Typeahead Search (Búsqueda en vivo)

El caso de uso más común. El usuario escribe "H", "Ho", "Hol", "Hola". No quieres 4 peticiones simultáneas compitiendo.
Quieres cancelar la anterior cuando empieza una nueva.

```javascript
let currentController = null;

async function buscar(query) {
    // 1. Si hay una petición en vuelo, cancélala
    if (currentController) {
        currentController.abort();
    }

    // 2. Crea un nuevo controlador para la nueva petición
    currentController = new AbortController();

    try {
        const res = await fetch(`/api/search?q=${query}`, {
            signal: currentController.signal,
        });
        const resultados = await res.json();
        renderizar(resultados);
    } catch (error) {
        if (error.name === "AbortError") return; // Ignorar cancelaciones
        console.error(error);
    } finally {
        currentController = null;
    }
}

input.addEventListener("input", (e) => buscar(e.target.value));
```

---

## 3. Cancelando Event Listeners (Recap)

Como vimos en el capítulo anterior, `AbortSignal` también sirve para limpiar eventos.

```javascript
const controller = new AbortController();

window.addEventListener("resize", handleResize, {signal: controller.signal});
window.addEventListener("scroll", handleScroll, {signal: controller.signal});

// Limpieza total al desmontar componente
controller.abort();
```

---

## 4. Conclusión

- Usa `AbortController` siempre que tengas una operación asíncrona que pueda quedar obsoleta por una acción del usuario.
- Maneja el `AbortError` silenciosamente (no es un error real, es control de flujo).
- Es fundamental para evitar bugs de UI en aplicaciones React/Vue (efectos de limpieza).
