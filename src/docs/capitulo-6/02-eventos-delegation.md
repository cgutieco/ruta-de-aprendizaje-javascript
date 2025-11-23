# 02. Eventos y Event Delegation

El manejo de eventos es el corazón de la interactividad en la web. Entender cómo se propagan es la clave para escribir
aplicaciones performantes.

---

## 1. Fases del Evento

Cuando haces clic en un botón, el evento no ocurre solo en el botón. Viaja por el DOM en tres fases:

1. **Capturing (Captura):** El evento baja desde `window` -> `document` -> `html` -> ... -> hasta el elemento objetivo.
2. **Target (Objetivo):** El evento llega al elemento que disparó la acción.
3. **Bubbling (Burbujeo):** El evento sube desde el objetivo -> padre -> abuelo -> ... -> `window`.

_Por defecto, `addEventListener` escucha en la fase de **Bubbling**._

### 1.1. `stopPropagation` vs `stopImmediatePropagation`

- **`e.stopPropagation()`**: Detiene el viaje del evento (ya no sube ni baja más).
- **`e.stopImmediatePropagation()`**: Detiene el viaje Y evita que se ejecuten otros listeners en el **mismo** elemento.

### 1.2. `preventDefault`

Evita la acción nativa del navegador (ej: enviar un form, seguir un link). No detiene la propagación.

---

## 2. Event Delegation (Delegación de Eventos)

Si tienes una lista con 1000 elementos, **NO** pongas 1000 listeners.

**❌ Malo (Mucha memoria):**

```javascript
document.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => console.log("Click!"));
});
```

**✅ Bueno (Delegación):**
Pon un solo listener en el padre y usa `e.target` para saber qué hijo fue clickeado.

```javascript
const lista = document.querySelector("ul");

lista.addEventListener("click", (e) => {
    // Usamos closest para manejar clicks en hijos internos (ej: un span dentro del li)
    const item = e.target.closest("li");

    // Verificamos que el click fue en un li y que ese li está dentro de nuestra lista
    if (item && lista.contains(item)) {
        console.log("Click en:", item.textContent);
    }
});
```

### Ventajas

1. **Menos memoria:** 1 listener vs 1000.
2. **Elementos dinámicos:** Si añades más `li` después, el listener del padre ya funciona para ellos. No necesitas
   volver a hacer `addEventListener`.

---

## 3. Opciones de `addEventListener`

El tercer argumento de `addEventListener` puede ser un objeto de opciones para mejorar el rendimiento.

```javascript
element.addEventListener("click", handler, {
    capture: false, // Escuchar en fase de captura (default: false)
    once: true, // El listener se borra automáticamente tras ejecutarse una vez
    passive: true, // Promete que NO llamarás a preventDefault()
});
```

### 3.1. Passive Event Listeners

Crucial para eventos de scroll y touch. Al decirle al navegador `passive: true`, le permites hacer scroll suave sin
esperar a ver si tu JS cancela el evento.

---

## 4. `AbortController` para limpiar eventos

Antes, para remover un listener necesitabas tener la referencia exacta a la función.

```javascript
// Antes
const handler = () => console.log("Click");
btn.addEventListener("click", handler);
btn.removeEventListener("click", handler); // Necesitas 'handler'
```

**Ahora (Moderno):**
Puedes usar un `AbortSignal` para remover múltiples listeners de golpe.

```javascript
const controller = new AbortController();

btn1.addEventListener("click", () => {
}, {signal: controller.signal});
btn2.addEventListener("mouseover", () => {
}, {signal: controller.signal});

// Remover TODOS los listeners asociados a esta señal
controller.abort();
```

---

## 5. Conclusión

- Usa **Event Delegation** siempre que tengas listas o colecciones de elementos.
- Usa `passive: true` en eventos de scroll/wheel para rendimiento (Lighthouse te lo pedirá).
- Usa `AbortController` para limpiar listeners limpiamente en componentes (ej: `useEffect` cleanup).
