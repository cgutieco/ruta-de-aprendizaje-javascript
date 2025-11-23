# 06. Inmutabilidad Avanzada

La inmutabilidad es el principio de **no modificar** los datos existentes, sino crear **nuevas versiones** de los datos
con los cambios aplicados. En JavaScript, que es mutable por defecto, esto requiere disciplina y conocimiento de ciertas
técnicas.

---

## 1. ¿Por qué Inmutabilidad?

1. **Previsibilidad:** Si un objeto no cambia, no tienes que preocuparte de que una función lejana lo haya modificado
   inesperadamente.
2. **Detección de Cambios (React):** Comparar referencias (`oldObject === newObject`) es instantáneo. Comparar
   propiedades profundas es lento. React depende de esto para saber cuándo re-renderizar.
3. **Historial (Time Travel):** Si guardas cada versión del estado, puedes implementar "Deshacer/Rehacer" trivialmente (
   como en Redux).

---

## 2. Técnicas de Copia

### 2.1. Spread Operator (`...`) - Shallow Copy

La forma estándar moderna de copiar objetos y arrays.
**Importante:** Solo realiza una copia superficial (Shallow Copy).

```javascript
const original = {a: 1, b: {c: 2}};
const copia = {...original, a: 99};

copia.a = 99; // No afecta a original.a
copia.b.c = 100; // ⚠️ ¡SÍ afecta a original.b.c! (referencia compartida)
```

### 2.2. `structuredClone()` - Deep Copy

Introducido en 2022, es la forma nativa de hacer copias profundas reales. Maneja referencias circulares, `Date`, `Map`,
`Set`, etc.

```javascript
const original = {a: 1, b: {c: 2}};
const copiaProfunda = structuredClone(original);

copiaProfunda.b.c = 100;
console.log(original.b.c); // 2 (Intacto)
```

_Nota: `JSON.parse(JSON.stringify(obj))` era el truco antiguo, pero es lento y falla con fechas, funciones
y `undefined`._

---

## 3. Congelando Objetos

JavaScript permite restringir la mutabilidad de los objetos a nivel de runtime.

### 3.1. `Object.freeze()`

Hace que un objeto sea **inmutable**.

- No se pueden agregar, eliminar ni modificar propiedades.
- Es **superficial** (shallow): los objetos anidados siguen siendo mutables a menos que también se congelen.

```javascript
const config = Object.freeze({
    api: "https://api.com",
    meta: {version: 1},
});

config.api = "hack"; // Falla silenciosamente (o Error en Strict Mode)
config.meta.version = 2; // ✅ Permitido (meta no está congelado)
```

### 3.2. `Object.seal()`

Menos estricto que freeze.

- No se pueden agregar ni eliminar propiedades.
- **SÍ** se pueden modificar los valores de las propiedades existentes.

---

## 4. Inmutabilidad en Arrays

Evita métodos que mutan el array original (`push`, `pop`, `splice`, `sort`, `reverse`). Usa sus contrapartes inmutables.

| Mutable (Evitar) | Inmutable (Usar)                                  |
|:-----------------|:--------------------------------------------------|
| `push(x)`        | `[...arr, x]`                                     |
| `pop()`          | `arr.slice(0, -1)`                                |
| `splice(...)`    | `toSpliced(...)` (ES2023) o `slice` + spread      |
| `sort(...)`      | `toSorted(...)` (ES2023) o `[...arr].sort(...)`   |
| `reverse()`      | `toReversed(...)` (ES2023) o `[...arr].reverse()` |

---

## 5. Conclusión

- La inmutabilidad no es "gratis" en JS (tiene coste de memoria y CPU), pero los beneficios en mantenimiento y
  predictibilidad lo superan en aplicaciones complejas.
- Usa **Spread Syntax** para la mayoría de los casos (copias superficiales).
- Usa **`structuredClone`** si realmente necesitas desacoplar objetos complejos anidados.
- Conoce los nuevos métodos de array de ES2023 (`toSorted`, `toSpliced`) que retornan copias automáticamente.
