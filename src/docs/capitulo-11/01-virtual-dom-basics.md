# 01. Virtual DOM Basics

El "Virtual DOM" suena místico, pero es simplemente **un objeto de JavaScript** que describe cómo debería verse el DOM
real.

React no toca el DOM real inmediatamente. Primero crea este árbol de objetos (barato) y luego decide qué cambios mínimos
hacer en el DOM real (caro).

---

## 1. La función `createElement` (o `h`)

En React escribes JSX:

```jsx
<div id="foo">Hello</div>
```

Pero esto se compila a:

```javascript
React.createElement("div", {id: "foo"}, "Hello");
```

Vamos a implementar nuestra propia versión, a menudo llamada `h` (hyperscript) en librerías minimalistas como Preact.

```javascript
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) =>
                typeof child === "object" ? child : createTextElement(child)
            ),
        },
    };
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}
```

---

## 2. Estructura del VNode

Si llamamos a nuestra función:

```javascript
const element = createElement(
    "div",
    {id: "foo"},
    createElement("a", null, "bar"),
    "baz"
);
```

Obtenemos este objeto (VNode):

```javascript
{
    type: "div",
        props
:
    {
        id: "foo",
            children
    :
        [
            {
                type: "a",
                props: {
                    children: [
                        {type: "TEXT_ELEMENT", props: {nodeValue: "bar", children: []}}
                    ]
                }
            },
            {
                type: "TEXT_ELEMENT",
                props: {
                    nodeValue: "baz",
                    children: []
                }
            }
        ]
    }
}
```

¡Eso es todo! El Virtual DOM es solo un árbol de objetos JSON.
