# 06. Garbage Collector

JavaScript tiene **Garbage Collection automático**: libera memoria de objetos que ya no se usan. Pero puedes causar *
*memory leaks** si no tienes cuidado.

---

## 1. Cómo Funciona el GC (Mark and Sweep)

1. **Mark (Marcar):** El GC marca todos los objetos alcanzables desde las raíces (variables globales, stack).
2. **Sweep (Barrer):** Libera la memoria de objetos no marcados.

---

## 2. Causas Comunes de Memory Leaks

### Event Listeners No Removidos

```javascript
// ❌ LEAK
function setupButton() {
    const button = document.querySelector("#btn");
    button.addEventListener("click", () => {
        console.log("Clicked");
    });
    // Si el botón se remueve del DOM, el listener queda en memoria
}
```

```javascript
// ✅ FIX
function setupButton() {
    const button = document.querySelector("#btn");
    const handler = () => console.log("Clicked");

    button.addEventListener("click", handler);

    return () => button.removeEventListener("click", handler);
}

const cleanup = setupButton();
// Cuando ya no lo necesites:
cleanup();
```

O usa `AbortController` (visto en capítulos anteriores).

---

### Timers No Cancelados

```javascript
// ❌ LEAK
function startPolling() {
    setInterval(() => {
        fetch("/api/status");
    }, 1000);
}
```

```javascript
// ✅ FIX
function startPolling() {
    const intervalId = setInterval(() => {
        fetch("/api/status");
    }, 1000);

    return () => clearInterval(intervalId);
}

const stopPolling = startPolling();
// Cuando termines:
stopPolling();
```

---

### Closures que Retienen Referencias

```javascript
// ❌ LEAK
function createBigClosure() {
    const hugeArray = new Array(1000000).fill("data");

    return function () {
        console.log("Hola");
        // hugeArray queda en memoria aunque no se use
    };
}
```

```javascript
// ✅ FIX
function createBigClosure() {
    const hugeArray = new Array(1000000).fill("data");

    // Procesar y descartar
    const result = hugeArray.length;

    return function () {
        console.log("Hola", result);
        // hugeArray ya puede ser liberado
    };
}
```

---

### Variables Globales Accidentales

```javascript
// ❌ LEAK
function leak() {
    foo = "Esto es global sin querer"; // Sin var/let/const
}
```

Usa `'use strict';` para prevenir esto.

---

## 3. WeakMap y WeakSet

Permiten que las keys sean garbage-collected.

```javascript
const cache = new WeakMap();

let user = {id: 1};
cache.set(user, {data: "info"});

user = null; // El objeto {id: 1} puede ser liberado por el GC
```

Útil para memoization sin memory leaks.

---

## 4. Detectando Memory Leaks

### Chrome DevTools Memory Panel

1. Toma un heap snapshot.
2. Realiza acciones en tu app.
3. Toma otro snapshot.
4. Compara para ver qué objetos no fueron liberados.

---

## 5. Performance.memory (Chrome)

```javascript
console.log(performance.memory);
// {
//   usedJSHeapSize: 10000000,
//   totalJSHeapSize: 15000000,
//   jsHeapSizeLimit: 2000000000
// }
```

Útil para monitorear el uso de memoria durante desarrollo.

---

## 6. Conclusión

El GC es automático, pero no mágico. **Sé consciente de las referencias** y limpia recursos cuando ya no los necesites.
