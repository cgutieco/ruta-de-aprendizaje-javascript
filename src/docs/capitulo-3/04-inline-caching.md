# 04. Inline Caching (Caché en Línea)

El **Inline Caching (IC)** es la técnica de optimización más importante que utilizan los motores de JavaScript para
acelerar el acceso a propiedades de objetos. Se basa en la observación empírica de que los objetos que pasan por una
misma línea de código suelen tener la misma estructura (Hidden Class).

---

## 1. El Costo del Acceso Dinámico

En un lenguaje dinámico, acceder a `obj.x` es costoso la primera vez. El motor debe:

1. Buscar la Hidden Class de `obj`.
2. Buscar en la Hidden Class dónde está la propiedad `x` (su offset en memoria).
3. Leer la memoria en ese offset.

Si hacemos esto dentro de un bucle que se ejecuta 1 millón de veces, hacer esa búsqueda completa cada vez sería
desastroso.

---

## 2. Cómo funciona el Inline Caching

Cuando el motor ejecuta una línea de código que accede a una propiedad (`obj.x`), "recuerda" (cachea) el resultado de
esa búsqueda **directamente en el Bytecode**.

### 2.1. Primer Acceso (Cold)

```javascript
function getX(obj) {
    return obj.x;
}

const p1 = {x: 10, y: 20}; // HiddenClass C1
getX(p1);
```

La primera vez, el motor hace la búsqueda completa. Encuentra que para la clase `C1`, `x` está en el offset 0.
El motor **modifica** la instrucción `getX` en caliente. Ahora dice algo como:

> _"Si el objeto tiene HiddenClass C1, devuelve el valor en offset 0. Si no, búscalo."_

### 2.2. Accesos Subsiguientes (Warm/Hot)

```javascript
const p2 = {x: 30, y: 40}; // HiddenClass C1 (misma estructura)
getX(p2);
```

La segunda vez, el motor ve que `p2` también es `C1`. Se salta toda la búsqueda y va directo al offset 0. ¡Es casi tan
rápido como C++!

---

## 3. Estados del IC

El Inline Cache puede estar en uno de tres estados, dependiendo de cuántas formas (Hidden Classes) diferentes haya visto
en ese punto de llamada (Call Site).

1. **Monomórfico (Monomorphic):**

    - El IC ha visto **1 sola** Hidden Class.
    - **Velocidad:** Máxima (Flash ⚡).
    - Es el estado ideal.

2. **Polimórfico (Polymorphic):**

    - El IC ha visto **pocas** Hidden Classes diferentes (usualmente 2-4).
    - El motor hace una pequeña lista de comprobaciones: _"¿Es C1? Offset 0. ¿Es C2? Offset 1..."_
    - **Velocidad:** Buena, pero más lenta que monomórfico.

3. **Megamórfico (Megamorphic):**
    - El IC ha visto **muchas** Hidden Classes diferentes (usualmente > 4).
    - El motor se rinde de optimizar. Deja de usar caché y vuelve a usar la búsqueda genérica (lenta) por tabla hash.
    - **Velocidad:** Lenta (Tortuga 🐢).

---

## 4. Ejemplo Práctico

```javascript
function area(rect) {
    return rect.width * rect.height; // Call Site
}

// Monomórfico (Ideal)
area({width: 10, height: 20}); // Clase A
area({width: 5, height: 5}); // Clase A
area({width: 2, height: 3}); // Clase A

// Polimórfico (Aceptable)
area({width: 10, height: 20, color: "red"}); // Clase B (distinta estructura)

// Megamórfico (Evitar)
// Si empezamos a pasar objetos con estructuras aleatorias, el rendimiento de 'area' caerá.
```

---

## 5. Conclusión

El Inline Caching recompensa la **consistencia**.

- Intenta que tus funciones reciban siempre objetos con la misma estructura (misma Hidden Class).
- Si tienes una función crítica en rendimiento, evita pasarle "cualquier cosa". Hazla estricta en cuanto a la forma de
  sus argumentos.
