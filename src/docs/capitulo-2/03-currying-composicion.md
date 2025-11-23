# 03. Currying y Composición

Una vez dominadas las High Order Functions, podemos explorar patrones más avanzados de la programación funcional que
permiten crear código extremadamente modular y elegante: **Currying** y **Composición**.

---

## 1. Currying

El **Currying** es la técnica de transformar una función que recibe múltiples argumentos `f(a, b, c)` en una secuencia
de funciones que reciben un solo argumento cada una `f(a)(b)(c)`.

### 1.1. Ejemplo básico

```javascript
// Función normal
function suma(a, b) {
    return a + b;
}

suma(2, 3); // 5

// Función curried
function sumaCurried(a) {
    return function (b) {
        return a + b;
    };
}

// O con Arrow Functions (más limpio)
const sumaArrow = (a) => (b) => a + b;

sumaCurried(2)(3); // 5
```

### 1.2. ¿Para qué sirve? (Aplicación Parcial)

El currying facilita la **Aplicación Parcial**: fijar algunos argumentos de una función para crear una nueva función más
específica.

```javascript
const log = (date) => (importance) => (message) => {
    console.log(
        `[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`
    );
};

// Fijamos la fecha
const logNow = log(new Date());

// Fijamos la importancia
const logErrorNow = logNow("ERROR");

logErrorNow("Conexión fallida");
// Salida: [10:30] [ERROR] Conexión fallida
```

---

## 2. Composición de Funciones (Composition)

La composición es el acto de combinar dos o más funciones para producir una nueva función. Ejecutar `f(g(x))` es la
composición de `f` y `g`.

El objetivo es crear tuberías (**pipelines**) de datos donde la salida de una función es la entrada de la siguiente.

### 2.1. Implementación manual (`compose` y `pipe`)

- **Compose:** Ejecuta de derecha a izquierda (matemáticamente clásico).
- **Pipe:** Ejecuta de izquierda a derecha (más legible para humanos).

```javascript
const pipe =
    (...fns) =>
        (x) =>
            fns.reduce((v, f) => f(v), x);

const gritar = (str) => str.toUpperCase();
const exclamar = (str) => `${str}!!!`;
const repetir = (str) => `${str} ${str}`;

// Crear una "super función" que combine todo
const gritarYExclamar = pipe(gritar, exclamar, repetir);

console.log(gritarYExclamar("hola"));
// Pasos: "hola" -> "HOLA" -> "HOLA!!!" -> "HOLA!!! HOLA!!!"
```

---

## 3. Point-Free Style

El estilo _Point-Free_ (tácito) consiste en definir funciones sin mencionar explícitamente sus argumentos, basándose en
la composición y el currying.

```javascript
// Estilo normal
const getIds = (users) => users.map((u) => u.id);

// Estilo Point-Free (asumiendo que tenemos una función 'map' curried)
// const getIds = map(prop('id'));
```

_Nota: JavaScript nativo no soporta esto tan limpiamente como Haskell o Ramda, pero bibliotecas como `lodash/fp`
o `Ramda` lo facilitan._

---

## 4. Conclusión

- El **Currying** te permite especializar funciones fijando argumentos.
- La **Composición** te permite construir lógica compleja uniendo piezas simples (como legos).
- Estos patrones reducen la necesidad de variables intermedias y hacen que el flujo de datos sea lineal y fácil de
  seguir.
