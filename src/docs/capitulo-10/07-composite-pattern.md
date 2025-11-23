# 07. Composite Pattern

El patrón **Composite** permite componer objetos en estructuras de árbol para representar jerarquías de "parte-todo".

La magia es que permite tratar a objetos individuales (hojas) y a composiciones de objetos (ramas) de manera **uniforme
**.

---

## 1. El Escenario

Imagina un sistema de archivos.

- Tienes **Archivos** (Hojas).
- Tienes **Carpetas** (Composiciones).
- Una Carpeta puede contener Archivos u otras Carpetas.

Quieres saber el tamaño total. No quieres preguntar "¿Eres carpeta? Entonces suma tus hijos. ¿Eres archivo? Dame tu
tamaño". Quieres decir `elemento.getSize()` y que funcione igual para ambos.

---

## 2. Implementación

```javascript
// Componente Base (Interfaz implícita)
class Componente {
    getSize() {
        throw new Error("Método no implementado");
    }
}

// Hoja (Leaf)
class Archivo extends Componente {
    constructor(nombre, tamaño) {
        super();
        this.nombre = nombre;
        this.tamaño = tamaño;
    }

    getSize() {
        return this.tamaño;
    }
}

// Compuesto (Composite)
class Carpeta extends Componente {
    constructor(nombre) {
        super();
        this.nombre = nombre;
        this.hijos = [];
    }

    agregar(componente) {
        this.hijos.push(componente);
    }

    getSize() {
        // Delegación recursiva
        return this.hijos.reduce((total, hijo) => total + hijo.getSize(), 0);
    }
}
```

### Uso

```javascript
const archivo1 = new Archivo("foto.jpg", 2);
const archivo2 = new Archivo("texto.txt", 1);
const carpetaFotos = new Carpeta("Mis Fotos");

carpetaFotos.agregar(archivo1);

const carpetaRaiz = new Carpeta("Root");
carpetaRaiz.agregar(archivo2);
carpetaRaiz.agregar(carpetaFotos);

console.log(carpetaRaiz.getSize()); // 3 (1 + 2)
```

---

## 3. Ejemplo Real: UI Components

React y el DOM funcionan así. Un `div` (Composite) puede contener un `span` (Leaf) u otro `div`. El método `render()`
funciona recursivamente sin importar si es un componente simple o complejo.

---

## 4. Conclusión

Usa Composite cuando quieras que el cliente ignore la diferencia entre objetos individuales y colecciones de objetos.
Simplifica enormemente el código del cliente.
