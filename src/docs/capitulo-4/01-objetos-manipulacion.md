# 01. Objetos: Creación y Manipulación Avanzada

En JavaScript, casi todo es un objeto. Comprender a fondo cómo crearlos, manipularlos y transformarlos es el primer paso
para dominar la Programación Orientada a Objetos (POO) en este lenguaje. A diferencia de lenguajes basados en clases
estáticas (como Java o C#), JavaScript ofrece una flexibilidad extrema en la gestión de objetos.

---

## 1. Patrones de Creación de Objetos

### 1.1. Object Literal (Literal de Objeto)

Es la forma más común y declarativa.

```javascript
const usuario = {
    nombre: "Ana",
    edad: 30,
    saludar() {
        // Method shorthand (ES6)
        return `Hola, soy ${this.nombre}`;
    },
};
```

**Bajo el capó:** JavaScript crea un objeto que hereda directamente de `Object.prototype`.

### 1.2. `Object.create(proto, [descriptors])`

Este es el método más poderoso para la creación de objetos "pura", permitiendo un control granular sobre el prototipo y
las propiedades.

```javascript
const prototipoUsuario = {
    saludar() {
        return `Hola, soy ${this.nombre}`;
    },
};

// Crea un objeto que hereda de prototipoUsuario
const ana = Object.create(prototipoUsuario);
ana.nombre = "Ana"; // Asignación manual

console.log(ana.saludar()); // "Hola, soy Ana"
```

**Objeto sin prototipo:**
Podemos crear objetos que no heredan de nada (ni siquiera de `Object.prototype`), útiles para diccionarios puros o mapas
de hash seguros.

```javascript
const diccionarioPuro = Object.create(null);
// diccionarioPuro.toString(); // Error! No existe.
```

### 1.3. `new Object()` (Constructor)

Poco usado hoy en día, equivalente a `{}` pero más verboso. Se menciona por completitud histórica.

---

## 2. Manipulación y Copia

### 2.1. `Object.assign(target, ...sources)`

Copia todas las propiedades **enumerables propias** de uno o más objetos fuente a un objeto destino.

- Realiza una **Shallow Copy** (copia superficial).
- Modifica el objeto `target` in-place.

```javascript
const defaults = {tema: "dark", notificaciones: true};
const preferenciasUsuario = {tema: "light"};

const configFinal = Object.assign({}, defaults, preferenciasUsuario);
// { tema: "light", notificaciones: true }
```

_Nota: Hoy en día se prefiere el Spread Operator (`...`) para esto, pero `Object.assign` es útil si necesitas mutar un
objeto existente dinámicamente._

### 2.2. `Object.hasOwn(obj, prop)` vs `obj.hasOwnProperty(prop)`

Desde ES2022, se recomienda `Object.hasOwn()` como una alternativa estática y segura.

```javascript
const obj = Object.create(null);
obj.prop = 1;

// obj.hasOwnProperty("prop"); // ❌ Error: obj.hasOwnProperty is not a function

Object.hasOwn(obj, "prop"); // ✅ true
```

---

## 3. Iteración y Transformación

JavaScript moderno ofrece métodos robustos para convertir objetos en estructuras iterables (arrays) y viceversa.

### 3.1. `Object.keys(obj)`

Retorna un array con las claves (keys) enumerables propias.

```javascript
const user = {id: 1, name: "Bob"};
Object.keys(user); // ["id", "name"]
```

### 3.2. `Object.values(obj)`

Retorna un array con los valores.

```javascript
Object.values(user); // [1, "Bob"]
```

### 3.3. `Object.entries(obj)`

Retorna un array de pares `[key, value]`. Ideal para iterar con `for...of`.

```javascript
for (const [key, value] of Object.entries(user)) {
    console.log(`${key}: ${value}`);
}
```

### 3.4. `Object.fromEntries(iterable)`

La operación inversa a `entries`. Transforma una lista de pares clave-valor en un objeto. Muy útil para transformaciones
funcionales.

**Ejemplo: Filtrar propiedades de un objeto**

```javascript
const inventario = {manzanas: 10, peras: 0, uvas: 5};

const enStock = Object.fromEntries(
    Object.entries(inventario).filter(([fruta, cantidad]) => cantidad > 0)
);
// { manzanas: 10, uvas: 5 }
```

---

## 4. Inmutabilidad Superficial

JavaScript permite "bloquear" objetos en diferentes niveles de severidad.

1. **`Object.preventExtensions(obj)`:** No se pueden añadir propiedades nuevas. Se pueden borrar y modificar las
   existentes.
2. **`Object.seal(obj)`:** No se pueden añadir ni borrar propiedades. Se pueden modificar los valores existentes.
3. **`Object.freeze(obj)`:** Inmutabilidad total (superficial). Nada cambia.

---

## 5. Conclusión

Dominar estos métodos es fundamental antes de entrar en clases y herencia. En JavaScript, las clases son solo una capa
de azúcar sintáctico sobre estos mecanismos de objetos y prototipos. La manipulación directa de objetos (
`Object.create`, `Object.assign`) es a menudo más flexible y potente que la herencia clásica.
