# 03. Constructor Functions y el Operador `new`

Antes de que existiera la palabra clave `class` (ES6), JavaScript utilizaba **Constructor Functions** para simular
clases y crear múltiples instancias de objetos con la misma estructura.

Aunque hoy usamos `class`, entender las Constructor Functions es obligatorio porque `class` es solo "azúcar sintáctico"
sobre este mismo mecanismo.

---

## 1. ¿Qué es una Constructor Function?

Es una función normal y corriente, pero que por convención:

1. Empieza con **Mayúscula** (PascalCase).
2. Está diseñada para ser ejecutada **únicamente** con el operador `new`.

```javascript
function Usuario(nombre, edad) {
    // 'this' se refiere a la nueva instancia que se está creando
    this.nombre = nombre;
    this.edad = edad;
    this.isAdmin = false;

    // No retornamos nada explícitamente
}

const user1 = new Usuario("Pepe", 25);
const user2 = new Usuario("Maria", 30);

console.log(user1.nombre); // "Pepe"
console.log(user1 instanceof Usuario); // true
```

---

## 2. El Algoritmo del Operador `new`

Cuando escribes `new Usuario(...)`, el motor de JavaScript realiza 4 pasos exactos. Entender esto es la clave de la POO
en JS.

1. **Creación:** Crea un nuevo objeto vacío `{}` en memoria.
2. **Enlace (Link):** Asigna la propiedad oculta `[[Prototype]]` (o `__proto__`) de ese nuevo objeto para que apunte a
   `Usuario.prototype`.
3. **Ejecución:** Ejecuta la función `Usuario` con el `this` apuntando al nuevo objeto creado en el paso 1.
4. **Retorno:** Retorna automáticamente el objeto `this` (a menos que la función retorne explícitamente otro objeto).

### Implementación manual de `new`

Podemos simular lo que hace `new` con una función:

```javascript
function miNew(Constructor, ...args) {
    // 1. Crear objeto vacío
    const obj = {};

    // 2. Enlazar prototipo
    Object.setPrototypeOf(obj, Constructor.prototype);

    // 3. Ejecutar constructor con 'this' = obj
    const resultado = Constructor.apply(obj, args);

    // 4. Retornar objeto (si el constructor devolvió un objeto, usar ese; si no, usar el creado)
    return typeof resultado === "object" && resultado !== null ? resultado : obj;
}

const user3 = miNew(Usuario, "Carlos", 40);
```

---

## 3. El problema de los métodos en el Constructor

Si definimos métodos dentro del constructor, se crean copias de la función para cada instancia. Esto es un desperdicio
de memoria.

```javascript
function Pato(nombre) {
    this.nombre = nombre;

    // ❌ MAL: Se crea una nueva función para CADA pato
    this.cuack = function () {
        console.log("Cuack!");
    };
}
```

### Solución: El Prototipo

Los métodos deben definirse en el `prototype` de la función constructora. Así, todas las instancias comparten **la misma
función** en memoria.

```javascript
function PatoOptimizado(nombre) {
    this.nombre = nombre;
}

// ✅ BIEN: Una sola función compartida
PatoOptimizado.prototype.cuack = function () {
    console.log(this.nombre + " dice Cuack!");
};
```

---

## 4. `return` en un Constructor

- Si retornas un **primitivo** (string, number, false), JS lo ignora y retorna `this` (la instancia).
- Si retornas un **objeto**, JS descarta la instancia (`this`) y retorna ese objeto.

```javascript
function Roto() {
    this.a = 1;
    return {b: 2};
}

console.log(new Roto()); // { b: 2 }
```

---

## 5. Conclusión

- Las Constructor Functions son la base de la herencia en JS.
- El operador `new` automatiza la creación del objeto y el enlace del prototipo.
- Los métodos deben ir siempre en el `.prototype` para optimizar memoria.
