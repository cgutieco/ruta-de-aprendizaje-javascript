# 06. Sistema de Reactividad

Hasta ahora, `setState` dispara manualmente un re-render. Pero en frameworks modernos (Vue, Svelte, Solid), la
reactividad es más sofisticada: **el sistema detecta automáticamente qué partes del UI dependen de qué datos.**

Vamos a crear una versión simple usando el patrón Observer.

---

## 1. Señales (Signals) - Estilo Solid.js

Una "señal" es un valor reactivo que notifica a los suscriptores cuando cambia.

```javascript
function createSignal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    const read = () => {
        // Si hay un efecto activo, suscribirlo
        if (currentEffect) {
            subscribers.add(currentEffect);
        }
        return value;
    };

    const write = (newValue) => {
        value = newValue;
        // Notificar a todos los suscriptores
        subscribers.forEach((effect) => effect());
    };

    return [read, write];
}
```

---

## 2. Efectos Automáticos

Un "efecto" es una función que se re-ejecuta cuando cualquier señal que lea cambie.

```javascript
let currentEffect = null;

function createEffect(fn) {
    currentEffect = fn;
    fn(); // Ejecutar para suscribirse a las señales
    currentEffect = null;
}
```

---

## 3. Uso

```javascript
const [count, setCount] = createSignal(0);

// Este efecto se re-ejecuta automáticamente cuando count() cambia
createEffect(() => {
    console.log("El contador es:", count());
    // En un framework real, aquí actualizaríamos el DOM
});

setCount(1); // Output: "El contador es: 1"
setCount(5); // Output: "El contador es: 5"
```

---

## 4. Integrando con nuestro Mini-React

Podríamos reemplazar `useState` con `createSignal` y hacer que los componentes se re-rendericen automáticamente cuando
lean una señal dentro de un efecto.

```javascript
function Counter() {
    const [count, setCount] = createSignal(0);

    return createElement(
        "div",
        null,
        createElement("h1", null, `Contador: ${count()}`), // Leer con ()
        createElement(
            "button",
            {
                onClick: () => setCount(count() + 1),
            },
            "Incrementar"
        )
    );
}
```

Este es el fundamento de frameworks como Vue 3 (Composition API) y Solid.js.
