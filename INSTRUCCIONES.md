# 📋 INSTRUCCIONES DE CONFIGURACIÓN

## Paso 1: Instalar dependencias

```bash
npm install
```

## Paso 2: Configurar Supabase

### 2.1 Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Dale un nombre (ej: "juego-lobo") y una contraseña
5. Espera a que el proyecto se cree (toma 1-2 minutos)

### 2.2 Ejecutar el schema SQL

1. En tu proyecto de Supabase, ve a "SQL Editor" en el menú lateral
2. Haz clic en "New Query"
3. Copia TODO el contenido del archivo `SUPABASE_SCHEMA.sql`
4. Pégalo en el editor SQL
5. Haz clic en "RUN" (abajo a la derecha)
6. Deberías ver un mensaje de éxito ✅

### 2.3 Obtener las credenciales

1. En tu proyecto de Supabase, ve a "Settings" (⚙️) → "API"
2. Encontrarás:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon/public key** (una key muy larga)

### 2.4 Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_key_aqui
```

2. Reemplaza los valores con los que copiaste de Supabase

## Paso 3: Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## Paso 4: Probar la aplicación

### Opción A: En la misma computadora

1. Abre `http://localhost:3000` en una pestaña → selecciona "SOY NARRADOR"
2. Abre `http://localhost:3000` en otra pestaña/ventana de incógnito → selecciona "SOY JUGADOR"
3. El narrador crea una partida y obtiene un código (ej: LOBO42)
4. El jugador ingresa el código y su nombre

### Opción B: Con múltiples dispositivos (RECOMENDADO)

**IMPORTANTE**: Todos los dispositivos deben estar en la misma red WiFi

1. Encuentra la IP local de tu computadora:
   - **Mac**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows**: `ipconfig` (busca "IPv4 Address")
   - **Linux**: `ip addr show`

2. La IP será algo como: `192.168.1.10`

3. Abre Vite con host:
   ```bash
   npm run dev -- --host
   ```

4. En tu computadora (narrador), abre: `http://localhost:3000`

5. En los celulares de los jugadores, abre: `http://192.168.1.10:3000` (usa tu IP)

6. ¡Ahora todos están conectados!

## 🎮 FLUJO DEL JUEGO

### NARRADOR

1. Configura roles (número de lobos, vidente, doctor, cazador)
2. Haz clic en "Nueva Partida" → se genera código (ej: LOBO42)
3. Muestra el código o QR a los jugadores
4. Espera a que los jugadores se unan
5. Haz clic en "Asignar Roles"
6. Haz clic en "Iniciar Juego"
7. Sigue la guía narrativa paso a paso

### JUGADORES

1. Abre la app en el celular
2. Ingresa el código de sala
3. Ingresa tu nombre
4. Espera...
5. ¡Ve tu rol!
6. Mantén el celular a mano durante el juego

## 🔧 Solución de Problemas

### "Error al crear la partida"
- Verifica que las credenciales de Supabase en `.env` sean correctas
- Asegúrate de haber ejecutado el schema SQL completo

### "Los jugadores no pueden unirse"
- Verifica que el código de sala sea correcto (mayúsculas)
- Revisa que la conexión a Supabase funcione

### "No se asignan los roles"
- Necesitas al menos 3 jugadores para empezar
- Verifica que no haya errores en la consola del navegador

### Los celulares no pueden conectarse
- Asegúrate de que todos estén en la misma red WiFi
- Verifica que el firewall de tu computadora no bloquee el puerto 3000
- Usa `npm run dev -- --host` para exponer el servidor en la red local

## 📱 Deploy (Opcional)

Para hacer deploy y jugar desde cualquier lugar:

### Opción 1: Vercel (RECOMENDADO)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Agrega las variables de entorno (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
5. Haz clic en "Deploy"
6. ¡Listo! Tendrás una URL pública

### Opción 2: Netlify

Similar a Vercel:
1. Sube a GitHub
2. Importa en [netlify.com](https://netlify.com)
3. Configura las variables de entorno
4. Deploy

## 🎉 ¡A JUGAR!

Ya tienes todo listo. Reúne a tus amigos y disfruta del Juego del Lobo 🐺

