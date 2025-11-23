# 05. Fetch API y Streaming

`fetch` reemplazó a `XMLHttpRequest` (AJAX). Es basado en promesas y mucho más limpio. Pero su verdadera potencia está
en el manejo de **Streams**.

---

## 1. Fetch Básico

```javascript
fetch("https://api.com/data")
    .then((response) => {
        if (!response.ok) {
            // Status no es 200-299
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parsea el cuerpo como JSON
    })
    .then((data) => console.log(data))
    .catch((e) => console.log("Fallo de red o CORS:", e));
```

**Nota:** `fetch` NO rechaza la promesa en errores HTTP (404, 500). Solo rechaza si falla la red (DNS, sin internet).
Siempre verifica `response.ok`.

---

## 2. Streaming de Datos (ReadableStream)

Imagina que descargas un archivo de 1GB o una lista de 1 millón de usuarios. Si usas `response.json()`, el navegador
debe descargar TODO en memoria y luego parsearlo. Eso puede congelar la pestaña.

Con Streams, puedes procesar los datos **mientras van llegando**.

```javascript
async function consumirStream() {
    const response = await fetch("/big-data.txt");
    const reader = response.body.getReader(); // Obtenemos el lector
    const decoder = new TextDecoder("utf-8");

    while (true) {
        const {done, value} = await reader.read();

        if (done) break;

        // 'value' es un Uint8Array (bytes)
        const textoChunk = decoder.decode(value, {stream: true});
        console.log("Recibido trozo:", textoChunk);

        // Aquí podrías ir pintando en la UI progresivamente
    }

    console.log("Descarga completa");
}
```

### Casos de Uso

1. **Procesar CSVs gigantes:** Leer línea por línea sin cargar todo el archivo.
2. **Video/Audio:** Reproducir mientras descarga.
3. **NDJSON (Newline Delimited JSON):** Recibir objetos JSON uno por uno en tiempo real.

---

## 3. POST y Headers

```javascript
fetch("/api/crear", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token123",
    },
    body: JSON.stringify({nombre: "Juan"}),
});
```

Recuerda siempre poner el header `Content-Type: application/json` si envías JSON, o el servidor podría no entenderlo.
