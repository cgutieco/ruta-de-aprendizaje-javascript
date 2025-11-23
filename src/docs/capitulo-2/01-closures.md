# 01. Closures (Clausuras)

Un **Closure** es una de las características más poderosas y fundamentales de JavaScript. Técnicamente, un closure es la
combinación de una función y el **entorno léxico** en el cual fue declarada.

En términos simples: un closure permite que una función "recuerde" y acceda a las variables de su ámbito padre, incluso
después de que la función padre haya terminado de ejecutarse.

---

## 1. Mecánica del Closure

Para entender los closures, debemos recordar el **Scope Léxico** (visto en el Capítulo 1). Las funciones acceden a
variables definidas fuera de ellas.

```javascript
function crearContador() {
    let cuenta = 0; // Variable local de crearContador

    return function incrementar() {
        cuenta++; // Accede a 'cuenta' del scope padre
        return cuenta;
    };
}

const miContador = crearContador();
// En este punto, crearContador() ha terminado su ejecución.
// Normalmente, sus variables locales (como 'cuenta') serían eliminadas por el Garbage Collector.

console.log(miContador()); // 1
console.log(miContador()); // 2
console.log(miContador()); // 3
```

**¿Por qué funciona?**
La función `incrementar` mantiene una referencia viva a la variable `cuenta`. Esta referencia impide que el Garbage
Collector limpie esa memoria. El entorno léxico se "cierra" (closes over) alrededor de la función retornada.

---

## 2. Casos de Uso Prácticos

### 2.1. Privacidad de Datos (Encapsulación)

JavaScript (antes de las clases con `#private`) no tenía modificadores de acceso. Los closures permiten emular variables
privadas.

```javascript
function crearCuentaBancaria(saldoInicial) {
    let saldo = saldoInicial; // "Privado"

    return {
        depositar(cantidad) {
            saldo += cantidad;
            return saldo;
        },
        retirar(cantidad) {
            if (cantidad > saldo) return "Fondos insuficientes";
            saldo -= cantidad;
            return saldo;
        },
        verSaldo() {
            return saldo;
        },
    };
}

const cuenta = crearCuentaBancaria(100);
console.log(cuenta.verSaldo()); // 100
cuenta.depositar(50);
console.log(cuenta.saldo); // undefined (No accesible directamente)
```

### 2.2. Function Factories (Fábricas de Funciones)

Podemos usar closures para crear funciones configuradas con parámetros específicos.

```javascript
function crearMultiplicador(factor) {
    return function (numero) {
        return numero * factor;
    };
}

const duplicar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);

console.log(duplicar(5)); // 10
console.log(triplicar(5)); // 15
```

---

## 3. Errores Comunes: El Loop y `var`

Un problema clásico (y pregunta de entrevista) ocurre al usar closures dentro de loops con `var`.

```javascript
// ❌ Problema con var
for (var i = 1; i <= 3; i++) {
    setTimeout(function () {
        console.log(i);
    }, 1000);
}
// Salida: 4, 4, 4 (porque 'var' tiene scope de función, no de bloque, y comparten la misma variable 'i')
```

**Solución moderna con `let`:**
`let` crea un nuevo scope por cada iteración del bloque, por lo que cada closure captura una variable `i` distinta.

```javascript
// ✅ Solución con let
for (let i = 1; i <= 3; i++) {
    setTimeout(function () {
        console.log(i);
    }, 1000);
}
// Salida: 1, 2, 3
```

---

## 4. Conclusión

Los closures no son magia; son una consecuencia directa del modelo de scope léxico de JavaScript. Son esenciales para:

- Patrones de diseño (Module Pattern).
- Programación Funcional (Currying, Partial Application).
- React Hooks (el estado en `useState` se mantiene gracias a closures).
