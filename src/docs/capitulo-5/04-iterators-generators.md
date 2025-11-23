# 04. Iterators y Generators

JavaScript tiene un protocolo estándar para definir cómo se recorren las estructuras de datos: el **Iterator Protocol**.
Los **Generadores** son funciones especiales que facilitan la creación de estos iteradores.

---

## 1. El Protocolo Iterador

Un objeto es "iterable" si implementa el método `[Symbol.iterator]`. Este método debe devolver un objeto con un método
`next()` que retorna `{ value, done }`.

### 1.1. Implementación Manual

```javascript
const contador = {
    max: 3,
    [Symbol.iterator]() {
        let count = 1;
        return {
            next: () => {
                if (count <= this.max) {
                    return {value: count++, done: false};
                }
                return {done: true};
            },
        };
    },
};

for (const num of contador) {
    console.log(num); // 1, 2, 3
}
```

---

## 2. Generadores (`function*`)

Escribir iteradores manualmente es verboso. Los Generadores lo hacen fácil.
Una función generadora puede **pausar** su ejecución y **reanudarla** más tarde.

```javascript
function* contadorGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const iterador = contadorGenerator(); // No ejecuta el código, devuelve un iterador

console.log(iterador.next()); // { value: 1, done: false }
console.log(iterador.next()); // { value: 2, done: false }
console.log(iterador.next()); // { value: 3, done: false }
console.log(iterador.next()); // { value: undefined, done: true }
```

### 2.1. `yield` vs `return`

- `yield`: Pausa la función y devuelve un valor. La próxima vez que llames a `next()`, continúa en la línea siguiente.
- `return`: Termina el generador (pone `done: true`).

### 2.2. Comunicación Bidireccional

Puedes pasar valores _hacia adentro_ del generador a través de `next(valor)`.

```javascript
function* chat() {
    const nombre = yield "¿Cómo te llamas?";
    const edad = yield `Hola ${nombre}, ¿qué edad tienes?`;
    return `Wow, ${edad} es una buena edad.`;
}

const gen = chat();
console.log(gen.next().value); // "¿Cómo te llamas?"
console.log(gen.next("Ana").value); // "Hola Ana, ¿qué edad tienes?"
console.log(gen.next(30).value); // "Wow, 30 es una buena edad."
```

---

## 3. Generadores Asíncronos (`async function*`)

Permiten usar `await` dentro del generador y se consumen con `for await...of`. Ideales para streams de datos o
paginación de APIs.

```javascript
async function* fetchPaginas(urls) {
    for (const url of urls) {
        const response = await fetch(url);
        yield await response.json();
    }
}

(async () => {
    const urls = ["/api/1", "/api/2"];
    for await (const data of fetchPaginas(urls)) {
        console.log(data);
    }
})();
```

---

## 4. Conclusión

Los generadores son herramientas poderosas para:

- Crear iterables personalizados (listas infinitas, rangos).
- Manejar flujos de datos asíncronos complejos (Redux Saga usa generadores intensivamente).
- Implementar máquinas de estado.
