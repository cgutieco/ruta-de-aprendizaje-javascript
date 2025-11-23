# 07. Reporte de Errores en Producción

En producción, los errores son inevitables. Lo importante es **detectarlos y corregirlos rápido**. Para eso usamos
servicios de monitoreo de errores.

---

## 1. Servicios Populares

- **Sentry:** El más popular. Gratuito para proyectos pequeños.
- **Rollbar:** Alternativa sólida.
- **Bugsnag, TrackJS, LogRocket:** Otras opciones.

---

## 2. Integración Básica con Sentry

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
    dsn: "https://tu-proyecto@sentry.io/123456",
    environment: "production",
    release: "mi-app@1.2.3",
});

// Los errores se capturan automáticamente
throw new Error("Esto va directo a Sentry");
```

---

## 3. Captura Manual de Errores

```javascript
try {
    procesarPago();
} catch (error) {
    // Añadir contexto antes de enviar a Sentry
    Sentry.captureException(error, {
        tags: {
            seccion: "checkout",
        },
        extra: {
            userId: user.id,
            amount: cart.total,
        },
    });

    // Mostrar mensaje amigable al usuario
    showToast("Hubo un problema procesando el pago. Reintentando...");
}
```

---

## 4. Contexto de Usuario (Breadcrumbs)

Los "breadcrumbs" son eventos que ayudan a reconstruir lo que hizo el usuario antes del error.

```javascript
// Añadir contexto global del usuario
Sentry.setUser({
    id: usuario.id,
    email: usuario.email,
});

// Registrar acciones (breadcrumbs)
Sentry.addBreadcrumb({
    category: "navigation",
    message: "Usuario navegó a /checkout",
    level: "info",
});

// Cuando ocurra un error, Sentry mostrará:
// 1. Usuario entró a la app
// 2. Añadió producto al carrito
// 3. Navegó a /checkout
// 4. 💥 Error en procesarPago()
```

---

## 5. Sampling (Muestreo)

No envíes TODOS los errores si tienes millones de usuarios. Usa sampling.

```javascript
Sentry.init({
    dsn: "...",
    sampleRate: 0.25, // Solo 25% de errores
    tracesSampleRate: 0.1, // Solo 10% de transacciones de rendimiento
});
```

---

## 6. Privacidad y PII (Personally Identifiable Information)

**No envíes datos sensibles a servicios externos.**

```javascript
Sentry.init({
    dsn: "...",
    beforeSend(event, hint) {
        // Eliminar datos sensibles
        if (event.user) {
            delete event.user.email;
        }

        // No enviar si es un error de red común (offline)
        if (hint.originalException?.message?.includes("NetworkError")) {
            return null; // No enviar
        }

        return event;
    },
});
```

---

## 7. Source Maps

En producción, tu código está minificado. Los source maps permiten a Sentry mostrar el código original.

```bash
# Generar source maps
vite build --sourcemap

# Subir a Sentry (con @sentry/cli)
sentry-cli releases files 1.2.3 upload-sourcemaps ./dist
```

---

## 8. Conclusión

El monitoreo de errores es crítico. Sin él, solo sabes de los bugs cuando los usuarios se quejan. Con él, los detectas y
corriges proactivamente.
