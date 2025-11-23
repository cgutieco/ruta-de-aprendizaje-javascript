# 02. Spread y Rest Avanzado (`...`)

El operador de tres puntos (`...`) es contextual. Dependiendo de dónde lo uses, actúa como **Spread** (expandir) o como **Rest** (agrupar).

---

## 1. Spread Operator (Expandir)

Toma un iterable (array, string) o un objeto y "esparce" sus elementos individuales.

### 1.1. En Arrays

```javascript
const partes = ["hombros", "rodillas"];
const cuerpo = ["cabeza", ...partes, "pies"];
// ["cabeza", "hombros", "rodillas", "pies"]
```

**Copia Superficial (Shallow Copy):**

```javascript
const original = [1, 2, 3];
const copia = [...original]; // Nuevo array, misma referencia de elementos internos
```

### 1.2. En Objetos

Introducido en ES2018. Copia propiedades enumerables propias de un objeto a otro.

```javascript
const base = { a: 1, b: 2 };
const extendido = { ...base, c: 3, a: 99 };
// { a: 99, b: 2, c: 3 } (El último gana)
```

**Orden importa:**
Si pones `...base` al final, sobreescribirá lo anterior.

```javascript
const error = { a: 99, ...base };
// { a: 1, b: 2 } (base.a sobreescribió el 99)
```

---

## 2. Rest Parameters (Agrupar)

Se usa en la definición de funciones para recoger "el resto" de los argumentos en un array real.

### 2.1. Reemplazo de `arguments`

El objeto `arguments` es "array-like" (no tiene métodos como `.map`). Los Rest Parameters crean arrays reales.

```javascript
// Antes (ES5)
function sumar() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce((a, b) => a + b);
}

// Ahora (ES6+)
function sumar(...numeros) {
  // 'numeros' es un Array real
  return numeros.reduce((a, b) => a + b, 0);
}

sumar(1, 2, 3, 4); // 10
```

### 2.2. Rest en Desestructuración

Sirve para extraer "lo que sobra".

```javascript
const { a, b, ...resto } = { a: 1, b: 2, c: 3, d: 4 };
console.log(resto); // { c: 3, d: 4 }
```

**Regla:** El Rest element debe ser siempre el **último**.

```javascript
// const { ...resto, a } = obj; // ❌ SyntaxError
```

---

## 3. Casos de Uso Avanzados

### 3.1. Eliminar propiedades de forma inmutable

Un patrón muy común en React/Redux para borrar una propiedad sin mutar el objeto original.

```javascript
const usuario = { id: 1, password: "123", nombre: "Ana" };

// Extraemos 'password' y agrupamos el resto en 'usuarioSeguro'
const { password, ...usuarioSeguro } = usuario;

console.log(usuarioSeguro); // { id: 1, nombre: "Ana" }
```

### 3.2. Merge condicional

Añadir propiedades solo si una condición se cumple.

```javascript
const esAdmin = true;

const usuario = {
  nombre: "Pepe",
  ...(esAdmin && { role: "admin", permisos: ["all"] }),
};
// Si esAdmin es false, ...(false) no hace nada.
```

---

## 4. Conclusión

- **Spread (`...var`)**: "Saca" los elementos de la caja. (Llamadas a función, creación de arrays/objetos).
- **Rest (`...var`)**: "Mete" los elementos en una caja. (Definición de función, desestructuración).
