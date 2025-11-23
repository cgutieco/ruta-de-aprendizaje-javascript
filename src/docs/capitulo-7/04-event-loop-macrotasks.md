# 04. Event Loop, Macrotasks y Job Queue

JavaScript es **Single Threaded** (un solo hilo). Solo puede hacer una cosa a la vez. ¿Cómo puede entonces manejar
clics, peticiones HTTP y timers sin bloquearse? Gracias al **Event Loop**.

---

## 1. Componentes Principales

1. **Call Stack (Pila de Llamadas):** Donde se ejecuta el código JS síncrono. LIFO (Last In, First Out).
2. **Web APIs:** Funcionalidades del navegador (DOM, fetch, setTimeout) que viven fuera del hilo de JS.
3. **Callback Queue (Macrotasks):** Cola para callbacks de `setTimeout`, `setInterval`, eventos del DOM.
4. **Job Queue (Microtasks):** Cola de alta prioridad para Promesas y `queueMicrotask`.
5. **Event Loop:** El portero. Mira si el Call Stack está vacío. Si lo está, mueve cosas de las colas al Stack.

---

## 2. El Ciclo de Vida

1. Ejecuta todo el código síncrono en el **Call Stack**.
2. Cuando el Stack está vacío, procesa **TODAS** las **Microtasks** (Job Queue) hasta que se vacíe la cola.
3. Si hay necesidad de renderizar (repintar UI), lo hace.
4. Toma **UNA** tarea de la **Macrotask Queue** y la mueve al Stack.
5. Repite.

---

## 3. Ejemplo Complejo de Orden

Intenta predecir el orden antes de ver la respuesta.

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

Promise.resolve().then(() => {
    console.log("4");
    setTimeout(() => console.log("5"), 0);
});

console.log("6");
```

**Respuesta:**

1. `1` (Síncrono)
2. `6` (Síncrono)
3. `3` (Microtask 1)
4. `4` (Microtask 2)
5. `2` (Macrotask 1 - Estaba en cola desde el principio)
6. `5` (Macrotask 2 - Se encoló dentro de la microtask)

---

## 4. Bloqueo del Event Loop

Si ejecutas un bucle `while(true)` o una operación matemática pesada en el Call Stack, el Event Loop se detiene.

- No se procesan clics.
- No se pintan cambios en pantalla.
- El navegador muestra "La página no responde".

**Solución:**
Usa **Web Workers** para cálculos pesados o divide la tarea en trozos pequeños usando `setTimeout` (para dar respiro al
renderizado) o `requestIdleCallback`.
