# 09. State Pattern

El patrón **State** permite que un objeto altere su comportamiento cuando su estado interno cambia. Parece como si el
objeto cambiara de clase.

Es la base de las **Máquinas de Estados Finitos (FSM)**.

---

## 1. El Problema (Switch Hell)

```javascript
class Reproductor {
    constructor() {
        this.estado = "parado";
    }

    play() {
        if (this.estado === "parado") {
            this.estado = "reproduciendo";
            console.log("Iniciando música");
        } else if (this.estado === "reproduciendo") {
            // No hacer nada
        } else if (this.estado === "pausado") {
            this.estado = "reproduciendo";
            console.log("Reanudando música");
        }
    }

    // ... repetir ifs para pause, stop, next ...
}
```

Esto se vuelve inmanejable rápidamente.

---

## 2. La Solución (Clases de Estado)

Delegamos el comportamiento a objetos de estado.

```javascript
// Interfaz implícita: play(), stop()

class EstadoParado {
    constructor(reproductor) {
        this.reproductor = reproductor;
    }

    play() {
        console.log("Iniciando música...");
        this.reproductor.cambiarEstado(new EstadoReproduciendo(this.reproductor));
    }

    stop() {
        console.log("Ya está parado.");
    }
}

class EstadoReproduciendo {
    constructor(reproductor) {
        this.reproductor = reproductor;
    }

    play() {
        console.log("Ya está sonando.");
    }

    stop() {
        console.log("Parando música...");
        this.reproductor.cambiarEstado(new EstadoParado(this.reproductor));
    }
}

// Contexto
class Reproductor {
    constructor() {
        this.estado = new EstadoParado(this); // Estado inicial
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    play() {
        this.estado.play();
    }

    stop() {
        this.estado.stop();
    }
}
```

### Uso

```javascript
const player = new Reproductor();

player.play(); // "Iniciando música..." (Cambia a EstadoReproduciendo)
player.play(); // "Ya está sonando."
player.stop(); // "Parando música..." (Cambia a EstadoParado)
```

---

## 3. Redux y XState

En el frontend moderno, raramente usamos clases para esto. Usamos librerías como **Redux** (un solo store inmutable) o *
*XState** (máquinas de estado explícitas).

Sin embargo, el concepto es el mismo: **El comportamiento depende del estado actual.**

---

## 4. Conclusión

Usa State cuando:

- El comportamiento de un objeto depende de su estado y debe cambiar en tiempo de ejecución.
- Tienes operaciones con grandes condicionales multipartitos que dependen del estado.
