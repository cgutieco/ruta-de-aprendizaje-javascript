# 🧭 Ruta de Aprendizaje JavaScript 2025

Esta ruta está organizada en capítulos secuenciales, orientada a un desarrollo profesional moderno (2025), y alineada
con ECMAScript actualizado, React contemporáneo y buenas prácticas de ingeniería.

---

## **Capítulo 1 — Fundamentos esenciales del lenguaje**

### Temas

- Qué es JavaScript: ECMAScript, navegador, Node.js
- Primitivos vs referencias
- Variables: `let`, `const`, hoisting, shadowing
- Operadores y coerción (implícita/explícita)
- Control de flujo: `if`, `switch`, loops, etiquetados
- Funciones: declaración, expresión, arrow functions
- Scope global, local, léxico
- Call Stack, Execution Context y Memory Heap
- Strict mode y errores comunes

**🎯 Objetivo:** entender el modelo real de ejecución y memoria.

---

## **Capítulo 2 — Funciones avanzadas + Inmutabilidad**

### Temas

- Closures en profundidad
- High Order Functions: `map`, `filter`, `reduce`, etc.
- Currying y composición
- IIFE
- Pureza y efectos secundarios
- **Inmutabilidad avanzada**
    - Mutación vs inmutabilidad
    - Spread/rest avanzado
    - Shallow vs deep clone
    - `Object.freeze`, `Object.seal`
- Shallow equality y su relación con React

**🎯 Objetivo React:** fundamentos de `useState` y re-renderizado.

---

## **Capítulo 3 — Internals del motor JavaScript (V8 / SpiderMonkey / JavaScriptCore)**

### Temas

- Motores modernos del 2025
- Memory management y garbage collector
- Hidden classes
- Inline caching
- JIT Compilation
- Monomorfismo vs polimorfismo
- Cómo escribir código que el motor optimiza

**🎯 Objetivo Senior:** escribir JS performante por diseño.

---

## **Capítulo 4 — Objetos, Prototipos y POO moderna**

### Temas

- Creación y manipulación de objetos
- Property descriptors
- Constructor functions
- Prototype y Prototype Chain
- Clases, `extends`, `super`
- Encapsulación con `#private` y closures
- Polimorfismo y composición
- Symbols y metaprogramación ligera
- Factory, Singleton y Mixins

---

## **Capítulo 5 — Arrays, objetos, iteradores y generadores**

### Temas

- Destructuring profundo
- Spread/rest avanzado
- Métodos avanzados de arrays
- Iterators y Generators
- `for...in` vs `for...of`
- WeakMap, WeakSet
- Serialización y manejo avanzado de JSON
- Clonación profunda y estructural

---

## **Capítulo 6 — DOM Avanzado**

### Temas

- Selección y manipulación
- Eventos y Event Delegation
- Ciclo de render: reflow/repaint
- Template literal rendering
- DocumentFragment
- Shadow DOM (conceptual)
- Crear un Virtual DOM básico

**🎯 Objetivo React:** comprender el renderizado de UI sin framework.

---

## **Capítulo 7 — Asincronía profesional**

### Temas

- Callback Hell y patrón piramidal
- Promises y microtasks
- async / await avanzado
- Event Loop, macrotasks, Job Queue
- Fetch API y streaming
- AbortController y cancelación
- Manejo de errores en async
- WebSockets básico
- Web Workers

**🎯 Objetivo React:** dominar los efectos secundarios y racing conditions.

---

## **Capítulo 8 — Arquitectura y Módulos**

### Temas

- ES Modules (estático y dinámico)
- Organización por features vs por capas
- MVC aplicado a JavaScript
- MVVM y separación de responsabilidades
- Dependency Injection
- Clean Architecture básica

**🎯 Objetivo Senior:** desarrollar software escalable.

---

## **Capítulo 9 — Estructuras de Datos & Algoritmos**

### Temas

- Big-O notation aplicado
- Listas enlazadas, colas, pilas
- Hash tables (implementación propia)
- Árboles (BST)
- Grafos básico
- Recursividad profunda
- Memoización
- Técnicas de optimización algorítmica

---

## **Capítulo 10 — Patrones de Diseño en JavaScript**

### Temas

- Observer
- Publish/Subscribe
- Strategy
- Adapter
- Decorator
- Flyweight
- Composite
- Command
- State

**🎯 Objetivo React:** comprender la base de Redux, Zustand y reactividad.

---

## **Capítulo 11 — Construyendo un mini React desde 0**

### Temas

- Implementación propia de `useState`
- Reconciliación y diffing
- Render por cambios de estado
- Componentes funcionales
- Sistema de suscripción (reactividad)
- Virtual DOM simplificado
- Router minimalista (Hash o History API)

**🎯 Meta final:** entender React internamente.

---

## **Capítulo 12 — Manejo avanzado de errores**

### Temas

- try/catch avanzado
- Errores sincrónicos vs asíncronos
- Custom errors
- Logging estructurado
- Error boundaries (conceptual React)
- Manejo de errores en Promises y async
- Reporte de errores en producción

---

## **Capítulo 13 — Testing y Calidad**

### Temas

- Mentalidad TDD
- Unit testing con Vitest / Mocha
- Mocking, spies y cobertura
- Testing de DOM sin framework
- Pruebas de integración
- CI básico

---

## **Capítulo 14 — Performance y Optimización**

### Temas

- Web performance profiling
- Memoización y caching
- Web Workers
- Optimización del render
- Técnicas del motor JS (optimizable vs desoptimizable)
- Garbage Collector tuning
- Diseño performante de estructuras de datos

---

## **Capítulo 15 — Seguridad en JavaScript (Frontend)**

### Temas

- XSS (reflected, stored, DOM-based)
- CSRF
- CORS profundo
- Sanitización de datos
- Content Security Policy (CSP)
- Cookies: HttpOnly, Secure, SameSite
- Seguridad en Fetch y APIs
- Hardening de frontend
- Seguridad de módulos ES y dependencias

---

## **Capítulo 16 — Construcción & Despliegue (Build & Deploy)**

### Temas

- Bundlers modernos: Vite, esbuild, Webpack (conceptual)
- Tree shaking y code splitting
- Estructura profesional de proyecto
- Variables de entorno
- Build para producción
- Deploy en Netlify, Vercel, Cloudflare Pages
- Buenas prácticas de CI/CD
