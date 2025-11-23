# 07. Scope (Ámbito)

El **Scope** define la accesibilidad (visibilidad) de las variables. Determina dónde puedes usar una variable y dónde
no. Entender el scope es vital para evitar conflictos de nombres y gestionar la memoria (Garbage Collection).

---

## 1. Tipos de Scope

### 1.1. Scope Global

Variables declaradas fuera de cualquier función o bloque.

- En el navegador: `window` / `globalThis`.
- En Node.js: `global`.

**Peligro:** Las variables globales son accesibles y modificables desde cualquier parte del código. Evítalas para
prevenir colisiones y efectos secundarios impredecibles ("Polluting the Global Namespace").

### 1.2. Scope de Función (Function Scope)

Cada función crea su propio ámbito. Las variables declaradas dentro (con `var`, `let` o `const`) no son accesibles desde
fuera.

```javascript
function secreto() {
    const clave = "1234";
}

// console.log(clave); // ❌ ReferenceError
```

### 1.3. Scope de Bloque (Block Scope)

Introducido en ES6 con `let` y `const`. Cualquier bloque delimitado por llaves `{ ... }` (if, for, switch) crea un nuevo
scope.

```javascript
if (true) {
    let mensaje = "Hola";
    var antiguo = "Mundo";
}

console.log(antiguo); // "Mundo" (var ignora el bloque)
// console.log(mensaje); // ❌ ReferenceError (let respeta el bloque)
```

---

## 2. Scope Léxico (Lexical Scope)

JavaScript utiliza **Scope Léxico** (o estático). Esto significa que la accesibilidad de las variables se determina **en
el momento de escribir el código**, según dónde están anidadas las funciones, y no en el momento de ejecución (donde son
llamadas).

Una función interna tiene acceso a las variables de su función externa (padre), pero no al revés.

```javascript
const global = "Soy global";

function externa() {
    const variableExterna = "Soy externa";

    function interna() {
        const variableInterna = "Soy interna";
        // Puede acceder a su propio scope, al del padre y al global
        console.log(variableInterna);
        console.log(variableExterna);
        console.log(global);
    }

    interna();
    // console.log(variableInterna); // ❌ Error: el padre no ve al hijo
}
```

### 2.1. Scope Chain (Cadena de Scope)

Cuando el motor busca una variable:

1. Busca en el scope actual.
2. Si no la encuentra, sube al scope padre (outer scope).
3. Repite hasta llegar al Scope Global.
4. Si no la encuentra en el Global, lanza `ReferenceError`.

Esta búsqueda es unidireccional: **siempre hacia arriba**.

---

## 3. Conclusión

El dominio del Scope es la base para entender **Closures** (que veremos en el Capítulo 2).

- Mantén tus variables lo más privadas posible (Principio de Mínimo Privilegio).
- Prefiere Scope de Bloque (`let`/`const`) sobre Scope de Función (`var`).
- Recuerda que el anidamiento físico en el código fuente define quién puede ver qué.
