# 02. Primitivos vs Referencias

En JavaScript, la distinción entre tipos primitivos y tipos de referencia es fundamental para entender cómo se
almacenan, copian y comparan los datos en memoria. Esta diferencia es la fuente de numerosos errores sutiles
relacionados con la mutación inesperada de datos.

---

## 1. Tipos de Datos en JavaScript

JavaScript es un lenguaje de **tipado dinámico**, lo que significa que las variables no tienen tipos asociados, pero los
valores sí. Existen dos categorías principales de tipos de datos:

### 1.1. Tipos Primitivos (Primitives)

Son datos inmutables que representan un único valor. Se almacenan directamente en la **Pila (Stack)** (simplificación
conceptual, aunque los motores modernos optimizan esto).

Existen 7 tipos primitivos oficiales en ES2025:

1. `string`
2. `number`
3. `bigint`
4. `boolean`
5. `undefined`
6. `symbol`
7. `null` (técnicamente un primitivo, aunque `typeof null === 'object'` por un bug histórico).

**Características clave:**

- **Inmutabilidad:** No se pueden modificar. Si cambias una variable primitiva, estás reasignando un nuevo valor, no
  modificando el existente en memoria.
- **Paso por Valor:** Al asignar una variable primitiva a otra, se crea una **copia independiente** del valor.

### 1.2. Tipos de Referencia (Objects)

Cualquier cosa que no sea un primitivo es un Objeto. Esto incluye:

- `Object` (`{}`)
- `Array` (`[]`)
- `Function`
- `Date`, `RegExp`, `Map`, `Set`, etc.

**Características clave:**

- **Mutabilidad:** Sus propiedades pueden cambiar sin cambiar la identidad del objeto.
- **Paso por Referencia:** La variable no almacena el objeto en sí, sino una **dirección de memoria (puntero)** que
  apunta a la ubicación del objeto en el **Heap**.

---

## 2. Asignación por Valor vs. Referencia

### 2.1. Paso por Valor (Primitivos)

Cuando asignamos un primitivo a otra variable, se copia el contenido real.

```javascript
let a = 10;
let b = a; // Se copia el valor 10 a 'b'

b = 20;

console.log(a); // 10 (intacto)
console.log(b); // 20
```

### 2.2. Paso por Referencia (Objetos)

Cuando asignamos un objeto a otra variable, copiamos la **referencia**, no el objeto. Ambas variables apuntan al mismo
espacio en memoria.

```javascript
const obj1 = {valor: 10};
const obj2 = obj1; // Se copia la REFERENCIA (dirección de memoria)

obj2.valor = 20; // Modificamos el objeto compartido

console.log(obj1.valor); // 20 (¡Modificado!)
console.log(obj2.valor); // 20
```

Este comportamiento es crucial al pasar objetos a funciones. Si una función muta un objeto recibido como argumento, el
cambio persistirá fuera de la función (efecto secundario).

---

## 3. Inmutabilidad y `const`

Es un error común pensar que `const` hace que un valor sea inmutable.

- **`const`** evita la **reasignación** del identificador (la variable).
- No evita la **mutación** del valor al que apunta, si este es un objeto.

```javascript
const user = {name: "Alice"};

// ❌ Error: No se puede reasignar la variable
// user = { name: "Bob" };

// ✅ Permitido: Se puede mutar el objeto referenciado
user.name = "Bob";
```

Para lograr verdadera inmutabilidad en objetos, se requieren métodos como `Object.freeze()` (superficial) o estructuras
de datos inmutables (que veremos en capítulos posteriores).

---

## 4. Comparación de Igualdad

### 4.1. Primitivos

Se comparan por **valor**.

```javascript
console.log(5 === 5); // true
console.log("hola" === "hola"); // true
```

### 4.2. Referencias

Se comparan por **referencia** (dirección de memoria). Dos objetos distintos con el mismo contenido **no son iguales**.

```javascript
const a = {id: 1};
const b = {id: 1};
const c = a;

console.log(a === b); // false (distintas direcciones de memoria)
console.log(a === c); // true (misma dirección de memoria)
```

---

## 5. Conclusión

Entender la diferencia entre primitivos y referencias es el primer paso para dominar la gestión de estado en JavaScript.

- Usa primitivos para valores simples y estáticos.
- Ten cuidado con los objetos al pasarlos entre funciones; considera usar patrones inmutables (copias con spread
  operator `...`) para evitar efectos secundarios no deseados.
