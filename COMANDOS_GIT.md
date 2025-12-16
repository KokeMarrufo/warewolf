# 🐙 COMANDOS GIT PARA ESTE PROYECTO

## ✅ YA HECHO PARA TI

El repositorio Git ya está inicializado y listo. Solo necesitas:

1. Crear un repositorio en GitHub
2. Conectarlo
3. Hacer push

---

## 📋 Comandos que Necesitarás

### 1️⃣ Crear Repositorio en GitHub

Ve a: [https://github.com/new](https://github.com/new)

Configuración:
```
Repository name: juego-del-lobo
Description: Juego del Lobo (Werewolf/Mafia) para jugar presencialmente
Private: ✅ (si quieres)
NO marques "Initialize with README"
```

---

### 2️⃣ Conectar con GitHub

Después de crear el repo en GitHub, ejecuta:

```bash
cd "/Users/jorgemarrufo/Documents/AI projects/Games/Lobo"

# Conectar con tu repositorio
git remote add origin https://github.com/TU_USUARIO/juego-del-lobo.git

# Verificar que se conectó
git remote -v
```

---

### 3️⃣ Subir el Código (Primera vez)

```bash
git push -u origin main
```

Si pide credenciales:
- **Usuario:** Tu usuario de GitHub
- **Contraseña:** Usa un Personal Access Token (no tu contraseña)
  - Ve a: GitHub → Settings → Developer settings → Personal access tokens
  - Generate new token (classic)
  - Selecciona scope: `repo`
  - Copia el token y úsalo como contraseña

---

### 4️⃣ Ver el Estado del Repositorio

```bash
# Ver qué archivos han cambiado
git status

# Ver el historial de commits
git log --oneline

# Ver qué archivos están siendo ignorados
git status --ignored
```

---

## 🔄 Comandos para el Día a Día

### Cada vez que hagas cambios:

```bash
# 1. Ver qué cambió
git status

# 2. Agregar todos los cambios
git add .

# 3. Hacer commit con mensaje descriptivo
git commit -m "Descripción de lo que hiciste"

# 4. Subir a GitHub
git push
```

### Ejemplo práctico:

```bash
# Hiciste cambios en el código
git status                                    # Ver qué cambió
git add .                                     # Agregar todos
git commit -m "Fix: corregir error en votaciones"
git push                                      # Subir a GitHub
```

---

## 📥 Comandos para Bajar Cambios

Si trabajas desde múltiples computadoras:

```bash
# Bajar los últimos cambios
git pull
```

---

## 🔀 Trabajar con Ramas (Avanzado)

```bash
# Crear una nueva rama para una feature
git checkout -b feature/nueva-funcionalidad

# Ver todas las ramas
git branch

# Cambiar de rama
git checkout main

# Fusionar una rama a main
git checkout main
git merge feature/nueva-funcionalidad

# Subir la rama a GitHub
git push -u origin feature/nueva-funcionalidad
```

---

## 🆘 Comandos de Emergencia

### Deshacer el último commit (pero mantener cambios):

```bash
git reset --soft HEAD~1
```

### Deshacer cambios locales (⚠️ SE PIERDEN):

```bash
# Un archivo específico
git checkout -- archivo.js

# Todos los archivos
git reset --hard HEAD
```

### Ver diferencias antes de commitear:

```bash
git diff
```

### Ignorar archivos temporalmente:

```bash
git update-index --assume-unchanged archivo.js
```

---

## 📋 Verificación del Estado Actual

```bash
# Ver información del repositorio
git status

# Ver el último commit
git log -1

# Ver archivos ignorados
cat .gitignore

# Ver remotes configurados
git remote -v
```

**Salida esperada:**
```
origin  https://github.com/TU_USUARIO/juego-del-lobo.git (fetch)
origin  https://github.com/TU_USUARIO/juego-del-lobo.git (push)
```

---

## 🔒 Archivos que NO se Suben (.gitignore)

Ya está configurado para ignorar:

```bash
node_modules/      # Dependencias (pesado)
.env               # ⚠️ Credenciales (NUNCA subir)
.env.local
dist/              # Build temporal
*.log              # Logs
.DS_Store          # Archivos del sistema
```

### Verificar que .env NO esté en Git:

```bash
git status

# .env NO debe aparecer en la lista
# Si aparece, es que no está en .gitignore
```

---

## 📦 Comandos Útiles Combinados

### Ver historial bonito:

```bash
git log --oneline --graph --all --decorate
```

### Ver quién cambió qué línea:

```bash
git blame archivo.js
```

### Buscar en el historial:

```bash
git log --all --grep="palabra"
```

### Ver tamaño del repositorio:

```bash
git count-objects -vH
```

---

## 🌐 URLs Importantes

**Tu repositorio local:**
```
/Users/jorgemarrufo/Documents/AI projects/Games/Lobo
```

**Tu repositorio en GitHub (después de crearlo):**
```
https://github.com/TU_USUARIO/juego-del-lobo
```

**Clonar tu repo (desde otra computadora):**
```bash
git clone https://github.com/TU_USUARIO/juego-del-lobo.git
```

---

## ✅ Checklist para Subir a GitHub

```bash
# 1. Verificar estado
git status                                    # ✅ Ya hecho

# 2. Crear repo en GitHub
# Ve a https://github.com/new

# 3. Conectar
git remote add origin https://github.com/TU_USUARIO/juego-del-lobo.git

# 4. Verificar conexión
git remote -v

# 5. Subir
git push -u origin main

# 6. Verificar en GitHub
# Abre: https://github.com/TU_USUARIO/juego-del-lobo
```

---

## 🎓 Tips Pro

### Alias útiles:

```bash
# Configurar alias
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"

# Ahora puedes usar:
git st      # en vez de git status
git lg      # para ver historial bonito
```

### Configurar tu información:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Ver toda tu configuración:

```bash
git config --list
```

---

## 📚 Recursos

- **Guía completa de Git:** [SUBIR_A_GITHUB.md](SUBIR_A_GITHUB.md)
- **Documentación oficial:** [git-scm.com](https://git-scm.com)
- **GitHub Desktop:** [desktop.github.com](https://desktop.github.com)

---

## 🎉 ¡Listo para GitHub!

Tu repositorio está inicializado y listo. Solo falta:

1. ✅ Git inicializado
2. ✅ Primer commit hecho
3. ⏳ Crear repo en GitHub
4. ⏳ Conectar y hacer push

**Sigue la guía:** [SUBIR_A_GITHUB.md](SUBIR_A_GITHUB.md)

🐺🎮

