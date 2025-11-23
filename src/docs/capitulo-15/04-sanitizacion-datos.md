# 04. Sanitización de Datos

La sanitización es el proceso de limpiar datos del usuario para prevenir inyecciones maliciosas.

---

## 1. Validación vs Sanitización

- **Validación:** Verificar que los datos cumplan reglas (ej: email válido).
- **Sanitización:** Limpiar datos peligrosos (ej: remover `<script>`).

**Ambas son necesarias.**

---

## 2. Escapar HTML

```javascript
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

// Uso
const userInput = '<script>alert("XSS")</script>';
element.textContent = escapeHTML(userInput);
// Muestra: &lt;script&gt;alert("XSS")&lt;/script&gt;
```

---

## 3. DOMPurify - Sanitización de HTML

```javascript
import DOMPurify from "dompurify";

const dirty = '<img src=x onerror=alert("XSS")>';
const clean = DOMPurify.sanitize(dirty);
// Resultado: <img src="x">

// Configuración estricta
const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a"],
    ALLOWED_ATTR: ["href"],
});
```

---

## 4. Escapar para JavaScript

```javascript
function escapeJS(str) {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
}

// ❌ MAL
const script = `<script>var name = '${userInput}';</script>`;

// ✅ BIEN
const script = `<script>var name = '${escapeJS(userInput)}';</script>`;
```

---

## 5. Escapar URLs

```javascript
// ❌ MAL
const url = `https://example.com/search?q=${userInput}`;

// ✅ BIEN
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;

// Para URLs completas
const userUrl = 'javascript:alert("XSS")';
if (!userUrl.startsWith("http://") && !userUrl.startsWith("https://")) {
    throw new Error("Invalid URL");
}
```

---

## 6. Validación de Entrada

```javascript
// Email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Número de teléfono
function isValidPhone(phone) {
    return /^\+?[1-9]\d{1,14}$/.test(phone);
}

// Solo alfanumérico
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}
```

---

## 7. Sanitización en el Backend

```javascript
// Express.js con express-validator
const {body, validationResult} = require("express-validator");

app.post(
    "/user",
    body("email").isEmail().normalizeEmail(),
    body("name").trim().escape(),
    body("age").isInt({min: 0, max: 120}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        // Datos sanitizados
    }
);
```

---

## 8. Listas Blancas vs Listas Negras

```javascript
// ❌ MAL - Lista negra (fácil de evadir)
const blacklist = ["<script>", "onerror", "onclick"];
let safe = userInput;
blacklist.forEach((bad) => {
    safe = safe.replace(new RegExp(bad, "gi"), "");
});

// ✅ BIEN - Lista blanca
const allowedTags = ["b", "i", "em", "strong"];
const clean = DOMPurify.sanitize(userInput, {ALLOWED_TAGS: allowedTags});
```

---

## 9. Conclusión

**Principio de mínimo privilegio:** Solo permite lo que es estrictamente necesario. Usa listas blancas, no negras.
