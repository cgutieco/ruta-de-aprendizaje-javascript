# 05. `for...in` vs `for...of`

Dos bucles que parecen iguales pero hacen cosas fundamentalmente distintas. Confundirlos es fuente común de bugs.

---

## 1. `for...in` (Iterar Propiedades)

Diseñado para **Objetos**. Itera sobre las **claves (keys)** enumerables.

```javascript
const obj = {a: 1, b: 2};

for (const key in obj) {
    console.log(key); // "a", "b"
}
```

### ⚠️ Peligros de `for...in`

1. **Recorre la cadena de prototipos:** Si alguien añadió `Object.prototype.metodo = ...`, `for...in` lo iterará.
    - _Solución:_ Usar `if (Object.hasOwn(obj, key))` o mejor, usar `Object.keys()`.
2. **No garantiza orden:** El estándar no obliga a que las claves salgan en orden de inserción (aunque los navegadores
   modernos intentan respetarlo).
3. **Lento:** Es mucho más lento que un bucle normal debido a la búsqueda en prototipos.

**NO LO USES PARA ARRAYS.**

---

## 2. `for...of` (Iterar Valores)

Diseñado para **Iterables** (Arrays, Strings, Maps, Sets, NodeLists). Itera sobre los **valores**.

```javascript
const arr = [10, 20, 30];

for (const val of arr) {
    console.log(val); // 10, 20, 30
}
```

### Ventajas

1. **Respeta el orden** del iterable.
2. **No mira propiedades extra** ni prototipos.
3. Funciona con `break` y `continue` (a diferencia de `.forEach()`).
4. Soporta `await` (`for await...of`).

---

## 3. Resumen Comparativo

| Característica      | `for...in`                     | `for...of`                     |
|:--------------------|:-------------------------------|:-------------------------------|
| **Objetivo**        | Objetos (Diccionarios)         | Iterables (Arrays, Strings...) |
| **Itera sobre**     | Claves (Keys)                  | Valores (Values)               |
| **Prototipos**      | Sí (Peligroso)                 | No (Seguro)                    |
| **Uso recomendado** | Casi nunca (usa `Object.keys`) | Siempre para arrays/listas     |

### Ejemplo Definitivo

```javascript
const lista = ["a", "b"];
lista.propiedad = "extra"; // Mala práctica, pero posible

// for...in ve claves y propiedades extra
for (const x in lista) console.log(x);
// "0", "1", "propiedad"

// for...of ve solo los datos
for (const x of lista) console.log(x);
// "a", "b"
```

---

## 4. Conclusión

- ¿Es un Objeto? -> Usa `Object.keys()`, `Object.values()` o `Object.entries()`.
- ¿Es un Array/Iterable? -> Usa `for...of`.
- ¿Necesitas el índice en un Array? -> Usa `for (const [i, val] of arr.entries())`.
- **Evita `for...in`** en código moderno.
