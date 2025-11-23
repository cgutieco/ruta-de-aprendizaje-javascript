# 01. Destructuring Profundo (Desestructuración)

La desestructuración es una de las características más elegantes de ES6. Permite extraer datos de arrays u objetos y
asignarlos a variables en una sola línea. Aunque su uso básico es común, dominar sus patrones avanzados te permitirá
escribir código mucho más limpio y expresivo.

---

## 1. Desestructuración de Objetos Anidados

Puedes extraer propiedades de objetos que están dentro de otros objetos, tan profundo como necesites.

```javascript
const usuario = {
    id: 1,
    perfil: {
        nombre: "Ana",
        detalles: {
            edad: 30,
            ciudad: "Madrid",
        },
    },
};

// Extracción profunda
const {
    perfil: {
        detalles: {ciudad},
    },
} = usuario;

console.log(ciudad); // "Madrid"
// console.log(detalles); // ReferenceError (no se creó la variable detalles)
```

### 1.1. Aliasing (Renombrado)

A veces el nombre de la propiedad no es el que quieres para tu variable (o colisiona con otra).

```javascript
const {
    perfil: {nombre: nombreUsuario},
} = usuario;
console.log(nombreUsuario); // "Ana"
```

---

## 2. Valores por Defecto

Si la propiedad que intentas extraer no existe (`undefined`), puedes asignar un valor de respaldo.

```javascript
const config = {tema: "dark"};

// Si 'idioma' no existe, usa 'es'
const {tema, idioma = "es"} = config;

console.log(idioma); // "es"
```

**Combinando todo (Anidado + Alias + Default):**

```javascript
const {perfil: {avatar: userAvatar = "default.png"} = {}} = usuario;
```

_Truco: El `= {}` al final evita que explote si `perfil` es `undefined`._

---

## 3. Desestructuración en Parámetros de Función

Este es el patrón estándar para manejar opciones de configuración en funciones modernas.

```javascript
function crearBoton({
                        texto = "Click me",
                        color = "blue",
                        size = "md",
                        disabled = false,
                    } = {}) {
    // = {} permite llamar a la función sin argumentos: crearBoton()

    console.log(`Botón ${texto} (${color}) creado.`);
}

crearBoton({color: "red"}); // "Botón Click me (red) creado."
```

---

## 4. Desestructuración de Arrays

A diferencia de los objetos (que usan claves), los arrays se desestructuran por **posición**.

```javascript
const coordenadas = [10, 20, 30];
const [x, y] = coordenadas; // x=10, y=20
```

### 4.1. Ignorar elementos

Puedes saltarte posiciones dejándolas vacías.

```javascript
const [primero, , tercero] = ["a", "b", "c"];
console.log(tercero); // "c"
```

### 4.2. Intercambio de Variables (Swapping)

Antes necesitabas una variable temporal `temp`. Ahora:

```javascript
let a = 1;
let b = 2;

[a, b] = [b, a]; // a=2, b=1
```

---

## 5. Computed Property Names

Puedes usar variables dinámicas para decidir qué propiedad extraer.

```javascript
const key = "edad";
const persona = {nombre: "Luis", edad: 25};

const {[key]: valor} = persona;
console.log(valor); // 25
```

---

## 6. Conclusión

La desestructuración no solo ahorra líneas de código; hace explícito qué datos necesita tu función o componente. Úsala
siempre que accedas a más de una propiedad de un objeto o array.
