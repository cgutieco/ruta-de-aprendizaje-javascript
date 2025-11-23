# 02. Listas Enlazadas, Colas y Pilas

Las estructuras de datos lineales son la base de todo. Aunque JavaScript tiene Arrays dinámicos muy potentes, entender
cómo funcionan estas estructuras es vital para entrevistas y optimizaciones específicas.

---

## 1. Stack (Pila) - LIFO

**Last In, First Out.** El último en entrar es el primero en salir. Como una pila de platos.

### Usos:

- Call Stack de JS.
- Deshacer/Rehacer (Undo/Redo).
- Navegación del navegador (Atrás/Adelante).

```javascript
class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }
}
```

---

## 2. Queue (Cola) - FIFO

**First In, First Out.** El primero en llegar es el primero en ser atendido. Como la cola del supermercado.

### Usos:

- Cola de impresión.
- Task Queue del Event Loop.

```javascript
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        return this.items.shift(); // O(n) - ¡Ineficiente en arrays grandes!
    }
}
```

**Nota:** Para una cola real de alto rendimiento, usaríamos una Linked List o un objeto con punteros `head` y `tail`
para lograr O(1) en `dequeue`.

---

## 3. Linked List (Lista Enlazada)

A diferencia de un Array, los elementos no están contiguos en memoria. Cada nodo tiene un valor y un puntero al
siguiente.

### Tipos:

- **Singly Linked List:** A -> B -> C
- **Doubly Linked List:** A <-> B <-> C

### Implementación Simple (Singly)

```javascript
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }
}
```

### Array vs Linked List

- **Array:** Acceso aleatorio O(1). Inserción/Borrado en medio O(n).
- **Linked List:** Acceso aleatorio O(n). Inserción/Borrado O(1) (si tienes el puntero).
