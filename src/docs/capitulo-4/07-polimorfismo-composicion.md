# 07. Polimorfismo y Composición

La POO clásica se centra mucho en la Herencia (`extends`). Sin embargo, en JavaScript moderno (y en ingeniería de
software en general), se prefieren patrones más flexibles como la **Composición** y el **Polimorfismo de Tipos (Duck
Typing)**.

---

## 1. Polimorfismo en JavaScript

En lenguajes tipados (Java), el polimorfismo suele requerir que las clases compartan una interfaz o clase padre común.
En JavaScript, el polimorfismo es implícito gracias al **Duck Typing**:

> _"Si camina como un pato y hace cuack como un pato, entonces es un pato."_

```javascript
class Pato {
    sonar() {
        console.log("Cuack");
    }
}

class Perro {
    sonar() {
        console.log("Guau");
    }
}

// Función polimórfica
function hacerSonar(animal) {
    // No importa si es Pato, Perro o un objeto literal.
    // Solo importa que tenga el método .sonar()
    if (typeof animal.sonar === "function") {
        animal.sonar();
    }
}

hacerSonar(new Pato()); // "Cuack"
hacerSonar(new Perro()); // "Guau"
hacerSonar({sonar: () => console.log("Beep")}); // "Beep"
```

Esto permite un desacoplamiento extremo. Tus funciones no dependen de _quién_ es el objeto, sino de _qué puede hacer_.

---

## 2. Composición sobre Herencia

La herencia (`extends`) crea una relación rígida "ES-UN" (Is-A).

- Un `Perro` ES-UN `Animal`.
- Si `Animal` cambia, `Perro` se rompe (Fragile Base Class Problem).
- Si quieres que un `Robot` también ladre, no puedes heredar de `Animal` porque un robot no es un animal.

La composición crea relaciones "TIENE-UN" (Has-A) o "PUEDE-HACER" (Can-Do). Es más flexible.

### 2.1. Implementación con Object.assign (Mixins Funcionales)

En lugar de heredar, componemos habilidades.

```javascript
// Habilidades (Mixins)
const puedeComer = (state) => ({
    comer: () => console.log(`${state.nombre} está comiendo.`),
});

const puedeCaminar = (state) => ({
    caminar: () => console.log(`${state.nombre} camina.`),
});

const puedeLadrar = (state) => ({
    ladrar: () => console.log("¡Guau!"),
});

// Factory Function (Composición)
function crearPerro(nombre) {
    const state = {nombre};

    return Object.assign(
        {},
        state,
        puedeComer(state),
        puedeCaminar(state),
        puedeLadrar(state)
    );
}

function crearRobot(nombre) {
    const state = {nombre};

    return Object.assign(
        {},
        state,
        puedeCaminar(state), // Reutilizamos caminar
        puedeLadrar(state) // Reutilizamos ladrar (Robot perro)
        // No come, así que no añadimos puedeComer
    );
}

const firulais = crearPerro("Firulais");
firulais.comer(); // "Firulais está comiendo."

const roboDog = crearRobot("RoboDog");
roboDog.ladrar(); // "¡Guau!"
// roboDog.comer(); // Error (no tiene el método)
```

---

## 3. ¿Cuándo usar Herencia vs Composición?

- **Usa Herencia (`extends`) cuando:**

    - La relación es estrictamente jerárquica y taxonómica (ej. `BotonAzul` extends `Boton`).
    - Necesitas reutilizar mucho código base idéntico.
    - Estás creando componentes en frameworks que obligan a ello (ej. React Class Components antiguos).

- **Usa Composición cuando:**
    - Quieres compartir comportamiento entre clases no relacionadas (ej. `Logger`, `EventEmitter`).
    - La jerarquía se vuelve profunda (> 2 niveles) y confusa.
    - Quieres evitar el problema del "Gorila y la Banana" (querías la banana, pero obtuviste el gorila que sostenía la
      banana y toda la selva).

---

## 4. Conclusión

JavaScript brilla en la composición. Su naturaleza dinámica y la facilidad para mezclar objetos (`Object.assign`, Spread
Operator) hacen que la composición sea más natural que la herencia clásica.
**Prefiere la composición.** Hará tu código más modular, testeable y fácil de refactorizar.
