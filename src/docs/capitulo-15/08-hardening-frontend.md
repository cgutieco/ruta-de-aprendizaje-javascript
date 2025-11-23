# 08. Hardening del Frontend

"Hardening" es el proceso de endurecer la seguridad de tu aplicación. Aquí hay técnicas esenciales.

---

## 1. Security Headers

```http
# Prevenir clickjacking
X-Frame-Options: DENY

# O usar CSP
Content-Security-Policy: frame-ancestors 'none'

# Prevenir MIME sniffing
X-Content-Type-Options: nosniff

# Forzar HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# Desactivar features peligrosas
Permissions-Policy: geolocation=(), microphone=(), camera=()

# Prevenir XSS (legacy)
X-XSS-Protection: 1; mode=block

# Controlar referrer
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 2. Subresource Integrity (SRI)

```html
<!-- Verificar integridad de recursos externos -->
<script
        src="https://cdn.jsdelivr.net/npm/vue@3.2.45/dist/vue.global.js"
        integrity="sha384-abc123..."
        crossorigin="anonymous"
></script>

<link
        rel="stylesheet"
        href="https://cdn.example.com/style.css"
        integrity="sha384-xyz789..."
        crossorigin="anonymous"
/>
```

Genera hashes con:

```bash
openssl dgst -sha384 -binary file.js | openssl base64 -A
```

---

## 3. Feature Policy / Permissions Policy

```http
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
```

Desactiva features que no usas para reducir superficie de ataque.

---

## 4. Deshabilitar Autocompletado Sensible

```html
<!-- Prevenir que el navegador guarde contraseñas en campos incorrectos -->
<input type="password" autocomplete="new-password"/>

<!-- Deshabilitar completamente -->
<input type="text" autocomplete="off"/>
```

---

## 5. Prevenir Clickjacking

```http
X-Frame-Options: DENY
```

O con CSP:

```http
Content-Security-Policy: frame-ancestors 'none'
```

O con JavaScript (menos confiable):

```javascript
if (window.top !== window.self) {
    window.top.location = window.self.location;
}
```

---

## 6. Ocultar Información del Servidor

```http
# ❌ MAL
Server: Apache/2.4.41 (Ubuntu)
X-Powered-By: Express

# ✅ BIEN
# No enviar estos headers
```

```javascript
// Express.js
app.disable("x-powered-by");
```

---

## 7. Modo HTTPS Estricto (HSTS)

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- **`max-age`:** Segundos que el navegador debe forzar HTTPS.
- **`includeSubDomains`:** Aplicar a todos los subdominios.
- **`preload`:** Incluir en la lista de preload de navegadores.

---

## 8. Deshabilitar Caché para Datos Sensibles

```http
Cache-Control: no-store, no-cache, must-revalidate, private
Pragma: no-cache
Expires: 0
```

```javascript
// Express.js
app.use("/api/sensitive", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});
```

---

## 9. Validar Entrada en el Frontend (Pero No Confiar)

```javascript
// ✅ Validar en frontend para UX
if (!email.includes("@")) {
    showError("Email inválido");
    return;
}

// ✅ SIEMPRE validar en backend también
// El frontend puede ser bypasseado
```

---

## 10. Configuración de Producción

```javascript
// Vite
export default {
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true, // Remover console.log
                drop_debugger: true,
            },
        },
        sourcemap: false, // No exponer source maps en producción
    },
};
```

---

## 11. Helmet.js (Express)

```javascript
const helmet = require("helmet");

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'nonce-{random}'"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    })
);
```

---

## 12. Conclusión

**Checklist de hardening:**

- ✅ Security headers
- ✅ SRI para CDNs
- ✅ HSTS
- ✅ CSP
- ✅ Deshabilitar features no usadas
- ✅ No exponer información del servidor
- ✅ No cachear datos sensibles
