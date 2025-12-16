# 🐙 SUBIR PROYECTO A GITHUB - PASO A PASO

## 📋 Guía Completa

### Opción 1: Usando GitHub Desktop (MÁS FÁCIL) 👍

#### Paso 1: Descargar GitHub Desktop

1. Ve a: [https://desktop.github.com](https://desktop.github.com)
2. Descarga para Mac
3. Instala la aplicación
4. Abre GitHub Desktop
5. Inicia sesión con tu cuenta de GitHub

#### Paso 2: Agregar el Repositorio

1. En GitHub Desktop, haz clic en **"File"** → **"Add Local Repository"**

2. Haz clic en **"Choose..."**

3. Navega a tu carpeta del proyecto:
   ```
   /Users/jorgemarrufo/Documents/AI projects/Games/Lobo
   ```

4. Haz clic en **"Add Repository"**

5. Si dice "This directory does not appear to be a Git repository":
   - Haz clic en **"Create a Repository"**
   - Desmarca "Initialize with README" (ya tenemos uno)
   - Haz clic en **"Create Repository"**

#### Paso 3: Hacer el Primer Commit

1. Verás una lista de archivos en la columna izquierda

2. En la caja de texto abajo (Summary), escribe:
   ```
   Initial commit - Juego del Lobo completo
   ```

3. En la caja grande (Description), puedes escribir:
   ```
   - App Narrador completa
   - App Jugador completa
   - 5 roles implementados
   - Documentación completa
   - Schema de Supabase
   ```

4. Haz clic en **"Commit to main"**

#### Paso 4: Publicar en GitHub

1. Haz clic en **"Publish repository"** (arriba)

2. Completa la información:
   ```
   Name: juego-del-lobo
   Description: Juego del Lobo (Werewolf/Mafia) para jugar presencialmente
   ```

3. **IMPORTANTE:** ✅ Marca "Keep this code private" si quieres que sea privado

4. Haz clic en **"Publish Repository"**

5. ⏳ Espera unos segundos...

6. ✅ ¡Listo! Tu código está en GitHub

#### Paso 5: Ver tu Repositorio

1. En GitHub Desktop, haz clic en **"Repository"** → **"View on GitHub"**

2. Se abrirá tu navegador con el repositorio

---

### Opción 2: Usando la Terminal (PARA EXPERTOS) 💻

#### Paso 1: Inicializar Git (si no está inicializado)

```bash
cd "/Users/jorgemarrufo/Documents/AI projects/Games/Lobo"
git init
```

#### Paso 2: Verificar qué archivos se subirán

```bash
git status
```

Deberías ver archivos en rojo. **Verifica que `.env` NO aparezca** (está en `.gitignore`).

#### Paso 3: Agregar todos los archivos

```bash
git add .
```

#### Paso 4: Hacer el primer commit

```bash
git commit -m "Initial commit - Juego del Lobo completo"
```

#### Paso 5: Crear repositorio en GitHub

1. Ve a: [https://github.com/new](https://github.com/new)

2. Llena:
   ```
   Repository name: juego-del-lobo
   Description: Juego del Lobo (Werewolf/Mafia) para jugar presencialmente
   Private: ✅ (si quieres que sea privado)
   ```

3. **NO marques** "Initialize with README" (ya tenemos uno)

4. Haz clic en **"Create repository"**

#### Paso 6: Conectar y subir

1. Copia los comandos que GitHub te muestra:

```bash
git remote add origin https://github.com/TU_USUARIO/juego-del-lobo.git
git branch -M main
git push -u origin main
```

2. Pega y ejecuta en tu terminal

3. Si pide usuario/contraseña, usa un **Personal Access Token**:
   - Ve a: GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Selecciona scope: `repo`
   - Usa el token como contraseña

4. ✅ ¡Listo! Tu código está en GitHub

---

## ⚠️ IMPORTANTE - Archivos que NO se suben

El archivo `.gitignore` ya está configurado para ignorar:

```bash
# NO se suben (y está bien):
node_modules/        # Dependencias (muy pesado)
.env                 # ⚠️ Credenciales secretas
.env.local
dist/                # Build temporal
*.log                # Logs
.DS_Store            # Archivos del sistema Mac
```

**✅ SÍ se suben:**
```bash
src/                 # Todo tu código
public/              # Archivos públicos
*.md                 # Documentación
package.json         # Lista de dependencias
vite.config.js       # Configuración
tailwind.config.js   # Configuración
SUPABASE_SCHEMA.sql  # Schema de BD
.gitignore           # Este mismo archivo
etc.
```

---

## 🔒 Proteger tus Credenciales

### ⚠️ NUNCA subas el archivo `.env`

**¿Por qué?**
- Contiene tus credenciales de Supabase
- Cualquiera con acceso podría usar tu base de datos
- Puede generar costos no deseados

**¿Qué hacer si lo subiste por accidente?**

1. **Cambiar las credenciales:**
   - Ve a Supabase → Settings → API
   - Regenera tu anon key
   - Actualiza tu `.env` local

2. **Remover del historial de Git:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

---

## 📝 Crear .env.example para GitHub

Es buena práctica subir un archivo de ejemplo:

```bash
# Crear archivo de ejemplo
cat > .env.example << 'EOF'
# Configuración de Supabase
# Copia este archivo a .env y reemplaza con tus valores

VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
EOF
```

Luego:
```bash
git add .env.example
git commit -m "Add .env.example"
git push
```

---

## 🔄 Actualizar el Repositorio

### Cada vez que hagas cambios:

**Con GitHub Desktop:**
1. Abre GitHub Desktop
2. Verás los cambios en la columna izquierda
3. Escribe un mensaje de commit
4. Haz clic en "Commit to main"
5. Haz clic en "Push origin"

**Con Terminal:**
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

---

## 👥 Colaborar con Otros

### Invitar colaboradores:

1. Ve a tu repo en GitHub
2. Settings → Collaborators
3. Add people
4. Ingresa su usuario de GitHub
5. Enviar invitación

### Para que otros clonen tu proyecto:

```bash
git clone https://github.com/TU_USUARIO/juego-del-lobo.git
cd juego-del-lobo
npm install
```

Luego deben:
1. Crear su propio `.env` con sus credenciales
2. Configurar su propio proyecto de Supabase
3. O usar el tuyo (compartiendo credenciales de forma segura)

---

## 📚 Mejorar el README.md en GitHub

GitHub mostrará tu `README.md` en la página principal. Ya está incluido y completo, pero puedes agregar:

### Badges (opcional):

```markdown
![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)
```

### Screenshot (opcional):

1. Toma una captura de pantalla del juego
2. Guárdala en `public/screenshots/`
3. Agrégala al README:
   ```markdown
   ![Screenshot](public/screenshots/game.png)
   ```

---

## 🚀 Deploy desde GitHub

### Vercel (Recomendado):

1. Ve a: [https://vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Haz clic en "Import Project"
4. Selecciona tu repositorio
5. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Haz clic en "Deploy"
7. ✅ Tendrás una URL pública

**Auto-deploy:**
- Cada push a main → deploy automático
- No necesitas hacer nada más

### Netlify:

Similar a Vercel:
1. [https://netlify.com](https://netlify.com)
2. Import from GitHub
3. Configurar env vars
4. Deploy

---

## 📊 .gitignore Explicado

```bash
# Dependencias de Node
node_modules/           # ~200MB de librerías
                        # Se reinstalan con npm install

# Variables de entorno
.env                    # ⚠️ Credenciales secretas
.env.local              # Variantes locales

# Build
dist/                   # Resultado de npm run build
dist-ssr/               # Build server-side

# Logs
*.log                   # Archivos de error
npm-debug.log*

# Sistema operativo
.DS_Store               # Mac
Thumbs.db               # Windows
*.sw?                   # Vim swap files

# Editor
.vscode/*               # Configuración de VS Code
.idea/                  # JetBrains IDEs
```

---

## ✅ Checklist Final

Antes de subir a GitHub:

- [ ] `.gitignore` está en la raíz
- [ ] `.env` NO está en el repositorio
- [ ] `node_modules/` NO está en el repositorio
- [ ] Todos los archivos de código están incluidos
- [ ] `README.md` está completo
- [ ] `package.json` tiene toda la info
- [ ] Has probado que el código funciona

---

## 🎉 ¡LISTO!

Tu proyecto está en GitHub y listo para:
- ✅ Compartir con otros
- ✅ Colaborar en equipo  
- ✅ Deploy automático
- ✅ Control de versiones
- ✅ Backup en la nube

---

## 🔗 URLs Importantes

- **Tu repositorio:** `https://github.com/TU_USUARIO/juego-del-lobo`
- **Supabase:** `https://supabase.com/dashboard`
- **GitHub Desktop:** `https://desktop.github.com`
- **Vercel:** `https://vercel.com`

---

**¿Dudas?** Lee la documentación en el repositorio 📚

**¡A jugar! 🐺🎮**

