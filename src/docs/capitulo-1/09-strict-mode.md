# 09. Strict Mode (`'use strict'`)

Introducido en ECMAScript 5, el **Strict Mode** es una forma de optar por una variante más restringida, segura y
optimizada de JavaScript. Convierte "errores silenciosos" en excepciones reales y prohíbe sintaxis problemática.

---

## 1. Cómo activarlo

Se activa añadiendo la cadena `'use strict';` al inicio de un script o de una función.

### 1.1. Script completo

```javascript
"use strict";
// Todo el código aquí es estricto
x = 3.14; // ReferenceError (x no está definida)
```

### 1.2. Función individual

```javascript
function estricta() {
    "use strict";
    return "Soy estricta";
}

function normal() {
    return "Soy relajada";
}
```

### 1.3. Módulos y Clases

En JavaScript moderno (ES Modules y Clases), **el Strict Mode está activado por defecto**. No necesitas escribir
`'use strict'` si estás usando `import`/`export` o `class`.

---

## 2. Principales Cambios y Beneficios

### 2.1. Prohíbe variables globales accidentales

En modo no estricto, asignar a una variable no declarada crea una variable global automáticamente. En modo estricto,
lanza error.

```javascript
"use strict";
mensaje = "Hola"; // ❌ ReferenceError: mensaje is not defined
```

### 2.2. Elimina `this` silencioso

En modo no estricto, si una función se llama sin contexto, `this` apunta al objeto global (`window`). En modo estricto,
`this` es `undefined`. Esto previene modificaciones accidentales del objeto global.

```javascript
"use strict";

function mostrarThis() {
    console.log(this);
}

mostrarThis(); // undefined (en lugar de Window)
```

### 2.3. Parámetros duplicados prohibidos

```javascript
"use strict";

// ❌ SyntaxError: Duplicate parameter name not allowed in this context
function sumar(a, a, b) {
    return a + a + b;
}
```

### 2.4. Asignación a propiedades de solo lectura

```javascript
"use strict";
const obj = {};
Object.defineProperty(obj, "x", {value: 42, writable: false});

obj.x = 9; // ❌ TypeError (en modo normal fallaría silenciosamente)
```

### 2.5. Prohíbe palabras reservadas futuras

Palabras como `implements`, `interface`, `package`, `private`, `protected`, `public`, `static` y `yield` están
reservadas.

---

## 3. Conclusión

El uso de `'use strict'` es una **buena práctica obligatoria** en el desarrollo profesional.

- Ayuda a escribir código "más limpio".
- Facilita la optimización por parte de los motores JS (V8 puede optimizar mejor el código estricto).
- Previene bugs comunes de principiantes.

Dado que los bundlers modernos (Webpack, Vite) y los módulos ES lo activan automáticamente, es probable que ya estés
usándolo sin darte cuenta. Sin embargo, es vital conocer sus reglas para entender por qué ciertos errores ocurren.
