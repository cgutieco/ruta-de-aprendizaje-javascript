# 04. Optimización del Render

El rendering es una de las operaciones más costosas. Optimizarlo mejora dramáticamente la experiencia del usuario.

---

## 1. Minimizando Reflows y Repaints

**Reflow:** Recalcular posiciones y tamaños.  
**Repaint:** Redibujar píxeles (sin cambiar layout).

### Qué Causa Reflows

- Cambiar dimensiones (`width`, `height`).
- Leer propiedades que fuerzan recálculo (`offsetHeight`, `scrollTop`).
- Añadir/remover elementos del DOM.

### Evitar Layout Thrashing

```javascript
// ❌ MAL - Lee y escribe en loop (múltiples reflows)
for (let i = 0; i < elements.length; i++) {
    const height = elements[i].offsetHeight; // READ (reflow)
    elements[i].style.height = height + 10 + "px"; // WRITE (invalida layout)
}

// ✅ BIEN - Batch reads y writes
const heights = [];
for (let i = 0; i < elements.length; i++) {
    heights[i] = elements[i].offsetHeight; // READ
}
for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = heights[i] + 10 + "px"; // WRITE
}
```

---

## 2. Virtual Scrolling

Si renders 10,000 items en una lista, el navegador se congela. **Virtual scrolling** solo renderiza los elementos
visibles.

```javascript
class VirtualList {
    constructor(container, items, itemHeight) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.visibleCount = Math.ceil(container.clientHeight / itemHeight);

        this.render();
        container.addEventListener("scroll", () => this.render());
    }

    render() {
        const scrollTop = this.container.scrollTop;
        const startIndex = Math.floor(scrollTop / this.itemHeight);
        const endIndex = Math.min(
            startIndex + this.visibleCount,
            this.items.length
        );

        this.container.innerHTML = "";

        for (let i = startIndex; i < endIndex; i++) {
            const item = document.createElement("div");
            item.style.height = this.itemHeight + "px";
            item.style.position = "absolute";
            item.style.top = i * this.itemHeight + "px";
            item.textContent = this.items[i];
            this.container.appendChild(item);
        }
    }
}
```

---

## 3. Debouncing y Throttling

### Debounce

Ejecuta la función **después de que el usuario deja de actuar**.

```javascript
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Uso
const search = debounce((query) => {
    console.log("Buscando:", query);
}, 300);

input.addEventListener("input", (e) => search(e.target.value));
```

### Throttle

Ejecuta la función **como máximo una vez cada X ms**.

```javascript
function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Uso
window.addEventListener(
    "scroll",
    throttle(() => {
        console.log("Scroll position:", window.scrollY);
    }, 200)
);
```

---

## 4. requestAnimationFrame

Para animaciones, usa `requestAnimationFrame` en lugar de `setTimeout`.

```javascript
// ❌ MAL
setInterval(() => {
    element.style.left = parseInt(element.style.left) + 1 + "px";
}, 16); // ~60fps

// ✅ BIEN
function animate() {
    element.style.left = parseInt(element.style.left) + 1 + "px";
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

`requestAnimationFrame` se sincroniza con la tasa de refresco del monitor (~60fps) y pausa si la pestaña no está
visible.

---

## 5. CSS Containment

Indica al navegador que un elemento no afectará el resto de la página.

```css
.widget {
    contain: layout style paint;
}
```

Esto permite al navegador optimizar el rendering de ese elemento aisladamente.
