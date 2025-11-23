# 05. Decorator Pattern

El patrón **Decorator** permite añadir funcionalidades a un objeto dinámicamente sin afectar a otros objetos de la misma
clase. Es una alternativa flexible a la herencia.

En JavaScript, usamos este patrón constantemente con **Higher-Order Functions (HOF)**.

---

## 1. El Concepto

Imagina un café.

- Café base.
- Decorador: Con leche.
- Decorador: Con azúcar.
- Decorador: Con vainilla.

Puedes combinar "Café con leche y vainilla" sin crear una clase `CafeConLecheYVainilla`.

---

## 2. Implementación Funcional (HOF)

```javascript
// Objeto base
function crearUsuario(nombre) {
    return {
        nombre,
        getPermisos: () => ["lectura"],
    };
}

// Decorador 1: Hacer Admin
function hacerAdmin(usuario) {
    const permisosOriginales = usuario.getPermisos();
    usuario.getPermisos = () => [...permisosOriginales, "escritura", "borrado"];
    return usuario;
}

// Decorador 2: Añadir Log
function conLog(usuario) {
    const original = usuario.getPermisos;
    usuario.getPermisos = () => {
        console.log(`Consultando permisos de ${usuario.nombre}...`);
        return original();
    };
    return usuario;
}
```

### Uso

```javascript
let user = crearUsuario("Carlos");
user = hacerAdmin(user);
user = conLog(user);

console.log(user.getPermisos());
// Output:
// "Consultando permisos de Carlos..."
// ['lectura', 'escritura', 'borrado']
```

---

## 3. ES Decorators (Experimental)

En el mundo de clases (TypeScript, Angular, NestJS), existe una sintaxis especial `@decorator` (actualmente en Stage 3
de TC39).

```javascript
// Ejemplo conceptual (requiere Babel/TS)
class User {
    @readonly getName() {
        return "Carlos";
    }
}

function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}
```

---

## 4. Conclusión

El patrón Decorator cumple con el principio **Open/Closed**: Las clases están abiertas a la extensión (vía decoradores)
pero cerradas a la modificación (no tocas el código original).
