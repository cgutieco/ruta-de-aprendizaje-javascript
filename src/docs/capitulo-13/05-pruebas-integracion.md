# 05. Pruebas de Integración

Mientras los **unit tests** prueban piezas aisladas, los **integration tests** prueban cómo esas piezas trabajan juntas.

---

## 1. Diferencia entre Unit e Integration

| Aspecto       | Unit Test                            | Integration Test                              |
|---------------|--------------------------------------|-----------------------------------------------|
| **Alcance**   | Una función/clase                    | Múltiples módulos                             |
| **Mocks**     | Muchos mocks (dependencias externas) | Pocos mocks (solo fronteras reales: DB, APIs) |
| **Velocidad** | Muy rápido                           | Más lento                                     |
| **Confianza** | Baja (código aislado)                | Alta (flujo real)                             |

---

## 2. Ejemplo: Testing un Flujo Completo

```javascript
// UserService.js
import {fetchUser} from "./api";
import {saveToCache} from "./cache";

export async function getUserWithCache(id) {
    const cached = getFromCache(id);
    if (cached) return cached;

    const user = await fetchUser(id);
    saveToCache(id, user);
    return user;
}
```

### Unit Test (Aislado)

```javascript
vi.mock("./api");
vi.mock("./cache");

it("should use cache if available", async () => {
    getFromCache.mockReturnValue({id: 1, name: "Cached"});

    const user = await getUserWithCache(1);

    expect(fetchUser).not.toHaveBeenCalled();
    expect(user.name).toBe("Cached");
});
```

### Integration Test (Con Implementaciones Reales)

```javascript
import {getUserWithCache} from "./UserService";

it("should fetch and cache user", async () => {
    // NO mockeamos api ni cache, usamos implementaciones reales
    // (o versiones in-memory para testing)

    const user1 = await getUserWithCache(1);
    expect(user1.name).toBe("John");

    const user2 = await getUserWithCache(1); // Segunda llamada
    // Debería venir del caché, no hacer fetch de nuevo
});
```

---

## 3. Cuándo Usar Integration Tests

- **Flujos críticos:** Autenticación, checkout, procesamiento de pago.
- **Interacciones complejas:** Varios módulos que dependen uno del otro.
- **APIs:** Testear endpoints completos (request → controller → service → database → response).

---

## 4. Testing de APIs con Supertest (Node.js)

```javascript
import request from "supertest";
import {app} from "./server";

describe("POST /api/users", () => {
    it("should create a new user", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({name: "Alice", email: "alice@example.com"})
            .expect(201);

        expect(response.body.user.name).toBe("Alice");
        expect(response.body.user.id).toBeDefined();
    });
});
```

---

## 5. E2E (End-to-End) - El Nivel Más Alto

Los tests E2E abren un navegador real y simulan un usuario.

**Herramientas:**

- **Playwright:** Moderno, rápido, multi-navegador.
- **Cypress:** Popular, dev-friendly.

```javascript
// Ejemplo con Playwright
import {test, expect} from "@playwright/test";

test("user can login", async ({page}) => {
    await page.goto("http://localhost:3000");

    await page.fill('input[name="email"]', "user@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page.locator("h1")).toContainText("Dashboard");
});
```

---

## 6. Pirámide de Tests

```
       /\
      /E2E\       (Pocos, lentos, alta confianza)
     /------\
    / INTEG \     (Algunos, moderados)
   /----------\
  /   UNIT     \  (Muchos, rápidos, baja confianza individual)
 /--------------\
```

**Regla:** Más unit tests, algunos integration, pocos E2E.
