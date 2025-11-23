# 01. try/catch Avanzado

El bloque `try/catch` es la herramienta fundamental para manejar errores, pero hay patrones y decisiones que separan al
código amateur del profesional.

---

## 1. El bloque `finally`

`finally` **siempre se ejecuta**, sin importar si hubo error o no. Es ideal para limpieza (cerrar conexiones, liberar
recursos).

```javascript
function leerArchivo(path) {
    const archivo = abrirArchivo(path);
    try {
        return procesarDatos(archivo);
    } catch (error) {
        console.error("Error procesando:", error);
        throw error; // Re-lanzar después de loguear
    } finally {
        // Este código se ejecuta SIEMPRE
        archivo.close();
    }
}
```

---

## 2. Try/Catch Anidado

A veces necesitas niveles de manejo de errores.

```javascript
try {
    try {
        operacionPeligrosa();
    } catch (err) {
        // Intentar recuperarse
        operacionAlternativa();
    }
} catch (err) {
    // Si incluso la alternativa falla
    console.error("Fallo crítico:", err);
}
```

---

## 3. Re-lanzar Errores (Rethrowing)

No siempre debes "tragar" el error. A veces solo quieres loguearlo y dejarlo subir.

```javascript
try {
    await fetchData();
} catch (error) {
    // Añadir contexto
    error.message = `Error en fetchData: ${error.message}`;

    // Enviar a sistema de logs
    logger.error(error);

    // Re-lanzar para que el llamador también lo maneje
    throw error;
}
```

---

## 4. Cuándo NO capturar

No pongas `try/catch` en todas partes. Solo captura si:

1. Puedes recuperarte del error (fallback).
2. Puedes añadir contexto útil.
3. Necesitas limpieza (`finally`).

**Anti-patrón:**

```javascript
try {
    usuario.nombre; // ¿Por qué capturar esto?
} catch (e) {
    console.log(e); // No añade valor
}
```
