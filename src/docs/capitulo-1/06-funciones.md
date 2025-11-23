# 06. Funciones

Las funciones son ciudadanos de primera clase en JavaScript (_First-Class Citizens_). Esto significa que pueden ser
tratadas como cualquier otro valor: asignadas a variables, pasadas como argumentos y retornadas por otras funciones.

---

## 1. Tipos de Definición

### 1.1. Function Declaration (Declaración)

Es la forma clásica. Tiene la característica única de ser **elevada (hoisted)** completamente.

```javascript
saludar("Mundo"); // Funciona gracias al hoisting

function saludar(nombre) {
    return `Hola ${nombre}`;
}
```

### 1.2. Function Expression (Expresión)

Asigna una función anónima (o nombrada) a una variable. No se eleva (sigue las reglas de la variable, usualmente TDZ con
`const`).

```javascript
// saludar("Mundo"); // ❌ Error: ReferenceError

const saludar = function (nombre) {
    return `Hola ${nombre}`;
};
```

### 1.3. Arrow Functions (Funciones Flecha)

Introducidas en ES6, ofrecen una sintaxis concisa y un comportamiento diferente para `this`.

```javascript
const sumar = (a, b) => a + b; // Return implícito si es una sola línea
const cuadrado = (x) => x * x; // Paréntesis opcionales si es un solo argumento
```

**Diferencia clave:** Las Arrow Functions **no tienen su propio `this`**. Heredan el `this` del contexto léxico donde
fueron definidas (el padre). Esto las hace ideales para callbacks y métodos dentro de clases, pero **inadecuadas** para
métodos de objetos que necesitan acceder a sus propias propiedades mediante `this`.

---

## 2. Parámetros Modernos

### 2.1. Parámetros por Defecto (Default Parameters)

Permite inicializar parámetros si no se pasan o son `undefined`.

```javascript
function conectar(timeout = 1000) {
    console.log(`Conectando en ${timeout}ms`);
}

conectar(); // 1000
conectar(500); // 500
conectar(undefined); // 1000
conectar(null); // null (null es un valor válido, no activa el default)
```

### 2.2. Parámetros Rest (`...args`)

Permite capturar un número indefinido de argumentos en un array real. Reemplaza al antiguo objeto `arguments` (que no
era un array real).

```javascript
function sumarTodo(...numeros) {
    // 'numeros' es un Array [1, 2, 3, 4]
    return numeros.reduce((acc, curr) => acc + curr, 0);
}

sumarTodo(1, 2, 3, 4);
```

---

## 3. Retorno de Valores

Si una función no tiene una sentencia `return`, devuelve `undefined` implícitamente.

```javascript
const vacia = () => {
};
console.log(vacia()); // undefined
```

Para devolver objetos en arrow functions de una línea, debes envolver el objeto en paréntesis para no confundir las
llaves del objeto con las del cuerpo de la función.

```javascript
// ❌ Incorrecto (cree que es el cuerpo de la función)
const getUser = () => {
    name: "Alice";
}; // return undefined

// ✅ Correcto
const getUser = () => ({name: "Alice"});
```

---

## 4. Conclusión

- Usa **Function Declarations** si prefieres hoisting y usar la función antes de definirla (común en archivos de
  utilidades).
- Usa **Arrow Functions** para la mayoría de los casos modernos, especialmente callbacks y programación funcional, por
  su concisión y `this` léxico.
- Usa **Function Expressions** si necesitas definir una función condicionalmente dentro de una variable.
