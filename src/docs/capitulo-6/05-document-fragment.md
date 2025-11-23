# 05. DocumentFragment

Cada vez que insertas un elemento en el DOM con `appendChild`, el navegador puede disparar un **Reflow**. Si insertas 100 elementos uno por uno, podrías causar 100 reflows.

El `DocumentFragment` es un contenedor DOM "ligero" que no tiene padre. Es como un buffer en memoria.

---

## 1. El Problema

```javascript
const lista = document.querySelector("ul");

// ❌ MALO: 1000 interacciones con el DOM vivo
for (let i = 0; i < 1000; i++) {
    const li = document.createElement("li");
    li.textContent = `Item ${i}`;
    lista.appendChild(li); // ¡Reflow potencial aquí!
}
```

## 2. La Solución: `DocumentFragment`

Puedes añadir elementos al fragmento, y luego añadir el fragmento al DOM. **El fragmento desaparece**, dejando solo sus hijos.

```javascript
const lista = document.querySelector("ul");
const fragment = document.createDocumentFragment(); // O new DocumentFragment()

// ✅ BUENO: Trabajamos en memoria (off-screen)
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}

// Solo 1 interacción con el DOM vivo
lista.appendChild(fragment);
```

### Comportamiento Mágico

Cuando haces `lista.appendChild(fragment)`, el objeto `fragment` se vacía. Sus hijos se mueven a `lista`.

---

## 3. Alternativa Moderna: `replaceChildren`

Si quieres **reemplazar** todo el contenido de un elemento (borrar lo viejo y poner lo nuevo) de forma eficiente:

```javascript
const lista = document.querySelector("ul");

// ... creas tus elementos en un array ...
const nuevosItems = datos.map((d) => {
  const li = document.createElement("li");
  li.textContent = d;
  return li;
});

// Borra todo lo anterior y pone lo nuevo en una sola operación
lista.replaceChildren(...nuevosItems);
```

---

## 4. Conclusión

- Usa `DocumentFragment` cuando necesites añadir múltiples elementos (append) sin borrar lo anterior.
- Usa `replaceChildren` si quieres resetear el contenido.
- El objetivo es siempre minimizar el número de veces que tocas el "DOM vivo".
