# 05. Clases, `extends` y `super`

Introducidas en ES6 (2015), las clases en JavaScript **no** introdujeron un nuevo modelo de herencia. Son puramente *
*Syntactic Sugar** (azúcar sintáctico) sobre la herencia prototípica que vimos en el tema anterior. Sin embargo, ofrecen
una sintaxis mucho más limpia, declarativa y familiar para programadores de otros lenguajes.

---

## 1. Declaración de Clase

```javascript
class Animal {
    constructor(nombre) {
        this.nombre = nombre;
    }

    // Método (se añade a Animal.prototype)
    hablar() {
        return `${this.nombre} hace ruido.`;
    }
}

const perro = new Animal("Firulais");
perro.hablar(); // "Firulais hace ruido."
```

**Diferencias con Constructor Functions:**

1. Las clases **siempre** usan Strict Mode (`'use strict'`) automáticamente.
2. No se pueden invocar sin `new` (lanzan error).
3. Los métodos de clase no son enumerables (más limpio).

---

## 2. Herencia con `extends`

La palabra clave `extends` establece la cadena de prototipos automáticamente.

```javascript
class Perro extends Animal {
    ladrar() {
        return "¡Guau!";
    }
}

// Lo que pasa bajo el capó:
// 1. Perro.prototype.__proto__ === Animal.prototype (para heredar métodos)
// 2. Perro.__proto__ === Animal (para heredar métodos estáticos)
```

---

## 3. `super`

Cuando extiendes una clase, la clase hija (subclase) no crea su propio objeto `this` inicial. Espera que la clase padre
lo haga. Por eso **es obligatorio llamar a `super()` antes de usar `this`** en el constructor.

```javascript
class Gato extends Animal {
    constructor(nombre, vidas = 7) {
        // this.vidas = vidas; // ❌ Error: Must call super constructor first
        super(nombre); // Llama al constructor de Animal
        this.vidas = vidas; // ✅ Ahora sí podemos usar 'this'
    }

    // Sobreescritura de métodos (Polimorfismo)
    hablar() {
        // Podemos llamar al método del padre
        return super.hablar() + " ¡Miau!";
    }
}
```

---

## 4. Miembros Estáticos (`static`)

Los métodos o propiedades estáticas pertenecen a la clase misma, no a las instancias.

```javascript
class Matematicas {
    static PI = 3.14159;

    static sumar(a, b) {
        return a + b;
    }
}

console.log(Matematicas.sumar(2, 3)); // 5
// console.log(new Matematicas().sumar(2, 3)); // ❌ Error: no existe en la instancia
```

Son útiles para funciones de utilidad, patrones Factory o constantes de configuración.

---

## 5. Class Fields (Campos de Clase)

Sintaxis moderna (ES2022) para definir propiedades directamente en el cuerpo de la clase, sin necesidad de hacerlo
dentro del constructor.

```javascript
class Contador {
    cuenta = 0; // Campo público (se asigna a 'this.cuenta')

    incrementar = () => {
        // Arrow function como campo
        this.cuenta++;
    };
}
```

_Nota: Usar Arrow Functions como métodos de clase (campos) asegura que `this` siempre apunte a la instancia, resolviendo
problemas comunes al pasar callbacks a React o Event Listeners._

---

## 6. Conclusión

Las clases modernas de JS son potentes y expresivas. Aunque por debajo sigan siendo prototipos, abstraen la complejidad
del enlace manual (`Object.create`, `Function.prototype`). Úsalas por defecto para POO, pero nunca olvides que **no son
clases estáticas** como en Java; son dinámicas y mutables en tiempo de ejecución.
