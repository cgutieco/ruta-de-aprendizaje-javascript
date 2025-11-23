# 05. Optimizaciones del Motor JS (V8)

Los motores JavaScript modernos (V8, SpiderMonkey) aplican optimizaciones agresivas. Entender cómo funcionan te ayuda a
escribir código rápido.

---

## 1. Monomorphic vs Polymorphic Functions

V8 optimiza funciones que siempre reciben el mismo "tipo" de objeto.

```javascript
// ❌ POLIMÓRFICO (lento)
function getX(obj) {
    return obj.x;
}

getX({x: 1, y: 2});
getX({x: 3, z: 4}); // Estructura diferente
getX({y: 5, x: 6}); // Orden diferente
```

```javascript
// ✅ MONOMÓRFICO (rápido)
function getX(obj) {
    return obj.x;
}

getX({x: 1, y: 2});
getX({x: 3, y: 4}); // Misma estructura
getX({x: 5, y: 6}); // Misma estructura
```

**Regla:** Crea objetos con la misma estructura (mismas propiedades, mismo orden).

---

## 2. Hidden Classes

V8 crea "clases ocultas" para objetos con la misma estructura.

```javascript
// ❌ MAL - Diferentes hidden classes
const obj1 = {};
obj1.x = 1;
obj1.y = 2;

const obj2 = {};
obj2.y = 2; // Orden diferente
obj2.x = 1;
```

```javascript
// ✅ BIEN - Misma hidden class
function Point(x, y) {
    this.x = x;
    this.y = y;
}

const obj1 = new Point(1, 2);
const obj2 = new Point(3, 4);
```

---

## 3. Evitar Deoptimización

Ciertos patrones hacen que V8 "desoptimice" tu código (vuelva a ejecutarlo sin optimizaciones).

### Triggers de Deoptimización

1. **Cambiar el tipo de una variable:**

   ```javascript
   let x = 5; // V8 asume que x es number
   x = "hola"; // ❌ Cambia a string → deoptimiza
   ```

2. **`arguments` (en funciones no-arrow):**

   ```javascript
   // ❌ Usar `arguments` dificulta optimización
   function sum() {
     return Array.from(arguments).reduce((a, b) => a + b);
   }

   // ✅ Usar rest parameters
   function sum(...args) {
     return args.reduce((a, b) => a + b);
   }
   ```

3. **`try/catch` en hot paths:**

   ```javascript
   // ❌ try/catch en loop desoptimiza
   for (let i = 0; i < 1000; i++) {
     try {
       doSomething(i);
     } catch (e) {}
   }

   // ✅ Mover try/catch fuera del loop
   try {
     for (let i = 0; i < 1000; i++) {
       doSomething(i);
     }
   } catch (e) {}
   ```

---

## 4. Inline Caches

V8 cachea la ubicación de propiedades.

```javascript
function processUsers(users) {
    for (let i = 0; i < users.length; i++) {
        console.log(users[i].name); // V8 cachea dónde está "name"
    }
}
```

Si todos los objetos en `users` tienen la misma estructura, esto es **muy rápido**.

---

## 5. Small/Fast Numbers

V8 usa **Smi (Small Integers)** para números entre `-2^30` y `2^30 - 1`. Son más rápidos que floats.

```javascript
// ✅ Rápido (Smi)
let x = 42;

// ❌ Más lento (necesita heap allocation)
let y = 1234567890123;
```

---

## 6. Conclusión

**No prematurices optimizaciones.** Estos detalles importan solo en código crítico (hot paths). Siempre mide primero con
el Performance panel antes de optimizar.
