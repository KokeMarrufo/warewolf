# ⚙️ CONFIGURACIÓN DEL ARCHIVO .env

## 🎯 Paso a Paso

### 1. Abre el archivo `.env` en la raíz del proyecto

Verás algo así:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 2. Ve a tu proyecto de Supabase

1. Abre [https://supabase.com](https://supabase.com)
2. Selecciona tu proyecto (o créalo si no existe)
3. Ve a **Settings** (⚙️) en el menú lateral
4. Haz clic en **API**

### 3. Copia las credenciales

Verás dos cosas importantes:

#### A) Project URL
```
https://abcdefghijklmnop.supabase.co
```

#### B) anon/public key (una key muy larga)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjM0NTY3OCwiZXhwIjoxOTI3OTIxNjc4fQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### 4. Reemplaza en el archivo .env

Edita `.env` y pega tus valores:

```bash
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjM0NTY3OCwiZXhwIjoxOTI3OTIxNjc4fQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### 5. Guarda el archivo

**⚠️ IMPORTANTE:**
- NO agregues espacios antes o después del `=`
- NO pongas comillas alrededor de los valores
- NO compartas este archivo públicamente (está en `.gitignore`)

### 6. Verifica que funcione

```bash
npm run dev
```

Si todo está bien:
- No verás errores en la consola
- Podrás crear una nueva partida
- Los jugadores podrán unirse

## ❌ Errores Comunes

### Error: "fetch failed" o "Failed to fetch"

**Causa:** Credenciales incorrectas o proyecto no existe

**Solución:**
1. Verifica que copiaste bien la URL (debe empezar con `https://`)
2. Verifica que la key sea la completa (es MUY larga)
3. Verifica que el proyecto de Supabase esté activo

### Error: "Invalid API key"

**Causa:** La key está mal copiada

**Solución:**
1. En Supabase, ve a Settings → API
2. Busca "anon/public" key (NO la "service_role" key)
3. Haz clic en el ícono de copiar 📋
4. Pégala directamente en `.env`

### Error: relation "rooms" does not exist

**Causa:** No ejecutaste el schema SQL

**Solución:**
1. Ve a Supabase → SQL Editor
2. Copia TODO el contenido de `SUPABASE_SCHEMA.sql`
3. Pégalo y haz clic en RUN

## ✅ Verificación Manual

Puedes verificar que Supabase funciona:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Pega esto:

```javascript
// Reemplaza con tus credenciales
const url = 'https://tu-proyecto.supabase.co'
const key = 'tu_anon_key'

fetch(`${url}/rest/v1/rooms?select=*`, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
})
.then(r => r.json())
.then(console.log)
```

Si ves `[]` (array vacío) → ✅ Funciona  
Si ves un error → ❌ Hay un problema

## 🔐 Seguridad

**¿Es seguro exponer la anon key?**

Sí, la "anon key" está diseñada para ser pública. Las protecciones vienen de:
- Row Level Security (RLS) en Supabase
- Políticas que definimos en el schema

**¿Debo usar la "service_role" key?**

❌ NO. La service_role key tiene acceso total y NO debe usarse en el frontend.

## 📝 Ejemplo Completo

Archivo `.env` correctamente configurado:

```bash
VITE_SUPABASE_URL=https://xqpnvmwkrluuxbqfmdeh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcG52bXdrcmx1dXhicWZtZGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDI1MjQ2NzgsImV4cCI6MTk1ODEwMDY3OH0.8cF-zK9x1Y2j3wP5vL8qR9mN4uT6gH2sA1bC3dE4fG5
```

(Este es un ejemplo, usa tus propias credenciales)

## 🆘 ¿Aún no funciona?

1. Lee **QUICK_START.md** completo
2. Lee **INSTRUCCIONES.md** sección de troubleshooting
3. Verifica que hayas ejecutado `npm install`
4. Reinicia el servidor (`Ctrl+C` y luego `npm run dev`)
5. Limpia caché del navegador (Ctrl+Shift+R)

---

**Una vez configurado, ya no tendrás que tocar este archivo nunca más.**

¡A jugar! 🐺🎉

