# 03. Custom Errors

Crear tus propios tipos de errores hace que el código sea más expresivo y permite manejar diferentes errores de forma
específica.

---

## 1. Extender la clase Error

```javascript
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class NetworkError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "NetworkError";
        this.statusCode = statusCode;
    }
}
```

---

## 2. Uso

Ahora puedes diferenciar tipos de errores en el `catch`.

```javascript
try {
    if (!email.includes("@")) {
        throw new ValidationError("Email inválido");
    }

    const response = await fetch("/api/users");
    if (!response.ok) {
        throw new NetworkError("Fallo en la petición", response.status);
    }
} catch (error) {
    if (error instanceof ValidationError) {
        // Mostrar al usuario que corrija el formulario
        mostrarError(error.message);
    } else if (error instanceof NetworkError) {
        // Retry o mostrar mensaje de "sin conexión"
        if (error.statusCode === 429) {
            console.log("Muchas peticiones, esperando...");
            await sleep(5000);
        }
    } else {
        // Error inesperado
        logger.error("Error desconocido:", error);
    }
}
```

---

## 3. Añadir Metadata

```javascript
class DatabaseError extends Error {
    constructor(message, query, originalError) {
        super(message);
        this.name = "DatabaseError";
        this.query = query;
        this.originalError = originalError;
        this.timestamp = new Date();
    }
}

// Uso
try {
    await db.execute(query);
} catch (err) {
    throw new DatabaseError("Fallo en consulta DB", query, err);
}
```

---

## 4. Códigos de Error

Útil para internacionalización o documentación.

```javascript
class AppError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code; // ej: "AUTH_001", "PAYMENT_002"
    }
}

// Diccionario de errores
const ERROR_CODES = {
    AUTH_001: "Credenciales inválidas",
    AUTH_002: "Token expirado",
    PAYMENT_001: "Tarjeta rechazada",
};
```
