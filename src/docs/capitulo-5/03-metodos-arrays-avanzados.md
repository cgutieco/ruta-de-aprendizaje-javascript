# 03. Métodos Avanzados de Arrays

Más allá de `map`, `filter` y `forEach`, JavaScript moderno tiene herramientas poderosas para manipulación de datos
compleja.

---

## 1. `Array.prototype.reduce()`

El método más incomprendido y poderoso. Transforma un array en **cualquier cosa** (un número, un objeto, otro array, una
promesa...).

### 1.1. Anatomía

```javascript
array.reduce((acumulador, actual, indice, array) => {
    // lógica
    return nuevoAcumulador;
}, valorInicial);
```

### 1.2. Patrón: Pipeline de Funciones

```javascript
const funciones = [(x) => x * 2, (x) => x + 10, (x) => `Resultado: ${x}`];

const valor = 5;
const resultado = funciones.reduce((acc, fn) => fn(acc), valor);
// 5 * 2 = 10 -> 10 + 10 = 20 -> "Resultado: 20"
```

### 1.3. Patrón: Agrupamiento (GroupBy manual)

```javascript
const frutas = ["manzana", "pera", "manzana", "uva"];

const conteo = frutas.reduce((acc, fruta) => {
    acc[fruta] = (acc[fruta] || 0) + 1;
    return acc;
}, {});
// { manzana: 2, pera: 1, uva: 1 }
```

_Nota: Ahora existe `Object.groupBy()` nativo, pero saber hacerlo con reduce es vital._

---

## 2. `flatMap()`

Combina `map()` seguido de `flat(1)`. Es más eficiente que hacerlos por separado.
Útil cuando tu función de mapeo devuelve un array y quieres "aplanar" el resultado.

```javascript
const frases = ["Hola mundo", "Adiós mundo"];

// Queremos un array con todas las palabras individuales
const palabras = frases.flatMap((frase) => frase.split(" "));
// ["Hola", "mundo", "Adiós", "mundo"]

// Con map sería: [["Hola", "mundo"], ["Adiós", "mundo"]]
```

---

## 3. Nuevos Métodos Inmutables (ES2023)

Históricamente, métodos como `sort`, `splice` y `reverse` mutaban el array original, causando bugs difíciles de
rastrear.
ES2023 introdujo sus contrapartes inmutables (retornan un nuevo array).

1. **`toSorted(fn)`**: Igual que `sort()`, pero devuelve copia.
2. **`toReversed()`**: Igual que `reverse()`, pero devuelve copia.
3. **`toSpliced(start, deleteCount, ...items)`**: Igual que `splice()`.
4. **`with(index, value)`**: Devuelve una copia con el elemento en `index` reemplazado.

```javascript
const numeros = [3, 1, 2];

const ordenados = numeros.toSorted();
console.log(ordenados); // [1, 2, 3]
console.log(numeros); // [3, 1, 2] (Intacto!)

const actualizado = numeros.with(1, 99);
// [3, 99, 2]
```

---

## 4. `at()` y `findLast()`

### 4.1. `at(index)`

Permite usar índices negativos (como en Python).

```javascript
const arr = [10, 20, 30];
console.log(arr.at(-1)); // 30 (último elemento)
```

### 4.2. `findLast()` y `findLastIndex()`

Buscan desde el final hacia el principio.

```javascript
const nums = [5, 12, 8, 130, 44];
const ultimoPar = nums.findLast((n) => n % 2 === 0); // 44
```

---

## 5. Conclusión

Prefiere siempre los métodos inmutables (`toSorted`, `map`, `filter`, `reduce`) sobre los mutables (`sort`, `push`,
`pop`) para mantener un flujo de datos predecible, especialmente en aplicaciones React/Redux.
