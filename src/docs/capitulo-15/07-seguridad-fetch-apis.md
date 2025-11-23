# 07. Seguridad en Fetch y APIs

Comunicarse con APIs de forma segura es fundamental para proteger datos del usuario.

---

## 1. Siempre Usar HTTPS

```javascript
// ❌ MAL
fetch("http://api.example.com/data");

// ✅ BIEN
fetch("https://api.example.com/data");
```

HTTP es texto plano. Cualquiera en la red puede interceptar y leer los datos.

---

## 2. Autenticación con Tokens

### Bearer Tokens (JWT)

```javascript
const token = localStorage.getItem("authToken");

fetch("https://api.example.com/user", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
```

**⚠️ Riesgo:** Si hay XSS, el token puede ser robado.

### Cookies HttpOnly (Más Seguro)

```javascript
fetch("https://api.example.com/user", {
    credentials: "include", // Envía cookies
});
```

El token está en una cookie `HttpOnly`, inaccesible desde JavaScript.

---

## 3. No Exponer Tokens en URLs

```javascript
// ❌ MAL - El token queda en logs del servidor, historial del navegador
fetch(`https://api.example.com/data?token=${token}`);

// ✅ BIEN - Usa headers
fetch("https://api.example.com/data", {
    headers: {Authorization: `Bearer ${token}`},
});
```

---

## 4. Validar Respuestas del Servidor

```javascript
const response = await fetch("https://api.example.com/data");

// ❌ MAL - Asumir que siempre es JSON
const data = await response.json();

// ✅ BIEN - Validar status y content-type
if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
}

const contentType = response.headers.get("content-type");
if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Invalid content-type");
}

const data = await response.json();
```

---

## 5. Timeout para Peticiones

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
    const response = await fetch("https://api.example.com/data", {
        signal: controller.signal,
    });
    clearTimeout(timeoutId);
} catch (error) {
    if (error.name === "AbortError") {
        console.error("Request timed out");
    }
}
```

---

## 6. No Confiar en Datos del Cliente

```javascript
// ❌ MAL - El cliente puede modificar esto
fetch("https://api.example.com/user", {
    method: "POST",
    body: JSON.stringify({
        userId: 123,
        isAdmin: true, // ⚠️ El cliente puede mentir
    }),
});

// ✅ BIEN - El servidor determina el userId desde el token
// Backend:
const userId = getUserIdFromToken(req.headers.authorization);
const user = await db.users.findById(userId);
```

---

## 7. Rate Limiting

```javascript
// Backend
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 peticiones
    message: "Too many requests",
});

app.use("/api/", limiter);
```

---

## 8. Evitar Credential Leaks

```javascript
// ❌ MAL - API key en el código
const API_KEY = "sk_live_abc123";
fetch(`https://api.service.com/data?key=${API_KEY}`);

// ✅ BIEN - API key en el backend
// Frontend
fetch("https://mybackend.com/proxy/data");

// Backend
app.get("/proxy/data", async (req, res) => {
    const response = await fetch("https://api.service.com/data", {
        headers: {"X-API-Key": process.env.API_KEY},
    });
    res.json(await response.json());
});
```

---

## 9. Subresource Integrity (SRI)

```html
<!-- Verificar que el CDN no fue comprometido -->
<script
        src="https://cdn.example.com/lib.js"
        integrity="sha384-abc123..."
        crossorigin="anonymous"
></script>
```

Si el hash no coincide, el navegador no ejecuta el script.

---

## 10. Conclusión

**Checklist de seguridad:**

- ✅ HTTPS siempre
- ✅ Tokens en headers, no en URLs
- ✅ Cookies HttpOnly para sesiones
- ✅ Validar respuestas
- ✅ Timeouts
- ✅ Rate limiting
- ✅ API keys en el backend
