# 09. Seguridad de Dependencias

Las dependencias de npm son un vector de ataque común. Un paquete comprometido puede robar datos o inyectar código
malicioso.

---

## 1. npm audit

```bash
npm audit

# Ver detalles
npm audit --json

# Intentar arreglar automáticamente
npm audit fix

# Arreglar incluso con breaking changes
npm audit fix --force
```

---

## 2. Dependencias Directas vs Transitivas

```json
{
  "dependencies": {
    "express": "^4.18.0"
    // Directa
  }
}
```

`express` tiene sus propias dependencias (transitivas). Vulnerabilidades pueden estar ahí.

```bash
# Ver árbol completo
npm ls

# Ver solo dependencias de producción
npm ls --prod
```

---

## 3. Lock Files

```bash
# package-lock.json (npm)
# yarn.lock (yarn)
# pnpm-lock.yaml (pnpm)
```

**Siempre commitear lock files.** Garantizan que todos instalen las mismas versiones.

```bash
# Instalar exactamente lo que dice el lock file
npm ci
```

---

## 4. Versiones Exactas vs Rangos

```json
{
  "dependencies": {
    "lodash": "4.17.21",
    // ✅ Versión exacta
    "react": "^18.2.0",
    // ⚠️ Permite 18.x.x
    "vue": "~3.2.45"
    // ⚠️ Permite 3.2.x
  }
}
```

**Para producción:** Considera versiones exactas para dependencias críticas.

---

## 5. Revisar Paquetes Antes de Instalar

```bash
# Ver información del paquete
npm info lodash

# Ver dependencias
npm info lodash dependencies

# Ver quién mantiene el paquete
npm info lodash maintainers

# Ver cuándo fue la última actualización
npm info lodash time
```

**Señales de alerta:**

- Paquete con pocas descargas.
- Última actualización hace años.
- Mantenedor desconocido.
- Muchas dependencias transitivas.

---

## 6. Snyk y Otras Herramientas

```bash
# Snyk
npm install -g snyk
snyk test
snyk monitor

# Socket.dev
npx socket npm audit
```

---

## 7. Supply Chain Attacks

### Typosquatting

```bash
# ❌ Paquete malicioso
npm install reacct  # Nota el typo

# ✅ Paquete legítimo
npm install react
```

### Dependency Confusion

Atacantes publican paquetes con el mismo nombre que paquetes privados internos.

**Prevención:**

```bash
# Usar scopes para paquetes privados
@mycompany/internal-lib
```

---

## 8. Minimizar Dependencias

```bash
# Ver tamaño de node_modules
du -sh node_modules

# Analizar qué paquetes ocupan más
npx npkill
```

**Regla:** Menos dependencias = menos superficie de ataque.

---

## 9. Renovate / Dependabot

Automatiza actualizaciones de dependencias.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## 10. Verificar Integridad con npm

```bash
# Verificar que los paquetes no fueron modificados
npm audit signatures
```

---

## 11. Políticas de Seguridad

```json
// .npmrc
audit-level=moderate
```

```bash
# Fallar el build si hay vulnerabilidades
npm audit --audit-level=moderate
```

---

## 12. Conclusión

**Checklist:**

- ✅ Ejecutar `npm audit` regularmente
- ✅ Commitear lock files
- ✅ Revisar paquetes antes de instalar
- ✅ Minimizar dependencias
- ✅ Usar herramientas como Snyk
- ✅ Automatizar actualizaciones con Dependabot
- ✅ Desconfiar de paquetes con typos
