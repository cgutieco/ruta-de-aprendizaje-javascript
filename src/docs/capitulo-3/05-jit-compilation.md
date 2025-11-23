# 05. JIT Compilation (Compilación Just-In-Time)

JavaScript comenzó como un lenguaje puramente interpretado. Hoy, gracias a la compilación **Just-In-Time (JIT)**, puede
competir en rendimiento con lenguajes compilados como Java o C# en muchas tareas.

---

## 1. Interpretación vs Compilación

- **Intérprete:** Lee el código fuente y lo ejecuta línea por línea.
    - _Ventaja:_ Empieza a ejecutar inmediatamente.
    - _Desventaja:_ Es lento si tiene que ejecutar la misma línea muchas veces (bucles).
- **Compilador:** Traduce todo el código a lenguaje máquina antes de ejecutar nada.
    - _Ventaja:_ El código resultante es muy rápido.
    - _Desventaja:_ Tarda tiempo en compilar antes de poder empezar (latencia inicial).

**JIT** combina ambos mundos.

---

## 2. Arquitectura de V8: Ignition y TurboFan

V8 (el motor de Chrome/Node) utiliza una arquitectura de dos niveles:

### 2.1. Ignition (El Intérprete)

Es un intérprete de bytecode rápido.

- Cuando carga tu script, V8 lo pasa por Ignition.
- Genera bytecode y lo ejecuta.
- Mientras ejecuta, recolecta datos de **Profiling** (tipos de variables, frecuencia de uso).

### 2.2. TurboFan (El Compilador Optimizador)

Es un compilador que genera código máquina altamente optimizado.

- Se ejecuta en un hilo separado (background thread).
- Toma las funciones que Ignition ha marcado como "Hot" (muy usadas).
- Usa los datos del Profiler para hacer suposiciones agresivas.
    - _Suposición:_ "Esta función `sumar(a, b)` siempre ha recibido enteros hasta ahora. Voy a compilar una versión que
      asuma que `a` y `b` son enteros y usar instrucciones de CPU directas (`ADD`)."

---

## 3. El ciclo de Optimización

1. **Warm-up:** El código arranca en Ignition.
2. **Optimize:** Si una función se usa mucho, TurboFan la compila a código máquina.
3. **Execute Optimized:** Las siguientes llamadas usan la versión compilada (super rápida).
4. **Deoptimize (Bailout):** Si algo cambia y rompe las suposiciones de TurboFan (ej. pasas un string a la función
   `sumar` que esperaba enteros), el motor **tira** el código optimizado y vuelve al bytecode de Ignition.

### ¿Por qué la Desoptimización es mala?

Porque tiene un costo de rendimiento ("Deopt penalty"). El motor tiene que reconstruir el stack frame y volver al modo
lento. Si tu código está constantemente optimizándose y desoptimizándose ("Deopt Loop"), será más lento que si nunca se
hubiera optimizado.

---

## 4. Hot Code (Código Caliente)

El concepto de "Hot Code" es fundamental.

- El motor no optimiza todo el código, solo lo que se usa frecuentemente.
- El código que se ejecuta una sola vez (ej. configuración inicial) probablemente nunca salga de Ignition.
- Esto significa que **no vale la pena micro-optimizar código que solo corre una vez**. Concéntrate en los bucles y
  funciones que se llaman miles de veces.

---

## 5. Conclusión

El JIT es un sistema especulativo. Apuesta a que tu código se comportará en el futuro igual que en el pasado.

- Escribe código predecible (tipos estables).
- Evita cambiar la forma de los objetos dinámicamente.
- Mantén las funciones pequeñas y enfocadas (es más fácil para el compilador optimizar funciones pequeñas y
  monomórficas).
