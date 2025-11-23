# 03. Ciclo de Render: Reflow y Repaint

Entender cómo el navegador pinta los píxeles en la pantalla es lo que separa a un desarrollador Junior de uno Senior que
optimiza animaciones a 60fps.

---

## 1. El Pixel Pipeline

El camino desde tu código JS hasta los píxeles en pantalla:

1. **JavaScript:** Cambias algo (clases, estilos, contenido).
2. **Style:** El navegador recalcula qué reglas CSS aplican a qué elementos.
3. **Layout (Reflow):** Calcula la **geometría** (posición y tamaño) de cada elemento.
4. **Paint (Repaint):** Rellena los píxeles (colores, sombras, bordes).
5. **Composite:** Compone las capas en la imagen final que ves.

---

## 2. Reflow (Layout) vs Repaint

### 2.1. Reflow (Costoso 🐢)

Ocurre cuando cambias algo que afecta la **geometría** o posición. El navegador debe recalcular el espacio que ocupa ese
elemento y cómo afecta a sus vecinos.

**Disparadores:**

- Cambiar `width`, `height`, `margin`, `padding`, `font-size`.
- Leer propiedades geométricas (`offsetWidth`, `clientHeight`, `getComputedStyle`).
- Añadir/borrar elementos del DOM.

### 2.2. Repaint (Menos costoso 🐇)

Ocurre cuando cambias la apariencia visual pero **no** la geometría.

**Disparadores:**

- Cambiar `color`, `background-color`, `visibility`.

### 2.3. Composite (Muy barato ⚡)

Ocurre cuando cambias propiedades que el navegador puede manejar solo con la GPU en una capa separada.

**Disparadores:**

- `transform` (translate, scale, rotate).
- `opacity`.

**Regla de Oro:** Para animaciones suaves, intenta tocar SOLO `transform` y `opacity`.

---

## 3. Layout Thrashing (Golpeo de Layout)

Es el error de rendimiento más común. Ocurre cuando lees y escribes en el DOM alternadamente en un bucle, forzando al
navegador a recalcular el layout una y otra vez.

```javascript
// ❌ Layout Thrashing
divs.forEach((div) => {
    const width = div.offsetWidth; // Lectura (fuerza layout)
    div.style.width = width + 10 + "px"; // Escritura (invalida layout)
});
```

El navegador dice: "Me pides el ancho, calculo. Ahora lo cambias, invalido. Me pides el ancho del siguiente, tengo que
recalcular todo otra vez...".

---

## 4. `requestAnimationFrame` (rAF)

Es la forma correcta de programar cambios visuales. Le dice al navegador: "Ejecuta este código justo antes de que vayas
a pintar el siguiente frame".

```javascript
function animar() {
    elemento.style.transform = `translateX(${pos}px)`;
    pos++;

    if (pos < 500) {
        requestAnimationFrame(animar);
    }
}

requestAnimationFrame(animar);
```

- Se sincroniza con la tasa de refresco del monitor (usualmente 60Hz).
- Se pausa si la pestaña está inactiva (ahorra batería).
- Evita el "Screen Tearing".

---

## 5. Conclusión

1. **Evita Reflows:** Agrupa lecturas y escrituras.
2. **Usa CSS Transitions/Animations** siempre que sea posible.
3. **Usa `transform` y `opacity`** para animaciones.
4. **Usa `requestAnimationFrame`** para animaciones JS.
5. **Herramienta:** Usa la pestaña "Performance" de Chrome DevTools para ver estos eventos.
