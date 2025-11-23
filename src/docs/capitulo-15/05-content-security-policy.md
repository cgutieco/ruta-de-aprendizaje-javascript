# 05. Content Security Policy (CSP)

**CSP** es un header HTTP que le dice al navegador qué recursos puede cargar, previniendo XSS y otros ataques.

---

## 1. Directivas Básicas

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

- **`default-src`:** Fallback para todas las directivas.
- **`script-src`:** De dónde pueden venir los scripts.
- **`style-src`:** De dónde pueden venir los estilos.
- **`img-src`:** De dónde pueden venir las imágenes.
- **`connect-src`:** A dónde puede hacer fetch/XHR.

---

## 2. Valores Comunes

```http
Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
```

- **`'self'`:** Mismo origen.
- **`'none'`:** Bloquear todo.
- **`'unsafe-inline'`:** Permitir scripts/estilos inline (⚠️ inseguro).
- **`'unsafe-eval'`:** Permitir `eval()` (⚠️ inseguro).
- **`https:`:** Cualquier origen HTTPS.
- **`data:`:** Data URIs.

---

## 3. Nonces para Scripts Inline

```html
<!-- Backend genera nonce aleatorio -->
<meta
        http-equiv="Content-Security-Policy"
        content="script-src 'self' 'nonce-random123abc'"
/>

<!-- Solo scripts con el nonce correcto se ejecutan -->
<script nonce="random123abc">
    console.log("Permitido");
</script>

<script>
    console.log("Bloqueado"); // ❌ Sin nonce
</script>
```

---

## 4. Hashes para Scripts Inline

```javascript
// Script
<script>console.log('Hello');</script>

// Generar hash SHA-256
const hash = sha256("console.log('Hello');");
// sha256-xyz123...

// CSP
Content - Security - Policy
:
script - src
'self'
'sha256-xyz123...'
```

---

## 5. Report-Only Mode

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
```

El navegador NO bloquea, solo reporta violaciones. Útil para testear CSP sin romper la app.

```javascript
// Backend recibe reportes
app.post("/csp-report", (req, res) => {
    console.log("CSP Violation:", req.body);
    res.status(204).end();
});
```

---

## 6. Ejemplo Completo

```http
Content-Security-Policy:
    default-src 'none';
    script-src 'self' 'nonce-{random}';
    style-src 'self' 'nonce-{random}';
    img-src 'self' https: data:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
```

---

## 7. Directivas de Seguridad Extra

### `frame-ancestors`

Previene clickjacking.

```http
Content-Security-Policy: frame-ancestors 'none'
```

Equivalente a `X-Frame-Options: DENY`.

### `upgrade-insecure-requests`

Convierte HTTP a HTTPS automáticamente.

```http
Content-Security-Policy: upgrade-insecure-requests
```

---

## 8. Implementación Progresiva

1. **Empezar con Report-Only.**
2. **Revisar reportes y ajustar.**
3. **Activar CSP en modo enforcement.**
4. **Eliminar `'unsafe-inline'` y `'unsafe-eval'` gradualmente.**

---

## 9. Conclusión

CSP es una de las defensas más efectivas contra XSS. Empieza permisivo y ve endureciendo.
