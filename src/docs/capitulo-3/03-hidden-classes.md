# 03. Hidden Classes (Clases Ocultas)

JavaScript es un lenguaje dinámico basado en prototipos: puedes añadir o quitar propiedades de un objeto en cualquier
momento. Esto es genial para el desarrollador, pero una pesadilla para el compilador.

En lenguajes estáticos (Java, C++), la posición de una propiedad en memoria es fija y conocida al compilar (offset). En
JS, el motor no sabe dónde está `obj.x` hasta que lo busca.

Para resolver esto y hacer que el acceso a propiedades sea casi tan rápido como en C++, V8 utiliza **Hidden Classes** (
también llamadas **Shapes** en SpiderMonkey o **Maps** en JSC).

---

## 1. ¿Qué es una Hidden Class?

Cada vez que creas un objeto, V8 le asigna una "Clase Oculta" interna. Esta clase describe la estructura del objeto (qué
propiedades tiene y dónde están en memoria).

### 1.1. Transiciones de Clase (Transitions)

Si modificas la estructura del objeto (añades una propiedad), V8 crea una **nueva** Hidden Class y crea una transición
desde la antigua.

```javascript
// 1. Se crea el objeto. V8 crea HiddenClass C0 (vacía).
const punto = {};

// 2. Añadimos 'x'.
// V8 crea HiddenClass C1 (basada en C0 + propiedad 'x').
// Transición: C0 -> C1
punto.x = 10;

// 3. Añadimos 'y'.
// V8 crea HiddenClass C2 (basada en C1 + propiedad 'y').
// Transición: C1 -> C2
punto.y = 20;
```

Si creas otro objeto `const punto2 = {}` y sigues **exactamente los mismos pasos**, `punto2` terminará compartiendo la
misma Hidden Class `C2` que `punto`.

---

## 2. La Importancia del Orden

Para que V8 reutilice las Hidden Classes (y optimice el código), los objetos deben tener la misma estructura y ser
inicializados en el **mismo orden**.

```javascript
// Caso A: Mismo orden (Optimizado)
const obj1 = {a: 1}; // Clase C1
obj1.b = 2; // Transición C1 -> C2

const obj2 = {a: 1}; // Reusa C1
obj2.b = 2; // Reusa Transición C1 -> C2 (obj2 ahora es C2)

// Caso B: Orden distinto (Desoptimizado)
const obj3 = {a: 1}; // Clase C1
obj3.b = 2; // Transición C1 -> C2

const obj4 = {b: 2}; // ¡Nueva Clase C3! (porque empezó con b)
obj4.a = 1; // Transición C3 -> C4
```

En el Caso B, aunque `obj3` y `obj4` terminan con las mismas propiedades `{a, b}`, tienen **Hidden Classes diferentes**.
El motor no puede usar el mismo código optimizado para ambos.

---

## 3. Inline Caching (Intro)

Las Hidden Classes son el requisito previo para el **Inline Caching** (que veremos en el siguiente tema). Si dos objetos
comparten la misma Hidden Class, el motor puede "memorizar" dónde están sus propiedades y acceder a ellas
instantáneamente.

---

## 4. Consejos de Optimización

1. **Inicializa todas las propiedades en el constructor:**
   No añadas propiedades sobre la marcha. Define la "forma" final del objeto desde el principio.

   ```javascript
   // ❌ Malo
   const p = {};
   p.x = 1;
   p.y = 2;

   // ✅ Bueno
   const p = { x: 1, y: 2 };
   ```

2. **Mantén el orden:**
   Si tienes múltiples objetos del mismo tipo, asegúrate de asignar sus propiedades en el mismo orden siempre.

3. **Evita `delete`:**
   Usar `delete obj.x` cambia la Hidden Class del objeto (a menudo a una versión "diccionario" más lenta). Es mejor
   asignar `obj.x = null` o `undefined` si quieres mantener la estructura rápida.

---

## 5. Conclusión

Las Hidden Classes son el truco de magia que permite a V8 tratar objetos dinámicos como si fueran estáticos. Escribir
código que respete estas estructuras (código "monomórfico") es clave para el alto rendimiento.
