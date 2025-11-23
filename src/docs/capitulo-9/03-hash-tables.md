# 03. Hash Tables (Tablas Hash)

En JavaScript, los **Objetos** (`{}`) y los **Maps** son implementaciones de Hash Tables. Son la estructura de datos más
importante por su velocidad: **O(1)** promedio para insertar, buscar y borrar.

---

## 1. ¿Cómo funcionan?

1. Tienes una clave: `"nombre"`.
2. Pasas la clave por una **Hash Function**: Convierte `"nombre"` en un índice numérico (ej: `342`).
3. Guardas el valor en ese índice de un array interno.

---

## 2. Colisiones

¿Qué pasa si `"nombre"` y `"edad"` dan el mismo hash? Eso es una colisión.
Los motores de JS resuelven esto (generalmente) usando **Separate Chaining**: En cada índice del array no guardan un
valor, sino una lista enlazada (o un array) de valores que cayeron ahí.

Si hay muchas colisiones, el rendimiento baja de O(1) a O(n).

---

## 3. Implementación Propia (Educativa)

```javascript
class HashTable {
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }

    _hash(key) {
        let total = 0;
        let WEIRD_PRIME = 31;
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            let char = key[i];
            let value = char.charCodeAt(0) - 96;
            total = (total * WEIRD_PRIME + value) % this.keyMap.length;
        }
        return total;
    }

    set(key, value) {
        let index = this._hash(key);
        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }
        // Manejo simple de colisiones (push)
        this.keyMap[index].push([key, value]);
    }

    get(key) {
        let index = this._hash(key);
        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    return this.keyMap[index][i][1];
                }
            }
        }
        return undefined;
    }
}
```

---

## 4. Map vs Object

- **Object:** Las claves son strings (o Symbols). Tiene prototipo (cuidado con claves como `toString`). No guarda orden
  de inserción (históricamente).
- **Map:** Las claves pueden ser CUALQUIER COSA (funciones, objetos). No tiene prototipo. Guarda orden de inserción.
  Tiene propiedad `.size`.

**Regla:** Usa `Map` si necesitas claves que no sean strings o si vas a añadir/borrar frecuentemente. Usa `Object` para
registros estáticos simples.
