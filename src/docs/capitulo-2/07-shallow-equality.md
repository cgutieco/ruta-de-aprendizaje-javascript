# 07. Shallow Equality (Igualdad Superficial)

La **Igualdad Superficial** es el mecanismo estándar que utilizan bibliotecas como React (en `React.memo`, `useEffect`,
`PureComponent`) y Redux para determinar si los datos han cambiado y si es necesario actualizar la UI.

---

## 1. Shallow vs Deep Equality

### 1.1. Igualdad Referencial (Strict Equality)

Es la comparación más simple: `===`.

- Para primitivos: compara valor.
- Para objetos: compara referencia de memoria.

### 1.2. Igualdad Superficial (Shallow Equality)

Va un paso más allá que la referencial.

1. Comprueba si son referencialmente iguales (`===`). Si sí, son iguales.
2. Si no, comprueba si las llaves (keys) de ambos objetos son las mismas.
3. Comprueba si el **valor** de cada llave es referencialmente igual (`===`) al del otro objeto.

**No entra recursivamente** en objetos anidados.

```javascript
function shallowEqual(objA, objB) {
    if (objA === objB) return true;

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) return false;

    for (let key of keysA) {
        if (objA[key] !== objB[key]) return false;
    }
    return true;
}
```

### 1.3. Igualdad Profunda (Deep Equality)

Compara recursivamente cada propiedad de cada objeto anidado.

- Es **muy costosa** computacionalmente.
- Rara vez se usa en el ciclo de renderizado de UI por problemas de performance.

---

## 2. El Problema de la Mutación

Si mutas un objeto, la igualdad superficial (y la referencial) fallará en detectar el cambio, porque la referencia sigue
siendo la misma.

```javascript
const user = {name: "Alice"};
const oldUser = user;

user.name = "Bob"; // Mutación

// Para React, nada cambió:
console.log(user === oldUser); // true
// shallowEqual(user, oldUser) -> true
```

Por eso **React requiere inmutabilidad**. Al crear un nuevo objeto, la referencia cambia, y la comparación retorna
`false`, disparando el render.

---

## 3. El Problema de los Objetos Anidados

La igualdad superficial no detecta cambios en niveles profundos si la referencia del padre cambió pero la del hijo no (o
viceversa, dependiendo de cómo se hizo la copia).

```javascript
const a = {data: {id: 1}};
const b = {data: {id: 1}};

// shallowEqual(a, b) -> false
// Porque a.data !== b.data (son objetos distintos en memoria)
```

Esto a veces causa re-renderizados innecesarios en React: si creas un objeto `{ id: 1 }` nuevo en cada render y lo pasas
como prop, el componente hijo creerá que es un dato nuevo cada vez, aunque el contenido sea idéntico.

---

## 4. Conclusión

- **Shallow Equality** es el equilibrio perfecto entre velocidad y precisión para UI.
- Entenderla explica por qué `useEffect` se dispara infinitamente si pones un objeto en su array de dependencias sin
  memorizarlo (`useMemo`).
- Explica por qué no debes mutar el estado en Redux o React.
