# 02. Publish-Subscribe (Pub/Sub)

A menudo se confunde con el Observer, pero hay una diferencia clave: **El intermediario (Broker/Event Bus).**

- **Observer:** El Sujeto y el Observador se conocen (el sujeto tiene una lista de observadores).
- **Pub/Sub:** El Publicador y el Suscriptor **NO se conocen**. Se comunican a través de un canal (tópico) gestionado
  por un intermediario.

---

## 1. El Event Bus (Intermediario)

Imagina una estación de radio.

- El locutor (Publisher) habla al micrófono. No sabe quién escucha.
- Tú (Subscriber) sintonizas la frecuencia 101.5. No conoces al locutor personalmente.
- La antena de radio (Event Bus) hace la magia.

---

## 2. Implementación

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }

    // Suscribirse a un tópico
    on(topic, listener) {
        if (!this.events[topic]) {
            this.events[topic] = [];
        }
        this.events[topic].push(listener);
    }

    // Publicar en un tópico
    emit(topic, data) {
        if (this.events[topic]) {
            this.events[topic].forEach((listener) => listener(data));
        }
    }

    // Desuscribirse (importante para evitar memory leaks)
    off(topic, listenerToRemove) {
        if (!this.events[topic]) return;
        this.events[topic] = this.events[topic].filter(
            (listener) => listener !== listenerToRemove
        );
    }
}
```

---

## 3. Ejemplo de Uso: Desacoplando Módulos

Imagina un E-commerce. Cuando se compra algo, queremos:

1. Enviar email.
2. Actualizar stock.
3. Analíticas.

Sin Pub/Sub (Acoplado):

```javascript
// Checkout.js
import {sendEmail} from "./EmailService";
import {updateStock} from "./InventoryService";

function comprar() {
    // ...lógica de pago...
    sendEmail(); // Checkout depende de EmailService
    updateStock(); // Checkout depende de InventoryService
}
```

Con Pub/Sub (Desacoplado):

```javascript
// Checkout.js
const bus = new EventEmitter();

function comprar() {
    // ...lógica de pago...
    bus.emit("compra-exitosa", {id: 123});
}

// EmailService.js
bus.on("compra-exitosa", (data) => console.log("Enviando email...", data));

// InventoryService.js
bus.on("compra-exitosa", (data) => console.log("Restando stock...", data));
```

Ahora `Checkout.js` no sabe que existen los otros servicios. Puedes añadir 20 servicios más escuchando el mismo evento
sin tocar el código de `Checkout`.
