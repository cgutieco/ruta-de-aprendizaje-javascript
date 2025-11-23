# 04. Variables de Entorno

Las **variables de entorno** permiten configurar tu aplicación sin hardcodear valores sensibles o específicos del
entorno.

---

## 1. ¿Qué Son?

Variables que cambian según el entorno (desarrollo, staging, producción).

**Ejemplos:**

- API URLs
- API keys
- Feature flags
- Configuración de servicios

---

## 2. Archivos .env

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_ANALYTICS=false

# .env.production
VITE_API_URL=https://api.myapp.com
VITE_ENABLE_ANALYTICS=true
```

**Importante:** Vite requiere prefijo `VITE_` para exponer variables al cliente.

---

## 3. Uso en Código

```javascript
// Acceder a variables
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Ejemplo
async function fetchData() {
    const response = await fetch(`${apiUrl}/users`);
    return response.json();
}
```

---

## 4. Variables Predefinidas (Vite)

```javascript
import.meta.env.MODE; // 'development' o 'production'
import.meta.env.DEV; // true en dev
import.meta.env.PROD; // true en prod
import.meta.env.SSR; // true si es SSR
import.meta.env.BASE_URL; // Base URL del proyecto
```

---

## 5. TypeScript Typing

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_ENABLE_ANALYTICS: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

---

## 6. Seguridad

### ❌ NO Exponer Secretos

```bash
# ❌ MAL - Nunca en el frontend
VITE_SECRET_KEY=abc123
VITE_DATABASE_PASSWORD=password123
```

**Regla:** Solo exponer lo que el navegador necesita.

### ✅ Usar Backend para Secretos

```javascript
// Frontend
const response = await fetch("/api/data", {
    headers: {
        Authorization: `Bearer ${userToken}`, // Token del usuario, no API key
    },
});

// Backend maneja el API key
app.get("/api/data", async (req, res) => {
    const data = await fetch("https://external-api.com/data", {
        headers: {"X-API-Key": process.env.SECRET_API_KEY},
    });
    res.json(await data.json());
});
```

---

## 7. .env.example

```bash
# .env.example
VITE_API_URL=
VITE_ENABLE_ANALYTICS=false
```

Commitear `.env.example`, NO commitear `.env`.

```bash
# .gitignore
.env
.env.local
.env.*.local
```

---

## 8. Múltiples Entornos

```bash
.env                # Valores por defecto
.env.local          # Sobrescribe .env (no commitear)
.env.development    # Desarrollo
.env.production     # Producción
```

**Prioridad:** `.env.production.local` > `.env.production` > `.env.local` > `.env`

---

## 9. Cargar Manualmente (Node.js)

```javascript
// Backend
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.API_KEY;
```

---

## 10. Validación de Variables

```javascript
// src/config.js
function getEnvVar(key) {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

export const config = {
    apiUrl: getEnvVar("VITE_API_URL"),
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
};
```

---

## 11. Feature Flags

```javascript
// .env
VITE_FEATURE_NEW_DASHBOARD = true;

// Código
if (import.meta.env.VITE_FEATURE_NEW_DASHBOARD === "true") {
    return <NewDashboard/>;
} else {
    return <OldDashboard/>;
}
```

---

## 12. Conclusión

**Checklist:**

- ✅ Usar `.env` para configuración
- ✅ Prefijo `VITE_` para variables del cliente
- ✅ NO exponer secretos en el frontend
- ✅ Commitear `.env.example`, no `.env`
- ✅ Validar variables requeridas
