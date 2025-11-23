# 05. Control de Flujo

El control de flujo determina el orden en que se ejecutan las instrucciones. JavaScript ofrece estructuras clásicas
heredadas de C/Java, pero con matices importantes relacionados con su naturaleza dinámica.

---

## 1. Condicionales

### 1.1. `if` / `else`

La estructura fundamental. Recuerda que la condición evalúa la "truthiness" del valor.

```javascript
if (user.isLoggedIn) {
    showDashboard();
} else if (user.isGuest) {
    showLogin();
} else {
    redirectToHome();
}
```

### 1.2. `switch`

Útil para múltiples condiciones sobre una misma variable.
**Importante:** `switch` usa igualdad estricta (`===`) para comparar casos.

```javascript
const role = "admin";

switch (role) {
    case "admin":
        grantFullAccess();
        break; // ¡No olvides el break!
    case "editor":
        grantEditAccess();
        break;
    default:
        grantReadAccess();
}
```

---

## 2. Bucles (Loops)

### 2.1. `for` clásico

El bucle más rápido y flexible, pero el más verboso.

```javascript
for (let i = 0; i < arr.length; i++) {
    // Acceso por índice
}
```

### 2.2. `for...of` (Iterables)

Introducido en ES6. Es la forma moderna de iterar arrays, strings, Maps, Sets y cualquier objeto que implemente el
protocolo _Iterable_.
**No funciona en objetos planos (`{}`) por defecto.**

```javascript
const colors = ["red", "green", "blue"];
for (const color of colors) {
    console.log(color);
}
```

### 2.3. `for...in` (Propiedades)

Itera sobre las **claves (keys) enumerables** de un objeto.
**Cuidado:** Itera también sobre propiedades heredadas del prototipo. Rara vez se usa en código moderno para arrays;
úsalo solo para objetos y preferiblemente con `Object.keys()` o `Object.entries()`.

```javascript
const user = {name: "Alice", age: 25};
for (const key in user) {
    console.log(key, user[key]);
}
```

### 2.4. `while` y `do...while`

- `while`: Evalúa la condición antes de ejecutar.
- `do...while`: Ejecuta al menos una vez, luego evalúa.

---

## 3. Control de Bucles

### 3.1. `break`

Termina el bucle inmediatamente.

### 3.2. `continue`

Salta la iteración actual y pasa a la siguiente.

### 3.3. Sentencias Etiquetadas (Labeled Statements)

Una característica poco conocida pero útil para romper bucles anidados.

```javascript
outerLoop: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outerLoop; // Rompe AMBOS bucles, no solo el interno
        }
        console.log(`i=${i}, j=${j}`);
    }
}
```

---

## 4. Alternativas Modernas a los Bucles

En el desarrollo profesional con JavaScript (especialmente en React), se prefiere el uso de **Métodos de Array** (
Programación Funcional) sobre los bucles imperativos, ya que expresan mejor la _intención_ y evitan efectos secundarios.

- En lugar de `for` para transformar: usa `.map()`.
- En lugar de `for` para filtrar: usa `.filter()`.
- En lugar de `for` para buscar: usa `.find()`.
- En lugar de `for` para acumular: usa `.reduce()`.

```javascript
// Imperativo (Cómo hacerlo)
const doubled = [];
for (const num of numbers) {
    doubled.push(num * 2);
}

// Declarativo (Qué queremos)
const doubled = numbers.map((num) => num * 2);
```

## 5. Conclusión

Aunque los bucles `for` y `while` son fundamentales, el código moderno tiende hacia la inmutabilidad y la claridad de
`for...of` o métodos funcionales. Usa `switch` con moderación (a veces un objeto mapa es mejor) y recuerda las etiquetas
para casos complejos de bucles anidados.
