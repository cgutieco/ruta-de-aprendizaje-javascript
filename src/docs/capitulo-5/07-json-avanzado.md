# 07. Serialización y Manejo Avanzado de JSON

`JSON.stringify` y `JSON.parse` son el pan de cada día, pero tienen superpoderes ocultos que la mayoría desconoce.

---

## 1. `JSON.stringify(value, replacer, space)`

### 1.1. El argumento `replacer`

Permite filtrar o transformar los valores antes de convertirlos a string. Puede ser un array o una función.

**Filtrado (Array):**

```javascript
const user = {id: 1, nombre: "Ana", password: "123", role: "admin"};
const json = JSON.stringify(user, ["nombre", "role"]);
// '{"nombre":"Ana","role":"admin"}'
```

**Transformación (Función):**

```javascript
const json = JSON.stringify(user, (key, value) => {
    if (key === "password") return undefined; // Lo elimina
    if (typeof value === "string") return value.toUpperCase();
    return value;
});
```

### 1.2. El argumento `space`

Para "pretty print" (formato legible).

```javascript
console.log(JSON.stringify(user, null, 2));
/*
{
  "id": 1,
  "nombre": "Ana",
  ...
}
*/
```

### 1.3. Método `toJSON()`

Si un objeto tiene un método `toJSON`, `stringify` usará lo que este retorne.

```javascript
const sala = {
    numero: 5,
    toJSON() {
        return `Sala número ${this.numero}`;
    },
};

console.log(JSON.stringify(sala)); // "Sala número 5"
```

---

## 2. `JSON.parse(text, reviver)`

### 2.1. El argumento `reviver`

Permite transformar el valor justo después de parsearlo. Es vital para recuperar tipos de datos que JSON no soporta
nativamente (como `Date` o `Map`).

```javascript
const jsonFechas =
    '{"evento": "Concierto", "fecha": "2025-12-31T00:00:00.000Z"}';

const objeto = JSON.parse(jsonFechas, (key, value) => {
    if (key === "fecha") return new Date(value); // Hidratación automática
    return value;
});

console.log(objeto.fecha.getFullYear()); // 2025
```

---

## 3. Limitaciones de JSON

JSON es un formato de intercambio de datos, no un volcado de memoria de JS.

- **Ignora:** `undefined`, funciones y Symbols.
- **Falla:** Referencias circulares (`TypeError: Converting circular structure to JSON`).
- **Pierde:** `Map`, `Set`, `RegExp`, `Error`, `BigInt`.

Para solucionar esto, necesitamos técnicas de clonación más avanzadas (siguiente tema).
