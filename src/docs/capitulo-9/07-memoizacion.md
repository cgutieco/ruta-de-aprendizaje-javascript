# 07. Memoización

La memoización es una técnica de optimización específica: **Guardar el resultado de una función pura para no volver a
calcularlo.**

Es el corazón de la **Programación Dinámica**.

---

## 1. El Problema: Fibonacci Recursivo

```javascript
// O(2^n) - Exponencial (Terrible)
function fib(n) {
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
}
```

Para `fib(50)`, esto tardará minutos o colgará el navegador. Calcula `fib(2)` millones de veces.

---

## 2. La Solución: Memoización

Guardamos lo que ya calculamos en un objeto (caché).

```javascript
// O(n) - Lineal (Excelente)
function fibMemo(n, memo = {}) {
    if (memo[n]) return memo[n]; // ¿Ya lo calculé? Devuélvelo.
    if (n <= 2) return 1;

    const resultado = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    memo[n] = resultado; // Guárdalo antes de devolverlo
    return resultado;
}
```

Para `fib(50)`, esto tarda milisegundos.

---

## 3. Función `memoize` Genérica

Podemos crear una función que vuelva "inteligente" a cualquier función.

```javascript
function memoize(fn) {
    const cache = {};
    return function (...args) {
        // Usamos los argumentos como clave (JSON.stringify para múltiples args)
        const key = JSON.stringify(args);

        if (cache[key]) {
            console.log("Desde caché");
            return cache[key];
        }

        const result = fn.apply(this, args);
        cache[key] = result;
        console.log("Calculando...");
        return result;
    };
}

const fibRapido = memoize(fib);
```

---

## 4. Cuándo usarla

- **Sí:** Funciones puras, costosas computacionalmente, con inputs repetitivos.
- **No:** Funciones con efectos secundarios (AJAX), o funciones muy rápidas (sumar dos números) donde buscar en el caché
  es más lento que ejecutar la función.
