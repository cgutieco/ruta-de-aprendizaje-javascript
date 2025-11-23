# 06. Flyweight Pattern

El patrón **Flyweight** (peso mosca) se usa para optimizar el uso de memoria (RAM) cuando tienes una **gran cantidad de
objetos similares**.

La clave es compartir el estado común (**intrínseco**) entre muchos objetos, en lugar de guardarlo en cada uno.

---

## 1. El Problema

Imagina un juego donde disparas 10,000 balas.
Si cada bala es un objeto con `sprite`, `x`, `y`, `velocidad`, `daño`...

```javascript
class Bala {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = "imagen-bala.png"; // ¡Ocupa memoria 10,000 veces!
        this.daño = 10;
    }
}
```

---

## 2. La Solución (Flyweight)

Separamos lo que cambia (Extrínseco: `x`, `y`) de lo que NO cambia (Intrínseco: `sprite`, `daño`).

```javascript
// Flyweight: Contiene solo lo compartido
class TipoBala {
    constructor(sprite, daño) {
        this.sprite = sprite;
        this.daño = daño;
    }
}

// Contexto: Contiene lo único
class Bala {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tipo = tipo; // Referencia al Flyweight
    }
}
```

### Uso con Factory

```javascript
class BalaFactory {
    constructor() {
        this.tipos = {};
    }

    getTipo(sprite, daño) {
        const key = `${sprite}-${daño}`;
        if (!this.tipos[key]) {
            this.tipos[key] = new TipoBala(sprite, daño);
        }
        return this.tipos[key];
    }
}

const factory = new BalaFactory();
const tipoComun = factory.getTipo("bala.png", 10);

const balas = [];
for (let i = 0; i < 10000; i++) {
    balas.push(new Bala(i, i, tipoComun));
}
```

Ahora, en lugar de 10,000 copias de la imagen, solo tenemos 1 en memoria.

---

## 3. En el DOM

El navegador usa Flyweight internamente. Si tienes 1000 `<div>` con la misma clase CSS, el navegador no guarda los
estilos 1000 veces. Guarda una referencia a la clase CSS.

---

## 4. Conclusión

Úsalo solo cuando tengas problemas reales de memoria debido a la cantidad masiva de objetos. Añade complejidad, así que
no optimices prematuramente.
