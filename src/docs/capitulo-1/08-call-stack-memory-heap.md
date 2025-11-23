# 08. Call Stack, Memory Heap y Execution Context

Para entender por qué JavaScript se comporta como lo hace (especialmente en asincronía y closures), debemos mirar "bajo
el capó" del motor. El modelo de ejecución de JavaScript se basa principalmente en dos estructuras de datos: el **Memory
Heap** y el **Call Stack**.

---

## 1. Memory Heap (Montón de Memoria)

Es una región de memoria grande y mayormente desestructurada donde el motor de JavaScript almacena objetos y variables.

- Aquí es donde viven los **Objetos**, **Arrays** y **Funciones**.
- La asignación de memoria ocurre dinámicamente.
- El **Garbage Collector** (GC) trabaja aquí periódicamente para liberar memoria que ya no tiene referencias activas.

---

## 2. Call Stack (Pila de Llamadas)

Es una estructura de datos LIFO (Last In, First Out) que registra en qué parte del programa estamos.

- JavaScript es un lenguaje **Single Threaded** (un solo hilo). Esto significa que tiene **un solo Call Stack**.
- Solo puede hacer **una cosa a la vez**.

### 2.1. Funcionamiento

1. Cuando entras en una función, se añade (push) un registro a la pila.
2. Cuando sales de una función (return), se elimina (pop) de la pila.

```javascript
function multiplicar(x, y) {
    return x * y;
}

function imprimirCuadrado(n) {
    const res = multiplicar(n, n);
    console.log(res);
}

imprimirCuadrado(5);
```

**Paso a paso en el Stack:**

1. `main()` (script global)
2. `imprimirCuadrado(5)`
3. `multiplicar(5, 5)` -> retorna 25 y sale (pop)
4. `console.log(25)` -> imprime y sale (pop)
5. `imprimirCuadrado` termina y sale (pop)

### 2.2. Stack Overflow

Ocurre cuando la pila se llena porque hay demasiadas llamadas a funciones sin retorno, típicamente por una *
*recursividad infinita**.

```javascript
function recursiva() {
    recursiva();
}

recursiva(); // RangeError: Maximum call stack size exceeded
```

---

## 3. Execution Context (Contexto de Ejecución)

Cada vez que se ejecuta una función (o el script global), se crea un **Execution Context**. Este es el entorno donde el
código JavaScript es evaluado y ejecutado.

### 3.1. Fases del Contexto

Cada contexto pasa por dos fases:

1. **Fase de Creación (Creation Phase):**

    - Se crea el objeto global (`window`/`global`).
    - Se crea el objeto `this`.
    - **Hoisting:** Se reserva espacio en memoria para variables y funciones.

2. **Fase de Ejecución (Execution Phase):**
    - Se ejecuta el código línea por línea.
    - Se asignan valores a las variables.

### 3.2. Tipos de Contexto

- **Global Execution Context (GEC):** El contexto base. Solo hay uno.
- **Function Execution Context (FEC):** Se crea uno nuevo cada vez que se invoca una función.

---

## 4. Conclusión

Entender que JavaScript es **Single Threaded** y depende del **Call Stack** es crucial. Si una función tarda mucho en
ejecutarse (ej. un bucle `while` gigante o procesamiento de imagen pesado), **bloquea el Stack**.

Cuando el Stack está bloqueado, el navegador no puede renderizar, no puede responder a clics y la página se "congela".
Para resolver esto, JavaScript utiliza el **Event Loop** y la asincronía (que veremos en el Capítulo 7) para delegar
tareas pesadas fuera del hilo principal.
