# 08. WebSockets Básico

HTTP es unidireccional: El cliente pide, el servidor responde. Si quieres datos en tiempo real (chat, precios de bolsa),
HTTP se queda corto (tendrías que hacer "polling" cada segundo).

**WebSockets** permite abrir un canal bidireccional y persistente. El servidor puede empujar datos al cliente cuando
quiera.

---

## 1. Estableciendo Conexión

```javascript
// El protocolo es ws:// o wss:// (seguro)
const socket = new WebSocket("wss://echo.websocket.org");

// Evento: Conexión abierta
socket.addEventListener("open", (event) => {
    console.log("Conectado al servidor WS");
    socket.send("¡Hola servidor!");
});
```

---

## 2. Escuchando Mensajes

```javascript
// Evento: Mensaje recibido
socket.addEventListener("message", (event) => {
    console.log("Mensaje del servidor:", event.data);

    // Normalmente los datos vienen como string JSON
    try {
        const datos = JSON.parse(event.data);
        actualizarUI(datos);
    } catch (e) {
        // Era texto plano
    }
});
```

---

## 3. Manejo de Errores y Cierre

```javascript
socket.addEventListener("error", (event) => {
    console.error("Error WS:", event);
});

socket.addEventListener("close", (event) => {
    console.log("Desconectado. Código:", event.code);
    // Aquí podrías intentar reconectar automáticamente
});
```

---

## 4. Patrón de Reconexión (Exponential Backoff)

Las conexiones WS se caen. Es un hecho. Necesitas lógica para reconectar.

```javascript
function conectar() {
    const ws = new WebSocket("wss://mi-api.com");

    ws.onclose = () => {
        console.log("Conexión perdida. Reintentando en 5s...");
        setTimeout(conectar, 5000); // Reintento simple
    };
}

conectar();
```

---

## 5. Conclusión

- WebSockets es ideal para **baja latencia** y **comunicación bidireccional**.
- Para cosas más simples (solo recibir actualizaciones), considera **Server-Sent Events (SSE)**, que es más fácil y usa
  HTTP normal.
- En producción, usa librerías como `Socket.io` que manejan la reconexión y fallbacks automáticamente.
