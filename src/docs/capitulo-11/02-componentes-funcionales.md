# 02. Componentes Funcionales

Hasta ahora, nuestro `createElement` solo entiende etiquetas HTML (`div`, `span`). Pero React brilla por sus *
*Componentes**.

Un Componente Funcional no es más que una función que retorna un VNode.

---

## 1. Diferencia entre Elemento y Componente

```javascript
// Elemento HTML simple
const vnode1 = createElement("div", null, "Hola");

// Componente
function Welcome({name}) {
    return createElement("h1", null, `Hola, ${name}`);
}

// Uso del componente
const vnode2 = createElement(Welcome, {name: "Juan"});
```

Observa la diferencia en el objeto resultante:

**vnode1 (HTML):**

```javascript
{
    type: "div", props
:
    { ...
    }
}
```

**vnode2 (Componente):**

```javascript
{
    type: Welcome, props
:
    {
        name: "Juan"
    }
} // type es una FUNCIÓN
```

---

## 2. Procesando Componentes

Cuando nuestro sistema de renderizado (que haremos luego) encuentra que `type` es una función, debe:

1. Llamar a la función `type(props)`.
2. Tomar el VNode que retorna esa función.
3. Seguir procesando ese VNode resultante hasta llegar a elementos HTML básicos.

Esto es lo que permite la **composición**: componentes dentro de componentes.

```javascript
function App() {
    return createElement(
        "div",
        null,
        createElement(Welcome, {name: "Ana"}),
        createElement(Welcome, {name: "Pedro"})
    );
}
```
