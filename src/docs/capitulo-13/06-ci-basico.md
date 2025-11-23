# 06. CI Básico (Continuous Integration)

**CI (Integración Continua)** ejecuta tus tests automáticamente en cada commit. Si los tests fallan, bloquea el merge.
Esto previene que código roto llegue a producción.

---

## 1. ¿Qué es CI?

Cada vez que haces push a GitHub:

1. Un servidor (runner) clona tu repositorio.
2. Instala dependencias.
3. Ejecuta los tests.
4. Si fallan, te notifica (email, PR check).

---

## 2. GitHub Actions (Ejemplo)

Crea `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Check coverage
        run: npm run coverage
```

---

## 3. Quality Gates (Puertas de Calidad)

Puedes bloquear merges si:

- Los tests fallan.
- La cobertura baja del 80%.
- El linter tiene errores.

```yaml
- name: Check coverage threshold
  run: |
    npm run coverage -- --threshold.lines=80
```

---

## 4. Branch Protection (GitHub)

En la configuración del repo:

- Settings → Branches → Add rule.
- Require status checks to pass (selecciona "Tests").
- Ahora no se puede mergear un PR si los tests fallan.

---

## 5. Otros Proveedores de CI

- **GitLab CI:** Similar a GitHub Actions.
- **CircleCI, Travis CI:** Servicios especializados.
- **Jenkins:** Auto-hospedado, muy configurable.

---

## 6. Ejecutar Tests Solo en Archivos Cambiados

Para repos grandes, ejecutar TODOS los tests en cada commit es lento.

```yaml
- name: Run tests on changed files
  run: npx vitest --changed
```

---

## 7. Ejemplo Completo: CI con Cache

```yaml
name: CI

on: [ push, pull_request ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm" # Cachear node_modules

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 8. Beneficios de CI

1. **Detectar bugs temprano:** Antes de que lleguen a main.
2. **Refactoring seguro:** Si rompes algo, te enteras inmediatamente.
3. **Colaboración:** Todos saben que el código en main funciona.
4. **Documentación:** Ver qué tests pasan es una forma de documentación.

---

## 9. Conclusión

CI no es opcional en equipos profesionales. Es la red de seguridad que permite mover rápido sin romper cosas.
