# 03. Web Workers

JavaScript es single-threaded. Si ejecutas una operación pesada, **bloquea el hilo principal** y la UI se congela. Los *
*Web Workers** resuelven esto ejecutando código en un hilo separado.

---

## 1. Creando un Worker

```javascript
// main.js
const worker = new Worker("worker.js");

// Enviar datos al worker
worker.postMessage({numbers: [1, 2, 3, 4, 5]});

// Recibir resultados del worker
worker.addEventListener("message", (event) => {
    console.log("Resultado:", event.data);
});
```

```javascript
// worker.js
self.addEventListener("message", (event) => {
    const {numbers} = event.data;

    // Operación pesada
    const result = numbers.reduce((sum, n) => sum + n ** 2, 0);

    // Enviar resultado de vuelta
    self.postMessage(result);
});
```

---

## 2. Ejemplo Real: Procesamiento de Imágenes

```javascript
// main.js
const worker = new Worker("image-processor.js");

document.querySelector('input[type="file"]').addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        worker.postMessage({
            imageData: reader.result,
            filter: "grayscale",
        });
    };

    reader.readAsDataURL(file);
});

worker.addEventListener("message", (event) => {
    const img = document.querySelector("#result");
    img.src = event.data.processedImage;
});
```

---

## 3. Limitaciones de Workers

- **No tienen acceso al DOM.** No puedes usar `document`, `window`, etc.
- **Comunicación por postMessage.** Solo puedes enviar datos serializables (no funciones).
- **No comparten memoria.** Los datos se copian, no se comparten.

---

## 4. Shared Workers

Múltiples tabs/ventanas pueden compartir el mismo Worker.

```javascript
// main.js
const worker = new SharedWorker("shared-worker.js");

worker.port.start();
worker.port.postMessage("Hello from tab");

worker.port.addEventListener("message", (event) => {
    console.log("Mensaje del worker:", event.data);
});
```

```javascript
// shared-worker.js
const connections = [];

self.addEventListener("connect", (event) => {
    const port = event.ports[0];
    connections.push(port);

    port.addEventListener("message", (e) => {
        // Broadcast a todas las tabs conectadas
        connections.forEach((conn) => conn.postMessage(e.data));
    });

    port.start();
});
```

---

## 5. Comlink - API más Simple

[Comlink](https://github.com/GoogleChromeLabs/comlink) elimina la necesidad de `postMessage`.

```javascript
// main.js
import * as Comlink from "comlink";

const worker = new Worker("worker.js");
const api = Comlink.wrap(worker);

const result = await api.heavyComputation([1, 2, 3]);
console.log(result);
```

```javascript
// worker.js
import * as Comlink from "comlink";

const api = {
    async heavyComputation(numbers) {
        return numbers.reduce((sum, n) => sum + n ** 2, 0);
    },
};

Comlink.expose(api);
```

---

## 6. Cuándo Usar Workers

- Procesamiento de imágenes/videos.
- Cálculos matemáticos pesados.
- Parseo de archivos grandes (CSV, JSON).
- Encriptación/desencriptación.

**No uses Workers para tareas triviales.** El overhead de comunicación puede ser mayor que el beneficio.
