# 06. WeakMap y WeakSet

`Map` y `Set` (introducidos en ES6) mantienen referencias **fuertes** a sus claves/valores. Esto significa que si
guardas un objeto en un `Map`, el Garbage Collector (GC) nunca lo borrará de memoria mientras el `Map` exista.

`WeakMap` y `WeakSet` resuelven esto permitiendo referencias **débiles**.

---

## 1. WeakMap

Es una colección de pares clave-valor donde:

1. **Las claves DEBEN ser objetos** (no primitivos).
2. La referencia a la clave es **débil**. Si no hay otras referencias a ese objeto, el GC lo borra (y la entrada
   desaparece del WeakMap automáticamente).

```javascript
let usuario = {nombre: "Ana"};

const mapaFuerte = new Map();
mapaFuerte.set(usuario, "Info extra");

const mapaDebil = new WeakMap();
mapaDebil.set(usuario, "Info extra");

usuario = null; // Eliminamos la referencia principal

// En mapaFuerte: El objeto {nombre: "Ana"} SIGUE existiendo en memoria.
// En mapaDebil: El objeto es recolectado por el GC y desaparece del mapa.
```

### 1.1. Limitaciones

- **No son iterables:** No tienen `keys()`, `values()`, `entries()` ni `size`.
- ¿Por qué? Porque el GC corre en segundo plano de forma impredecible. El motor no sabe cuántos elementos hay en un
  momento dado.

### 1.2. Casos de Uso

1. **Datos privados:** (Como vimos en el Cap 4).
2. **Metadatos de nodos DOM:** Asociar datos a un elemento HTML sin causar memory leaks si el elemento se borra del DOM.

```javascript
const clicks = new WeakMap();
const boton = document.querySelector("#btn");

clicks.set(boton, 0); // Si 'boton' se elimina del DOM, este contador se libera solo.
```

---

## 2. WeakSet

Similar al `Set`, pero solo almacena **objetos** y las referencias son débiles.

```javascript
const visitados = new WeakSet();

let usuario1 = {id: 1};
visitados.add(usuario1);

console.log(visitados.has(usuario1)); // true

usuario1 = null;
// El objeto se libera de memoria y del WeakSet.
```

### Caso de Uso: Control de Circularidad

Evitar procesar el mismo objeto dos veces en algoritmos recursivos sin retenerlo en memoria para siempre.

---

## 3. Conclusión

Usa `WeakMap` y `WeakSet` cuando necesites asociar información a un objeto **sin impedir que ese objeto sea destruido**
por el Garbage Collector. Es una herramienta vital para la gestión eficiente de memoria en aplicaciones de larga
duración (SPA).
