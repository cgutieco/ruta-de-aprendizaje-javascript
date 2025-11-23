# 07. Manejo de Errores en Asincronía

El manejo de errores asíncronos es donde la mayoría de las aplicaciones fallan silenciosamente.

---

## 1. `try / catch` en `async/await`

Es la forma estándar. Captura tanto errores síncronos como rechazos de promesas.

```javascript
async function proceso() {
    try {
        const usuario = await fetchUser();
        const datos = JSON.parse(usuario.data); // Si esto falla, cae al catch
    } catch (error) {
        console.error("Algo falló:", error);
    }
}
```

**Trampa común:**
Si olvidas el `await` en una promesa que falla, el `try/catch` **NO** lo capturará (a menos que retornes la promesa y
quien llame a `proceso` la espere).

```javascript
try {
    fetch('/error'); // Sin await: La promesa falla en el fondo, el catch no se entera
} catch (e) { ...
}
```

---

## 2. Errores en `Promise.all`

`Promise.all` es **Fail-Fast**. Si una sola promesa falla, todo el `Promise.all` se rechaza inmediatamente, ignorando
los resultados exitosos de las otras.

```javascript
try {
    await Promise.all([fetch("/importante"), fetch("/irrelevante-que-falla")]);
} catch (e) {
    // Perdemos el resultado de '/importante' aunque haya funcionado
    console.log("Todo falló");
}
```

**Solución:** Usa `Promise.allSettled` si quieres conservar los éxitos parciales.

---

## 3. Manejo Global (La red de seguridad)

A veces se te escapa un `catch`. Para evitar que la app explote o el error pase desapercibido:

### 3.1. `unhandledrejection`

Evento global que se dispara cuando una promesa es rechazada y nadie la atrapó.

```javascript
window.addEventListener("unhandledrejection", (event) => {
    console.error("Promesa rechazada sin manejar:", event.reason);
    // Aquí podrías enviar el error a Sentry/LogRocket
    event.preventDefault(); // Evita que salga el error rojo en consola (opcional)
});
```

---

## 4. Patrón Go-Lang (Opcional)

A algunos desarrolladores no les gusta el anidamiento de `try/catch`. Un patrón popular es hacer una utilidad que
devuelva `[error, data]`.

```javascript
const safeAwait = (promise) => {
    return promise.then((data) => [null, data]).catch((err) => [err, null]);
};

async function main() {
    const [err, user] = await safeAwait(fetchUser());

    if (err) {
        return console.error(err);
    }

    console.log(user);
}
```

---

## 5. Conclusión

- Usa `try/catch` con `async/await`.
- No olvides el `await`.
- Usa `Promise.allSettled` si puedes tolerar fallos parciales.
- Configura un listener global `unhandledrejection` para monitoreo.
