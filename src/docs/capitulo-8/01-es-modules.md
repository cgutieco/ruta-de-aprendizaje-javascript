# 01. ES Modules (ECMAScript Modules)

Durante años, JavaScript no tuvo un sistema de módulos nativo (usábamos CommonJS en Node.js o AMD/RequireJS en el
navegador). Desde ES6 (2015), tenemos **ES Modules (ESM)**, el estándar oficial.

---

## 1. Sintaxis Básica

### 1.1. Named Exports (Exportaciones Nombradas)

Puedes exportar múltiples cosas desde un archivo.

```javascript
// math.js
export const PI = 3.1416;

export function sumar(a, b) {
    return a + b;
}
```

```javascript
// main.js
import {PI, sumar} from "./math.js";

console.log(sumar(2, 2)); // 4
```

### 1.2. Default Exports (Exportación por Defecto)

Solo una por archivo. Útil para clases o componentes principales.

```javascript
// User.js
export default class User {
    constructor(name) {
        this.name = name;
    }
}
```

```javascript
// main.js
import User from "./User.js"; // Puedes ponerle el nombre que quieras
```

---

## 2. Importaciones Dinámicas (`import()`)

A veces no quieres cargar todo el código al inicio (para mejorar el rendimiento). `import()` permite cargar módulos bajo
demanda. Retorna una **Promesa**.

```javascript
const btn = document.querySelector("#btn-analisis");

btn.addEventListener("click", async () => {
    // El módulo 'heavy-analytics.js' solo se descarga si el usuario hace clic
    const modulo = await import("./heavy-analytics.js");

    modulo.iniciarAnalisis();
});
```

---

## 3. Top-Level Await

En módulos ES, puedes usar `await` fuera de funciones `async`. Esto es útil para inicializaciones que dependen de
promesas.

```javascript
// db.js
const connection = await connectToDB(); // Bloquea la carga del módulo
export default connection;
```

**Cuidado:** Si `db.js` tarda 5 segundos en conectar, cualquier archivo que haga `import ... from './db.js'` esperará
esos 5 segundos antes de ejecutarse.

---

## 4. Circular Dependencies (Dependencias Circulares)

Ocurre cuando A importa B, y B importa A.

```javascript
// a.js
import {b} from "./b.js";

export const a = "A";

// b.js
import {a} from "./a.js"; // ¡Peligro! 'a' podría ser undefined aquí
export const b = "B";
```

ES Modules maneja esto mejor que CommonJS gracias a los "Live Bindings" (enlaces vivos), pero sigue siendo una mala
práctica arquitectónica.
**Solución:** Extrae la lógica compartida a un tercer archivo `c.js` y haz que A y B importen de C.

---

## 5. Conclusión

- Usa **Named Exports** para utilidades y librerías (fuerza a usar el nombre correcto).
- Usa **Default Exports** para componentes o clases principales.
- Usa **Dynamic Imports** para Code Splitting y Lazy Loading.
- Evita dependencias circulares refactorizando tu código.
