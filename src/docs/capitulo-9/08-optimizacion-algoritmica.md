# 08. Técnicas de Optimización Algorítmica

Más allá de las estructuras de datos, existen **patrones** para resolver problemas comunes de forma eficiente (
generalmente bajando de O(n^2) a O(n)).

---

## 1. Multiple Pointers (Punteros Múltiples)

**Problema:** En un array **ordenado**, encontrar el primer par de números que sumen 0. `[-3, -2, -1, 0, 1, 2, 3]`.

- **Fuerza Bruta O(n^2):** Dos bucles anidados.
- **Punteros O(n):** Un puntero al inicio (`left`) y otro al final (`right`).

```javascript
function sumZero(arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        let sum = arr[left] + arr[right];
        if (sum === 0) {
            return [arr[left], arr[right]];
        } else if (sum > 0) {
            right--; // La suma es muy grande, necesitamos números menores
        } else {
            left++; // La suma es muy pequeña, necesitamos números mayores
        }
    }
}
```

---

## 2. Sliding Window (Ventana Deslizante)

**Problema:** Encontrar la suma máxima de `n` números consecutivos en un array.

- **Fuerza Bruta O(n^2):** Recalcular la suma del sub-array en cada paso.
- **Sliding Window O(n):** Calcular la primera ventana. Luego, para mover la ventana a la derecha, **restar** el número
  que sale y **sumar** el que entra.

```javascript
function maxSubarraySum(arr, num) {
    if (arr.length < num) return null;

    let maxSum = 0;
    let tempSum = 0;

    // 1. Calcular primera ventana
    for (let i = 0; i < num; i++) {
        maxSum += arr[i];
    }
    tempSum = maxSum;

    // 2. Deslizar
    for (let i = num; i < arr.length; i++) {
        // Restar el anterior (i - num) y sumar el nuevo (i)
        tempSum = tempSum - arr[i - num] + arr[i];
        maxSum = Math.max(maxSum, tempSum);
    }

    return maxSum;
}
```

---

## 3. Divide and Conquer (Divide y Vencerás)

Dividir un problema grande en trozos pequeños.

- **Ejemplo:** Binary Search, Merge Sort, Quick Sort.
- **Clave:** Lograr complejidad **O(log n)** o **O(n log n)**.

---

## 4. Conclusión

Reconocer estos patrones requiere práctica (LeetCode/HackerRank). Pero la intuición principal es: **"¿Puedo evitar
recorrer el array otra vez?"**.
