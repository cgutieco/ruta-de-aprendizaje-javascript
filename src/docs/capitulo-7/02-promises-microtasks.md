# 02. Promises y Microtasks

Una **Promesa** es un objeto que representa la terminación (o falla) eventual de una operación asíncrona y su valor
resultante.

---

## 1. Estados de una Promesa

Una promesa solo puede estar en uno de estos 3 estados:

1. **Pending (Pendiente):** Estado inicial. Ni cumplida ni rechazada.
2. **Fulfilled (Cumplida):** La operación se completó con éxito. Tiene un `value`.
3. **Rejected (Rechazada):** La operación falló. Tiene un `reason` (error).

**Importante:** Una vez que una promesa cambia de estado (se "resuelve"), es **inmutable**. No puede cambiar de nuevo.

---

## 2. Consumiendo Promesas

```javascript
fetch("/api/user")
    .then((response) => {
        // Se ejecuta si es Fulfilled
        return response.json();
    })
    .then((data) => {
        // Encadenamiento (Chaining)
        console.log(data);
    })
    .catch((error) => {
        // Se ejecuta si es Rejected (en CUALQUIER paso anterior)
        console.error(error);
    })
    .finally(() => {
        // Se ejecuta SIEMPRE (éxito o error)
        // Ideal para limpiar loading spinners
        console.log("Terminado");
    });
```

### 2.1. El valor de retorno de `.then()`

`.then()` **siempre devuelve una nueva Promesa**.

- Si retornas un valor (`return 5`), la nueva promesa se resuelve con ese valor.
- Si retornas una promesa (`return fetch(...)`), la nueva promesa "esperará" a esa promesa.
- Si lanzas un error (`throw new Error()`), la nueva promesa se rechaza.

---

## 3. Microtasks (Microtareas)

Aquí es donde la cosa se pone técnica. ¿Cuándo se ejecutan los `.then()`?

JavaScript tiene dos colas de tareas:

1. **Macrotasks (Task Queue):** `setTimeout`, `setInterval`, I/O, UI rendering.
2. **Microtasks (Job Queue):** `Promise.then`, `queueMicrotask`, `MutationObserver`.

**Regla de Oro:**
El Event Loop **siempre** vacía la cola de Microtasks COMPLETA antes de pasar a la siguiente Macrotask.

```javascript
console.log("1. Script start");

setTimeout(() => {
    console.log("5. Timeout (Macrotask)");
}, 0);

Promise.resolve()
    .then(() => {
        console.log("3. Promise 1 (Microtask)");
    })
    .then(() => {
        console.log("4. Promise 2 (Microtask)");
    });

console.log("2. Script end");
```

**Salida:**

1. Script start
2. Script end
3. Promise 1
4. Promise 2
5. Timeout

Las promesas tienen prioridad sobre los `setTimeout`. Esto asegura que la lógica asíncrona crítica se ejecute lo antes
posible.
