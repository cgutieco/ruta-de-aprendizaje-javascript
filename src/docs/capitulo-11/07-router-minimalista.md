# 07. Router Minimalista

Las SPAs (Single Page Applications) necesitan enrutamiento del lado del cliente. Vamos a construir un router básico
usando la **History API**.

---

## 1. Hash Router vs History Router

- **Hash Router:** Usa `#/about`. Cambia `window.location.hash`. No requiere configuración del servidor.
- **History Router:** Usa `/about`. Usa `pushState()`. Requiere que el servidor devuelva `index.html` para todas las
  rutas.

Implementaremos History Router por ser más moderno.

---

## 2. El State Global del Router

```javascript
let currentPath = window.location.pathname;
const routes = [];

function navigate(path) {
    window.history.pushState(null, "", path);
    currentPath = path;
    reRender(); // Re-renderizar la app
}

// Detectar cuando el usuario usa Back/Forward del navegador
window.addEventListener("popstate", () => {
    currentPath = window.location.pathname;
    reRender();
});
```

---

## 3. Componente `Route`

Renderiza su hijo solo si la ruta coincide.

```javascript
function Route({path, component}) {
    if (currentPath === path) {
        return component();
    }
    return null; // No renderizar nada
}
```

---

## 4. Componente `Link`

Un enlace que usa `navigate` en lugar de recargar la página.

```javascript
function Link({to, children}) {
    return createElement(
        "a",
        {
            href: to,
            onClick: (e) => {
                e.preventDefault(); // Evitar navegación normal
                navigate(to);
            },
        },
        children
    );
}
```

---

## 5. Uso Completo

```javascript
function Home() {
    return createElement("h1", null, "Página de Inicio");
}

function About() {
    return createElement("h1", null, "Acerca de");
}

function App() {
    return createElement(
        "div",
        null,
        createElement(
            "nav",
            null,
            createElement(Link, {to: "/"}, "Home"),
            " | ",
            createElement(Link, {to: "/about"}, "About")
        ),
        createElement(Route, {path: "/", component: Home}),
        createElement(Route, {path: "/about", component: About})
    );
}
```

---

## 6. Conclusión

Con esto tienes un router funcional. React Router hace esto mismo pero añade:

- Rutas dinámicas (`/user/:id`).
- Rutas anidadas.
- Componente `Outlet` para layouts.
- Guards (protección de rutas).
