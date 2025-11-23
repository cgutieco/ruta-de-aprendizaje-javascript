# 06. Encapsulación y Privacidad

Uno de los pilares de la POO es la **Encapsulación**: ocultar los detalles internos de implementación y exponer solo una
interfaz pública segura. Durante años, JavaScript no tuvo forma nativa de hacer esto, obligando a los desarrolladores a
usar convenciones (como `_propiedad`) o trucos con Closures.

Hoy, en 2025, tenemos **Campos Privados (#)** nativos.

---

## 1. Campos Privados (`#private`)

Desde ES2022, cualquier propiedad o método que comience con `#` es **estrictamente privado**. Solo puede ser accedido
desde dentro de la clase.

```javascript
class CuentaBancaria {
    #saldo; // Declaración obligatoria del campo privado

    constructor(saldoInicial) {
        this.#saldo = saldoInicial;
    }

    depositar(cantidad) {
        this.#saldo += cantidad;
    }

    verSaldo() {
        return this.#saldo;
    }
}

const cuenta = new CuentaBancaria(100);
cuenta.depositar(50);
console.log(cuenta.verSaldo()); // 150

// console.log(cuenta.#saldo); // ❌ SyntaxError: Private field '#saldo' must be declared in an enclosing class
```

**Características:**

- **Inaccesible desde fuera:** Ni siquiera `Object.keys` o `for...in` lo ven.
- **Único por clase:** Si tienes dos clases con `#id`, no colisionan.
- **Métodos privados:** También puedes tener métodos `#calcularInteres()`.

---

## 2. Patrones Históricos (Legacy)

Es probable que encuentres estos patrones en código antiguo.

### 2.1. Convención de Guion Bajo (`_`)

```javascript
class Usuario {
    constructor(nombre) {
        this._nombre = nombre; // "Por favor, no toques esto"
    }
}
```

_Problema:_ No es privado de verdad. Cualquiera puede hacer `user._nombre = "Hack"`.

### 2.2. Closures (Module Pattern)

Antes de las clases, usábamos closures para privacidad real (como vimos en el Cap 2).

```javascript
function crearUsuario(nombre) {
    let _nombre = nombre; // Variable local, inaccesible desde fuera
    return {
        getNombre: () => _nombre,
    };
}
```

_Problema:_ Consume más memoria (crea funciones nuevas por instancia) y no se integra bien con la herencia de clases.

### 2.3. WeakMap

Un patrón avanzado para simular privacidad en clases antes de los `#campos`.

```javascript
const privados = new WeakMap();

class Persona {
    constructor(nombre) {
        privados.set(this, {nombre});
    }

    saludar() {
        return `Hola, soy ${privados.get(this).nombre}`;
    }
}
```

_Ventaja:_ Privacidad real.
_Desventaja:_ Verboso y difícil de depurar.

---

## 3. Getters y Setters para Encapsulación

La encapsulación no solo es ocultar datos, sino controlar cómo se accede a ellos. Los `get` y `set` son la interfaz
pública perfecta para propiedades privadas.

```javascript
class Termostato {
    #temperatura = 20;

    get temperatura() {
        return `${this.#temperatura}°C`; // Formatea la salida
    }

    set temperatura(valor) {
        if (valor < -273) throw new Error("Cero absoluto alcanzado");
        this.#temperatura = valor; // Valida la entrada
    }
}
```

---

## 4. Friend Classes (Simulación)

JavaScript no tiene "clases amigas" (como C++) que puedan acceder a los privados de otra. Los campos `#` son **Hard
Private**.
Si necesitas compartir estado privado entre clases relacionadas, usualmente debes exponer métodos `protected` (por
convención `_metodo`) o usar módulos de ES6 que compartan variables no exportadas.

---

## 5. Conclusión

- Usa **`#propiedad`** para todo estado interno que no deba ser tocado desde fuera.
- Usa **Getters/Setters** para exponer ese estado de forma controlada.
- Olvida la convención `_` para código nuevo, a menos que estés migrando una base de código muy antigua.
