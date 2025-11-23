# 02. Memory Management y Garbage Collector

A diferencia de lenguajes como C o C++ donde el desarrollador debe asignar (`malloc`) y liberar (`free`) memoria
manualmente, JavaScript gestiona la memoria automáticamente. Sin embargo, "automático" no significa "mágico". Entender
cómo funciona es vital para evitar **Memory Leaks** (fugas de memoria) que ralentizan o colapsan la aplicación.

---

## 1. Ciclo de Vida de la Memoria

Independientemente del lenguaje, el ciclo es siempre el mismo:

1. **Asignación (Allocation):** El sistema reserva espacio para los datos que necesitas.
2. **Uso (Use):** Lectura o escritura en la memoria asignada.
3. **Liberación (Release):** El sistema recupera la memoria que ya no se necesita para que pueda ser reutilizada.

En JavaScript:

- La asignación ocurre cuando declaras variables, funciones u objetos.
- La liberación es tarea del **Garbage Collector (GC)**.

---

## 2. Algoritmos de Garbage Collection

El objetivo del GC es identificar qué objetos en memoria ya no son necesarios ("basura") y eliminarlos.

### 2.1. Reference Counting (Obsoleto)

El algoritmo más simple. Un objeto es "basura" si tiene **cero referencias** apuntando a él.

- **Problema:** No puede manejar **Referencias Circulares**.
  ```javascript
  let a = {};
  let b = {};
  a.otro = b;
  b.otro = a;
  // Si eliminamos a y b, se siguen referenciando mutuamente.
  // Reference Counting nunca los liberaría -> Memory Leak.
  ```

### 2.2. Mark-and-Sweep (Marcado y Barrido)

El algoritmo estándar moderno (desde 2012 en todos los navegadores).
En lugar de contar referencias, se basa en la **alcanzabilidad (reachability)**.

1. **Raíces (Roots):** El GC comienza desde un conjunto de raíces (el objeto global `window`/`global`, variables locales
   en el stack actual).
2. **Mark (Marcar):** El GC recorre todas las referencias desde las raíces, marcando cada objeto que encuentra como "
   vivo". Luego recorre las referencias de esos objetos, recursivamente.
3. **Sweep (Barrer):** Cualquier objeto en memoria que **no** haya sido marcado (es decir, es inalcanzable desde las
   raíces) se considera basura y se libera.

**Ventaja:** Las referencias circulares aisladas no son alcanzables desde la raíz, por lo que son eliminadas
correctamente.

---

## 3. Generational Garbage Collection (V8)

Para optimizar el rendimiento, V8 (y otros motores) dividen el Heap en dos generaciones:

### 3.1. Young Generation (Nursery)

- Aquí se asignan los objetos nuevos.
- Es pequeña (1-8 MB).
- El GC aquí es muy rápido y frecuente (**Minor GC** o Scavenger).
- La mayoría de los objetos mueren jóvenes (hipótesis generacional).

### 3.2. Old Generation

- Los objetos que sobreviven a varios ciclos de Minor GC son "promovidos" a la Old Generation.
- Es mucho más grande.
- El GC aquí es menos frecuente pero más costoso (**Major GC**).

---

## 4. Memory Leaks Comunes

Una fuga de memoria ocurre cuando objetos que ya no necesitas siguen siendo referenciados por la raíz, impidiendo que el
GC los limpie.

1. **Variables Globales Accidentales:**
   ```javascript
   function leak() {
     bar = "texto gigante..."; // Se pega a window.bar
   }
   ```
2. **Timers y Callbacks Olvidados:**
   ```javascript
   setInterval(() => {
     // Si este callback referencia objetos grandes y nunca se detiene (clearInterval),
     // esos objetos nunca se liberan.
   }, 1000);
   ```
3. **Referencias en el DOM:**
   Si guardas una referencia JS a un nodo DOM eliminado del documento, el nodo (y a veces todo su árbol padre) se queda
   en memoria.
4. **Closures:** (Como vimos en el Cap 2) Un closure mantiene vivas las variables de su scope padre.

---

## 5. Conclusión

- No asumas que el GC lo arregla todo.
- Limpia tus suscripciones, intervalos y listeners cuando un componente o página se desmonte.
- Usa las herramientas de desarrollo (Chrome DevTools -> Memory Tab) para tomar **Heap Snapshots** y detectar fugas.
