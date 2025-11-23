# 04. Adapter Pattern

El patrón **Adapter** actúa como un puente entre dos interfaces incompatibles. Es como el adaptador de enchufe que usas
cuando viajas a otro país.

Muy útil cuando integras librerías de terceros o migras código legacy.

---

## 1. El Escenario

Tienes un sistema viejo que usa `xml` y quieres usar una nueva librería de analíticas que solo acepta `json`.

O más simple: Tienes una API antigua y una nueva.

---

## 2. Ejemplo Práctico

Imagina que tu app usa una interfaz `PaymentProcessor` antigua.

```javascript
// Interfaz Antigua (lo que tu app espera)
class OldPaymentProcessor {
    pay(amount, currency) {
        console.log(`Pagando ${amount} ${currency} con sistema viejo.`);
    }
}
```

Ahora quieres usar Stripe (simulado), pero su método se llama diferente.

```javascript
// Nueva Librería (incompatible)
class StripeNew {
    makePayment(totalCents) {
        console.log(`Pagando ${totalCents} centavos vía Stripe.`);
    }
}
```

Si cambias todas las llamadas en tu app de `pay()` a `makePayment()`, tardarás semanas.
**Solución:** Crea un adaptador.

---

## 3. Implementación del Adaptador

```javascript
class StripeAdapter {
    constructor(stripeInstance) {
        this.stripe = stripeInstance;
    }

    // Implementamos la interfaz que la app ESPERA (pay)
    pay(amount, currency) {
        // Adaptamos los datos (convertir a centavos)
        const totalCents = amount * 100;

        // Llamamos a la nueva API
        this.stripe.makePayment(totalCents);
    }
}
```

### Uso

```javascript
// Tu código existente no cambia, solo la instancia que le pasas
const processor = new StripeAdapter(new StripeNew());

processor.pay(100, "USD");
// Output: "Pagando 10000 centavos vía Stripe."
```

---

## 4. Conclusión

Usa el Adapter cuando:

- Quieras usar una clase existente pero su interfaz no coincida con lo que necesitas.
- Quieras crear una clase reutilizable que coopere con clases no relacionadas o imprevistas.
