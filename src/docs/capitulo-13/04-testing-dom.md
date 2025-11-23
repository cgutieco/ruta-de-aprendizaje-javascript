# 04. Testing DOM sin Framework

Testear manipulación del DOM es esencial. Aunque uses frameworks, entender cómo testear vanilla JS te da las bases.

---

## 1. JSDOM vs happy-dom

Vitest usa **happy-dom** por defecto (más rápido). Para proyectos complejos, puedes usar **jsdom** (más compatible).

```javascript
// vitest.config.js
export default {
    test: {
        environment: "happy-dom", // o 'jsdom'
    },
};
```

---

## 2. Ejemplo: Testear un Componente Simple

```javascript
// counter.js
export function createCounter() {
    const container = document.createElement("div");

    const countDisplay = document.createElement("span");
    countDisplay.textContent = "0";

    const btn = document.createElement("button");
    btn.textContent = "Incrementar";

    let count = 0;
    btn.addEventListener("click", () => {
        count++;
        countDisplay.textContent = count;
    });

    container.appendChild(countDisplay);
    container.appendChild(btn);

    return container;
}
```

### Test

```javascript
// counter.test.js
import {describe, it, expect, beforeEach} from "vitest";
import {createCounter} from "./counter";

describe("Counter Component", () => {
    let counter;

    beforeEach(() => {
        counter = createCounter();
        document.body.appendChild(counter);
    });

    it("should start with count 0", () => {
        const display = counter.querySelector("span");
        expect(display.textContent).toBe("0");
    });

    it("should increment when button is clicked", () => {
        const btn = counter.querySelector("button");
        const display = counter.querySelector("span");

        btn.click();

        expect(display.textContent).toBe("1");
    });

    it("should increment multiple times", () => {
        const btn = counter.querySelector("button");
        const display = counter.querySelector("span");

        btn.click();
        btn.click();
        btn.click();

        expect(display.textContent).toBe("3");
    });
});
```

---

## 3. Simular Eventos

```javascript
it("should handle keypress", () => {
    const input = document.querySelector("input");

    // Crear evento
    const event = new KeyboardEvent("keydown", {key: "Enter"});

    input.dispatchEvent(event);

    // Verificar resultado
    expect(submitWasCalled).toBe(true);
});
```

---

## 4. Testing de Estilos y Clases

```javascript
it("should toggle active class", () => {
    const element = document.querySelector(".item");

    element.click();

    expect(element.classList.contains("active")).toBe(true);
});
```

---

## 5. Cleanup

Siempre limpia el DOM después de cada test.

```javascript
import {afterEach} from "vitest";

afterEach(() => {
    document.body.innerHTML = "";
});
```

---

## 6. Alternativa: Testing Library

Para tests más semánticos (testing como lo haría un usuario), usa **@testing-library/dom**.

```javascript
import {screen, fireEvent} from "@testing-library/dom";

it("should increment on click", () => {
    createCounter();

    const btn = screen.getByRole("button", {name: /incrementar/i});

    fireEvent.click(btn);

    expect(screen.getByText("1")).toBeInTheDocument();
});
```
