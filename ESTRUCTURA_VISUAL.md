# 📊 ESTRUCTURA VISUAL DEL PROYECTO

## 🗂️ Árbol de Archivos Completo

```
Lobo/
│
├── 📚 DOCUMENTACIÓN (Lee esto primero)
│   ├── 🎯 EMPIEZA_AQUI.md         ← COMIENZA AQUÍ
│   ├── 🚀 QUICK_START.md          (5 min - inicio rápido)
│   ├── 📖 INSTRUCCIONES.md        (15 min - guía completa)
│   ├── ⚙️ ENV_SETUP.md            (configurar .env)
│   ├── ✅ CHECKLIST.md            (verificación)
│   ├── 📱 README.md               (documentación principal)
│   ├── 🔧 NOTAS_TECNICAS.md       (arquitectura)
│   ├── 🎉 RESUMEN_COMPLETO.md     (overview)
│   └── 📊 ESTRUCTURA_VISUAL.md    (este archivo)
│
├── ⚙️ CONFIGURACIÓN
│   ├── .env                       ← EDITAR CON TUS CREDENCIALES
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── 🗄️ BASE DE DATOS
│   └── SUPABASE_SCHEMA.sql        ← EJECUTAR EN SUPABASE
│
├── 🎨 FRONTEND
│   ├── index.html
│   │
│   ├── public/
│   │   └── wolf-icon.svg
│   │
│   └── src/
│       ├── main.jsx               (entry point)
│       ├── App.jsx                (router)
│       ├── index.css              (estilos globales)
│       │
│       ├── 📄 pages/              (pantallas principales)
│       │   ├── Home.jsx           → Selección Narrador/Jugador
│       │   ├── Narrator.jsx       → App completa del Narrador
│       │   └── Player.jsx         → App completa del Jugador
│       │
│       ├── 🧩 components/         (componentes reutilizables)
│       │   └── narrator/
│       │       ├── SetupView.jsx       → Setup de partida
│       │       ├── GameView.jsx        → Vista principal del juego
│       │       ├── NightPhase.jsx      → Fase de noche
│       │       ├── DayPhase.jsx        → Fase de día
│       │       └── VictoryView.jsx     → Pantalla de victoria
│       │
│       ├── 🛠️ utils/              (lógica del juego)
│       │   ├── roles.js           → Manejo de roles
│       │   └── gameLogic.js       → Lógica del juego
│       │
│       └── 📚 lib/                (librerías)
│           └── supabase.js        → Cliente de Supabase
│
└── 📦 node_modules/               (dependencias instaladas)
```

---

## 🎯 FLUJO DE NAVEGACIÓN

### 1️⃣ Pantalla de Inicio (`Home.jsx`)

```
┌─────────────────────────────────┐
│     🐺 JUEGO DEL LOBO          │
├─────────────────────────────────┤
│                                 │
│   [👑 SOY NARRADOR]            │
│                                 │
│   [👥 SOY JUGADOR]             │
│                                 │
└─────────────────────────────────┘
```

---

### 2️⃣ APP NARRADOR (`Narrator.jsx`)

#### A) Setup (`SetupView.jsx`)
```
┌─────────────────────────────────┐
│  Código: LOBO42    [QR Code]   │
├─────────────────────────────────┤
│  Jugadores (3):                 │
│  ☑️ Juan                        │
│  ☑️ María                       │
│  ☐ Pedro                        │
├─────────────────────────────────┤
│  [Asignar Roles]                │
│  [Iniciar Juego]                │
└─────────────────────────────────┘
```

#### B) Juego - Fase Noche (`NightPhase.jsx`)
```
┌─────────────────────────────────┐
│  🌙 NOCHE 1                     │
├─────────────────────────────────┤
│  GUÍA NARRATIVA:                │
│  ✅ Todos duermen               │
│  ▶️ Lobos despiertan            │
│  ☐ Vidente despierta            │
│  ☐ Doctor despierta             │
│  ☐ Amanecer                     │
├─────────────────────────────────┤
│  Víctima de lobos:              │
│  [Selector de jugadores]        │
│  [Confirmar →]                  │
└─────────────────────────────────┘
```

#### C) Juego - Fase Día (`DayPhase.jsx`)
```
┌─────────────────────────────────┐
│  ☀️ DÍA 1                       │
├─────────────────────────────────┤
│  💀 María ha muerto             │
├─────────────────────────────────┤
│  VOTACIÓN:                      │
│  Juan:    [- 0 +]               │
│  Pedro:   [- 2 +]               │
│  Ana:     [- 1 +]               │
├─────────────────────────────────┤
│  [⚖️ Ejecutar al más votado]    │
└─────────────────────────────────┘
```

#### D) Victoria (`VictoryView.jsx`)
```
┌─────────────────────────────────┐
│         🎉                      │
│   ¡ALDEANOS GANAN!              │
├─────────────────────────────────┤
│  REVELACIÓN DE ROLES:           │
│  Juan - Lobo 🐺                 │
│  María - Aldeana 👤 (muerta)    │
│  Pedro - Vidente 👁️             │
├─────────────────────────────────┤
│  [🎮 Nueva Partida]             │
└─────────────────────────────────┘
```

---

### 3️⃣ APP JUGADOR (`Player.jsx`)

#### A) Unirse
```
┌─────────────────┐
│  🐺 LOBO        │
├─────────────────┤
│  Código:        │
│  [____]         │
│                 │
│  Nombre:        │
│  [____]         │
│                 │
│  [UNIRSE]       │
└─────────────────┘
```

#### B) Esperando
```
┌─────────────────┐
│  Sala: LOBO42   │
├─────────────────┤
│  Esperando...   │
│                 │
│  🟢 Conectado   │
└─────────────────┘
```

#### C) Rol Asignado
```
┌─────────────────┐
│  Tu Rol:        │
├─────────────────┤
│      🐺         │
│   ERES LOBO     │
├─────────────────┤
│  Cada noche     │
│  elige víctima  │
│                 │
│  Otros lobos:   │
│  • María        │
└─────────────────┘
```

---

## 🎨 PALETA DE COLORES

```css
/* Noche */
bg-gradient: from-night (1a1a2e) → purple-900 → indigo-900

/* Roles */
🐺 Lobo:     red-600 → red-800
👁️ Vidente:  blue-600 → blue-800
⚕️ Doctor:   green-600 → green-800
🏹 Cazador:  orange-600 → orange-800
👤 Aldeano:  gray-600 → gray-800

/* Estados */
Vivo:       green-50, border-green-300
Muerto:     gray-100, border-gray-300
Activo:     purple-50, border-purple-500
```

---

## 📊 FLUJO DE DATOS

### Setup de Partida

```
NARRADOR                  SUPABASE                JUGADOR
   │                         │                        │
   ├─[Nueva Partida]────────►│                        │
   │◄──────[LOBO42]──────────┤                        │
   │                         │                        │
   │                         │◄────[Unirse LOBO42]────┤
   │                         ├─────[Conectado]───────►│
   │                         │                        │
   │◄──[Polling jugadores]───┤                        │
   ├─[Ve: Juan conectado]    │                        │
   │                         │                        │
   ├─[Asignar Roles]────────►│                        │
   │                         │                        │
   │                         │◄───[Polling rol]───────┤
   │                         ├─────[Eres Lobo]───────►│
   │                         │                        │
   │◄─[Ve: Juan abrió rol]───┤                        │
   │                         │                        │
   ├─[Iniciar Juego]         │                        │
   │                         │                        │
```

### Durante el Juego

```
NARRADOR                  LOCAL STORAGE           JUGADOR
   │                         │                        │
   ├─[Todo el estado]───────►│                        │
   │◄─────[Estado]───────────┤                        │
   │                         │                        │
   │  (Sin comunicación)     │        (Sin comunicación)
   │                         │                        │
   │  [Solo voz]═════════════════════════════════►[Escucha]
```

---

## 🔄 CICLO DE JUEGO

```
┌─────────────────────────────────────────────┐
│                                             │
│  SETUP                                      │
│  ↓                                          │
│  🌙 NOCHE 1                                 │
│  │  1. Todos duermen                        │
│  │  2. Lobos eligen víctima                 │
│  │  3. Vidente investiga                    │
│  │  4. Doctor protege                       │
│  │  5. Amanecer (procesar)                  │
│  ↓                                          │
│  ☀️ DÍA 1                                   │
│  │  1. Anunciar muerte                      │
│  │  2. Discusión                            │
│  │  3. Votación                             │
│  │  4. Ejecución                            │
│  │  5. [Cazador si aplica]                  │
│  ↓                                          │
│  🌙 NOCHE 2                                 │
│  ↓                                          │
│  ☀️ DÍA 2                                   │
│  ↓                                          │
│  ...                                        │
│  ↓                                          │
│  🎉 VICTORIA                                │
│     (Lobos eliminados O Lobos ≥ Aldeanos)  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🗄️ SCHEMA DE BASE DE DATOS

```sql
┌─────────────────────────────────────────┐
│  ROOMS                                  │
├─────────────────────────────────────────┤
│  id (uuid)                              │
│  code (text)              "LOBO42"      │
│  status (text)            "playing"     │
│  num_wolves (int)         2             │
│  include_seer (bool)      true          │
│  include_doctor (bool)    true          │
│  include_hunter (bool)    false         │
└─────────────────────────────────────────┘
           │ 1
           │
           │ N
┌─────────────────────────────────────────┐
│  PLAYERS                                │
├─────────────────────────────────────────┤
│  id (uuid)                              │
│  room_id (uuid)          → rooms.id     │
│  name (text)             "Juan"         │
│  role (text)             "wolf"         │
│  is_alive (bool)         true           │
│  role_opened (bool)      true           │
└─────────────────────────────────────────┘
           │ 1
           │
           │ 1
┌─────────────────────────────────────────┐
│  GAME_STATE                             │
├─────────────────────────────────────────┤
│  id (uuid)                              │
│  room_id (uuid)          → rooms.id     │
│  phase (text)            "night"        │
│  round (int)             1              │
│  current_step (int)      2              │
│  wolf_target (uuid)      → players.id   │
│  seer_target (uuid)      → players.id   │
│  seer_result (text)      "wolf"         │
│  doctor_target (uuid)    → players.id   │
│  history (jsonb)         [...]          │
└─────────────────────────────────────────┘
```

---

## 📦 DEPENDENCIAS

```json
{
  "dependencies": {
    "@supabase/supabase-js": "Cliente de Supabase",
    "react": "Framework UI",
    "react-dom": "React DOM",
    "react-router-dom": "Routing",
    "qrcode.react": "QR Codes"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "Vite + React",
    "tailwindcss": "Estilos CSS",
    "autoprefixer": "PostCSS",
    "postcss": "Procesador CSS",
    "vite": "Build tool"
  }
}
```

---

## 🚀 COMANDOS DISPONIBLES

```bash
# Instalar (primera vez)
npm install

# Desarrollo local
npm run dev
# → http://localhost:3000

# Desarrollo con red local
npm run dev:host
# → http://192.168.1.10:3000

# Build para producción
npm run build
# → Genera carpeta dist/

# Preview de build
npm run preview
# → http://localhost:4173
```

---

## ✅ CHECKLIST RÁPIDO

```
□ npm install ejecutado
□ Supabase proyecto creado
□ Schema SQL ejecutado
□ .env configurado
□ npm run dev funciona
□ Pantalla de inicio carga
□ Narrador puede crear partida
□ Jugador puede unirse
□ Roles se asignan
□ Juego funciona
```

---

**Para empezar, lee: [EMPIEZA_AQUI.md](EMPIEZA_AQUI.md)**

🐺🎮🎉

