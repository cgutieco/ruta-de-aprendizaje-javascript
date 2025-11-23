# 06. Errores en Promises y async/await

Las Promises cambiaron la forma en que manejamos errores asíncronos. Vamos a ver las mejores prácticas.

---

## 1. Cadenas de Promises con `.catch()`

```javascript
fetch("/api/user")
    .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
    })
    .then((data) => {
        console.log("Usuario:", data);
    })
    .catch((error) => {
        // Este catch atrapa errores de TODA la cadena
        console.error("Error en cadena:", error);
    });
```

**Importante:** Un solo `.catch()` al final captura errores de cualquier `.then()` anterior.

---

## 2. async/await con try/catch

Es más legible que las cadenas.

```javascript
async function obtenerUsuario(id) {
    try {
        const response = await fetch(`/api/user/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        throw error; // Re-lanzar o devolver null/default
    }
}
```

---

## 3. Promise.all (Fail-Fast)

Si UNA promesa falla, TODAS fallan.

```javascript
try {
    const [usuarios, posts] = await Promise.all([
        fetch("/api/users").then((r) => r.json()),
        fetch("/api/posts").then((r) => r.json()),
    ]);
    console.log(usuarios, posts);
} catch (error) {
    // Si /api/users O /api/posts fallan, llegas aquí
    console.error("Al menos una petición falló:", error);
}
```

---

## 4. Promise.allSettled (Graceful Degradation)

Ejecuta todas las promesas sin importar si algunas fallan.

```javascript
const results = await Promise.allSettled([
    fetch("/api/users").then((r) => r.json()),
    fetch("/api/posts").then((r) => r.json()),
    fetch("/api/comments").then((r) => r.json()),
]);

results.forEach((result, index) => {
    if (result.status === "fulfilled") {
        console.log(`Resultado ${index}:`, result.value);
    } else {
        console.error(`Error ${index}:`, result.reason);
    }
});
```

**Cuándo usar:**

- `Promise.all`: Si necesitas TODOS los datos para continuar.
- `Promise.allSettled`: Si algunas partes son opcionales y puedes continuar sin ellas.

---

## 5. Anti-patrón: Mezclar Callbacks y Promises

```javascript
// ❌ MAL
async function malo() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hola");
        }, 1000);
    });
}

// ✅ BIEN - Usa async/await directo cuando sea posible
async function bueno() {
    return new Promise((resolve) => setTimeout(resolve, 1000, "Hola"));
}

// ✅ MEJOR - Si tienes una función que usa callbacks, promisifícala
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```
