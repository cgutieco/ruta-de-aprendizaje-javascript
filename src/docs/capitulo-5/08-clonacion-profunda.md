# 08. Clonación Profunda y Estructural

Copiar objetos en JavaScript es engañoso.

- `const b = a` copia la **referencia**.
- `{...a}` hace una **copia superficial** (shallow copy).

¿Qué pasa si queremos una copia real e independiente de un objeto anidado?

---

## 1. El viejo truco: `JSON.parse(JSON.stringify(obj))`

Durante años fue la única forma nativa "fácil".

```javascript
const original = {a: 1, b: {c: 2}};
const copia = JSON.parse(JSON.stringify(original));

copia.b.c = 99;
console.log(original.b.c); // 2 (¡Éxito!)
```

**Problemas:**

- **Lento:** Tiene que serializar y parsear strings.
- **Pérdida de datos:** Borra `undefined`, funciones, `Symbol`.
- **Rompe tipos:** `Date` se convierte en string.
- **Explota:** Con referencias circulares.

---

## 2. El estándar moderno: `structuredClone(obj)`

Disponible globalmente desde 2022 (Node 17+, todos los navegadores modernos). Usa el algoritmo de **Structured Clone** (
el mismo que usa `postMessage` en Web Workers).

```javascript
const original = {
    fecha: new Date(),
    set: new Set([1, 2]),
    map: new Map([["a", 1]]),
    error: new Error("Boom"),
    circular: null,
};
original.circular = original; // Referencia circular

const copia = structuredClone(original);

console.log(copia.fecha instanceof Date); // true (Mantiene el tipo)
console.log(copia.circular === copia); // true (Maneja circularidad)
console.log(copia !== original); // true (Es una copia)
```

**Limitaciones de `structuredClone`:**

- No clona **funciones** (lanzará `DataCloneError`).
- No clona elementos del DOM.
- No clona prototipos (la copia será un objeto plano o del tipo estándar correspondiente).

---

## 3. Clonación Recursiva Manual

Si necesitas clonar funciones o casos muy específicos, necesitas una librería como `lodash.cloneDeep` o escribir tu
propia función recursiva (aunque es reinventar la rueda y propenso a errores de stack overflow).

---

## 4. Resumen de Estrategias

| Método            | Profundidad | Velocidad  | Soporta Tipos Raros | Soporta Circularidad | Soporta Funciones |
|:------------------|:------------|:-----------|:--------------------|:---------------------|:------------------|
| `{...obj}`        | Superficial | ⚡ Muy Alta | Sí                  | N/A                  | Sí                |
| `JSON`            | Profunda    | 🐢 Baja    | No                  | 💥 Error             | No                |
| `structuredClone` | Profunda    | 🐇 Media   | Sí (mayoría)        | ✅ Sí                 | ❌ Error           |

**Recomendación:** Usa `structuredClone()` por defecto para copias profundas. Usa `{...spread}` para copias
superficiales.
