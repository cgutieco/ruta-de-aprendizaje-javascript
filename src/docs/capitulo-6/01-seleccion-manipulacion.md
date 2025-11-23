# 01. Selección y Manipulación del DOM

El DOM (Document Object Model) es la interfaz que conecta JavaScript con el HTML. Manipularlo eficientemente es crucial
para el rendimiento, ya que es una de las operaciones más costosas ("expensive") que puede hacer el navegador.

---

## 1. Selección de Elementos

### 1.1. `getElementById` vs `querySelector`

- **`document.getElementById("id")`**:

    - Es extremadamente rápido (acceso directo por hash map interno).
    - Retorna un `HTMLElement` o `null`.
    - Solo funciona con IDs.

- **`document.querySelector(".clase #id [attr]")`**:
    - Es más lento que `getElementById` (necesita parsear el selector CSS).
    - Es mucho más flexible.
    - Retorna el **primer** elemento que coincida.

**Recomendación:** Usa `getElementById` si tienes el ID. Usa `querySelector` para todo lo demás por comodidad, a menos
que estés en un bucle crítico de alto rendimiento (juegos, visualización de datos).

### 1.2. `querySelectorAll` vs `getElementsByClassName`

Aquí está la trampa clásica de rendimiento y comportamiento.

- **`document.querySelectorAll(".clase")`**:

    - Retorna una **NodeList Estática**.
    - Es una "foto" del DOM en ese momento. Si añades elementos después, la lista NO se actualiza.
    - Tiene método `.forEach()` nativo.

- **`document.getElementsByClassName("clase")`**:
    - Retorna una **HTMLCollection Viva (Live)**.
    - Si añades un elemento al DOM con esa clase, la colección se actualiza mágicamente sola.
    - **No** tiene `.forEach()` (debes convertirlo con `Array.from()` o `[...]`).

```javascript
// HTML: <div class="item"></div>

const staticList = document.querySelectorAll(".item");
const liveList = document.getElementsByClassName("item");

console.log(staticList.length); // 1
console.log(liveList.length); // 1

// Añadimos otro div
document.body.appendChild(document.createElement("div")).className = "item";

console.log(staticList.length); // 1 (No cambió)
console.log(liveList.length); // 2 (¡Se actualizó solo!)
```

---

## 2. Recorriendo el DOM (Traversal)

A veces ya tienes un elemento y quieres moverte a sus parientes sin volver a buscar en todo el documento.

### 2.1. Propiedades de Navegación

- `element.parentNode` / `element.parentElement`
- `element.children` (solo Elementos) vs `element.childNodes` (incluye texto y comentarios).
- `element.firstElementChild` / `element.lastElementChild`
- `element.nextElementSibling` / `element.previousElementSibling`

### 2.2. `closest(selector)`

El método más útil para Event Delegation. Busca el ancestro más cercano (incluyéndose a sí mismo) que cumpla con el
selector.

```javascript
const btn = document.querySelector(".btn-icon");
const card = btn.closest(".card"); // Sube por el árbol hasta encontrar .card
```

### 2.3. `matches(selector)`

Verifica si el elemento cumple con un selector CSS. Retorna `true/false`.

```javascript
if (element.matches(".active")) { ...
}
```

---

## 3. Manipulación Eficiente

### 3.1. Lectura y Escritura

Evita el "Layout Thrashing" (leer y escribir estilos en bucle).

```javascript
// ❌ MALO: Fuerza al navegador a recalcular el layout en cada iteración
items.forEach((item) => {
    const width = item.offsetWidth; // Lectura
    item.style.width = width + 10 + "px"; // Escritura
});

// ✅ BUENO: Separa lecturas de escrituras
const widths = items.map((item) => item.offsetWidth); // Todas las lecturas
items.forEach((item, i) => {
    item.style.width = widths[i] + 10 + "px"; // Todas las escrituras
});
```

### 3.2. Clases vs Estilos en Línea

Prefiere siempre `classList` sobre `style`.

- `element.classList.add("active")`
- `element.classList.remove("active")`
- `element.classList.toggle("active")`

Modificar `style` (`element.style.color = 'red'`) aumenta la especificidad CSS y hace difícil de mantener el código.

---

## 4. Conclusión

- Prefiere `querySelector` por flexibilidad, `getElementById` por velocidad pura.
- Entiende la diferencia entre **NodeList (Estática)** y **HTMLCollection (Viva)**.
- Usa `closest()` para navegar hacia arriba.
- Agrupa tus lecturas y escrituras al DOM para evitar reflujos costosos.
