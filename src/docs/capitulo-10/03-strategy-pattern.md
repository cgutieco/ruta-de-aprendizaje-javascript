# 03. Strategy Pattern

El patrón **Strategy** permite definir una familia de algoritmos, encapsular cada uno, y hacerlos intercambiables.
Permite que el algoritmo varíe independientemente de los clientes que lo usan.

**En resumen:** Evita los `if/else` o `switch` gigantes.

---

## 1. El Problema

```javascript
class CalculadoraEnvio {
    calcular(paquete, proveedor) {
        if (proveedor === "fedex") {
            return paquete.peso * 2.5;
        } else if (proveedor === "dhl") {
            return paquete.peso * 3.0 + 5;
        } else if (proveedor === "correos") {
            return 5;
        }
        // Si añades otro proveedor, tienes que modificar esta clase (rompe Open/Closed Principle)
    }
}
```

---

## 2. La Solución (Estrategias)

Creamos objetos separados para cada lógica.

```javascript
// Estrategia 1
const FedexStrategy = {
    calcular: (paquete) => paquete.peso * 2.5,
};

// Estrategia 2
const DHLStrategy = {
    calcular: (paquete) => paquete.peso * 3.0 + 5,
};

// Contexto
class CalculadoraEnvio {
    constructor() {
        this.strategy = null;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    calcular(paquete) {
        return this.strategy.calcular(paquete);
    }
}
```

---

## 3. Uso

```javascript
const paquete = {peso: 10};
const calculadora = new CalculadoraEnvio();

calculadora.setStrategy(FedexStrategy);
console.log(calculadora.calcular(paquete)); // 25

calculadora.setStrategy(DHLStrategy);
console.log(calculadora.calcular(paquete)); // 35
```

### Ventajas

1. **Extensible:** Para añadir UPS, solo creas `UPSStrategy`. No tocas la calculadora.
2. **Testeable:** Puedes probar cada estrategia por separado.
3. **Limpio:** Elimina condicionales complejos.
