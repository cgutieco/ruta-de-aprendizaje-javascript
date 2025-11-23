# 01. Big-O Notation Aplicado

**Big-O Notation** es el lenguaje que usamos para describir el rendimiento de un algoritmo. No mide segundos, mide *
*cómo crece el número de operaciones** a medida que crece el input (`n`).

---

## 1. Complejidad Temporal (Time Complexity)

### O(1) - Constante

El tiempo es el mismo sin importar si hay 10 o 10 millones de elementos.

```javascript
const arr = [1, 2, 3, 4, 5];
console.log(arr[0]); // O(1) - Acceso directo
```

### O(n) - Lineal

Si duplicas el input, duplicas el tiempo.

```javascript
// Buscar un valor (sin saber el índice)
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 5) return true;
}
```

### O(log n) - Logarítmica

Extremadamente eficiente. Común en algoritmos que dividen el problema a la mitad en cada paso (Binary Search).

### O(n^2) - Cuadrática

Bucles anidados. Peligroso para inputs grandes.

```javascript
// Bubble Sort o comparar todos con todos
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        console.log(i, j);
    }
}
```

---

## 2. Complejidad Espacial (Space Complexity)

¿Cuánta memoria RAM extra necesitamos?

- **O(1):** Usamos variables fijas (`let sum = 0`).
- **O(n):** Creamos un nuevo array del mismo tamaño que el input.

```javascript
// O(n) Espacial
function duplicar(arr) {
    let nuevo = [];
    for (let num of arr) {
        nuevo.push(num * 2);
    }
    return nuevo;
}
```

---

## 3. Arrays en JavaScript (Bajo el capó)

- **Push/Pop:** O(1) (generalmente).
- **Shift/Unshift:** O(n) (¡Cuidado!). Al insertar/borrar al principio, hay que reindexar TODOS los elementos
  siguientes.
- **Access:** O(1).
- **Search:** O(n).

---

## 4. Conclusión

Antes de escribir código, piensa: ¿Es esto O(n) o O(n^2)? Si puedes bajar de O(n^2) a O(n) o O(log n), tu aplicación
volará.
