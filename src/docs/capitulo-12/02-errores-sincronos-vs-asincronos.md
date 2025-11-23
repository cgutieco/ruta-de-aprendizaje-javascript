# 02. Errores Sincrónicos vs Asíncronos

La naturaleza del error (síncrono o asíncrono) determina cómo debes capturarlo.

---

## 1. Errores Sincrónicos

Se capturan con `try/catch` normal.

```javascript
try {
    JSON.parse("no es JSON válido");
} catch (error) {
    console.error("Error atrapado:", error);
}
```

---

## 2. Errores en Callbacks (NO se capturan con try/catch)

```javascript
try {
    setTimeout(() => {
        throw new Error("Boom"); // ❌ No se captura
    }, 1000);
} catch (e) {
    console.log("Nunca llega aquí");
}
```

**Solución:** Manejar dentro del callback.

```javascript
setTimeout(() => {
    try {
        throw new Error("Boom");
    } catch (e) {
        console.error("Capturado:", e);
    }
}, 1000);
```

---

## 3. Errores en Promises

Las Promises capturan errores automáticamente.

```javascript
fetch("/api/data")
    .then((res) => res.json())
    .catch((error) => {
        console.error("Error en fetch:", error);
    });
```

---

## 4. Errores con async/await

`async/await` permite usar `try/catch` para código asíncrono.

```javascript
async function cargarDatos() {
    try {
        const response = await fetch("/api/data");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return null; // Fallback
    }
}
```

---

## 5. Manejadores Globales

Para errores que se escapan:

```javascript
// Errores síncronos no capturados
window.onerror = (message, source, lineno, colno, error) => {
    console.error("Error global:", error);
    return true; // Prevenir comportamiento por defecto del navegador
};

// Promesas rechazadas no manejadas
window.addEventListener("unhandledrejection", (event) => {
    console.error("Promise rechazada:", event.reason);
    event.preventDefault();
});
```
