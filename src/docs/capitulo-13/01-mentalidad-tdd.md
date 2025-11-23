# 01. Mentalidad TDD

**TDD (Test-Driven Development)** no es solo escribir tests. Es una forma de diseñar software donde los tests guían la
implementación.

---

## 1. El Ciclo Red-Green-Refactor

```
🔴 RED: Escribe un test que falle (no hay implementación todavía)
    ↓
🟢 GREEN: Escribe el código mínimo para que pase
    ↓
🔵 REFACTOR: Mejora el código sin cambiar su comportamiento
    ↓
    (Repetir)
```

---

## 2. Ejemplo Práctico

Queremos una función `sum(a, b)`.

### 🔴 Paso 1: Test Primero (Red)

```javascript
import {describe, it, expect} from "vitest";
import {sum} from "./math";

describe("sum", () => {
    it("should add two numbers", () => {
        expect(sum(2, 3)).toBe(5);
    });
});

// Al correr el test: ❌ FAIL - sum is not defined
```

### 🟢 Paso 2: Implementación Mínima (Green)

```javascript
// math.js
export function sum(a, b) {
    return a + b;
}

// Al correr el test: ✅ PASS
```

### 🔵 Paso 3: Refactor (si es necesario)

En este caso simple, no hay mucho que refactorizar. Pero si hubiera código duplicado o complejidad, este es el momento.

---

## 3. Beneficios de TDD

1. **Diseño emergente:** Los tests te obligan a pensar en la interfaz antes de la implementación.
2. **Confianza:** Si el test pasa, el código funciona.
3. **Documentación viva:** Los tests muestran cómo usar tu código.
4. **Menos bugs:** Detectas errores inmediatamente.
5. **Refactoring seguro:** Puedes cambiar implementación sin miedo a romper funcionalidad.

---

## 4. Cuándo NO usar TDD

- Experimentación rápida (prototipos desechables).
- UI altamente visual (mejor usar tests de integración/visuales).
- Cuando el problema no está claro (primero haz un spike para entenderlo).

---

## 5. Conclusión

TDD es contraintuitivo al principio ("¿Por qué escribir un test para código que no existe?"). Pero una vez que lo
dominas, es difícil volver atrás. La clave es empezar pequeño: una función, un test.
