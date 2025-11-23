# 05. Dependency Injection (Inyección de Dependencias)

La **Inyección de Dependencias (DI)** es un patrón de diseño que implementa la **Inversión de Control (IoC)**. Suena
complejo, pero es simple: **No crees tus dependencias, pídelas.**

---

## 1. El Problema (Alto Acoplamiento)

```javascript
import {Database} from "./Database";

class UserService {
    constructor() {
        // ❌ MAL: UserService crea su propia base de datos.
        // Es difícil de testear (¿cómo mockeas la DB?)
        // Es difícil de configurar (¿y si quiero usar otra DB?)
        this.db = new Database();
    }

    async getUser(id) {
        return this.db.find(id);
    }
}
```

---

## 2. La Solución (Inyección)

Pasamos la dependencia por el constructor.

```javascript
class UserService {
    // ✅ BIEN: UserService "pide" una base de datos.
    constructor(database) {
        this.db = database;
    }

    async getUser(id) {
        return this.db.find(id);
    }
}
```

### Uso en Producción:

```javascript
const mySqlDB = new MySQLDatabase();
const service = new UserService(mySqlDB);
```

### Uso en Tests:

```javascript
const mockDB = {find: () => ({id: 1, name: "Test"})};
const service = new UserService(mockDB); // ¡Fácil de testear!
```

---

## 3. Contenedores de DI

En apps grandes, crear todo a mano (`new A(new B(new C()))`) es tedioso. Usamos un **Contenedor** que lo hace por
nosotros (común en Angular o NestJS).

```javascript
// Ejemplo conceptual
const container = new Container();

container.register("db", new MySQLDatabase());
container.register("userService", (c) => new UserService(c.get("db")));

const service = container.get("userService"); // ¡Magia!
```

---

## 4. Conclusión

La DI hace tu código:

1. **Desacoplado:** Las clases no dependen de implementaciones concretas, sino de interfaces (contratos).
2. **Testeable:** Puedes sustituir dependencias reales por mocks/stubs.
3. **Flexible:** Puedes cambiar la base de datos o el servicio de email sin tocar la lógica de negocio.
