# 03. Render y Commit

Ahora que tenemos VNodes (objetos), necesitamos convertirlos en DOM real. Este proceso tiene dos fases en React:

1. **Render:** Crear el árbol de VNodes.
2. **Commit:** Aplicar los cambios al DOM real.

---

## 1. La función `render`

Nuestra función `render` toma un VNode y un contenedor DOM, y crea el DOM real recursivamente.

```javascript
function render(vnode, container) {
    const dom = createDom(vnode);
    container.appendChild(dom);
}

function createDom(vnode) {
    // Caso especial: Texto
    if (vnode.type === "TEXT_ELEMENT") {
        return document.createTextNode(vnode.props.nodeValue);
    }

    // Caso: Componente Funcional
    if (typeof vnode.type === "function") {
        const component = vnode.type;
        const childVnode = component(vnode.props);
        return createDom(childVnode); // Recursión
    }

    // Caso: Elemento HTML
    const dom = document.createElement(vnode.type);

    // Asignar propiedades (atributos y eventos)
    Object.keys(vnode.props)
        .filter((key) => key !== "children")
        .forEach((name) => {
            if (name.startsWith("on")) {
                // Eventos (onClick -> click)
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, vnode.props[name]);
            } else {
                // Atributos normales
                dom[name] = vnode.props[name];
            }
        });

    // Renderizar hijos recursivamente
    vnode.props.children.forEach((child) => {
        render(child, dom);
    });

    return dom;
}
```

---

## 2. Uso

```javascript
const App = () => {
    return createElement(
        "div",
        {id: "app"},
        createElement("h1", null, "Mi React"),
        createElement(
            "button",
            {
                onClick: () => alert("Click!"),
            },
            "Hazme click"
        )
    );
};

const root = document.getElementById("root");
render(createElement(App), root);
```

¡Y ya tenemos un renderizador funcional! Pero todavía no es reactivo (no se actualiza cuando cambia el estado).
