# 06. Monomorfismo vs Polimorfismo

En el contexto de los motores de JavaScript, estos términos no se refieren a la herencia de clases (POO), sino a la *
*variabilidad de tipos** que observa una función en sus argumentos o en los objetos que accede.

---

## 1. Definiciones

### 1.1. Monomórfico (Monomorphic)

- **Mono** (uno) + **Morph** (forma).
- Una operación es monomórfica si siempre opera sobre objetos con la **misma Hidden Class**.
- **Estado del Motor:** Altamente optimizado. El Inline Cache tiene una sola entrada.
- **Rendimiento:** 🚀 Excelente.

### 1.2. Polimórfico (Polymorphic)

- **Poly** (muchos).
- Una operación es polimórfica si opera sobre objetos con **diferentes Hidden Classes** (pero pocas, usualmente 2-4).
- **Estado del Motor:** Optimizado con comprobaciones extra (`if/else` internos).
- **Rendimiento:** 🚗 Bueno, pero más lento que el monomórfico.

### 1.3. Megamórfico (Megamorphic)

- **Mega** (enorme).
- Una operación es megamórfica si opera sobre **muchas** Hidden Classes diferentes (> 4).
- **Estado del Motor:** Desoptimizado. El Inline Cache se deshabilita y se usa una búsqueda genérica.
- **Rendimiento:** 🐢 Lento.

---

## 2. Ejemplo Práctico

Imagina una función que suma propiedades:

```javascript
function sumar(obj) {
    return obj.a + obj.b;
}
```

### Escenario Monomórfico

```javascript
const o1 = {a: 1, b: 2}; // Clase A
const o2 = {a: 3, b: 4}; // Clase A
const o3 = {a: 5, b: 6}; // Clase A

sumar(o1);
sumar(o2);
sumar(o3);
// El motor ve que SIEMPRE recibe Clase A.
// Genera código: "Lee offset 0, lee offset 1, suma".
```

### Escenario Polimórfico

```javascript
const o4 = {b: 2, a: 1}; // Clase B (orden distinto = clase distinta)

sumar(o1); // Clase A
sumar(o4); // Clase B
// El motor ve Clase A y Clase B.
// Genera código: "Si es A, lee offsets 0,1. Si es B, lee offsets 1,0".
```

### Escenario Megamórfico

```javascript
sumar({a: 1, b: 2, c: 3}); // Clase C
sumar({a: 1, b: 2, d: 4}); // Clase D
sumar({a: 1, b: 2, e: 5}); // Clase E
// ... y así sucesivamente.
// El motor dice: "Basta, no puedo cachear esto".
```

---

## 3. Arrays: Packed vs Holey

El concepto también aplica a los Arrays. V8 rastrea los elementos que contiene un array.

- **PACKED_SMI_ELEMENTS:** Array denso (sin huecos) de enteros pequeños (SMI = Small Integers). **El más rápido.**
  `[1, 2, 3]`
- **PACKED_DOUBLE_ELEMENTS:** Array denso de números flotantes.
  `[1.1, 2.2, 3.3]`
- **PACKED_ELEMENTS:** Array denso de objetos o mezcla de tipos.
  `['a', 'b', {}]`
- **HOLEY_ELEMENTS:** Array con huecos (sparse). **El más lento.**
  `[1, , 3]`

**Regla de oro:** Evita crear arrays con huecos (`new Array(10)`) y evita mezclar tipos si buscas el máximo rendimiento
numérico.

---

## 4. Conclusión

Para escribir código de alto rendimiento:

1. Intenta que tus funciones "calientes" sean **monomórficas**.
2. Inicializa objetos con la misma estructura y en el mismo orden.
3. Prefiere arrays densos y tipados homogéneamente.

No te obsesiones con esto para todo el código, pero sí para las partes críticas (bucles de animación, procesamiento de
datos masivo).
