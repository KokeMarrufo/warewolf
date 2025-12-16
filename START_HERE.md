# 🚀 START HERE - SETUP RÁPIDO

## 📋 TODO LO QUE NECESITAS EN UN LUGAR

### ✅ PASO 1: Instalar Dependencias (1 minuto)

```bash
npm install
```

---

### ✅ PASO 2: Configurar Supabase (5 minutos)

📖 **Sigue la guía detallada:** [SETUP_SUPABASE_PASO_A_PASO.md](SETUP_SUPABASE_PASO_A_PASO.md)

**Resumen rápido:**

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un proyecto nuevo
3. En SQL Editor, ejecuta todo el contenido de `SUPABASE_SCHEMA.sql`
4. Ve a Settings → API y copia:
   - Project URL
   - anon/public key

---

### ✅ PASO 3: Configurar .env (2 minutos)

**Opción A: Copiar el ejemplo**
```bash
cp .env.example .env
```

**Opción B: Crear manualmente**
```bash
# Crea un archivo llamado .env en la raíz
# y pega esto:

VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Reemplaza** con tus credenciales de Supabase.

---

### ✅ PASO 4: Iniciar la App (30 segundos)

**Para jugar en localhost:**
```bash
npm run dev
```
Abre: `http://localhost:3000`

**Para jugar con celulares en WiFi:**
```bash
npm run dev:host
```
Abre en computadora: `http://localhost:3000`  
Abre en celulares: `http://TU_IP:3000` (ej: `http://192.168.1.10:3000`)

---

### ✅ PASO 5: Probar que Funciona (1 minuto)

1. Abre `http://localhost:3000`
2. Haz clic en "SOY NARRADOR"
3. Haz clic en "Nueva Partida"
4. ¿Ves un código como "LOBO42"? ✅ **¡FUNCIONA!**

---

### ✅ PASO 6 (Opcional): Subir a GitHub (5 minutos)

📖 **Sigue la guía detallada:** [SUBIR_A_GITHUB.md](SUBIR_A_GITHUB.md)

**Resumen rápido:**

**Opción 1: GitHub Desktop (más fácil)**
1. Descarga [GitHub Desktop](https://desktop.github.com)
2. File → Add Local Repository
3. Commit to main
4. Publish repository

**Opción 2: Terminal**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/juego-del-lobo.git
git push -u origin main
```

---

## 📚 Documentación Disponible

| Documento | Para qué sirve | Tiempo |
|-----------|----------------|--------|
| [EMPIEZA_AQUI.md](EMPIEZA_AQUI.md) | 🎯 Índice de toda la documentación | 2 min |
| [SETUP_SUPABASE_PASO_A_PASO.md](SETUP_SUPABASE_PASO_A_PASO.md) | 🗄️ Configurar Supabase con capturas | 5 min |
| [SUBIR_A_GITHUB.md](SUBIR_A_GITHUB.md) | 🐙 Subir el proyecto a GitHub | 5 min |
| [QUICK_START.md](QUICK_START.md) | 🚀 Inicio rápido (3 pasos) | 3 min |
| [INSTRUCCIONES.md](INSTRUCCIONES.md) | 📖 Guía completa paso a paso | 15 min |
| [ENV_SETUP.md](ENV_SETUP.md) | ⚙️ Configurar archivo .env | 3 min |
| [CHECKLIST.md](CHECKLIST.md) | ✅ Verificar que todo funcione | 5 min |
| [README.md](README.md) | 📱 Documentación del proyecto | 10 min |
| [NOTAS_TECNICAS.md](NOTAS_TECNICAS.md) | 🔧 Arquitectura técnica | 20 min |
| [ESTRUCTURA_VISUAL.md](ESTRUCTURA_VISUAL.md) | 📊 Diagramas y estructura | 10 min |

---

## 🆘 Problemas Comunes

### ❌ "Error al crear la partida"
→ Lee [ENV_SETUP.md](ENV_SETUP.md) para configurar bien Supabase

### ❌ "Los celulares no conectan"
→ Usa `npm run dev:host` y verifica que estén en la misma WiFi

### ❌ "relation 'rooms' does not exist"
→ Ejecuta el `SUPABASE_SCHEMA.sql` completo en Supabase

### ❌ Otro problema
→ Lee [CHECKLIST.md](CHECKLIST.md) para diagnosticar

---

## 🎮 ¿Cómo se Juega?

### **Narrador** (Desktop/Tablet):
1. Crea nueva partida → obtén código
2. Los jugadores se unen con el código
3. Asigna roles
4. Inicia el juego
5. Sigue la guía narrativa paso a paso

### **Jugadores** (Celular):
1. Ingresa código + nombre
2. Espera...
3. Ve tu rol asignado
4. ¡Mantén el celular a mano!

---

## 🎯 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Desarrollo con red local (WiFi)
npm run dev:host

# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 🔑 Archivos Importantes

```
.env                           ← TUS CREDENCIALES (crear manualmente)
.env.example                   ← Plantilla del .env
SUPABASE_SCHEMA.sql            ← Ejecutar en Supabase
package.json                   ← Dependencias
src/                           ← Todo el código
```

---

## ✅ Checklist Rápido

```
□ npm install ejecutado
□ Proyecto Supabase creado
□ SUPABASE_SCHEMA.sql ejecutado
□ Archivo .env creado con credenciales
□ npm run dev funciona
□ Puedo crear una partida
```

---

## 🎉 ¡TODO LISTO!

Si completaste los 5 pasos, estás listo para jugar.

**Reúne a tus amigos y disfruta del Juego del Lobo! 🐺🎮**

---

## 💡 Tips

- **Primera vez:** Lee [SETUP_SUPABASE_PASO_A_PASO.md](SETUP_SUPABASE_PASO_A_PASO.md)
- **Para GitHub:** Lee [SUBIR_A_GITHUB.md](SUBIR_A_GITHUB.md)
- **Dudas:** Lee [EMPIEZA_AQUI.md](EMPIEZA_AQUI.md) para el índice completo

---

**Creado con ❤️ para jugar presencialmente**

