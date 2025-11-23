# 02. Organización: Features vs Layers

Una de las primeras decisiones de arquitectura es: ¿Cómo organizo mis carpetas? No hay una respuesta única, pero hay dos
estrategias dominantes.

---

## 1. Organización por Capas (Layer-based)

Agrupar archivos por su **rol técnico**. Es el estándar en frameworks MVC clásicos (Rails, Django, Express viejos).

```text
src/
├── controllers/
│   ├── UserController.js
│   ├── ProductController.js
├── models/
│   ├── User.js
│   ├── Product.js
├── views/
│   ├── UserView.js
│   ├── ProductView.js
```

### ✅ Pros

- Fácil de entender para principiantes ("¿Dónde están los modelos? En `models/`").
- Estructura predecible.

### ❌ Contras

- **Baja cohesión:** Para cambiar algo del "Usuario", tienes que saltar entre 3 carpetas diferentes.
- **Escalabilidad:** En apps grandes, la carpeta `controllers` termina con 500 archivos.

---

## 2. Organización por Funcionalidad (Feature-based)

Agrupar archivos por **dominio de negocio**. También llamada "Screaming Architecture" (la estructura "grita" de qué
trata la app).

```text
src/
├── users/
│   ├── UserController.js
│   ├── User.js
│   ├── UserView.js
├── products/
│   ├── ProductController.js
│   ├── Product.js
│   ├── ProductView.js
├── auth/
```

### ✅ Pros

- **Alta cohesión:** Todo lo relacionado con "Usuarios" está junto.
- **Escalabilidad:** Puedes extraer la carpeta `users` a un microservicio o paquete npm fácilmente.
- **Navegación:** Sabes exactamente dónde buscar si hay un bug en "Productos".

### ❌ Contras

- Puede ser confuso decidir dónde poner código compartido (¿`common`? ¿`shared`?).

---

## 3. El Híbrido (Recomendado)

Para aplicaciones modernas (React, Vue, Node.js), se suele usar una mezcla: Feature-based para el dominio, y carpetas
técnicas para lo transversal (`components`, `hooks`, `utils`).

```text
src/
├── features/          <-- Dominio
│   ├── auth/
│   ├── cart/
├── components/        <-- UI Reutilizable (Botones, Inputs)
├── hooks/             <-- Lógica reutilizable
├── utils/             <-- Helpers puros
```

---

## 4. Conclusión

Para proyectos pequeños, **Layers** está bien. Para proyectos serios que planean crecer, **Features** (o el híbrido) es
casi obligatorio para mantener la cordura mental del equipo.
