# 🐺 Juego del Lobo (Werewolf/Mafia)

Juego del Lobo para jugar presencialmente con múltiples dispositivos **SIN sincronización en tiempo real**.

## 🎮 Características

- **Dos aplicaciones separadas**: Una para el narrador (desktop/tablet) y otra para jugadores (mobile)
- **Sin sockets ni realtime**: Usa polling simple para mayor robustez
- **Roles clásicos**: Lobos 🐺, Vidente 👁️, Doctor ⚕️, Cazador 🏹, Aldeanos 👤
- **Interfaz intuitiva**: Guía narrativa paso a paso para el narrador
- **QR Code**: Los jugadores pueden unirse escaneando un código QR
- **Estado persistente**: Usa localStorage para recuperar partidas

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script SQL en `SUPABASE_SCHEMA.sql` en el SQL Editor de Supabase
3. Copia las credenciales de tu proyecto

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Cómo Jugar

### Para el Narrador

1. Abre la app y selecciona "SOY NARRADOR"
2. Configura el número de lobos y roles especiales
3. Haz clic en "Nueva Partida" para generar un código de sala
4. Los jugadores pueden unirse escaneando el QR o ingresando el código
5. Agrega jugadores manualmente o espera que se unan
6. Haz clic en "Asignar Roles" cuando todos estén listos
7. Inicia el juego y sigue la guía narrativa

### Para los Jugadores

1. Abre la app y selecciona "SOY JUGADOR"
2. Ingresa el código de sala y tu nombre
3. Espera a que el narrador inicie el juego
4. ¡Consulta tu rol y mantén el celular a mano!

## 🎯 Roles

- **🐺 Lobo**: Cada noche elige una víctima con los otros lobos
- **👁️ Vidente**: Cada noche puede investigar si alguien es lobo
- **⚕️ Doctor**: Cada noche puede proteger a alguien de los lobos
- **🏹 Cazador**: Si muere, puede llevarse a alguien con él
- **👤 Aldeano**: Vota durante el día para eliminar sospechosos

## 🏗️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **QR Codes**: qrcode.react
- **Routing**: React Router

## 📂 Estructura del Proyecto

```
Lobo/
├── src/
│   ├── components/
│   │   └── narrator/
│   │       ├── SetupView.jsx
│   │       ├── GameView.jsx
│   │       ├── NightPhase.jsx
│   │       ├── DayPhase.jsx
│   │       └── VictoryView.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Narrator.jsx
│   │   └── Player.jsx
│   ├── utils/
│   │   ├── roles.js
│   │   └── gameLogic.js
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── SUPABASE_SCHEMA.sql
├── package.json
└── README.md
```

## 🎨 Capturas de Pantalla

### Pantalla de Inicio
Selecciona si eres narrador o jugador

### Panel del Narrador
Configura y controla toda la partida

### Vista del Jugador
Simple y clara: solo muestra tu rol

## 🔧 Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 📝 Notas Técnicas

- **Polling en lugar de WebSockets**: Los jugadores hacen polling cada 3 segundos durante la fase de setup, luego dejan de hacer polling una vez que reciben su rol
- **Estado local**: El narrador guarda el estado del juego en localStorage para recuperarlo si cierra la pestaña
- **Sin dependencias complejas**: Arquitectura simple y robusta

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de abrir issues o pull requests.

## 📄 Licencia

MIT

## 🎉 Créditos

Creado con ❤️ para jugar presencialmente con amigos

