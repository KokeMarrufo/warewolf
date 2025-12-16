# ✅ CHECKLIST - ANTES DE JUGAR

## 📋 Verificación Paso a Paso

### 1. Instalación ✅

- [ ] `npm install` ejecutado correctamente
- [ ] Carpeta `node_modules/` existe
- [ ] No hay errores en la terminal

### 2. Supabase ✅

- [ ] Proyecto creado en [supabase.com](https://supabase.com)
- [ ] Schema SQL ejecutado completo (`SUPABASE_SCHEMA.sql`)
- [ ] Se crearon 3 tablas: `rooms`, `players`, `game_state`
- [ ] Credenciales copiadas (URL y anon key)

**Verificar tablas en Supabase:**
1. Ve a "Table Editor" en el menú lateral
2. Deberías ver: `rooms`, `players`, `game_state`

### 3. Archivo .env ✅

- [ ] Archivo `.env` existe en la raíz del proyecto
- [ ] `VITE_SUPABASE_URL` configurado
- [ ] `VITE_SUPABASE_ANON_KEY` configurado
- [ ] No hay espacios ni comillas innecesarias
- [ ] Las credenciales coinciden con Supabase

**Formato correcto:**
```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...tu_key_completa
```

### 4. Servidor de Desarrollo ✅

- [ ] `npm run dev` funciona sin errores
- [ ] Se abre en `http://localhost:3000`
- [ ] Ves la pantalla de inicio con dos botones
- [ ] No hay errores en la consola del navegador (F12)

### 5. Prueba Básica ✅

#### Narrador:
- [ ] Puedes crear una nueva partida
- [ ] Se genera un código (ej: LOBO42)
- [ ] Ves el QR code

#### Jugador:
- [ ] Puedes abrir en otra ventana/incógnito
- [ ] Puedes ingresar el código y nombre
- [ ] El jugador aparece en la lista del narrador

#### Asignación de Roles:
- [ ] El narrador puede asignar roles
- [ ] El jugador recibe su rol automáticamente
- [ ] El rol se muestra correctamente

#### Juego:
- [ ] El narrador puede iniciar el juego
- [ ] Aparece la guía narrativa de la noche
- [ ] Puedes avanzar por los pasos

---

## 🎮 READY TO PLAY!

Si marcaste todas las casillas, ¡estás listo para jugar!

### Para jugar en la misma computadora:

```bash
npm run dev
```

- Ventana 1 (normal): Narrador
- Ventana 2 (incógnito): Jugador 1
- Ventana 3 (incógnito): Jugador 2
- etc.

### Para jugar con múltiples dispositivos:

```bash
# 1. Encuentra tu IP
ifconfig | grep "inet " | grep -v 127.0.0.1
# Ejemplo de resultado: 192.168.1.10

# 2. Inicia con --host
npm run dev:host

# 3. En computadora (Narrador):
http://localhost:3000

# 4. En celulares (Jugadores):
http://192.168.1.10:3000  # Usa TU IP
```

---

## ⚠️ Troubleshooting Rápido

### ❌ "Error al crear la partida"

**Problema:** Credenciales de Supabase incorrectas

**Solución:**
1. Verifica `.env`
2. Ve a Supabase → Settings → API
3. Copia de nuevo las credenciales
4. Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### ❌ "relation 'rooms' does not exist"

**Problema:** Schema SQL no ejecutado

**Solución:**
1. Ve a Supabase → SQL Editor
2. Copia TODO `SUPABASE_SCHEMA.sql`
3. Pégalo y haz clic en RUN
4. Verifica que se crearon las 3 tablas

### ❌ Los celulares no conectan

**Problema:** No están en la misma WiFi o IP incorrecta

**Solución:**
1. Verifica que todos estén en la MISMA red WiFi
2. Usa `npm run dev:host` (con --host)
3. Verifica tu IP: `ifconfig | grep inet`
4. Usa la IP en los celulares: `http://TU_IP:3000`
5. Verifica que el firewall no bloquee el puerto 3000

### ❌ "Los jugadores no ven su rol"

**Problema:** Pueden estar en caché o no se asignaron roles

**Solución:**
1. El narrador debe hacer clic en "Asignar Roles"
2. Espera unos segundos (polling cada 3s)
3. Recarga la página del jugador (Ctrl+R)
4. Si persiste, borra localStorage: F12 → Application → Clear Storage

### ❌ Página en blanco

**Problema:** Errores de JavaScript

**Solución:**
1. Abre la consola (F12)
2. Lee el error
3. Si dice "Supabase" → verifica `.env`
4. Si dice "Cannot find" → ejecuta `npm install`
5. Recarga con Ctrl+Shift+R (forzar recarga)

---

## 📞 ¿Necesitas Ayuda?

**Si algo no funciona:**

1. 🚀 Lee **QUICK_START.md** - inicio rápido
2. 📖 Lee **INSTRUCCIONES.md** - guía completa
3. ⚙️ Lee **ENV_SETUP.md** - configuración .env
4. 🔧 Lee **NOTAS_TECNICAS.md** - arquitectura

**Documentos disponibles:**
- `README.md` - Documentación completa
- `QUICK_START.md` - Guía rápida (3 pasos)
- `INSTRUCCIONES.md` - Instrucciones detalladas
- `ENV_SETUP.md` - Configurar .env
- `NOTAS_TECNICAS.md` - Arquitectura técnica
- `RESUMEN_COMPLETO.md` - Resumen del proyecto
- `SUPABASE_SCHEMA.sql` - Schema de BD

---

## 🎉 ¡TODO LISTO!

Cuando todas las casillas estén marcadas, reúne a tus amigos y...

**¡A JUGAR AL LOBO! 🐺**

---

### 🎯 Jugadores Recomendados

- **Mínimo:** 3 jugadores (1 lobo, 2 aldeanos)
- **Óptimo:** 6-12 jugadores
- **Máximo:** 20 jugadores (UI soporta hasta ahí)

### 🎲 Configuración Recomendada

**Para 6-8 jugadores:**
- 2 Lobos
- ✅ Vidente
- ✅ Doctor
- ❌ Cazador (opcional)

**Para 9-12 jugadores:**
- 2-3 Lobos
- ✅ Vidente
- ✅ Doctor
- ✅ Cazador

**Para 13+ jugadores:**
- 3-4 Lobos
- ✅ Vidente
- ✅ Doctor
- ✅ Cazador

---

**Creado con ❤️ para jugar presencialmente con amigos**

¡Disfruta! 🎮🐺🎉

