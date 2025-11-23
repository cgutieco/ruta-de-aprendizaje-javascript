# 02. CSRF (Cross-Site Request Forgery)

**CSRF** permite a un atacante hacer que un usuario autenticado ejecute acciones no deseadas en una aplicación web sin
su conocimiento.

---

## 1. Cómo Funciona

```html
<!-- Sitio malicioso evil.com -->
<img src="https://bank.com/transfer?to=attacker&amount=1000"/>

<!-- Si el usuario está autenticado en bank.com, la petición se ejecuta -->
```

El navegador envía automáticamente las cookies de `bank.com`, por lo que la petición parece legítima.

---

## 2. CSRF Tokens

El servidor genera un token único por sesión que debe incluirse en cada petición.

```javascript
// Backend genera token
const csrfToken = generateRandomToken();
session.csrfToken = csrfToken;

// Frontend incluye token en peticiones
fetch("/api/transfer", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({to: "user123", amount: 100}),
});

// Backend valida token
if (req.headers["x-csrf-token"] !== req.session.csrfToken) {
    return res.status(403).json({error: "Invalid CSRF token"});
}
```

---

## 3. SameSite Cookies

```http
Set-Cookie: sessionId=abc123; SameSite=Strict; Secure; HttpOnly
```

- **`SameSite=Strict`:** La cookie NO se envía en peticiones cross-site.
- **`SameSite=Lax`:** La cookie se envía solo en navegación top-level (GET).
- **`SameSite=None`:** La cookie se envía siempre (requiere `Secure`).

```javascript
// Con SameSite=Strict, este ataque falla
<img src="https://bank.com/transfer?to=attacker&amount=1000">
    // La cookie de sesión NO se envía
```

---

## 4. Verificar el Origin/Referer

```javascript
// Backend
const origin = req.headers.origin;
const referer = req.headers.referer;

if (!origin || !origin.startsWith("https://myapp.com")) {
    return res.status(403).json({error: "Invalid origin"});
}
```

---

## 5. Usar POST para Acciones Sensibles

```javascript
// ❌ MAL - GET puede ser atacado con <img>
app.get("/delete-account", (req, res) => {
    deleteAccount(req.user.id);
});

// ✅ BIEN - POST requiere JavaScript
app.post("/delete-account", (req, res) => {
    // Validar CSRF token
    deleteAccount(req.user.id);
});
```

---

## 6. Doble Submit Cookie

```javascript
// Backend
res.cookie("csrf-token", token, {httpOnly: false});
res.cookie("session", sessionId, {httpOnly: true});

// Frontend
const csrfToken = getCookie("csrf-token");
fetch("/api/action", {
    method: "POST",
    headers: {"X-CSRF-Token": csrfToken},
});

// Backend valida que ambos coincidan
if (req.cookies["csrf-token"] !== req.headers["x-csrf-token"]) {
    return res.status(403).json({error: "CSRF validation failed"});
}
```

---

## 7. Conclusión

**Defensa en profundidad:** Usa CSRF tokens + SameSite cookies + validación de Origin.
