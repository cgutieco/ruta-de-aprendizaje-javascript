# 05. Implementando `useState`

Los Hooks de React parecen magia, pero en realidad son un truco elegante con variables globales. La clave es un **índice
global** que se reinicia en cada render.

---

## 1. El Estado Global

```javascript
let hooks = []; // Array de todos los hooks de la app
let currentHookIndex = 0; // Índice que se incrementa en cada llamada a useState
let currentComponent = null; // Componente que se está renderizando actualmente
```

---

## 2. Implementación de `useState`

```javascript
function useState(initialValue) {
    const hookIndex = currentHookIndex;

    // Si es la primera vez, inicializar
    if (!hooks[hookIndex]) {
        hooks[hookIndex] = initialValue;
    }

    const setState = (newValue) => {
        // Actualizar el valor en el array global
        hooks[hookIndex] = newValue;

        // ¡Re-renderizar la app!
        currentHookIndex = 0; // Resetear índice para el próximo render
        reRender();
    };

    currentHookIndex++; // Preparar para el próximo hook
    return [hooks[hookIndex], setState];
}
```

---

## 3. Re-Render

Cuando se llama `setState`, necesitamos volver a ejecutar el componente y reconciliar.

```javascript
let currentVnode = null; // El VNode que está renderizado actualmente

function reRender() {
    const newVnode = createElement(App); // Recrear el árbol
    reconcile(rootContainer, currentVnode, newVnode);
    currentVnode = newVnode;
}
```

---

## 4. Uso

```javascript
function Counter() {
    const [count, setCount] = useState(0);

    return createElement(
        "div",
        null,
        createElement("h1", null, `Contador: ${count}`),
        createElement(
            "button",
            {
                onClick: () => setCount(count + 1),
            },
            "Incrementar"
        )
    );
}
```

### ⚠️ Regla Importante

¿Por qué no puedes llamar hooks en condicionales (`if`)? Porque el índice se rompería. Si en el primer render llamas 2
hooks y en el segundo 3, los índices no coincidirían.
