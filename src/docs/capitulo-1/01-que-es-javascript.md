# 01. ¿Qué es JavaScript?

JavaScript es a menudo malinterpretado como un simple lenguaje de scripting para navegadores. Sin embargo, en el
panorama del desarrollo de software de 2025, JavaScript es un lenguaje de programación multiparadigma, dinámico y
robusto que actúa como la columna vertebral de la web moderna y gran parte de la infraestructura de servidores.

Para comprender verdaderamente JavaScript, es imperativo disociar el lenguaje (la especificación) de su entorno de
ejecución (el runtime). Este capítulo establece los cimientos conceptuales necesarios para distinguir entre lo que el
lenguaje _es_ y lo que el entorno _proporciona_.

---

## 1. ECMAScript: La Especificación

En su núcleo, JavaScript es una implementación de la especificación **ECMAScript** (estandarizada por ECMA International
en el documento ECMA-262).

### 1.1. El rol de TC39

El desarrollo del lenguaje es gestionado por el comité técnico **TC39**. A diferencia de otros lenguajes que pueden
tener actualizaciones esporádicas, ECMAScript evoluciona mediante un proceso continuo y democrático dividido en etapas 
(_stages_):

- **Stage 0 (Strawperson):** Una idea inicial presentada por un miembro o contribuyente.
- **Stage 1 (Proposal):** Propuesta formal con descripción del problema y solución potencial.
- **Stage 2 (Draft):** Primer borrador de la especificación sintáctica y semántica.
- **Stage 3 (Candidate):** La especificación está completa y espera implementaciones en navegadores para feedback final.
- **Stage 4 (Finished):** La característica está lista para ser incluida en la siguiente versión anual del estándar (ej.
  ES2024, ES2025).

### 1.2. Dialectos y Motores

JavaScript no es un binario compilado único; es interpretado o compilado "just-in-time" (JIT) por un **motor**.

- **V8 (Google):** Utilizado en Chrome, Edge, Node.js y Deno.
- **SpiderMonkey (Mozilla):** Utilizado en Firefox.
- **JavaScriptCore (Apple):** Utilizado en Safari y WebKit.

Cada motor implementa el estándar ECMAScript, pero pueden existir ligeras diferencias en optimización o soporte de
características muy recientes (aunque la compatibilidad hoy en día es extremadamente alta gracias a herramientas como
Babel o SWC).

---

## 2. El Motor vs. El Entorno (Runtime)

Una distinción crítica para un ingeniero de software es entender que **el motor de JavaScript solo conoce el estándar
ECMAScript**.

El motor sabe cómo declarar una variable, cómo ejecutar un bucle `for` o cómo definir una función. Sin embargo, el motor
**no sabe** qué es `document.getElementById`, ni qué es `fs.readFile`. Estos objetos y funciones no son parte de
JavaScript; son APIs proporcionadas por el **Entorno de Ejecución (Runtime)**.

### 2.1. El Navegador como Runtime

Cuando JavaScript se ejecuta en un navegador, el entorno proporciona:

- **DOM (Document Object Model):** La representación en árbol del HTML (`document`, `nodes`).
- **BOM (Browser Object Model):** Interfaz con la ventana del navegador (`window`, `navigator`, `location`).
- **Web APIs:** Funcionalidades extra como `fetch`, `localStorage`, `setTimeout`, `Geolocation`.

El navegador inyecta estas APIs en el objeto global (usualmente `window`), permitiendo que el motor de JavaScript
interactúe con ellas.

### 2.2. Node.js como Runtime

Node.js es un entorno de ejecución basado en el motor V8, pero diseñado para el lado del servidor. Node.js **no tiene
DOM ni BOM**. En su lugar, proporciona:

- **Módulos nativos:** `fs` (sistema de archivos), `http` (servidor web), `path`, `os`.
- **Globales de servidor:** `global`, `process`, `Buffer`.
- **C++ Bindings:** A través de `libuv`, Node.js dota a JavaScript de capacidades de E/S asíncronas y acceso al sistema
  operativo que el lenguaje por sí solo no posee.

---

## 3. JavaScript en 2025

Hoy en día, JavaScript se define por características modernas que lo alejan de sus orígenes humildes:

1. **Tipado Dinámico pero Fuerte (en práctica):** Aunque las variables no tienen tipo, los valores sí. El uso de
   TypeScript se ha convertido en el estándar de facto para añadir seguridad de tipos en tiempo de desarrollo, aunque el
   runtime sigue siendo JavaScript puro.
2. **Multiparadigma:** Soporta programación imperativa, orientada a objetos (basada en prototipos y clases) y
   funcional (funciones de primera clase, clausuras, inmutabilidad).
3. **Asincronía Nativa:** Con `Promises` y `async/await`, JavaScript maneja la concurrencia de una manera única mediante
   el **Event Loop**, permitiendo operaciones no bloqueantes en un solo hilo (single-threaded).

### Tabla Comparativa: Browser vs Node.js

| Característica          | Navegador (Browser)                 | Node.js (Server)                  |
|:------------------------|:------------------------------------|:----------------------------------|
| **Motor**               | V8, SpiderMonkey, JSC               | V8 (principalmente)               |
| **Objeto Global**       | `window` (o `self` en workers)      | `global`                          |
| **DOM**                 | ✅ Sí (manipulación UI)              | ❌ No                              |
| **Sistema de Archivos** | ❌ No (por seguridad)                | ✅ Sí (`fs`)                       |
| **Módulos**             | ES Modules (`import`/`export`)      | CommonJS (`require`) y ES Modules |
| **Enfoque**             | Interfaz de usuario, interactividad | API, Backend, Scripts, I/O        |

---

## 4. Conclusión

JavaScript es el lenguaje que orquesta la interacción lógica. No es el navegador ni el servidor; es el director de
orquesta que utiliza los instrumentos (APIs) que el entorno le proporciona.

Comprender esta separación es vital. Cuando un código falla porque "document is not defined", un desarrollador junior
culpará al lenguaje; un desarrollador senior entenderá que está intentando acceder a una API del entorno navegador desde
un entorno de servidor.

En los siguientes capítulos, exploraremos la sintaxis y semántica del lenguaje puro (ECMAScript), independientemente de
dónde se ejecute.
