# 03. Estructura Profesional de Proyecto

Una estructura bien organizada facilita el mantenimiento, la escalabilidad y la colaboración.

---

## 1. Estructura Básica (Proyecto Pequeño)

```
my-app/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   └── Header.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── utils/
│   │   └── helpers.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── favicon.ico
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 2. Estructura Escalable (Proyecto Grande)

```
my-app/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── SignupForm.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   └── index.js
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── index.js
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.test.js
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   ├── hooks/
│   │   │   └── useFetch.js
│   │   ├── utils/
│   │   │   ├── format.js
│   │   │   └── validation.js
│   │   └── constants/
│   │       └── config.js
│   ├── services/
│   │   ├── api.js
│   │   └── storage.js
│   ├── store/
│   │   ├── slices/
│   │   └── index.js
│   ├── routes/
│   │   └── index.jsx
│   ├── styles/
│   │   ├── variables.css
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 3. Organización por Features

**Ventaja:** Cada feature es autocontenida.

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── index.js  // Exporta todo lo público
├── products/
│   ├── components/
│   ├── hooks/
│   └── index.js
```

```javascript
// features/auth/index.js
export {LoginForm} from "./components/LoginForm";
export {useAuth} from "./hooks/useAuth";

// Uso en otra parte
import {LoginForm, useAuth} from "@/features/auth";
```

---

## 4. Separación de Concerns

### Components

```
components/
├── Button/
│   ├── Button.jsx        // Componente
│   ├── Button.test.js    // Tests
│   ├── Button.module.css // Estilos
│   └── index.js          // Re-export
```

### Services (Lógica de negocio)

```javascript
// services/userService.js
export const userService = {
    async getUser(id) {
        const response = await fetch(`/api/users/${id}`);
        return response.json();
    },
    async updateUser(id, data) {
        const response = await fetch(`/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        return response.json();
    },
};
```

### Hooks (Lógica reutilizable)

```javascript
// hooks/useFetch.js
export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, [url]);

    return {data, loading};
}
```

---

## 5. Path Aliases

```javascript
// vite.config.js
import {defineConfig} from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@features": path.resolve(__dirname, "./src/features"),
        },
    },
});
```

```javascript
// Antes
import {Button} from "../../../shared/components/Button";

// Después
import {Button} from "@components/Button";
```

---

## 6. Archivos de Configuración

```
.env.development
.env.production
.env.example        # Template sin secretos
.gitignore
.prettierrc
.eslintrc.js
tsconfig.json       # Si usas TypeScript
vite.config.js
```

---

## 7. Documentación

```
README.md           # Descripción, setup, comandos
CONTRIBUTING.md     # Guía para contribuir
CHANGELOG.md        # Historial de cambios
```

---

## 8. Conclusión

**Principios:**

- **Cohesión:** Archivos relacionados juntos.
- **Desacoplamiento:** Features independientes.
- **Escalabilidad:** Fácil agregar nuevas features.
- **Consistencia:** Misma estructura en todo el proyecto.
