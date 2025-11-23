# 02. Unit Testing con Vitest

Los **unit tests** prueban unidades de código (funciones, clases) de forma aislada. Vamos a usar **Vitest**, un
framework moderno y rápido compatible con Vite.

---

## 1. Setup Básico

```bash
npm install -D vitest
```

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest --coverage"
  }
}
```

---

## 2. Estructura de un Test

```javascript
import {describe, it, expect} from "vitest";

describe("Nombre del módulo o función", () => {
    it("debería hacer X cuando Y", () => {
        // Tu test aquí
    });
});
```

- **`describe`:** Agrupa tests relacionados.
- **`it` (o `test`):** Define un test individual.
- **`expect`:** Hace la aserción.

---

## 3. Assertions Comunes

```javascript
// Igualdad estricta
expect(2 + 2).toBe(4);

// Igualdad profunda (objetos/arrays)
expect({a: 1}).toEqual({a: 1});

// Veracidad
expect(true).toBeTruthy();
expect(null).toBeFalsy();

// Contiene
expect([1, 2, 3]).toContain(2);
expect("hello world").toContain("world");

// Lanzar errores
expect(() => throwError()).toThrow("Error message");

// Tipos
expect(typeof valor).toBe("string");
```

---

## 4. El Patrón AAA (Arrange-Act-Assert)

Estructura clara para tests legibles:

```javascript
describe("Calculator", () => {
    it("should multiply two numbers", () => {
        // 1. ARRANGE: Preparar datos
        const calculator = new Calculator();
        const a = 5;
        const b = 3;

        // 2. ACT: Ejecutar acción
        const result = calculator.multiply(a, b);

        // 3. ASSERT: Verificar resultado
        expect(result).toBe(15);
    });
});
```

---

## 5. Ejemplo Real: Testing una Función de Validación

```javascript
// validators.js
export function validateEmail(email) {
    if (!email) return false;
    if (!email.includes("@")) return false;
    if (email.split("@").length !== 2) return false;
    return true;
}
```

```javascript
// validators.test.js
import {describe, it, expect} from "vitest";
import {validateEmail} from "./validators";

describe("validateEmail", () => {
    it("should return true for valid email", () => {
        expect(validateEmail("user@example.com")).toBe(true);
    });

    it("should return false for email without @", () => {
        expect(validateEmail("userexample.com")).toBe(false);
    });

    it("should return false for empty string", () => {
        expect(validateEmail("")).toBe(false);
    });

    it("should return false for multiple @", () => {
        expect(validateEmail("user@@example.com")).toBe(false);
    });
});
```

---

## 6. Watch Mode

```bash
npm run test
```

Vitest ejecuta en modo watch por defecto. Los tests se re-ejecutan automáticamente al guardar cambios.
