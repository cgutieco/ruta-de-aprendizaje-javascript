# 08. Command Pattern

El patrón **Command** encapsula una solicitud como un objeto. Esto te permite parametrizar clientes con diferentes
solicitudes, encolar solicitudes y soportar operaciones que se pueden deshacer (**Undo/Redo**).

---

## 1. El Problema

Imagina un editor de texto. Tienes botones para "Copiar", "Pegar", "Negrita".
Si pones la lógica directamente en el botón (`onClick`), es difícil implementar "Deshacer". ¿Cómo sabes qué hizo el
usuario para revertirlo?

---

## 2. La Solución (Comandos)

Cada acción es un objeto con dos métodos: `execute()` y `undo()`.

```javascript
// Receptor (quien hace el trabajo real)
class Calculadora {
    constructor() {
        this.valor = 0;
    }

    sumar(n) {
        this.valor += n;
    }

    restar(n) {
        this.valor -= n;
    }
}

// Command
class SumarCommand {
    constructor(calculadora, valor) {
        this.calculadora = calculadora;
        this.valor = valor;
    }

    execute() {
        this.calculadora.sumar(this.valor);
    }

    undo() {
        this.calculadora.restar(this.valor);
    }
}
```

---

## 3. Invoker (Historial)

El Invoker guarda los comandos ejecutados para poder deshacerlos.

```javascript
class Invoker {
    constructor() {
        this.historial = [];
    }

    ejecutar(comando) {
        comando.execute();
        this.historial.push(comando);
    }

    deshacer() {
        const comando = this.historial.pop();
        if (comando) {
            comando.undo();
        }
    }
}
```

### Uso

```javascript
const calc = new Calculadora();
const invoker = new Invoker();

// Usuario suma 10
invoker.ejecutar(new SumarCommand(calc, 10));
console.log(calc.valor); // 10

// Usuario suma 5
invoker.ejecutar(new SumarCommand(calc, 5));
console.log(calc.valor); // 15

// Usuario se arrepiente (Ctrl+Z)
invoker.deshacer();
console.log(calc.valor); // 10
```

---

## 4. Conclusión

El patrón Command es esencial para:

- Sistemas de Undo/Redo.
- Transacciones (bases de datos).
- Colas de tareas (Job Queues).
- Macros (grabar secuencia de acciones).
