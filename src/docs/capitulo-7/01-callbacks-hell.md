# 01. Callback Hell y Patrón Piramidal

Antes de las Promesas (ES6) y async/await (ES8), la asincronía en JavaScript dependía exclusivamente de los **callbacks
**. Entender por qué esto era problemático es vital para apreciar las herramientas modernas.

---

## 1. ¿Qué es un Callback?

Es simplemente una función que pasas como argumento a otra función, para que sea ejecutada ("called back") más tarde.

```javascript
function cargarDatos(callback) {
    setTimeout(() => {
        callback("Datos recibidos");
    }, 1000);
}

cargarDatos((resultado) => {
    console.log(resultado);
});
```

---

## 2. El Infierno de los Callbacks (Callback Hell)

El problema surge cuando tienes operaciones asíncronas secuenciales. "Haz A, luego B, luego C".

```javascript
// La Pirámide de la Perdición (Pyramid of Doom)
obtenerUsuario(
    1,
    (usuario) => {
        obtenerPedidos(
            usuario.id,
            (pedidos) => {
                obtenerDetalles(
                    pedidos[0].id,
                    (detalles) => {
                        guardarEnBaseDeDatos(
                            detalles,
                            (resultado) => {
                                console.log("¡Todo listo!");
                            },
                            (error) => {
                                console.error("Error guardando", error);
                            }
                        );
                    },
                    (error) => {
                        console.error("Error en detalles", error);
                    }
                );
            },
            (error) => {
                console.error("Error en pedidos", error);
            }
        );
    },
    (error) => {
        console.error("Error en usuario", error);
    }
);
```

### Problemas Fundamentales:

1. **Ilegibilidad:** El código crece horizontalmente, no verticalmente.
2. **Manejo de Errores:** Tienes que manejar el error en CADA nivel de la pirámide.
3. **Inversión de Control (Inversion of Control):** Le entregas tu callback a una librería de terceros (ej:
   `analytics.track(cb)`). ¿Qué pasa si esa librería llama a tu callback 5 veces? ¿O nunca? ¿O de forma síncrona?
   Pierdes el control de la ejecución.

---

## 3. Solución (Histórica)

Antes de las promesas, usábamos librerías como `async.js` o patrones de "Thunks" para mitigar esto, pero el lenguaje
necesitaba una solución nativa.

Esa solución llegó con las **Promesas**, que nos devolvieron el control y aplanaron la pirámide.
