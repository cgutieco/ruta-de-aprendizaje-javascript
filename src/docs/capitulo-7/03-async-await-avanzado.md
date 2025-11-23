# 03. Async / Await Avanzado

`async/await` (ES2017) es "azúcar sintáctico" sobre las Promesas. Hace que el código asíncrono parezca síncrono.

---

## 1. Secuencial vs Paralelo

El error más común es usar `await` dentro de un bucle, matando el rendimiento.

### ❌ Secuencial (Lento)

Espera a que termine una para empezar la siguiente.

```javascript
async function cargarTodo() {
    const usuario = await fetchUser(); // Tarda 1s
    const pedidos = await fetchOrders(); // Tarda 1s
    const amigos = await fetchFriends(); // Tarda 1s

    // Total: 3 segundos
}
```

### ✅ Paralelo (Rápido)

Inicia todas a la vez y espera a que todas terminen.

```javascript
async function cargarTodo() {
    // Disparamos las promesas (aún no usamos await)
    const pUsuario = fetchUser();
    const pPedidos = fetchOrders();
    const pAmigos = fetchFriends();

    // Esperamos a todas juntas
    const [usuario, pedidos, amigos] = await Promise.all([
        pUsuario,
        pPedidos,
        pAmigos,
    ]);

    // Total: 1 segundo (el tiempo de la más lenta)
}
```

---

## 2. Métodos de Concurrencia

JavaScript ofrece 4 herramientas para manejar múltiples promesas:

1. **`Promise.all([p1, p2])`**:

    - Éxito: Si TODAS se cumplen.
    - Falla: Si UNA falla (fail-fast).
    - Uso: Datos interdependientes.

2. **`Promise.allSettled([p1, p2])`** (ES2020):

    - Éxito: Siempre espera a que todas terminen (bien o mal).
    - Retorna: Array de objetos `{ status: 'fulfilled', value }` o `{ status: 'rejected', reason }`.
    - Uso: Tareas independientes donde no importa si una falla.

3. **`Promise.race([p1, p2])`**:

    - Retorna: La primera que termine (sea éxito o error).
    - Uso: Timeouts (ej: petición vs timeout de 5s).

4. **`Promise.any([p1, p2])`** (ES2021):
    - Éxito: La primera que se cumpla con éxito.
    - Falla: Si TODAS fallan (AggregateError).
    - Uso: Redundancia (pedir a 3 servidores espejo, quedarse con el más rápido).

---

## 3. Top-Level Await (ES2022)

Antes, `await` solo podía usarse dentro de una función `async`. Ahora, en módulos (ES Modules), puedes usarlo en el
nivel superior del archivo.

```javascript
// db.js
const connection = await connectToDB(); // Bloquea la importación de este módulo hasta que conecte
export default connection;
```

**Cuidado:** Esto bloquea la carga de cualquier módulo que importe `db.js`. Úsalo con responsabilidad (ej:
inicialización crítica, carga de configuración).

---

## 4. Async Iterators (`for await...of`)

Para recorrer arrays de promesas o generadores asíncronos.

```javascript
const urls = ["/a", "/b", "/c"];
const promesas = urls.map((url) => fetch(url));

for await (const res of promesas) {
    console.log(await res.json());
}
```
