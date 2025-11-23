# 05. Error Boundaries (Conceptual React)

En React, un error en un componente puede romper toda la aplicación. Los **Error Boundaries** capturan errores en el
árbol de componentes y muestran una UI de fallback.

---

## 1. El Problema

```jsx
function App() {
    return (
        <div>
            <Header/>
            <ProblematicComponent/> {/* Si esto explota, toda la app se rompe */}
            <Footer/>
        </div>
    );
}
```

---

## 2. Error Boundary (Solo Class Components)

React no permite Error Boundaries con componentes funcionales (hasta React 18). Debes usar clases.

```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false, error: null};
    }

    static getDerivedStateFromError(error) {
        // Actualizar estado para que el siguiente render muestre el fallback
        return {hasError: true, error};
    }

    componentDidCatch(error, errorInfo) {
        // Puedes loguear el error a un servicio
        console.error("Error capturado:", error, errorInfo);
        logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // UI de fallback
            return (
                <div>
                    <h1>Algo salió mal 😔</h1>
                    <button onClick={() => window.location.reload()}>
                        Recargar página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
```

---

## 3. Uso

Envuelves partes de tu app:

```jsx
function App() {
    return (
        <div>
            <Header/>
            <ErrorBoundary>
                <ProblematicComponent/> {/* Si explota, solo esta sección falla */}
            </ErrorBoundary>
            <Footer/>
        </div>
    );
}
```

---

## 4. Limitaciones

Los Error Boundaries **NO capturan**:

- Errores en event handlers (usa try/catch ahí).
- Errores asíncronos (setTimeout, Promises).
- Errores en el propio Error Boundary.
- Errores en Server-Side Rendering (SSR).

---

## 5. Alternativa Moderna: `react-error-boundary`

Librería que simplifica esto y soporta hooks.

```jsx
import {ErrorBoundary} from "react-error-boundary";

function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <div>
            <h1>Error: {error.message}</h1>
            <button onClick={resetErrorBoundary}>Reintentar</button>
        </div>
    );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
    <MyComponent/>
</ErrorBoundary>;
```
