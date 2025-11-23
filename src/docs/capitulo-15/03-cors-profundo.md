# 03. CORS Profundo

**CORS (Cross-Origin Resource Sharing)** controla qué dominios pueden acceder a recursos de tu API desde el navegador.

---

## 1. Same-Origin Policy

Por defecto, el navegador bloquea peticiones cross-origin.

```javascript
// En https://example.com
fetch("https://api.other.com/data")
    .then((res) => res.json())
    .catch((err) => console.error("Blocked by CORS"));
```

**Same-Origin:** Mismo protocolo + dominio + puerto.

---

## 2. Cómo Funciona CORS

### Petición Simple (Simple Request)

```javascript
// Frontend (https://example.com)
fetch('https://api.other.com/data');

// Backend responde con:
Access - Control - Allow - Origin
:
https://example.com
```

Si el header coincide, el navegador permite la respuesta.

### Petición Preflight

Para peticiones complejas (POST con JSON, headers custom), el navegador envía primero un `OPTIONS`.

```http
OPTIONS /api/data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

Si el preflight pasa, se envía la petición real.

---

## 3. Headers CORS Importantes

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Expose-Headers: X-Total-Count
Access-Control-Max-Age: 3600
```

---

## 4. Credenciales (Cookies)

```javascript
// Frontend
fetch('https://api.other.com/data', {
    credentials: 'include' // Enviar cookies
});

// Backend DEBE responder con:
Access - Control - Allow - Origin
:
https://example.com // NO puede ser *
    Access - Control - Allow - Credentials
:
true
```

---

## 5. Errores Comunes

### Usar `*` con Credenciales

```javascript
// ❌ MAL
Access - Control - Allow - Origin
: *
Access - Control - Allow - Credentials
:
true
// El navegador rechaza esto
```

### No Incluir el Origin Correcto

```javascript
// ❌ MAL
Access - Control - Allow - Origin
:
https://wrong-domain.com

// ✅ BIEN
    const allowedOrigins = ['https://example.com', 'https://app.example.com'];
const origin = req.headers.origin;

if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
}
```

---

## 6. Implicaciones de Seguridad

### CORS NO es Autenticación

```javascript
// ❌ CORS no protege tu API
// Cualquiera puede hacer peticiones desde Postman/curl

// ✅ Usa autenticación real (tokens, API keys)
if (!req.headers.authorization) {
    return res.status(401).json({error: "Unauthorized"});
}
```

### CORS Protege al Usuario, No al Servidor

CORS evita que sitios maliciosos lean datos del usuario desde el navegador. No evita ataques directos al servidor.

---

## 7. Configuración Segura

```javascript
// Express.js
const cors = require("cors");

app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = ["https://example.com"];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
```

---

## 8. Conclusión

CORS es una capa de seguridad del navegador. Configúralo correctamente para permitir solo orígenes confiables.
