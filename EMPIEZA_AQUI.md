# 🎮 EMPIEZA AQUÍ

## 👋 Bienvenido al Juego del Lobo

Este es un juego de Werewolf/Mafia para jugar **presencialmente** con múltiples dispositivos.

---

## 📚 ¿Qué documento leer?

### 🚀 Quiero empezar YA (5 minutos)
👉 Lee **[QUICK_START.md](QUICK_START.md)**

Configuración express en 3 pasos:
1. Configurar Supabase
2. Configurar .env
3. Iniciar la app

---

### 📖 Quiero instrucciones detalladas (15 minutos)
👉 Lee **[INSTRUCCIONES.md](INSTRUCCIONES.md)**

Guía completa con:
- Configuración paso a paso
- Múltiples opciones de juego
- Troubleshooting detallado
- Deploy opcional

---

### ⚙️ Tengo problemas con el .env
👉 Lee **[ENV_SETUP.md](ENV_SETUP.md)**

Configuración específica de Supabase:
- Cómo obtener las credenciales
- Formato correcto del archivo
- Errores comunes
- Verificación manual

---

### ✅ Quiero verificar que todo funcione
👉 Lee **[CHECKLIST.md](CHECKLIST.md)**

Lista de verificación completa:
- Instalación ✓
- Supabase ✓
- .env ✓
- Servidor ✓
- Prueba básica ✓

---

### 📱 Quiero entender cómo funciona
👉 Lee **[README.md](README.md)**

Documentación completa:
- Características
- Roles del juego
- Tech stack
- Estructura del proyecto

---

### 🔧 Soy desarrollador y quiero entender la arquitectura
👉 Lee **[NOTAS_TECNICAS.md](NOTAS_TECNICAS.md)**

Detalles técnicos:
- Arquitectura sin sockets
- Polling estratégico
- Estado persistente
- Escalabilidad

---

### 🎉 Quiero ver un resumen de todo
👉 Lee **[RESUMEN_COMPLETO.md](RESUMEN_COMPLETO.md)**

Overview completo:
- Estructura del proyecto
- Todas las funcionalidades
- Próximos pasos
- Documentación

---

## 🎯 Flujo Recomendado

### Primera vez:

```
1. QUICK_START.md     (configurar)
   ↓
2. CHECKLIST.md       (verificar)
   ↓
3. ¡A JUGAR! 🎮
```

### Si tienes problemas:

```
1. CHECKLIST.md       (verificar qué falla)
   ↓
2. ENV_SETUP.md       (si es problema de .env)
   ↓
3. INSTRUCCIONES.md   (troubleshooting detallado)
```

### Si quieres aprender más:

```
1. README.md          (documentación general)
   ↓
2. NOTAS_TECNICAS.md  (arquitectura)
   ↓
3. Código fuente      (implementación)
```

---

## ⚡ Quick Commands

```bash
# Instalar dependencias (primera vez)
npm install

# Iniciar en localhost
npm run dev

# Iniciar para múltiples dispositivos en WiFi
npm run dev:host

# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 📁 Archivos Importantes

### Documentación
- 🚀 **QUICK_START.md** - Inicio rápido
- 📖 **INSTRUCCIONES.md** - Guía completa
- ⚙️ **ENV_SETUP.md** - Configurar .env
- ✅ **CHECKLIST.md** - Verificación
- 📱 **README.md** - Documentación principal
- 🔧 **NOTAS_TECNICAS.md** - Arquitectura
- 🎉 **RESUMEN_COMPLETO.md** - Overview

### Configuración
- 📄 **package.json** - Dependencias
- ⚙️ **.env** - Credenciales de Supabase (EDITAR AQUÍ)
- 🗄️ **SUPABASE_SCHEMA.sql** - Schema de BD

### Código
- **src/pages/** - Páginas principales
- **src/components/** - Componentes React
- **src/utils/** - Lógica del juego

---

## 🎮 ¿Qué es el Juego del Lobo?

Un juego de rol social donde:
- **Lobos** 🐺 intentan eliminar a todos los aldeanos
- **Aldeanos** 👤 intentan descubrir y eliminar a los lobos
- **Roles especiales** (Vidente, Doctor, Cazador) ayudan a los aldeanos

### Roles Disponibles:
- 🐺 **Lobo** - Mata aldeanos cada noche
- 👁️ **Vidente** - Investiga a un jugador cada noche
- ⚕️ **Doctor** - Protege a un jugador cada noche
- 🏹 **Cazador** - Si muere, se lleva a alguien
- 👤 **Aldeano** - Vota durante el día

---

## 💡 Características Únicas

✅ **Sin WebSockets** - Más robusto, sin desconexiones  
✅ **Sin sincronización** durante el juego - Los jugadores solo ven su rol  
✅ **Estado persistente** - Se recupera si cierras la app  
✅ **Mobile-first** - Optimizado para celulares  
✅ **QR Codes** - Únete escaneando  
✅ **Guía narrativa** - El narrador sigue pasos claros  

---

## 🆘 Ayuda Rápida

**¿No arranca?**
→ Verifica que ejecutaste `npm install`

**¿"Error al crear partida"?**
→ Lee [ENV_SETUP.md](ENV_SETUP.md)

**¿Los celulares no conectan?**
→ Usa `npm run dev:host` y verifica WiFi

**¿Otra cosa?**
→ Lee [CHECKLIST.md](CHECKLIST.md)

---

## 🎯 Objetivo

Crear un ambiente perfecto para jugar al Lobo **presencialmente**:
- Narrador en tablet/laptop
- Jugadores con sus celulares
- Sin complicaciones técnicas
- Simplemente jugar y divertirse 🎉

---

## 🚀 EMPIEZA AHORA

### Opción 1: Modo Express (5 min)
```bash
# 1. Configura Supabase (lee QUICK_START.md punto 1)
# 2. Edita .env con tus credenciales
# 3. Inicia
npm run dev
```

### Opción 2: Modo Completo (15 min)
```bash
# Lee INSTRUCCIONES.md y sigue todos los pasos
```

---

**¡Que empiece el juego! 🐺🎮🎉**

Reúne a tus amigos, asigna roles, y descubre quién es el lobo antes de que sea demasiado tarde...

