# 02. Property Descriptors (Descriptores de Propiedad)

Hasta ahora, hemos tratado las propiedades de los objetos como simples pares clave-valor. Sin embargo, en JavaScript,
cada propiedad es mucho más compleja: tiene un estado interno definido por sus **Property Descriptors**.

Entender esto es clave para crear librerías robustas, emular propiedades privadas y entender cómo funcionan frameworks
como Vue.js (que usa getters/setters reactivos).

---

## 1. Los Atributos de una Propiedad

Cada propiedad en un objeto tiene un descriptor que contiene los siguientes atributos (flags):

1. **`value`**: El valor actual de la propiedad (ej. `42`, `"hola"`, `function...`).
2. **`writable`**: `true` si el valor puede ser modificado. `false` lo hace de solo lectura.
3. **`enumerable`**: `true` si la propiedad aparece en bucles `for...in` y `Object.keys()`. `false` la hace "
   invisible" (aunque accesible directamente).
4. **`configurable`**: `true` si la propiedad puede ser borrada (`delete`) o si sus descriptores pueden ser modificados
   en el futuro. Si es `false`, es un "candado" final.

### 1.1. Valores por Defecto

- Cuando creas una propiedad normalmente (`obj.a = 1`), todos los flags son `true`.
- Cuando usas `Object.defineProperty`, los flags por defecto son `false`.

---

## 2. `Object.defineProperty`

Este método permite definir una nueva propiedad o modificar una existente con control total sobre sus descriptores.

```javascript
const usuario = {};

Object.defineProperty(usuario, "id", {
    value: 12345,
    writable: false, // No se puede cambiar
    enumerable: true, // Aparece en listados
    configurable: false, // No se puede borrar ni reconfigurar
});

console.log(usuario.id); // 12345
usuario.id = 999; // Falla silenciosamente (o Error en Strict Mode)
console.log(usuario.id); // 12345 (Intacto)
```

### 2.1. Propiedades No Enumerables

Útil para esconder metadatos o métodos internos que no quieres que salgan al serializar a JSON o iterar.

```javascript
Object.defineProperty(usuario, "secreto", {
    value: "token_xyz",
    enumerable: false,
});

console.log(Object.keys(usuario)); // ["id"] (No aparece "secreto")
console.log(usuario.secreto); // "token_xyz" (Pero sí es accesible)
```

---

## 3. Getters y Setters (Accessor Descriptors)

En lugar de un `value`, una propiedad puede tener funciones `get` y `set`. Esto permite ejecutar lógica cada vez que
alguien lee o escribe la propiedad.

**Regla:** Un descriptor no puede tener `value` y `get`/`set` al mismo tiempo.

```javascript
const cuenta = {
    _saldo: 100, // Convención: _ significa "privado" (aunque es público)
};

Object.defineProperty(cuenta, "saldo", {
    get() {
        console.log("Alguien leyó el saldo");
        return this._saldo;
    },
    set(nuevoValor) {
        if (nuevoValor < 0) {
            console.error("Saldo no puede ser negativo");
            return;
        }
        console.log(`Saldo actualizado: ${nuevoValor}`);
        this._saldo = nuevoValor;
    },
    enumerable: true,
    configurable: true,
});

cuenta.saldo = 50; // Log: "Saldo actualizado: 50"
cuenta.saldo = -10; // Error: "Saldo no puede ser negativo"
console.log(cuenta.saldo); // Log: "Alguien leyó el saldo" -> 50
```

### 3.1. Sintaxis Literal

También puedes definirlos directamente en el objeto literal:

```javascript
const persona = {
    nombre: "Juan",
    apellido: "Pérez",

    get nombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    },

    set nombreCompleto(valor) {
        [this.nombre, this.apellido] = valor.split(" ");
    },
};

persona.nombreCompleto = "Ana Gómez";
console.log(persona.nombre); // "Ana"
```

---

## 4. `Object.defineProperties` y `Object.getOwnPropertyDescriptor`

- **`defineProperties`**: Define múltiples propiedades a la vez.
- **`getOwnPropertyDescriptor`**: Permite inspeccionar el estado de los flags de una propiedad.

```javascript
const desc = Object.getOwnPropertyDescriptor(persona, "nombre");
console.log(desc);
// { value: "Ana", writable: true, enumerable: true, configurable: true }
```

---

## 5. Conclusión

Los Property Descriptors son la base de la "magia" en muchas librerías de JS. Te permiten:

- Crear constantes reales (antes de `const`).
- Ocultar propiedades de la iteración.
- Validar datos automáticamente al asignarlos (Setters).
- Crear propiedades computadas (Getters).
