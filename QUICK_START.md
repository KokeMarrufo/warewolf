# 🚀 INICIO RÁPIDO

## ⚡ 3 Pasos para empezar:

### 1️⃣ Configurar Supabase (5 minutos)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto (dale un nombre y contraseña)
3. Ve a **SQL Editor** y ejecuta todo el contenido de `SUPABASE_SCHEMA.sql`
4. Ve a **Settings → API** y copia:
   - Project URL
   - anon/public key

### 2️⃣ Configurar el archivo .env

Edita el archivo `.env` y reemplaza con tus credenciales:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```

### 3️⃣ Iniciar la app

```bash
npm run dev
```

**Para jugar con celulares en la misma WiFi:**

```bash
npm run dev -- --host
```

Luego abre en los celulares: `http://TU_IP:3000` (ej: `http://192.168.1.10:3000`)

---

## 📱 Cómo Jugar

### NARRADOR (Desktop/Tablet)
1. Abre `http://localhost:3000` → "SOY NARRADOR"
2. Configura roles → "Nueva Partida"
3. Muestra el código/QR a los jugadores
4. Espera jugadores → "Asignar Roles" → "Iniciar Juego"
5. Sigue la guía narrativa

### JUGADORES (Celular)
1. Abre la app → "SOY JUGADOR"
2. Ingresa código + nombre
3. Espera... → ¡Ve tu rol!
4. Mantén el celular a mano

---

## ❓ Problemas comunes

**Los celulares no conectan:**
- Verifica que estén en la misma WiFi
- Usa `npm run dev -- --host`
- Usa tu IP local (no localhost)

**Error al crear partida:**
- Verifica el archivo `.env`
- Asegúrate de haber ejecutado el SQL en Supabase

---

¿Más detalles? → Ver `INSTRUCCIONES.md`

¡A jugar! 🐺🎉

