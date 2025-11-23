# 09. Web Workers

JavaScript en el navegador corre en el **Main Thread** (Hilo Principal). Este hilo también se encarga de pintar la UI.

Si ejecutas un cálculo pesado (ej: procesar una imagen, criptografía, ordenar 1M de registros), **bloqueas la UI**. El
usuario no puede hacer clic ni scrollear.

Los **Web Workers** permiten correr código JS en un hilo separado (background thread).

---

## 1. Creando un Worker

El código del worker debe estar en un archivo separado.

**worker.js**

```javascript
// Este código corre en otro hilo
self.onmessage = (e) => {
    console.log("Worker recibió:", e.data);

    // Simular trabajo pesado
    let resultado = 0;
    for (let i = 0; i < 1000000000; i++) {
        resultado += i;
    }

    // Enviar respuesta al hilo principal
    self.postMessage(resultado);
};
```

**main.js**

```javascript
const worker = new Worker("worker.js");

worker.onmessage = (e) => {
    console.log("Resultado del worker:", e.data);
    document.querySelector("#resultado").textContent = e.data;
};

// Enviar datos para empezar
worker.postMessage("¡Empieza a trabajar!");
console.log("Yo sigo libre para manejar clics...");
```

---

## 2. Limitaciones

Los Workers NO tienen acceso al DOM.

- ❌ `document.getElementById(...)`
- ❌ `window.alert(...)`
- ✅ `fetch`, `WebSocket`, `IndexedDB`, `setTimeout`.

Son puramente para **cómputo y datos**.

---

## 3. Inline Workers (Truco)

Si no quieres crear un archivo separado, puedes crear un worker desde un Blob.

```javascript
const codigo = `
    self.onmessage = () => postMessage("Soy un worker inline");
`;

const blob = new Blob([codigo], {type: "application/javascript"});
const worker = new Worker(URL.createObjectURL(blob));
```

---

## 4. Conclusión

Usa Web Workers cuando tengas lógica que tarde más de **50ms** en ejecutarse. Mantén el Main Thread libre para que la UI
responda instantáneamente a los dedos del usuario.
