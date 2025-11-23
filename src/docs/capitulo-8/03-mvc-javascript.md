# 03. MVC aplicado a JavaScript

El patrón **Model-View-Controller (MVC)** es el abuelo de las arquitecturas web. Aunque frameworks modernos como React
usan variaciones (Component-based), entender MVC es fundamental para estructurar cualquier aplicación.

---

## 1. Los Componentes

1. **Model (Modelo):** Los datos y la lógica de negocio. No sabe nada de la vista.
2. **View (Vista):** Lo que el usuario ve (HTML/CSS). Renderiza los datos del modelo.
3. **Controller (Controlador):** El intermediario. Escucha al usuario (Vista), actualiza el Modelo, y le dice a la Vista
   que se repinte.

---

## 2. Implementación Vanilla JS

Vamos a hacer un contador simple.

### El Modelo

Solo datos. Lógica pura.

```javascript
class CounterModel {
    constructor() {
        this.count = 0;
        this.listeners = [];
    }

    increment() {
        this.count++;
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener(this.count));
    }
}
```

### La Vista

Solo DOM. No sabe lógica.

```javascript
class CounterView {
    constructor() {
        this.app = document.querySelector("#app");
        this.btn = document.createElement("button");
        this.display = document.createElement("span");

        this.btn.textContent = "Incrementar";
        this.app.append(this.display, this.btn);
    }

    render(count) {
        this.display.textContent = `Cuenta: ${count}`;
    }

    bindIncrement(handler) {
        this.btn.addEventListener("click", handler);
    }
}
```

### El Controlador

El pegamento.

```javascript
class CounterController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // 1. Enlazar vista con modelo (render inicial)
        this.view.render(this.model.count);

        // 2. Suscribirse a cambios del modelo
        this.model.subscribe((newCount) => {
            this.view.render(newCount);
        });

        // 3. Manejar eventos de la vista
        this.view.bindIncrement(() => {
            this.model.increment();
        });
    }
}

// Inicialización
const app = new CounterController(new CounterModel(), new CounterView());
```

---

## 3. Separación de Responsabilidades (SoC)

Observa la magia:

- Si quieres cambiar el diseño (HTML), solo tocas la **Vista**.
- Si quieres que el contador sume de 2 en 2, solo tocas el **Modelo**.
- Si quieres cambiar qué pasa al hacer clic, tocas el **Controlador**.

Este desacoplamiento hace que el código sea mantenible y testeable.
