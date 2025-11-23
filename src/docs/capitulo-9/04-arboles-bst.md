# 04. Árboles (BST - Binary Search Trees)

El DOM es un árbol. El sistema de archivos es un árbol. Los árboles son jerárquicos.

Un **Binary Search Tree (BST)** es un tipo especial donde:

1. Cada nodo tiene máximo 2 hijos (izquierda, derecha).
2. **Regla de Oro:** Todo lo a la izquierda es MENOR. Todo lo a la derecha es MAYOR.

Esto permite búsquedas muy rápidas: **O(log n)**.

---

## 1. Implementación de Nodo y Árbol

```javascript
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return this;
        }
        let current = this.root;
        while (true) {
            if (value === current.value) return undefined; // No duplicados
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }

    find(value) {
        if (!this.root) return false;
        let current = this.root;
        while (current) {
            if (value < current.value) current = current.left;
            else if (value > current.value) current = current.right;
            else return true; // Encontrado
        }
        return false;
    }
}
```

---

## 2. Recorridos (Traversal)

¿Cómo visitamos todos los nodos?

### BFS (Breadth First Search) - Anchura

Nivel por nivel. Horizontal.
Usa una **Cola (Queue)**.

### DFS (Depth First Search) - Profundidad

Baja hasta el final de una rama antes de pasar a la siguiente.
Usa **Recursividad** (o una Pila).

Tipos de DFS:

1. **PreOrder:** Raíz -> Izq -> Der. (Útil para clonar/exportar el árbol).
2. **PostOrder:** Izq -> Der -> Raíz.
3. **InOrder:** Izq -> Raíz -> Der. (¡Devuelve los datos ordenados de menor a mayor!).

---

## 3. Conclusión

Los BST son excelentes para datos ordenados dinámicos. Si el árbol se desbalancea (ej: insertas 1, 2, 3, 4, 5 en orden),
se convierte en una Linked List y la búsqueda pasa a ser O(n). Para evitar esto en producción, se usan árboles
auto-balanceados (AVL, Red-Black), pero eso es tema avanzado.
