# 01. Observer Pattern (Patrón Observador)

El patrón **Observer** define una relación de "uno a muchos". Cuando un objeto (el **Sujeto**) cambia de estado,
notifica automáticamente a todos sus dependientes (los **Observadores**).

Es la base de la reactividad en frameworks como Vue o MobX.

---

## 1. Concepto

Imagina un Youtuber (Sujeto) y sus Suscriptores (Observadores).

- Cuando el Youtuber sube video, YouTube "notifica" a todos los suscriptores.
- El Youtuber no sabe quiénes son sus suscriptores específicamente, solo tiene una lista y les grita "¡Nuevo video!".

---

## 2. Implementación Vanilla JS

```javascript
class Subject {
    constructor() {
        this.observers = []; // Lista de suscriptores
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    notify(data) {
        this.observers.forEach((observer) => observer.update(data));
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }

    update(data) {
        console.log(`${this.name} recibió notificación: ${data}`);
    }
}
```

### Uso

```javascript
const canalYoutube = new Subject();

const usuario1 = new Observer("Juan");
const usuario2 = new Observer("Ana");

canalYoutube.subscribe(usuario1);
canalYoutube.subscribe(usuario2);

canalYoutube.notify("Nuevo tutorial de JS!");
// Juan recibió notificación: Nuevo tutorial de JS!
// Ana recibió notificación: Nuevo tutorial de JS!
```

---

## 3. Ejemplo Real: DOM Event Listeners

El ejemplo más común que ya usas es `addEventListener`.

- **Sujeto:** El botón DOM.
- **Observador:** Tu función callback.
- **Notify:** Cuando el usuario hace click.

```javascript
const btn = document.querySelector("button");

// Suscripción
btn.addEventListener("click", () => console.log("Click detectado!"));
```

---

## 4. Conclusión

Úsalo cuando un cambio en un objeto requiera cambiar otros objetos, y no sepas cuántos objetos necesitan cambiarse.
