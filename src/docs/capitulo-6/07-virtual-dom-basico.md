# 07. Crear un Virtual DOM básico

React, Vue y otros frameworks usan un "Virtual DOM" para mejorar el rendimiento. Pero, ¿qué es exactamente? Es
simplemente **una representación en objetos de JavaScript** de cómo debería verse el DOM.

---

## 1. El Concepto

Tocar el DOM real es lento. Tocar objetos JS es rápido.
La estrategia es:

1. Crear el árbol de objetos (Virtual DOM).
2. Compararlo con el árbol anterior (Diffing).
3. Calcular los cambios mínimos necesarios.
4. Aplicar esos cambios al DOM real (Patching).

---

## 2. Implementación Miniatura

Vamos a crear una función `h` (hyperscript) para crear nodos virtuales.

```javascript
function h(tag, props, children) {
    return {tag, props, children};
}

// Representación virtual de <div id="app"><h1>Hola</h1></div>
const vApp = h("div", {id: "app"}, [h("h1", null, ["Hola"])]);

console.log(vApp);
/*
{
    tag: 'div',
    props: { id: 'app' },
    children: [
        { tag: 'h1', props: null, children: ['Hola'] }
    ]
}
*/
```

---

## 3. Renderizado (Mount)

Una función que toma un nodo virtual y crea nodos reales.

```javascript
function render(vNode, container) {
    // 1. Si es texto, crear nodo de texto
    if (typeof vNode === "string") {
        container.appendChild(document.createTextNode(vNode));
        return;
    }

    // 2. Crear elemento
    const $el = document.createElement(vNode.tag);

    // 3. Añadir propiedades (simplificado)
    if (vNode.props) {
        for (const [key, value] of Object.entries(vNode.props)) {
            $el.setAttribute(key, value);
        }
    }

    // 4. Recursividad para los hijos
    if (vNode.children) {
        vNode.children.forEach((child) => render(child, $el));
    }

    container.appendChild($el);
}

render(vApp, document.body);
```

---

## 4. El Algoritmo de Diffing (Conceptual)

La magia ocurre cuando cambias algo. En lugar de borrar todo y volver a renderizar (como hicimos arriba), comparamos:

1. **¿Cambió el tag?** (`div` -> `p`) -> Reemplazar todo el nodo.
2. **¿Cambiaron las props?** (`id="a"` -> `id="b"`) -> Solo actualizar ese atributo.
3. **¿Cambiaron los hijos?** -> Iterar y comparar uno por uno (aquí es donde las `keys` son vitales en React para saber
   si un hijo se movió o se borró).

---

## 5. Conclusión

El Virtual DOM no es más rápido que el DOM real (siempre hay un overhead de cálculo). Es más rápido que **la forma
ingenua** de programar (borrar y repintar todo). Nos permite escribir UI de forma declarativa ("así quiero que se vea")
y dejar que la librería se encargue de las manipulaciones sucias del DOM.
