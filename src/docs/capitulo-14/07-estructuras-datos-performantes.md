# 07. Estructuras de Datos Performantes

Elegir la estructura de datos correcta puede hacer tu código 10x más rápido.

---

## 1. Map vs Object

| Operación       | Object                          | Map                         |
|-----------------|---------------------------------|-----------------------------|
| **Claves**      | Solo strings/symbols            | Cualquier tipo              |
| **Orden**       | No garantizado (pre-ES2015)     | Insertado                   |
| **Tamaño**      | `Object.keys(obj).length`       | `map.size`                  |
| **Iterar**      | `for...in` (incluye prototipo)  | `for...of`                  |
| **Performance** | Más rápido para pocos elementos | Mejor para muchos elementos |

### Cuándo Usar Map

```javascript
// ✅ Usar Map cuando:
// 1. Necesitas claves que no son strings
const cache = new Map();
cache.set({id: 1}, "userData");

// 2. Necesitas frecuentemente añadir/remover entradas
const activeUsers = new Map();
activeUsers.set(userId, userData);
activeUsers.delete(userId); // O(1)

// 3. Necesitas iterar en orden de inserción
for (const [key, value] of map) {
    console.log(key, value);
}
```

---

## 2. Set vs Array

### Búsqueda

```javascript
const arr = [1, 2, 3, 4, 5];
arr.includes(3); // O(n) - recorre todo

const set = new Set([1, 2, 3, 4, 5]);
set.has(3); // O(1) - instantáneo
```

### Cuándo Usar Set

```javascript
// ✅ Eliminar duplicados
const unique = [...new Set([1, 2, 2, 3, 3, 3])];
// [1, 2, 3]

// ✅ Verificar existencia frecuentemente
const allowedIds = new Set([10, 20, 30]);
if (allowedIds.has(userId)) {
    // Mucho más rápido que array.includes()
}
```

---

## 3. Typed Arrays

Para datos numéricos intensivos, los **Typed Arrays** son más rápidos y consumen menos memoria.

```javascript
// ❌ Array normal
const numbers = [1, 2, 3, 4, 5];

// ✅ Typed Array (Int32)
const numbers = new Int32Array([1, 2, 3, 4, 5]);

// Beneficios:
// - Tamaño fijo, más eficiente
// - Operaciones numéricas más rápidas
// - Menos memoria (cada elemento es exactamente 4 bytes)
```

### Tipos Disponibles

- `Int8Array`, `Uint8Array` (1 byte)
- `Int16Array`, `Uint16Array` (2 bytes)
- `Int32Array`, `Uint32Array` (4 bytes)
- `Float32Array`, `Float64Array` (4/8 bytes)

---

## 4. Elegir la Estructura Correcta

```javascript
// Necesitas orden + valores únicos? → Set
const tags = new Set(["javascript", "performance"]);

// Necesitas key-value + claves complejas? → Map
const userCache = new Map();
userCache.set(userObject, userData);

// Necesitas array de números? → Typed Array
const pixels = new Uint8ClampedArray(width * height * 4);

// Necesitas objeto simple? → Object
const config = {apiUrl: "/api", timeout: 5000};
```

---

## 5. Performance Comparison

```javascript
// Benchmark: Búsqueda en 10,000 elementos
console.time("Array.includes");
const arr = Array.from({length: 10000}, (_, i) => i);
arr.includes(9999);
console.timeEnd("Array.includes");
// ~0.1-0.5ms

console.time("Set.has");
const set = new Set(Array.from({length: 10000}, (_, i) => i));
set.has(9999);
console.timeEnd("Set.has");
// ~0.001-0.01ms (100x más rápido)
```

---

## 6. Conclusión

**Regla de oro:** Usa la estructura más simple que cumpla tus necesidades. Solo optimiza si el profiling muestra que es
un cuello de botella.
