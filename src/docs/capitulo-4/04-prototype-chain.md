# 04. Prototype y Prototype Chain (Cadena de Prototipos)

Este es quizás el concepto más importante y malentendido de JavaScript. Mientras que Java o C++ usan **Herencia Clásica
** (donde una clase es un plano para crear objetos), JavaScript usa **Herencia Prototípica**.

En JS, **los objetos heredan directamente de otros objetos**. No existen las "clases" como entidades abstractas en el
runtime; solo existen objetos enlazados entre sí.

---

## 1. `prototype` vs `__proto__`

Esta distinción confunde a todos los principiantes. Acláremela para siempre:

1. **`prototype` (La propiedad):**

    - Solo existe en las **Funciones** (constructoras).
    - Es un objeto "plantilla".
    - Se usa _solo_ cuando invocas la función con `new`. El nuevo objeto creado tendrá este objeto como su prototipo.

2. **`__proto__` (El enlace real):**
    - Existe en **TODOS** los objetos.
    - Es una referencia al objeto padre del que hereda propiedades.
    - El estándar oficial lo llama `[[Prototype]]`. `__proto__` es solo un getter/setter histórico (y algo deprecated)
      para acceder a él.

**La Regla de Oro:**

> `(new Foo()).__proto__ === Foo.prototype`

---

## 2. La Cadena de Prototipos (The Chain)

Cuando intentas acceder a una propiedad `obj.prop`:

1. El motor busca `prop` en el propio objeto `obj` (Own Property).
2. Si no la encuentra, busca en `obj.__proto__`.
3. Si no la encuentra, busca en `obj.__proto__.__proto__`.
4. Sigue subiendo hasta llegar a `Object.prototype`.
5. Si no está ahí, busca en `Object.prototype.__proto__`, que es `null`.
6. Si llega a `null`, devuelve `undefined`.

```javascript
const abuelo = {a: 1};
const padre = Object.create(abuelo); // padre.__proto__ === abuelo
padre.b = 2;
const hijo = Object.create(padre); // hijo.__proto__ === padre
hijo.c = 3;

console.log(hijo.c); // 3 (propia)
console.log(hijo.b); // 2 (heredada de padre)
console.log(hijo.a); // 1 (heredada de abuelo)
console.log(hijo.d); // undefined
```

---

## 3. Métodos Modernos para Prototipos

No uses `__proto__` en código moderno (es lento y no estándar en todos lados). Usa:

### 3.1. `Object.getPrototypeOf(obj)`

Lee el prototipo.

```javascript
Object.getPrototypeOf(hijo) === padre; // true
```

### 3.2. `Object.setPrototypeOf(obj, proto)`

Cambia el prototipo de un objeto existente.
**⚠️ ADVERTENCIA DE RENDIMIENTO:** Esto es una operación muy lenta porque rompe todas las optimizaciones del motor (
Hidden Classes). Evítalo si puedes. Es mejor crear el objeto con el prototipo correcto desde el principio usando
`Object.create`.

---

## 4. Prototype Pollution (Contaminación de Prototipo)

Es una vulnerabilidad de seguridad crítica. Si un atacante puede modificar `Object.prototype`, puede inyectar
propiedades en **todos** los objetos de tu aplicación.

```javascript
// Atacante hace esto:
Object.prototype.isAdmin = true;

// Tu código:
const usuario = {nombre: "Invitado"};
if (usuario.isAdmin) {
    // ¡True! Porque lo hereda de Object.prototype
    darPermisosDeAdmin();
}
```

**Prevención:**

1. Usa `Object.create(null)` para mapas de datos puros (no tienen prototipo).
2. Usa `Object.freeze(Object.prototype)` (drástico pero seguro).
3. Valida inputs JSON recursivos para evitar claves como `"__proto__"`.

---

## 5. Conclusión

La herencia prototípica es un mecanismo de **delegación**. Un objeto delega en otro la responsabilidad de responder a
una propiedad que él no tiene. Es un sistema dinámico, vivo y eficiente en memoria.
