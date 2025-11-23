# 04. Reconciliación y Diffing

El corazón de React es el proceso de **Reconciliación**: Comparar el VNode nuevo con el anterior para decidir qué
cambios mínimos hacer en el DOM real.

Recrear todo el DOM en cada cambio sería demasiado lento. El "Diffing Algorithm" es lo que hace a React rápido.

---

## 1. Algoritmo Básico

Las reglas simplificadas son:

1. **Tipo diferente:** Reemplazar el nodo completo.
2. **Tipo igual:** Actualizar solo las props que cambiaron.
3. **Hijos:** Comparar recursivamente.

```javascript
function reconcile(parentDom, oldVnode, newVnode) {
    // Caso 1: No hay nuevo nodo -> Eliminar
    if (!newVnode) {
        parentDom.removeChild(oldVnode.dom);
        return;
    }

    // Caso 2: No hay nodo viejo -> Crear
    if (!oldVnode) {
        const newDom = createDom(newVnode);
        parentDom.appendChild(newDom);
        return;
    }

    // Caso 3: Tipo cambió -> Reemplazar completo
    if (oldVnode.type !== newVnode.type) {
        const newDom = createDom(newVnode);
        parentDom.replaceChild(newDom, oldVnode.dom);
        return;
    }

    // Caso 4: Mismo tipo -> Actualizar props
    updateDom(oldVnode.dom, oldVnode.props, newVnode.props);

    // Caso 5: Reconciliar hijos
    const oldChildren = oldVnode.props.children;
    const newChildren = newVnode.props.children;

    const maxLength = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < maxLength; i++) {
        reconcile(oldVnode.dom, oldChildren[i], newChildren[i]);
    }
}

function updateDom(dom, oldProps, newProps) {
    // Eliminar props viejas
    Object.keys(oldProps)
        .filter((key) => key !== "children" && !(key in newProps))
        .forEach((name) => {
            if (name.startsWith("on")) {
                const eventType = name.toLowerCase().substring(2);
                dom.removeEventListener(eventType, oldProps[name]);
            } else {
                dom[name] = "";
            }
        });

    // Añadir o actualizar props nuevas
    Object.keys(newProps)
        .filter((key) => key !== "children")
        .forEach((name) => {
            if (oldProps[name] !== newProps[name]) {
                if (name.startsWith("on")) {
                    const eventType = name.toLowerCase().substring(2);
                    dom.addEventListener(eventType, newProps[name]);
                } else {
                    dom[name] = newProps[name];
                }
            }
        });
}
```

---

## 2. Keys (Conceptual)

React usa `key` para optimizar listas. Si los elementos tienen keys únicas, puede reordenarlos en lugar de recrearlos.
Esto es crítico para listas dinámicas, pero lo omitiremos en nuestra versión simple.
