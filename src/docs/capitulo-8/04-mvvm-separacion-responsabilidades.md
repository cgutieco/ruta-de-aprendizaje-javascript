# 04. MVVM y Separación de Responsabilidades

**Model-View-ViewModel (MVVM)** es la evolución de MVC, popularizada por Microsoft (WPF) y adoptada por la web moderna (
Knockout, Angular, Vue).

El objetivo es eliminar el "Glue Code" (código pegamento) del Controlador que mueve datos manualmente del Modelo a la
Vista.

---

## 1. Los Componentes

1. **Model:** Datos puros (igual que en MVC).
2. **View:** La plantilla HTML. Es "declarativa". Dice _qué_ mostrar, no _cómo_.
3. **ViewModel:** Un objeto que expone los datos del modelo de forma lista para la vista.

La clave es el **Data Binding (Enlace de Datos)**. La Vista se "conecta" automáticamente al ViewModel. Si el ViewModel
cambia, la Vista se actualiza sola.

---

## 2. Ejemplo Conceptual (Estilo Vue/Angular)

Imagina que no tienes que escribir `document.querySelector` nunca más.

**ViewModel:**

```javascript
class UserViewModel {
    constructor() {
        // Estado reactivo (simplificado)
        this.state = {
            name: "Juan",
            isAdmin: false,
        };
    }

    toggleAdmin() {
        this.state.isAdmin = !this.state.isAdmin;
    }
}
```

**View (HTML Declarativo):**

```html

<div>
    <!-- Binding unidireccional (Texto) -->
    <h1>Hola, {{ name }}</h1>

    <!-- Binding condicional -->
    <p v-if="isAdmin">¡Eres administrador!</p>

    <!-- Binding de eventos -->
    <button @click="toggleAdmin">Cambiar Rol</button>
</div>
```

---

## 3. ¿Cómo funciona la magia?

Frameworks como Vue o React (que usa una variante) utilizan:

1. **Getters/Setters (Proxy):** Para interceptar cuando cambias una propiedad del ViewModel.
2. **Dependency Tracking:** Saben qué parte exacta del DOM depende de esa propiedad.
3. **Re-render:** Actualizan solo ese nodo de texto o atributo.

---

## 4. Separación de Responsabilidades

- **Diseñador:** Trabaja en el HTML/CSS (View). No toca JS.
- **Desarrollador:** Trabaja en el JS (ViewModel/Model). No toca el DOM.

Esto permite trabajar en paralelo y reduce drásticamente los bugs de sincronización de UI ("actualicé el dato pero
olvidé actualizar el span").
