# 01. Motores Modernos del 2025

Para escribir JavaScript de alto rendimiento, es indispensable comprender dónde y cómo se ejecuta nuestro código. Un *
*Motor de JavaScript (JavaScript Engine)** es un programa que toma código fuente JavaScript y lo convierte en
instrucciones de máquina optimizadas que la CPU puede ejecutar.

---

## 1. El Panorama de los Motores

En 2025, el ecosistema está dominado por tres grandes motores, cada uno con su propia arquitectura pero compartiendo
principios fundamentales de optimización.

### 1.1. V8 (Google)

- **Uso:** Google Chrome, Microsoft Edge, Brave, Opera, **Node.js**, Deno.
- **Lenguaje:** Escrito en C++.
- **Características:** Pionero en JIT (Just-In-Time) compilation agresiva. Es el estándar de facto para el desarrollo
  backend (Node.js).

### 1.2. SpiderMonkey (Mozilla)

- **Uso:** Mozilla Firefox.
- **Lenguaje:** C++ y Rust.
- **Características:** Históricamente el primer motor de JS (creado por Brendan Eich). Hoy en día destaca por su
  seguridad y paralelismo gracias a componentes reescritos en Rust.

### 1.3. JavaScriptCore (Apple)

- **Uso:** Safari, WebKit, React Native (en iOS), Bun.
- **Lenguaje:** C++.
- **Características:** También conocido como "Nitro". Optimizado para bajo consumo de energía y arranque rápido, crucial
  para dispositivos móviles Apple.

---

## 2. El Pipeline de Ejecución

Aunque cada motor tiene sus nombres propios para sus componentes (Ignition/TurboFan en V8, Baseline/IonMonkey en
SpiderMonkey), el flujo general es universal:

### Paso 1: Parsing (Análisis)

El motor recibe el código fuente (texto).

1. **Lexical Analysis (Tokenización):** Rompe el código en "tokens" (palabras clave, identificadores, operadores).
    - `const a = 5;` -> `[CONST, IDENTIFIER(a), ASSIGN, NUMBER(5), SEMICOLON]`
2. **Syntax Analysis:** Convierte los tokens en un **AST (Abstract Syntax Tree)**. Un árbol que representa la estructura
   lógica del programa.

### Paso 2: Interpretación (Ignition en V8)

El **Intérprete** toma el AST y lo convierte en **Bytecode**.

- El Bytecode es un código intermedio, más abstracto que el código máquina pero más rápido de ejecutar que el AST
  directo.
- **Ventaja:** El arranque es muy rápido (baja latencia).
- **Desventaja:** La ejecución no es tan rápida como el código máquina nativo.

### Paso 3: Profiling (Perfilado)

Mientras el Bytecode se ejecuta, un **Profiler** (monitor) observa el código en tiempo real.

- Identifica funciones que se usan mucho ("Hot Functions").
- Registra los tipos de datos que fluyen por esas funciones (ej. "esta función siempre recibe enteros").

### Paso 4: JIT Compilation (TurboFan en V8)

Cuando una función se vuelve "caliente" (hot), el motor la envía al **Compilador Optimizador**.

- Usa la información del Profiler para generar **Código Máquina (Machine Code)** altamente optimizado para la
  arquitectura específica de la CPU (x64, ARM64).
- Este proceso se llama **Just-In-Time (JIT) Compilation**.

### Paso 5: Deoptimization (Bailout)

Si las suposiciones del compilador fallan (ej. una función que siempre recibía números de repente recibe un string), el
motor **desoptimiza**.

- Tira el código máquina optimizado a la basura.
- Vuelve a ejecutar el Bytecode en el intérprete (más lento pero seguro).
- Este "baile" entre optimización y desoptimización es costoso.

---

## 3. Conclusión

El objetivo de un desarrollador senior es escribir código que:

1. Ayude al motor a llegar al Paso 4 (Optimización) lo más rápido posible.
2. Evite que el motor caiga en el Paso 5 (Desoptimización).

En los siguientes temas exploraremos cómo lograr esto entendiendo conceptos como _Hidden Classes_ e _Inline Caching_.
