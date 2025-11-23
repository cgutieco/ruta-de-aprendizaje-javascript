# 05. Grafos Básico

Un grafo es un conjunto de **Nodos (Vertices)** conectados por **Aristas (Edges)**.
Es la estructura que modela redes sociales, mapas, recomendaciones, internet.

---

## 1. Tipos de Grafos

- **Undirected (No dirigido):** Facebook (si yo soy tu amigo, tú eres mi amigo). La conexión es bidireccional.
- **Directed (Dirigido):** Twitter/Instagram (yo te sigo, pero tú no tienes por qué seguirme). La flecha tiene dirección.
- **Weighted (Ponderado):** Google Maps (la conexión entre A y B tiene un "peso" o distancia en km).

---

## 2. Representación

¿Cómo guardamos esto en código?

### Adjacency Matrix (Matriz de Adyacencia)

Una tabla 2D de booleanos (0/1).

- ✅ Rápido para ver si hay conexión entre A y B.
- ❌ Ocupa mucha memoria si hay pocos enlaces (Sparse Graph).

### Adjacency List (Lista de Adyacencia) - La más común

Un objeto/mapa donde la clave es el nodo y el valor es un array de sus vecinos.

```javascript
{
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "E"],
    "D": ["B", "E", "F"],
    "E": ["C", "D", "F"],
    "F": ["D", "E"]
}
```

---

## 3. Implementación (Undirected)

```javascript
class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    addEdge(v1, v2) {
        this.adjacencyList[v1].push(v2);
        this.adjacencyList[v2].push(v1); // Si fuera dirigido, borrar esta línea
    }

    removeEdge(v1, v2) {
        this.adjacencyList[v1] = this.adjacencyList[v1].filter((v) => v !== v2);
        this.adjacencyList[v2] = this.adjacencyList[v2].filter((v) => v !== v1);
    }
}
```

---

## 4. Recorridos (Traversal)

Igual que en árboles (que son un tipo de grafo), usamos BFS y DFS.

- **DFS (Recursivo):** "Sigue el camino hasta que topes con pared, luego retrocede". Útil para laberintos o detectar
  ciclos.
- **BFS (Iterativo con Cola):** "Visita a todos los vecinos inmediatos antes de alejarte". Útil para encontrar el *
  *camino más corto** en grafos no ponderados (ej: grados de separación de Kevin Bacon).

**Importante:** En grafos, debes llevar un registro de `visited` (nodos visitados) para no entrar en bucles infinitos.
