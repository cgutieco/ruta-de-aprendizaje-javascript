# 07. CI/CD - Buenas Prácticas

**CI/CD (Continuous Integration / Continuous Deployment)** automatiza testing, build y deploy.

---

## 1. ¿Qué es CI/CD?

- **CI (Continuous Integration):** Integrar código frecuentemente, ejecutar tests automáticamente.
- **CD (Continuous Deployment):** Deploy automático a producción cuando los tests pasan.

---

## 2. GitHub Actions

### Workflow Básico

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

---

## 3. Deploy Automático

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: "./dist"
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 4. Secrets

```bash
# GitHub: Settings → Secrets and variables → Actions
NETLIFY_AUTH_TOKEN=your-token
NETLIFY_SITE_ID=your-site-id
VITE_API_URL=https://api.myapp.com
```

---

## 5. Matrix Testing

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest, macos-latest ]
        node-version: [ 18, 20 ]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

---

## 6. Caché de Dependencias

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm" # Cachea node_modules

- name: Install dependencies
  run: npm ci # Más rápido que npm install
```

---

## 7. Conditional Steps

```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: npm run deploy

- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: npm run deploy:staging
```

---

## 8. Notificaciones

```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: "Build failed!"
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 9. Buenas Prácticas

### Fail Fast

```yaml
jobs:
  test:
    strategy:
      fail-fast: true # Detener si un job falla
```

### Timeout

```yaml
jobs:
  test:
    timeout-minutes: 10 # Cancelar si tarda más de 10 min
```

### Artifacts

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: dist
    path: dist/
```

### Coverage

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

---

## 10. Workflow Completo

```yaml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: "./dist"
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 11. Otras Plataformas CI/CD

- **GitLab CI:** `.gitlab-ci.yml`
- **CircleCI:** `.circleci/config.yml`
- **Travis CI:** `.travis.yml`

---

## 12. Conclusión

**Checklist CI/CD:**

- ✅ Lint en cada push
- ✅ Tests automáticos
- ✅ Build verification
- ✅ Deploy automático a staging
- ✅ Deploy manual a producción (o automático si tests pasan)
- ✅ Notificaciones de fallos
- ✅ Caché de dependencias
- ✅ Secrets seguros
