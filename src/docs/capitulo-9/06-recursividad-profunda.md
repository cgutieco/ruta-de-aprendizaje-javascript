# 06. Recursividad Profunda

La recursividad es cuando una función se llama a sí misma. Es elegante y fundamental para árboles y grafos, pero
peligrosa si no se entiende el **Call Stack**.

---

## 1. Anatomía de una Función Recursiva

Necesita dos cosas:

1. **Caso Base (Base Case):** La condición para detenerse. Sin esto, bucle infinito (Stack Overflow).
2. **Paso Recursivo:** La llamada a sí misma con un input más pequeño.

```javascript
function factorial(n) {
    if (n === 1) return 1; // Caso Base
    return n * factorial(n - 1); // Paso Recursivo
}
```

---

## 2. El Peligro: Stack Overflow

Cada llamada añade un "frame" al Call Stack. El Stack tiene un límite (aprox. 10,000 - 50,000 llamadas en navegadores).

```javascript
// Esto explotará
function infinito() {
    return infinito();
}

infinito(); // Uncaught RangeError: Maximum call stack size exceeded
```

---

## 3. Tail Call Optimization (TCO)

Es una optimización del motor. Si la llamada recursiva es **lo último** que hace la función, el motor puede reutilizar
el mismo frame del stack en lugar de crear uno nuevo.

**Nota:** JavaScript (ES6) especifica TCO, pero **solo Safari (JavaScriptCore)** lo implementa consistentemente. V8 (
Chrome/Node) no lo soporta por defecto.

```javascript
// No optimizable (porque hay que multiplicar después de que vuelva factorial)
return n * factorial(n - 1);

// Optimizable (Tail Recursive)
function factorialTail(n, acumulador = 1) {
    if (n === 1) return acumulador;
    return factorialTail(n - 1, n * acumulador); // La llamada es lo último
}
```

---

## 4. Ejemplo Práctico: Aplanar Arrays (Flatten)

```javascript
function aplanar(arr) {
    let resultado = [];
    for (let item of arr) {
        if (Array.isArray(item)) {
            // Recursividad: Si es array, aplánalo y concatena
            resultado = resultado.concat(aplanar(item));
        } else {
            // Caso base implícito: Si es número, añádelo
            resultado.push(item);
        }
    }
    return resultado;
}

console.log(aplanar([1, [2, [3, 4], 5]])); // [1, 2, 3, 4, 5]
```

Hoy en día puedes usar `arr.flat(Infinity)`, pero saber implementarlo es clásico de entrevistas.
