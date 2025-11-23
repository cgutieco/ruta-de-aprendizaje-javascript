# 03. Mocking, Spies y Cobertura

Para testear código aislado, necesitas **reemplazar dependencias externas** (APIs, bases de datos, otros módulos). Aquí
entran los **test doubles**.

---

## 1. Tipos de Test Doubles

- **Stub:** Devuelve datos fijos. No verifica nada.
- **Mock:** Devuelve datos Y verifica que fue llamado correctamente.
- **Spy:** Envuelve la función real, permite ver cómo fue llamada.

---

## 2. Mocking con Vitest

### Mockear una Función

```javascript
import {vi, describe, it, expect} from "vitest";

describe("fetchUser", () => {
    it("should call API with correct ID", async () => {
        // Crear un mock
        const mockFetch = vi.fn().mockResolvedValue({
            json: async () => ({id: 1, name: "John"}),
        });

        // Reemplazar fetch global (solo en este test)
        global.fetch = mockFetch;

        const user = await fetchUser(1);

        // Verificar que fue llamado correctamente
        expect(mockFetch).toHaveBeenCalledWith("/api/user/1");
        expect(user.name).toBe("John");
    });
});
```

### Mockear un Módulo Completo

```javascript
// userService.js
import {fetchUser} from "./api";

export async function getUserName(id) {
    const user = await fetchUser(id);
    return user.name;
}
```

```javascript
// userService.test.js
import {vi, describe, it, expect} from "vitest";
import {getUserName} from "./userService";
import {fetchUser} from "./api";

// Mockear TODO el módulo './api'
vi.mock("./api");

describe("getUserName", () => {
    it("should return user name", async () => {
        // Configurar el mock
        fetchUser.mockResolvedValue({id: 1, name: "Alice"});

        const name = await getUserName(1);

        expect(name).toBe("Alice");
        expect(fetchUser).toHaveBeenCalledWith(1);
    });
});
```

---

## 3. Spies

Un spy envuelve la función real sin reemplazarla completamente.

```javascript
import {vi, describe, it, expect} from "vitest";

describe("Logger", () => {
    it("should log error messages", () => {
        const spy = vi.spyOn(console, "error");

        logger.error("Something went wrong");

        expect(spy).toHaveBeenCalledWith("Something went wrong");

        spy.mockRestore(); // Restaurar comportamiento original
    });
});
```

---

## 4. Code Coverage (Cobertura de Código)

La cobertura mide qué porcentaje de tu código es ejecutado por los tests.

```bash
npm run coverage
```

**Métricas:**

- **Statements:** Líneas de código ejecutadas.
- **Branches:** Ramas condicionales (if/else) cubiertas.
- **Functions:** Funciones llamadas.
- **Lines:** Similar a statements.

### Interpretación

- **80%+ es bueno** en la mayoría de casos.
- **100% NO garantiza ausencia de bugs.** Puedes tener tests que ejecuten el código pero no verifiquen el comportamiento
  correcto.
- **Enfócate en código crítico:** Lógica de negocio, validaciones, cálculos.

---

## 5. Cuándo NO mockear

No mockees TODO. Si mockeas demasiado, tus tests no prueban nada real.

**Regla:** Mockea las fronteras (I/O, network, filesystem). No mockees lógica interna de tu aplicación.
