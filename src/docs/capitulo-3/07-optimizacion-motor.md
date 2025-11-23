# 07. Cómo escribir código que el motor optimiza

Resumiendo todo lo aprendido en este capítulo, aquí tienes una guía práctica de "Do's and Don'ts" para mantener feliz al
motor de JavaScript (V8, SpiderMonkey, JSC).

---

## 1. Objetos y Propiedades

### ✅ DO (Hacer)

- **Inicializa todas las propiedades en el constructor.** Define la forma del objeto de una vez.
- **Mantén el orden de inicialización.** `obj.a` luego `obj.b` siempre.
- **Usa valores por defecto** si una propiedad puede no existir, en lugar de no definirla.

### ❌ DON'T (No hacer)

- **No uses `delete`.** Cambia la Hidden Class a un modo diccionario lento. Asigna `null` o `undefined` en su lugar.
- **No añadas propiedades perezosamente (lazy)** a objetos que se usan en funciones críticas.

---

## 2. Arrays

### ✅ DO (Hacer)

- **Usa literales `[]`** en lugar de `new Array()`.
- **Mantén los arrays contiguos** (índices 0, 1, 2...).
- **Mantén los tipos homogéneos** (solo números, o solo objetos). V8 optimiza `PACKED_SMI_ELEMENTS` (enteros) mejor que
  nada.

### ❌ DON'T (No hacer)

- **No crees arrays con huecos (sparse arrays).** `arr[100] = 1` en un array vacío lo convierte en "holey" y lento.
- **No leas índices fuera de rango.** Acceder a `arr[arr.length]` (que es `undefined`) es costoso porque el motor debe
  buscar en la cadena de prototipos para asegurarse de que no hay un getter mágico allí.

---

## 3. Funciones

### ✅ DO (Hacer)

- **Mantén las funciones pequeñas.** Son más fáciles de compilar y hacer _inlining_ (reemplazar la llamada a la función
  por el cuerpo de la función).
- **Hazlas monomórficas.** Pásales siempre el mismo "tipo" de objeto (misma Hidden Class).

### ❌ DON'T (No hacer)

- **Evita `with` y `eval`.** Deshabilitan casi todas las optimizaciones porque hacen imposible el análisis estático del
  scope.
- **Cuidado con `arguments`.** En funciones modernas, usa Rest Parameters (`...args`) en lugar del objeto `arguments`,
  que es más difícil de optimizar para el motor.

---

## 4. Números

### ✅ DO (Hacer)

- **Prefiere enteros de 31 bits (SMI).** V8 los guarda directamente en el puntero sin asignar memoria extra.
- **Usa Bitwise operators (`|`, `&`)** solo si sabes que trabajas con enteros, ya que fuerzan la conversión a enteros de
  32 bits.

---

## 5. Resumen Final

El mantra de la optimización en JS es: **"Escribe código que parezca estático"**.

Aunque JS es dinámico, los motores intentan "fingir" que es estático para optimizarlo. Si escribes código predecible,
estable y estructurado, el motor te recompensará con un rendimiento cercano a C++. Si escribes código caótico y
altamente dinámico, el motor tendrá que usar el modo seguro (lento).
