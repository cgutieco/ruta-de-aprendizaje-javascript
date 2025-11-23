# 04. Operadores y Coerción

JavaScript es conocido (y a veces temido) por su flexibilidad en el manejo de tipos. La **coerción** es el proceso
automático o explícito de convertir valores de un tipo a otro. Entender sus reglas es la diferencia entre un bug
inexplicable y un código robusto.

---

## 1. Tipos de Coerción

### 1.1. Coerción Explícita

Ocurre cuando el desarrollador intencionalmente convierte un tipo. Es la forma recomendada por ser legible y predecible.

```javascript
const str = "42";
const num = Number(str); // 42 (Explícito)
const bool = Boolean(1); // true (Explícito)
const str2 = String(100); // "100" (Explícito)
```

### 1.2. Coerción Implícita

Ocurre cuando el motor de JavaScript convierte automáticamente los tipos para realizar una operación. Esto suele suceder
con operadores que esperan tipos específicos.

#### El operador `+` (Concatenación vs Suma)

Si uno de los operandos es un `string`, JavaScript prefiere la concatenación.

```javascript
console.log(1 + "2"); // "12" (número coercionado a string)
console.log("Hola " + {name: "Mundo"}); // "Hola [object Object]"
```

#### Operadores matemáticos (`-`, `*`, `/`, `%`)

Convierten los operandos a `number`.

```javascript
console.log("10" - 5); // 5 (string "10" coercionado a número)
console.log("10" * "2"); // 20
console.log("hola" - 1); // NaN (Not a Number)
```

---

## 2. Truthy y Falsy

En contextos booleanos (como un `if`), JavaScript evalúa cualquier valor como `true` o `false`.

### 2.1. Falsy Values

Solo hay 8 valores que evalúan a `false` en JavaScript:

1. `false`
2. `0` (cero positivo)
3. `-0` (cero negativo)
4. `0n` (BigInt cero)
5. `""` (string vacío)
6. `null`
7. `undefined`
8. `NaN`

### 2.2. Truthy Values

**Todo lo demás es `true`**.
Esto incluye:

- `"0"` (string con cero)
- `"false"` (string con texto "false")
- `[]` (array vacío)
- `{}` (objeto vacío)
- `function(){}` (función vacía)

> **Nota:** Un error común es verificar si un array está vacío con `if (arr)`. Como `[]` es truthy, la condición siempre
> pasa. Debes usar `if (arr.length > 0)`.

---

## 3. Igualdad: `==` vs `===`

### 3.1. Doble Igual (`==`) - Loose Equality

Permite coerción implícita antes de comparar.

```javascript
console.log(5 == "5"); // true (convierte string a number)
console.log(null == undefined); // true (regla especial)
console.log(0 == false); // true
```

**Regla de oro:** Evítalo. La única excepción aceptable suele ser `if (x == null)` para verificar `null` Y `undefined`
simultáneamente.

### 3.2. Triple Igual (`===`) - Strict Equality

No permite coerción. Compara **tipo** y **valor**.

```javascript
console.log(5 === "5"); // false
console.log(null === undefined); // false
```

**Siempre usa `===`**.

---

## 4. Short-Circuiting (Cortocircuito)

Los operadores lógicos `&&` y `||` no siempre retornan `true` o `false`; retornan **el valor de uno de los operandos**.

### 4.1. AND (`&&`)

Retorna el primer valor **Falsy** que encuentre, o el último si todos son Truthy.

```javascript
const user = {name: "Alice"};
const name = user && user.name; // "Alice" (user es truthy, retorna el segundo)
const noUser = null && user.name; // null (primer falsy)
```

### 4.2. OR (`||`)

Retorna el primer valor **Truthy** que encuentre, o el último si todos son Falsy.

```javascript
const port = process.env.PORT || 3000; // Si PORT no existe, usa 3000
```

### 4.3. Nullish Coalescing (`??`)

Introducido en ES2020. Solo retorna el operando derecho si el izquierdo es `null` o `undefined`.
Diferencia clave con `||`: `??` no considera `0` o `""` como falsos.

```javascript
const count = 0;
const a = count || 10; // 10 (porque 0 es falsy)
const b = count ?? 10; // 0 (porque 0 no es null/undefined)
```

---

## 5. Conclusión

La coerción es una herramienta poderosa pero peligrosa.

- Prefiere siempre la coerción explícita (`Number()`, `String()`).
- Usa siempre igualdad estricta (`===`).
- Domina los valores `Falsy` para escribir condicionales limpios.
- Usa `??` en lugar de `||` cuando quieras valores por defecto que respeten el `0` o strings vacíos.
