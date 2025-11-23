# 04. Logging Estructurado

El `console.log` está bien para desarrollo, pero en producción necesitas **logging estructurado**: registros con
niveles, formato consistente, y contexto.

---

## 1. Niveles de Log

```javascript
const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

class Logger {
    constructor(minLevel = LogLevel.INFO) {
        this.minLevel = minLevel;
    }

    log(level, message, meta = {}) {
        if (level < this.minLevel) return; // Filtrar

        const entry = {
            timestamp: new Date().toISOString(),
            level: Object.keys(LogLevel)[level],
            message,
            ...meta,
        };

        console.log(JSON.stringify(entry));
    }

    debug(message, meta) {
        this.log(LogLevel.DEBUG, message, meta);
    }

    info(message, meta) {
        this.log(LogLevel.INFO, message, meta);
    }

    warn(message, meta) {
        this.log(LogLevel.WARN, message, meta);
    }

    error(message, meta) {
        this.log(LogLevel.ERROR, message, meta);
    }
}
```

---

## 2. Uso

```javascript
const logger = new Logger(LogLevel.INFO);

logger.debug("Esto no se mostrará en producción");
logger.info("Usuario inició sesión", {userId: 123});
logger.warn("Rate limit cerca del límite", {current: 98, max: 100});
logger.error("Fallo en pago", {userId: 123, amount: 50, error: err.message});
```

**Output (JSON):**

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "INFO",
  "message": "Usuario inició sesión",
  "userId": 123
}
{
  "timestamp": "2025-01-15T10:30:05.000Z",
  "level": "ERROR",
  "message": "Fallo en pago",
  "userId": 123,
  "amount": 50,
  "error": "Card declined"
}
```

---

## 3. Contexto y Correlation IDs

Para rastrear una solicitud completa (ej: una petición HTTP que toca 5 servicios).

```javascript
class Logger {
    constructor(context = {}) {
        this.context = context; // {userId, requestId, sessionId}
    }

    log(level, message, meta = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...this.context, // Contexto compartido
            ...meta,
        };
        console.log(JSON.stringify(entry));
    }
}

// Crear logger con contexto
const logger = new Logger({requestId: "abc-123", userId: 456});

logger.info("Procesando pago");
// Output incluye requestId y userId automáticamente
```

---

## 4. Integración con Servicios

En producción, envías estos logs a servicios como **Datadog**, **Loggly**, **CloudWatch**, **Splunk** usando librerías
como `winston` o `pino`.
