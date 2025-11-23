# 03. Variables: `let`, `const`, Hoisting y Shadowing

La gestión de variables en JavaScript ha evolucionado significativamente desde ES6 (2015). Entender no solo la sintaxis,
sino el ciclo de vida de una variable en memoria, es esencial para escribir código predecible y libre de errores.

---

## 1. Declaración de Variables

En JavaScript moderno (2025), `var` se considera obsoleto para la mayoría de los casos de uso, favoreciendo `let` y
`const`.

### 1.1. `const` (Constante)

Debe ser la opción por defecto.

- **Scope:** Bloque (`{ ... }`).
- **Reasignación:** Prohibida.
- **Inicialización:** Obligatoria en el momento de la declaración.

### 1.2. `let` (Variable reasignable)

Úsala solo cuando sepas que el valor de la variable necesita cambiar (ej. contadores en loops, acumuladores).

- **Scope:** Bloque.
- **Reasignación:** Permitida.
- **Inicialización:** Opcional (por defecto `undefined`).

### 1.3. `var` (Legacy)

- **Scope:** Función (o global si está fuera de una función). Ignora los bloques `if`, `for`, etc.
- **Reasignación:** Permitida.
- **Problema:** Su comportamiento con el _hoisting_ y el scope es contraintuitivo y propenso a bugs.

---

## 2. Hoisting (Elevación)

El _Hoisting_ es el comportamiento por el cual las declaraciones de variables y funciones son "movidas" virtualmente al
inicio de su scope durante la fase de compilación (antes de la ejecución).

### 2.1. Hoisting con `var`

Las variables declaradas con `var` son elevadas y **inicializadas con `undefined`**.

```javascript
console.log(x); // undefined (no da error)
var x = 5;
```

### 2.2. Hoisting con `let` y `const`

Las variables `let` y `const` **también son elevadas**, pero **NO son inicializadas**. Permanecen en un estado conocido
como **Temporal Dead Zone (TDZ)** hasta que la ejecución alcanza la línea de su declaración.

```javascript
// Inicio del scope (TDZ para 'y' comienza aquí)
console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 10; // (TDZ termina aquí)
```

La TDZ es una medida de seguridad: impide usar variables antes de que hayan sido declaradas explícitamente.

### 2.3. Hoisting de Funciones

- **Function Declaration:** Se elevan completas (nombre y cuerpo). Se pueden llamar antes de declararlas.
- **Function Expression (con `var`):** Se eleva solo la variable (como `undefined`). Fallará si intentas ejecutarla
  antes.
- **Function Expression (con `const`/`let`):** Siguen las reglas de TDZ.

---

## 3. Shadowing (Sombreado)

El _Shadowing_ ocurre cuando una variable declarada en un scope interno tiene el **mismo nombre** que una variable en un
scope externo. La variable interna "hace sombra" (oculta) a la externa dentro de ese bloque.

```javascript
let nombre = "Global";

function mostrarNombre() {
    let nombre = "Local"; // Shadowing: esta variable oculta a la global dentro de la función
    console.log(nombre); // "Local"
}

mostrarNombre();
console.log(nombre); // "Global" (la externa no fue afectada)
```

### 3.1. Illegal Shadowing

Hay un caso especial: no puedes declarar una variable con `let` en un scope interno si ya existe una variable con `var`
en el mismo scope de función (aunque sí al revés o en bloques distintos). Esto es un error de sintaxis para prevenir
ambigüedades.

---

## 4. Conclusión

Para un código moderno y robusto:

1. Usa **`const`** por defecto.
2. Usa **`let`** solo si es estrictamente necesario reasignar.
3. Evita **`var`** por completo para no lidiar con scopes de función confusos y hoisting inicializado a `undefined`.
4. Entiende la **TDZ** para depurar `ReferenceError` rápidamente.
