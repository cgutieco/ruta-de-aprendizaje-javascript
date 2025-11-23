# 06. Shadow DOM (Conceptual)

El DOM es global. Si tienes un estilo `.btn { color: red }`, afectará a TODOS los botones de tu página. Esto es un
problema para crear componentes reutilizables y aislados.

El **Shadow DOM** permite crear un sub-árbol DOM que está **encapsulado** del documento principal.

---

## 1. ¿Qué es?

Imagina un documento HTML dentro de tu documento HTML, donde:

- Los estilos de fuera no entran (casi).
- Los estilos de dentro no salen.
- Los IDs y clases no colisionan con el mundo exterior.

Es la tecnología base de los **Web Components** (junto con Custom Elements y Templates).

---

## 2. Creando un Shadow Root

```javascript
const host = document.querySelector("#mi-componente");
const shadow = host.attachShadow({mode: "open"});

shadow.innerHTML = `
    <style>
        p { color: red; } /* Solo afecta a este párrafo */
    </style>
    <p>Soy texto encapsulado</p>
`;
```

### 2.1. Modos: `open` vs `closed`

- **`open`**: Puedes acceder al shadow DOM desde fuera usando `element.shadowRoot`.
- **`closed`**: `element.shadowRoot` devuelve `null`. Es un intento de privacidad fuerte, pero raramente necesario (y
  difícil de testear).

---

## 3. Slots (Ranuras)

¿Cómo metemos contenido del usuario DENTRO de nuestro componente aislado? Usando `<slot>`.

**Shadow DOM:**

```html

<div class="card">
    <h2>
        <slot name="titulo">Título por defecto</slot>
    </h2>
    <p>
        <slot name="cuerpo"></slot>
    </p>
</div>
```

**Uso (Light DOM):**

```html

<mi-componente>
    <span slot="titulo">Hola Mundo</span>
    <span slot="cuerpo">Este es el contenido.</span>
</mi-componente>
```

El navegador "proyecta" los elementos del Light DOM en los huecos (slots) correspondientes del Shadow DOM.

---

## 4. Conclusión

El Shadow DOM es nativo y poderoso, pero complejo. Frameworks como React no lo usan por defecto (prefieren emular la
encapsulación con CSS Modules o CSS-in-JS), pero es fundamental entenderlo si vas a trabajar con Web Components (Lit,
Stencil) o micro-frontends.
