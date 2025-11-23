# 08. Symbols y Metaprogramación Ligera

Los **Symbols** son el séptimo tipo de dato primitivo de JavaScript, introducidos en ES6. A diferencia de strings o
números, los Symbols son **únicos e inmutables**. Su propósito principal es servir como identificadores de propiedades
de objetos que no colisionen con otras claves (strings).

---

## 1. Creación y Unicidad

```javascript
const sym1 = Symbol("descripcion");
const sym2 = Symbol("descripcion");

console.log(sym1 === sym2); // false (Siempre son únicos)
```

### 1.1. Propiedades "Ocultas"

Las propiedades con clave Symbol no aparecen en `for...in` ni en `Object.keys()`.

```javascript
const id = Symbol("id");
const user = {
    nombre: "Ana",
    [id]: 12345, // Propiedad con clave Symbol
};

console.log(Object.keys(user)); // ["nombre"]
console.log(JSON.stringify(user)); // {"nombre":"Ana"} (Los symbols se ignoran en JSON)

// Acceso directo
console.log(user[id]); // 12345
```

_Nota: No son verdaderamente privados (se pueden obtener con `Object.getOwnPropertySymbols(user)`), pero evitan
colisiones accidentales._

---

## 2. Well-Known Symbols (Símbolos Conocidos)

Aquí es donde entra la **Metaprogramación**. JavaScript expone ciertos Symbols predefinidos que el motor utiliza
internamente para realizar operaciones fundamentales. Al implementar estos símbolos en tus objetos, puedes alterar el
comportamiento del lenguaje.

### 2.1. `Symbol.iterator`

Hace que un objeto sea iterable (usable en `for...of` y spread `...`).

```javascript
const rango = {
    inicio: 1,
    fin: 3,
    [Symbol.iterator]() {
        let actual = this.inicio;
        let fin = this.fin;
        return {
            next() {
                if (actual <= fin) {
                    return {value: actual++, done: false};
                }
                return {done: true};
            },
        };
    },
};

for (const num of rango) {
    console.log(num); // 1, 2, 3
}
```

### 2.2. `Symbol.toPrimitive`

Controla cómo se convierte tu objeto a primitivo (número, string).

```javascript
const dinero = {
    cantidad: 100,
    [Symbol.toPrimitive](hint) {
        if (hint === "string") return `$${this.cantidad}`;
        return this.cantidad;
    },
};

console.log(`${dinero}`); // "$100"
console.log(dinero + 50); // 150
```

### 2.3. `Symbol.toStringTag`

Permite cambiar el output de `Object.prototype.toString.call(obj)`.

```javascript
class MiClase {
    get [Symbol.toStringTag]() {
        return "MiClasePersonalizada";
    }
}

console.log(Object.prototype.toString.call(new MiClase()));
// "[object MiClasePersonalizada]" (antes sería [object Object])
```

---

## 3. Global Symbol Registry

A veces quieres compartir un Symbol entre diferentes iframes o módulos.

- **`Symbol.for("key")`**: Busca un símbolo con esa clave en el registro global. Si no existe, lo crea.
- **`Symbol.keyFor(sym)`**: Devuelve la clave asociada a un símbolo global.

```javascript
const globalSym = Symbol.for("app.id");
const mismoSym = Symbol.for("app.id");

console.log(globalSym === mismoSym); // true
```

---

## 4. Conclusión

Los Symbols son la puerta de entrada a la metaprogramación en JS. Te permiten "engancharte" a mecanismos internos del
motor (iteración, conversión de tipos, inspección) sin riesgo de colisiones de nombres. Úsalos para crear APIs robustas
y expresivas.
