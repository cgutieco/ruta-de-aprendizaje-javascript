# 02. High Order Functions (Funciones de Orden Superior)

Una **High Order Function (HOF)** es cualquier función que cumpla al menos una de estas dos condiciones:

1. Recibe una o más funciones como argumentos (callbacks).
2. Retorna una función como resultado.

Este concepto es la piedra angular de la Programación Funcional en JavaScript y permite escribir código más declarativo,
modular y reutilizable.

---

## 1. Funciones como Argumentos (Callbacks)

El ejemplo más común son los métodos de array. En lugar de escribir un bucle `for` manual (imperativo), usamos una HOF
que abstrae la iteración.

```javascript
const numeros = [1, 2, 3, 4, 5];

// Imperativo
const dobles = [];
for (let i = 0; i < numeros.length; i++) {
    dobles.push(numeros[i] * 2);
}

// Declarativo (usando HOF)
const doblesHOF = numeros.map((n) => n * 2);
```

Aquí, `.map()` es la High Order Function porque recibe una función `(n => n * 2)` como argumento.

---

## 2. Métodos Esenciales de Array

### 2.1. `.map(callback)`

Transforma cada elemento del array y retorna un **nuevo array** de la misma longitud.

- **Uso:** Transformación de datos (ej. convertir objetos de usuario a strings de nombres).

### 2.2. `.filter(callback)`

Evalúa cada elemento con una condición booleana. Retorna un **nuevo array** con los elementos que pasaron la prueba (
`true`).

- **Uso:** Eliminar elementos, buscar subconjuntos.

### 2.3. `.reduce(callback, initialValue)`

Reduce el array a un **único valor** (que puede ser un número, string, objeto o incluso otro array).

- **Uso:** Sumas, conteos, agrupar datos, aplanar arrays.

```javascript
const carrito = [
    {producto: "Manzana", precio: 10},
    {producto: "Pera", precio: 15},
    {producto: "Uva", precio: 20},
];

const total = carrito.reduce((acumulador, item) => {
    return acumulador + item.precio;
}, 0); // 0 es el valor inicial del acumulador

console.log(total); // 45
```

### 2.4. Otros métodos útiles

- **`.find()`**: Retorna el _primer_ elemento que cumpla la condición (o `undefined`).
- **`.some()`**: Retorna `true` si _al menos un_ elemento cumple la condición.
- **`.every()`**: Retorna `true` si _todos_ los elementos cumplen la condición.
- **`.forEach()`**: Itera por efectos secundarios (no retorna nada). **Nota:** No es encadenable.

---

## 3. Retornando Funciones

Como vimos en el capítulo de Closures, una función puede crear y devolver otra función. Esto permite crear utilidades
genéricas.

```javascript
const greaterThan = (n) => {
    return (m) => m > n;
};

const greaterThan10 = greaterThan(10);
console.log(greaterThan10(11)); // true
```

---

## 4. Conclusión

Las High Order Functions permiten elevar el nivel de abstracción de tu código.

- Prefiere `.map`, `.filter` y `.reduce` sobre bucles `for`.
- Escribe funciones pequeñas y componibles que puedan ser pasadas como argumentos.
- Entender esto es requisito indispensable para dominar React (donde los componentes son funciones que a menudo reciben
  otras funciones como props).
