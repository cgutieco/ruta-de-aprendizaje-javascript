# 06. Clean Architecture Básica

**Clean Architecture** (de Robert C. Martin "Uncle Bob") es la guía definitiva para crear software que sobreviva al paso
del tiempo.

La regla de oro es la **Regla de Dependencia**: Las dependencias de código fuente solo pueden apuntar **hacia adentro**.

---

## 1. Los Círculos Concéntricos

Imagina una cebolla.

1. **Entities (Centro):** Reglas de negocio de la empresa. Son objetos JS puros. No saben NADA de bases de datos,
   frameworks o UI.
2. **Use Cases (Casos de Uso):** Reglas de negocio de la aplicación. Orquestan el flujo de datos hacia y desde las
   entidades. Ej: `CrearPedido`, `RegistrarUsuario`.
3. **Interface Adapters (Adaptadores):** Controladores, Presentadores, Gateways. Convierten datos del formato
   conveniente para los casos de uso al formato conveniente para la web/DB.
4. **Frameworks & Drivers (Exterior):** React, Vue, Express, PostgreSQL, el navegador. Detalles sucios de
   implementación.

---

## 2. Ejemplo Práctico

### Entidad (Puro JS)

```javascript
// src/domain/User.js
export class User {
    constructor(id, name, email) {
        if (!email.includes("@")) throw new Error("Email inválido");
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
```

### Caso de Uso (Puro JS)

```javascript
// src/use-cases/RegisterUser.js
import {User} from "../domain/User.js";

export class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository; // Inyección de dependencia
    }

    async execute(userData) {
        const user = new User(null, userData.name, userData.email);
        return await this.userRepository.save(user);
    }
}
```

### Adaptador (Implementación concreta)

```javascript
// src/adapters/FetchUserRepository.js
export class FetchUserRepository {
    async save(user) {
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(user),
        });
        return response.json();
    }
}
```

### Framework (React/Vue)

```javascript
// src/ui/RegisterComponent.jsx
const repo = new FetchUserRepository();
const useCase = new RegisterUser(repo);

const handleSubmit = (data) => {
    useCase.execute(data).then(() => alert("Usuario creado"));
};
```

---

## 3. Beneficios

1. **Independencia de Frameworks:** ¿React pasó de moda? Tu lógica de negocio (Entidades y Casos de Uso) no cambia. Solo
   cambias la capa exterior.
2. **Independencia de UI:** Puedes cambiar la web por una consola o una app móvil sin tocar las reglas de negocio.
3. **Independencia de Base de Datos:** Puedes cambiar de SQL a Mongo o a LocalStorage cambiando solo el Adaptador.
4. **Testeabilidad Extrema:** Puedes probar toda la lógica de negocio sin arrancar un servidor ni abrir un navegador.

---

## 4. Conclusión

Clean Architecture añade "boilerplate" (más archivos). No la uses para un "To-Do List" de fin de semana. Úsala para
aplicaciones que planeas mantener durante **años**.
