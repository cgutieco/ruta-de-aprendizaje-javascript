# 06. Deploy en Plataformas Modernas

Las plataformas modernas (Netlify, Vercel, Cloudflare Pages) simplifican el despliegue con CI/CD integrado, CDN global y
HTTPS automático.

---

## 1. Netlify

### Setup Básico

1. **Conectar repositorio:** GitHub, GitLab, Bitbucket.
2. **Configurar build:**

```toml
# netlify.toml
[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

3. **Deploy:** Automático en cada push.

### Variables de Entorno

```bash
# Netlify UI: Site settings → Environment variables
VITE_API_URL=https://api.myapp.com
```

### Edge Functions

```javascript
// netlify/edge-functions/hello.js
export default async (request, context) => {
    return new Response("Hello from the edge!", {
        headers: {"content-type": "text/plain"},
    });
};

export const config = {path: "/api/hello"};
```

### Redirects y Rewrites

```toml
# netlify.toml
[[redirects]]
from = "/api/*"
to = "https://backend.myapp.com/:splat"
status = 200

[[redirects]]
from = "/old-page"
to = "/new-page"
status = 301
```

---

## 2. Vercel

### Setup Básico

1. **Conectar repositorio.**
2. **Auto-detecta framework** (Vite, Next.js, etc.).
3. **Deploy automático.**

### Configuración

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Variables de Entorno

```bash
# Vercel UI: Settings → Environment Variables
VITE_API_URL=https://api.myapp.com
```

### Edge Functions (Serverless)

```javascript
// api/hello.js
export default function handler(req, res) {
    res.status(200).json({message: "Hello from Vercel"});
}
```

### Preview Deployments

Cada PR crea un preview deployment automático.

```
https://my-app-git-feature-branch-username.vercel.app
```

---

## 3. Cloudflare Pages

### Setup Básico

1. **Conectar repositorio.**
2. **Configurar build:**

```bash
Build command: npm run build
Build output: dist
```

### Configuración

```toml
# wrangler.toml (opcional)
name = "my-app"
compatibility_date = "2025-01-01"

[build]
command = "npm run build"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Workers (Edge Functions)

```javascript
// functions/api/hello.js
export async function onRequest(context) {
    return new Response("Hello from Cloudflare!", {
        headers: {"content-type": "text/plain"},
    });
}
```

### Variables de Entorno

```bash
# Cloudflare Pages UI: Settings → Environment variables
VITE_API_URL=https://api.myapp.com
```

---

## 4. Custom Domains

### Netlify

```bash
# Netlify UI: Domain settings → Add custom domain
# Configurar DNS:
# A record: 75.2.60.5
# CNAME: your-site.netlify.app
```

### Vercel

```bash
# Vercel UI: Settings → Domains
# Agregar dominio y seguir instrucciones DNS
```

### Cloudflare Pages

```bash
# Cloudflare Pages UI: Custom domains
# Si usas Cloudflare DNS, se configura automáticamente
```

---

## 5. HTTPS

**Todas las plataformas proveen HTTPS automático** con Let's Encrypt.

---

## 6. Comparación

| Feature         | Netlify  | Vercel   | Cloudflare Pages |
|-----------------|----------|----------|------------------|
| CI/CD           | ✅        | ✅        | ✅                |
| HTTPS           | ✅        | ✅        | ✅                |
| CDN Global      | ✅        | ✅        | ✅                |
| Edge Functions  | ✅        | ✅        | ✅ (Workers)      |
| Preview Deploys | ✅        | ✅        | ✅                |
| Free Tier       | Generoso | Generoso | Ilimitado        |
| DDoS Protection | ✅        | ✅        | ✅✅               |

---

## 7. Deploy Manual (Alternativa)

### Netlify CLI

```bash
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Vercel CLI

```bash
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 8. Rollbacks

Todas las plataformas guardan historial de deploys.

```bash
# Netlify UI: Deploys → Click en deploy anterior → Publish deploy

# Vercel UI: Deployments → Click en deploy anterior → Promote to Production
```

---

## 9. Monitoreo

### Netlify Analytics

```bash
# Netlify UI: Analytics (de pago)
```

### Vercel Analytics

```bash
npm install @vercel/analytics

// main.jsx
import {Analytics} from '@vercel/analytics/react';

<Analytics/>
```

### Cloudflare Web Analytics

```html
<!-- Agregar script en index.html -->
<script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "your-token"}'
></script>
```

---

## 10. Conclusión

**Recomendación:**

- **SPAs/Static sites:** Netlify o Cloudflare Pages.
- **Next.js/React:** Vercel.
- **Máximo rendimiento global:** Cloudflare Pages.
