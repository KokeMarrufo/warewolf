# 🗄️ CONFIGURAR SUPABASE - PASO A PASO

## 📋 Guía Visual Completa

### Paso 1: Crear Cuenta en Supabase (2 minutos)

1. Abre tu navegador y ve a: [https://supabase.com](https://supabase.com)

2. Haz clic en **"Start your project"** o **"Sign Up"**

3. Puedes registrarte con:
   - GitHub (recomendado - 1 clic)
   - Google
   - Email

4. Autoriza el acceso si usas GitHub/Google

---

### Paso 2: Crear un Nuevo Proyecto (1 minuto)

1. Una vez dentro, haz clic en **"New Project"**

2. Llena el formulario:

   ```
   Organization: [Selecciona o crea una]
   ├─ Name: Juego del Lobo
   ├─ Database Password: [Crea una contraseña segura]
   │  💡 Guárdala en un lugar seguro
   ├─ Region: [Elige la más cercana a ti]
   │  - México → South America (São Paulo)
   │  - USA → US East (North Virginia)
   │  - Europa → Europe West (Ireland)
   └─ Pricing Plan: Free (suficiente para el juego)
   ```

3. Haz clic en **"Create new project"**

4. ⏳ Espera 1-2 minutos mientras se crea el proyecto
   - Verás una barra de progreso
   - El proyecto se está configurando

---

### Paso 3: Ejecutar el Schema SQL (3 minutos)

1. En el menú lateral izquierdo, busca el ícono **"SQL Editor"** 
   - Parece: `</>` o "SQL"

2. Haz clic en **"SQL Editor"**

3. Haz clic en el botón **"+ New query"** (arriba a la derecha)

4. Abre el archivo `SUPABASE_SCHEMA.sql` de este proyecto
   - Está en la raíz del proyecto
   - Ábrelo con cualquier editor de texto

5. **COPIA TODO EL CONTENIDO** del archivo (Ctrl+A, Ctrl+C)

6. **PEGA** en el editor SQL de Supabase (Ctrl+V)

7. Haz clic en **"RUN"** (botón abajo a la derecha)
   - Puede decir "Run" o tener un ícono ▶️

8. ✅ Deberías ver: **"Success. No rows returned"**

---

### Paso 4: Verificar que las Tablas se Crearon (1 minuto)

1. En el menú lateral, haz clic en **"Table Editor"** 
   - Parece una tabla o grid

2. Deberías ver 3 tablas:
   ```
   ✅ rooms
   ✅ players  
   ✅ game_state
   ```

3. Haz clic en cada una para ver su estructura:
   - `rooms` debe tener: id, code, status, num_wolves, etc.
   - `players` debe tener: id, room_id, name, role, is_alive, etc.
   - `game_state` debe tener: id, room_id, phase, round, etc.

4. Si ves las 3 tablas → ✅ ¡Perfecto!

---

### Paso 5: Obtener las Credenciales (2 minutos)

1. En el menú lateral, haz clic en el ícono de **"Settings"** (⚙️)

2. En el menú de Settings, haz clic en **"API"**

3. Verás una página con información de la API

4. **COPIA estos dos valores:**

   #### A) Project URL
   ```
   Se ve así: https://abcdefghijklmnop.supabase.co
   ```
   - Busca la sección "Project URL"
   - Haz clic en el ícono de copiar 📋

   #### B) anon/public key
   ```
   Se ve así: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - Busca la sección "Project API keys"
   - Encuentra la que dice **"anon" "public"**
   - Haz clic en el ícono de copiar 📋
   - ⚠️ NO copies la "service_role" key

---

### Paso 6: Configurar el archivo .env (1 minuto)

1. En tu proyecto, crea un archivo llamado `.env` en la raíz
   ```bash
   # Si estás en la terminal:
   touch .env
   
   # O créalo manualmente con tu editor
   ```

2. Abre `.env` y pega esto:

   ```bash
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...tu_key_completa_aqui
   ```

3. **REEMPLAZA** con tus valores reales que copiaste

   **Ejemplo correcto:**
   ```bash
   VITE_SUPABASE_URL=https://xqpnvmwkrluuxbqfmdeh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcG52bXdrcmx1dXhicWZtZGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDI1MjQ2NzgsImV4cCI6MTk1ODEwMDY3OH0.8cF-zK9x1Y2j3wP5vL8qR9mN4uT6gH2sA1bC3dE4fG5
   ```

4. Guarda el archivo

5. ⚠️ **IMPORTANTE**: 
   - NO agregues espacios antes o después del `=`
   - NO pongas comillas alrededor de los valores
   - Guarda como `.env` (con el punto al inicio)

---

### Paso 7: Verificar que Funciona (1 minuto)

1. Abre la terminal en tu proyecto

2. Ejecuta:
   ```bash
   npm run dev
   ```

3. Abre el navegador en: `http://localhost:3000`

4. Haz clic en **"SOY NARRADOR"**

5. Haz clic en **"Nueva Partida"**

6. Si ves un código como "LOBO42" → ✅ **¡FUNCIONA!**

7. Si ves un error:
   - Verifica que copiaste bien la URL
   - Verifica que la key sea la completa (es muy larga)
   - Verifica que ejecutaste el SQL schema

---

## 🎉 ¡LISTO!

Supabase está configurado y funcionando.

### ✅ Checklist Final:

- [ ] Proyecto creado en Supabase
- [ ] Schema SQL ejecutado (3 tablas creadas)
- [ ] Credenciales copiadas (URL + anon key)
- [ ] Archivo `.env` creado y configurado
- [ ] App funciona y puede crear partidas

---

## 🆘 Troubleshooting

### Error: "fetch failed" o "Failed to fetch"

**Solución:**
1. Ve a Supabase → Settings → API
2. Copia de nuevo la URL (debe incluir `https://`)
3. Copia de nuevo la anon key (completa)
4. Verifica el archivo `.env`
5. Reinicia el servidor: `Ctrl+C` y `npm run dev`

### Error: relation "rooms" does not exist

**Solución:**
1. Ve a Supabase → SQL Editor
2. Ejecuta de nuevo el schema completo
3. Verifica en Table Editor que se crearon las tablas

### Error: Invalid API key

**Solución:**
1. Verifica que usaste la **anon/public** key
2. NO uses la "service_role" key
3. Copia directamente desde Supabase (haz clic en el ícono 📋)

---

## 📊 Límites del Plan Free

✅ **Más que suficiente para el juego:**

- 50,000 requests/mes
- 500 MB de almacenamiento
- 2 GB de transferencia
- Proyectos ilimitados
- Sin tarjeta de crédito requerida

**Con 10 jugadores por partida:**
- Setup = ~40 queries
- Puedes hacer ~1,250 partidas/mes
- = ~40 partidas por día

---

## 🔐 Seguridad

**¿Es seguro exponer la anon key?**

✅ SÍ - Está diseñada para ser pública. Las protecciones vienen de:
- Row Level Security (RLS) - ya configurado en el schema
- Políticas que definimos en las tablas

**¿Debo usar la service_role key?**

❌ NO - Tiene acceso completo a toda la base de datos. Solo úsala en el backend, nunca en el frontend.

---

**¡Ahora estás listo para jugar! 🐺🎮**

