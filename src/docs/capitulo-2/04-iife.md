# 04. IIFE (Immediately Invoked Function Expressions)

Una **IIFE** (pronunciado "iffy") es una función que se ejecuta tan pronto como se define. Aunque su uso ha disminuido
con la llegada de los módulos ES6 (`import`/`export`) y `let`/`const`, sigue siendo un patrón vital para entender código
legado y para ciertos casos de uso modernos.

---

## 1. Sintaxis

El patrón consiste en envolver una función anónima entre paréntesis (para convertirla en una expresión) y luego
invocarla inmediatamente con otro par de paréntesis.

```javascript
(function () {
    console.log("¡Me ejecuto inmediatamente!");
})();

// Variante con Arrow Function
(() => {
    console.log("Yo también soy inmediata");
})();
```

### 1.1. ¿Por qué los paréntesis?

Si escribes `function() {}()` sin paréntesis envolventes, el parser de JavaScript lo interpretará como una declaración
de función fallida (porque no tiene nombre) y lanzará un error de sintaxis. Los paréntesis fuerzan al motor a tratarlo
como una **expresión**.

---

## 2. Propósito Histórico: El Module Pattern

Antes de ES6, JavaScript no tenía módulos nativos ni scope de bloque. Las variables declaradas con `var` en el scope
global contaminaban el espacio de nombres global (`window`), causando colisiones.

Las IIFE se usaban para crear un **scope privado artificial**.

```javascript
var contadorGlobal = (function () {
    var cuentaPrivada = 0; // No accesible desde fuera

    return {
        incrementar: function () {
            cuentaPrivada++;
            return cuentaPrivada;
        },
        reset: function () {
            cuentaPrivada = 0;
        },
    };
})();

contadorGlobal.incrementar(); // 1
// contadorGlobal.cuentaPrivada; // undefined
```

Este patrón fue la base de bibliotecas como jQuery y de los primeros sistemas de módulos (AMD, CommonJS).

---

## 3. Uso Moderno (2025)

Aunque ya no necesitamos IIFEs para privacidad (gracias a los módulos y `let`/`const`), todavía tienen usos específicos:

### 3.1. Async/Await en nivel superior (Top-Level Await)

Aunque Node.js y navegadores modernos soportan _Top-Level Await_ en módulos, a veces necesitas ejecutar código asíncrono
en un script antiguo o en un entorno que no lo soporta.

```javascript
(async () => {
    try {
        const data = await fetch("/api/datos");
        const json = await data.json();
        console.log(json);
    } catch (error) {
        console.error(error);
    }
})();
```

### 3.2. Evitar contaminar el scope global en scripts pequeños

Si estás inyectando un script pequeño en una página y no quieres chocar con otras librerías.

### 3.3. Inicialización compleja de constantes

A veces quieres inicializar una `const` con una lógica compleja que requiere varias líneas (`if/else`, bucles), pero no
quieres ensuciar el scope con variables temporales.

```javascript
const config = (() => {
    const env = process.env.NODE_ENV;
    if (env === "production") {
        return {url: "https://api.prod.com", debug: false};
    } else {
        return {url: "http://localhost:3000", debug: true};
    }
})();
```

---

## 4. Conclusión

Las IIFE son una herramienta clásica del arsenal JavaScript.

- **Antes:** Eran obligatorias para modularidad y privacidad.
- **Ahora:** Son útiles para aislar lógica, inicializar variables complejas y ejecutar código asíncrono inmediato.
- Reconocerlas es esencial para leer código de librerías y proyectos legacy.
