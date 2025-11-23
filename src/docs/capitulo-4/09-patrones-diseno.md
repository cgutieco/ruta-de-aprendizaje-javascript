# 09. Patrones de Diseño en JS Moderno

Aunque los patrones de diseño clásicos (GoF) son universales, su implementación en JavaScript suele ser diferente debido a la naturaleza dinámica del lenguaje. Aquí veremos tres patrones esenciales adaptados a JS moderno.

---

## 1. Factory Pattern (Fábrica)

En lugar de usar `new` directamente, usamos una función que crea y retorna objetos.
**Ventajas:** Desacopla la creación del objeto de su implementación. Permite retornar diferentes subclases según condiciones.

```javascript
class Coche {
    constructor() {
        this.ruedas = 4;
    }
}

class Moto {
    constructor() {
        this.ruedas = 2;
    }
}

class VehiculoFactory {
    static crearVehiculo(tipo) {
        if (tipo === "coche") return new Coche();
        if (tipo === "moto") return new Moto();
        throw new Error("Tipo desconocido");
    }
}

const miVehiculo = VehiculoFactory.crearVehiculo("moto");
```

_En JS funcional, cualquier función que retorne un objeto literal es técnicamente una Factory._

---

## 2. Singleton Pattern (Instancia Única)

Garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella.

### 2.1. Implementación Clásica (Evitar)

```javascript
class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.conected = true;
    Database.instance = this;
  }
}
```

### 2.2. Implementación Moderna (Módulos ES6)

En JavaScript moderno, **los módulos son Singletons por defecto**. Se ejecutan una sola vez y el valor exportado se cachea.

```javascript
// db.js
class Database {
  constructor() {
    console.log("Conectando DB...");
  }
}
export const db = new Database(); // Se crea UNA vez

// app.js
import { db } from "./db.js"; // Reusa la misma instancia
// otro-archivo.js
import { db } from "./db.js"; // Reusa la misma instancia
```

**Conclusión:** No necesitas clases Singleton complejas. Usa `export const instancia = new Clase()`.

---

## 3. Mixins (Composición de Clases)

JavaScript solo permite herencia simple (`extends` de una sola clase). Los Mixins permiten simular herencia múltiple o composición de comportamientos.

### 3.1. Class Mixins

Una función que toma una clase base y retorna una nueva clase extendida.

```javascript
// Mixin
const Volador = (BaseClass) =>
  class extends BaseClass {
    volar() {
      console.log("Volando alto!");
    }
  };

const Nadador = (BaseClass) =>
  class extends BaseClass {
    nadar() {
      console.log("Nadando profundo!");
    }
  };

class Animal {}

// Composición
class Pato extends Nadador(Volador(Animal)) {}

const pato = new Pato();
pato.volar();
pato.nadar();
```

Este patrón es muy potente para añadir capacidades transversales (logging, validación, eventos) a tus clases sin ensuciar la jerarquía de herencia principal.

---

## 4. Conclusión

- **Factory:** Úsalo cuando la lógica de creación sea compleja.
- **Singleton:** Úsalo (vía Módulos ES6) para servicios compartidos (DB, Config, Logger).
- **Mixin:** Úsalo para compartir comportamiento entre clases no relacionadas jerárquicamente.
