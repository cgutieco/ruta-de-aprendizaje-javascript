# 04. Template Rendering y Seguridad

Renderizar HTML desde JavaScript es una tarea común. Hay formas rápidas y formas seguras.

---

## 1. Interpolación de Strings (Template Literals)

La forma más directa es usar backticks (`` ` ``).

```javascript
const usuario = {nombre: "Ana", edad: 30};

const html = `
    <div class="card">
        <h2>${usuario.nombre}</h2>
        <p>Edad: ${usuario.edad}</p>
    </div>
`;

document.body.innerHTML = html;
```

### Ventajas

- Legible y fácil de escribir.
- Soporta múltiples líneas.

### Desventajas

- **Lento:** El navegador tiene que parsear el string y convertirlo a nodos DOM cada vez.
- **Destructivo:** `innerHTML` borra todos los event listeners que había dentro del contenedor.
- **INSEGURO (XSS):** Si `usuario.nombre` viene de un input de usuario, estás en peligro.

---

## 2. El Peligro del XSS (Cross-Site Scripting)

Si inyectas texto sin sanitizar, un atacante puede ejecutar código en tu sitio.

```javascript
// Imagina que esto viene de una API o un input
const nombreMalicioso = "<img src=x onerror=alert('Hacked!')>";

document.body.innerHTML = `Hola ${nombreMalicioso}`;
// ¡El navegador ejecuta el alert!
```

### Solución 1: `textContent`

Si solo vas a insertar texto, usa `textContent` (o `innerText`). El navegador escapará automáticamente los caracteres HTML.

```javascript
const div = document.createElement("div");
div.textContent = nombreMalicioso;
// Muestra literalmente: "<img src=x onerror=alert('Hacked!')>"
```

### Solución 2: Sanitización

Si NECESITAS insertar HTML, usa una librería de sanitización como **DOMPurify**.

```javascript
import DOMPurify from "dompurify";
const limpio = DOMPurify.sanitize(htmlSucio);
document.body.innerHTML = limpio;
```

_Nota: La API nativa `Sanitizer` está en desarrollo, pero aún no es estándar global._

---

## 3. La etiqueta `<template>`

Es la forma estándar y eficiente de definir fragmentos de HTML que no se renderizan inmediatamente, pero pueden ser clonados.

**HTML:**

```html
<template id="mi-template">
  <div class="card">
    <h2 class="titulo"></h2>
    <p class="contenido"></p>
  </div>
</template>
```

**JavaScript:**

```javascript
const template = document.getElementById("mi-template");
const contenedor = document.getElementById("lista");

const datos = [
  { t: "A", c: "1" },
  { t: "B", c: "2" },
];

datos.forEach((dato) => {
  // Clonamos el contenido del template (true = clonar hijos también)
  const clon = template.content.cloneNode(true);

  // Rellenamos los datos de forma SEGURA
  clon.querySelector(".titulo").textContent = dato.t;
  clon.querySelector(".contenido").textContent = dato.c;

  contenedor.appendChild(clon);
});
```

### Ventajas de `<template>`

1.  **Inerte:** El contenido no carga imágenes ni ejecuta scripts hasta que se clona.
2.  **Rendimiento:** El navegador ya parseó el HTML, solo tiene que clonarlo.
3.  **Seguridad:** Te obliga a manipular el DOM nodo por nodo (usando `textContent`), reduciendo el riesgo de XSS accidental.

---

## 4. Conclusión

- Para textos simples -> `textContent`.
- Para estructuras complejas repetitivas -> `<template>`.
- Nunca uses `innerHTML` con datos de usuario sin sanitizar.
