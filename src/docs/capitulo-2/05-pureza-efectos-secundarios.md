# 05. Pureza y Efectos Secundarios

En el corazón de la programación funcional y del desarrollo fiable (especialmente en React/Redux) está el concepto de *
*Pureza**. Escribir funciones puras hace que el código sea predecible, fácil de testear y menos propenso a bugs.

---

## 1. Funciones Puras

Una función se considera **Pura** si cumple estrictamente dos condiciones:

1. **Determinismo:** Dado el mismo input (argumentos), **siempre** retorna el mismo output.
2. **Sin Efectos Secundarios:** No modifica nada fuera de su propio alcance (no muta variables globales, no imprime en
   consola, no hace llamadas a API, etc.).

### 1.1. Ejemplo de Función Pura

```javascript
function sumar(a, b) {
    return a + b;
}

// sumar(2, 3) SIEMPRE será 5. No toca nada externo.
```

### 1.2. Ejemplo de Función Impura

```javascript
let total = 0;

function sumarAlTotal(cantidad) {
    total += cantidad; // Efecto secundario (modifica variable externa)
    return total; // No determinista (depende del estado de 'total')
}
```

---

## 2. Efectos Secundarios (Side Effects)

Un efecto secundario es cualquier cambio de estado observable que ocurre fuera de la función llamada. Ejemplos comunes:

- Modificar una variable global o un argumento (mutación).
- `console.log()` (modifica la salida estándar).
- Manipular el DOM (`document.getElementById...`).
- Llamadas de red (`fetch`, `XMLHttpRequest`).
- `Math.random()` (hace que la función sea no determinista).
- `Date.now()` (depende del tiempo, no de los argumentos).

### ¿Son malos los efectos secundarios?

**No.** Sin efectos secundarios, un programa no serviría para nada (no podría mostrar nada en pantalla ni guardar
datos).
El objetivo no es eliminarlos, sino **aislarlos y controlarlos**.

En una arquitectura limpia, intentamos empujar los efectos secundarios a los bordes del sistema (controladores,
useEffect), manteniendo el núcleo de la lógica de negocio lo más puro posible.

---

## 3. Idempotencia

Un concepto relacionado es la **Idempotencia**. Una operación es idempotente si ejecutarla múltiples veces tiene el
mismo efecto que ejecutarla una sola vez.

- `f(x)` es idempotente si `f(f(x)) === f(x)`.
- En APIs REST: `GET`, `PUT` y `DELETE` deberían ser idempotentes. `POST` generalmente no lo es.

---

## 4. Beneficios de la Pureza

1. **Testabilidad:** No necesitas mocks complejos. Solo pasas argumentos y verificas el retorno.
2. **Cacheable (Memoización):** Si `f(2)` siempre da `4`, puedes guardar el resultado y no volver a calcularlo.
3. **Concurrencia:** Las funciones puras no compiten por recursos compartidos, por lo que son seguras en entornos
   paralelos.
4. **React:** React asume que tus componentes son puros (para el renderizado). Si un componente tiene efectos
   secundarios durante el render, causará bugs visuales o loops infinitos.

---

## 5. Conclusión

- Esfuérzate por escribir funciones puras siempre que sea posible.
- Si necesitas un efecto secundario (API, DOM), hazlo explícito y sepáralo de la lógica de transformación de datos.
- En React, mantén la lógica de renderizado pura y pon los efectos en `useEffect` o event handlers.
