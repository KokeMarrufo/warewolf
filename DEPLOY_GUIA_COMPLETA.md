# 🚀 DEPLOY - GUÍA COMPLETA

## 🎯 Opciones de Deployment

Tienes 3 opciones principales:

1. **Vercel** (⭐ RECOMENDADO - más fácil)
2. **Netlify** (también muy bueno)
3. **Otro hosting** (Railway, Render, etc.)

---

## ⭐ OPCIÓN 1: VERCEL (RECOMENDADO)

### ✅ Ventajas:
- ✅ Deploy en 2 minutos
- ✅ Auto-deploy en cada push a GitHub
- ✅ SSL gratis (HTTPS)
- ✅ CDN global (súper rápido)
- ✅ 100GB bandwidth gratis/mes
- ✅ Perfecto para React + Vite

---

## 📋 PASO A PASO - VERCEL

### **Requisito:** Tu código debe estar en GitHub primero

Si NO lo has subido, lee: [TODO_LISTO_PARA_GITHUB.md](TODO_LISTO_PARA_GITHUB.md)

---

### 1️⃣ Crear Cuenta en Vercel (1 minuto)

1. Ve a: [https://vercel.com](https://vercel.com)

2. Haz clic en **"Sign Up"**

3. Selecciona **"Continue with GitHub"** (recomendado)
   - Así Vercel tendrá acceso a tus repositorios

4. Autoriza a Vercel

---

### 2️⃣ Importar tu Proyecto (30 segundos)

1. En el dashboard de Vercel, haz clic en **"Add New..."**

2. Selecciona **"Project"**

3. Verás una lista de tus repositorios de GitHub

4. Busca **"juego-del-lobo"**

5. Haz clic en **"Import"**

---

### 3️⃣ Configurar el Proyecto (2 minutos)

Vercel detectará automáticamente que es un proyecto Vite. Verás:

```
Framework Preset: Vite
Build Command: vite build
Output Directory: dist
Install Command: npm install
```

✅ **No cambies nada** - todo está correcto.

---

### 4️⃣ Agregar Variables de Entorno (⚠️ IMPORTANTE)

1. Expande la sección **"Environment Variables"**

2. Agrega estas 2 variables:

   **Variable 1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://tu-proyecto.supabase.co
   ```

   **Variable 2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGc... (tu anon key completa)
   ```

3. ⚠️ **Copia los valores exactos de tu archivo `.env` local**

4. Asegúrate de que ambas variables estén para **"Production"**

---

### 5️⃣ Deploy! (1 minuto)

1. Haz clic en **"Deploy"**

2. ⏳ Vercel comenzará a:
   - Clonar tu repositorio
   - Instalar dependencias
   - Hacer build
   - Publicar

3. Verás el progreso en tiempo real

4. Después de ~1 minuto, verás: **"🎉 Congratulations!"**

---

### 6️⃣ Ver tu Sitio en Vivo

1. Vercel te dará una URL como:
   ```
   https://juego-del-lobo.vercel.app
   ```

2. Haz clic en **"Visit"** o copia la URL

3. 🎉 **¡Tu juego está en línea!**

4. Prueba que funcione:
   - Haz clic en "SOY NARRADOR"
   - Crea una nueva partida
   - ¿Funciona? ✅ ¡Listo!

---

## 🔄 Auto-Deploy

**La magia de Vercel:**

Cada vez que hagas un `git push` a GitHub:
- ✅ Vercel detectará el cambio
- ✅ Hará deploy automático
- ✅ Actualizará tu sitio en ~1 minuto

**No necesitas hacer nada más.**

---

## 🎨 Personalizar el Dominio (Opcional)

### Opción A: Usar subdominio de Vercel (gratis)

1. Ve a: Project Settings → Domains
2. Agrega un alias: `mi-juego-lobo.vercel.app`

### Opción B: Usar tu propio dominio

1. Compra un dominio (ej: en Namecheap, GoDaddy)
2. En Vercel: Project Settings → Domains
3. Agrega tu dominio: `mijuego.com`
4. Configura los DNS según las instrucciones
5. ✅ En ~1 hora estará activo con SSL

---

## 📱 Compartir tu Juego

Una vez desplegado, puedes compartir la URL:

```
https://juego-del-lobo.vercel.app

o

https://tu-dominio.com
```

**Cualquier persona con la URL puede:**
- ✅ Ser narrador
- ✅ Unirse como jugador
- ✅ Jugar desde cualquier dispositivo
- ✅ Sin necesidad de estar en la misma WiFi

---

## ⚠️ IMPORTANTE: Variables de Entorno

### ¿Qué pasa si olvidaste agregar las variables?

**Síntomas:**
- El sitio carga pero da error al crear partida
- "fetch failed" en la consola

**Solución:**
1. Ve a: Project Settings → Environment Variables
2. Agrega las 2 variables (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
3. Ve a: Deployments
4. Haz clic en los 3 puntos del último deploy
5. Selecciona "Redeploy"
6. ✅ En 1 minuto estará arreglado

---

## 🔧 Troubleshooting Vercel

### Error: "Build failed"

**Causa:** Algún error en el código

**Solución:**
1. Lee el log de error (Vercel te lo muestra)
2. Verifica que localmente funcione: `npm run build`
3. Corrige el error
4. Haz push a GitHub
5. Vercel hará redeploy automático

### Error: "Failed to fetch" en producción

**Causa:** Variables de entorno mal configuradas

**Solución:**
1. Verifica las variables en Vercel
2. Copia exactamente desde tu `.env` local
3. Redeploy

### El sitio carga pero no funciona

**Causa:** Supabase no configurado o variables incorrectas

**Solución:**
1. Verifica que Supabase esté funcionando
2. Verifica las variables de entorno en Vercel
3. Abre la consola del navegador (F12) para ver errores

---

## 📊 OPCIÓN 2: NETLIFY

### Paso a Paso:

1. **Crear cuenta:**
   - Ve a: [https://netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Importar proyecto:**
   - Add new site → Import from Git
   - Selecciona GitHub
   - Busca tu repositorio

3. **Configurar build:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Variables de entorno:**
   - Site settings → Environment variables
   - Agrega:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Deploy:**
   - Click en "Deploy site"
   - Espera ~2 minutos
   - ✅ ¡Listo!

**URL:** `https://tu-sitio.netlify.app`

---

## 🌐 OPCIÓN 3: Otros Hostings

### Railway.app
- Similar a Vercel
- Soporta backend + frontend
- $5/mes después del trial

### Render.com
- Gratis para sitios estáticos
- Auto-deploy desde GitHub
- Más lento que Vercel

### GitHub Pages
- ⚠️ No recomendado para este proyecto
- No soporta variables de entorno privadas

---

## 💰 Costos

### Vercel (Hobby Plan - GRATIS)
- ✅ 100GB bandwidth/mes
- ✅ Deploy ilimitados
- ✅ Sitios ilimitados
- ✅ SSL gratis
- ✅ Dominio .vercel.app gratis

**¿Es suficiente?** SÍ, para cientos de partidas al mes.

### Netlify (Free Plan)
- ✅ 100GB bandwidth/mes
- ✅ 300 build minutes/mes
- ✅ Deploy ilimitados

### Pro Plans (si creces mucho):
- Vercel Pro: $20/mes
- Netlify Pro: $19/mes

**Para uso personal/amigos:** El plan gratis es más que suficiente.

---

## 🔐 Seguridad

### ¿Es seguro exponer mi anon key en Vercel?

✅ **SÍ** - La anon key está diseñada para ser pública.

**Protecciones:**
- Row Level Security (RLS) en Supabase
- Políticas configuradas en el schema
- La anon key tiene permisos limitados

### ¿Qué NO debo exponer?

❌ La **service_role key** de Supabase  
❌ Contraseñas de bases de datos  
❌ API keys privadas  

---

## 📈 Monitoreo

### Ver estadísticas en Vercel:

1. Ve a tu proyecto en Vercel
2. Tab "Analytics" (si está disponible)
3. Verás:
   - Visitas
   - Performance
   - Errores

### Ver uso de Supabase:

1. Ve a tu proyecto en Supabase
2. Settings → Usage
3. Verás:
   - API requests
   - Database size
   - Bandwidth

---

## 🎯 Checklist de Deploy

Antes de hacer deploy:

- [ ] Código está en GitHub
- [ ] Funciona localmente (`npm run dev`)
- [ ] Build funciona (`npm run build`)
- [ ] Tienes las credenciales de Supabase
- [ ] Supabase está configurado y funcionando

Durante el deploy:

- [ ] Variables de entorno agregadas en Vercel/Netlify
- [ ] Build completado sin errores
- [ ] Sitio cargado correctamente

Después del deploy:

- [ ] Probar crear una partida
- [ ] Probar unirse como jugador
- [ ] Probar asignar roles
- [ ] Probar flujo completo del juego

---

## 🔄 Workflow Recomendado

### Desarrollo:
```bash
# Trabajar localmente
npm run dev

# Hacer cambios...

# Probar
npm run build
npm run preview

# Si funciona, commitear
git add .
git commit -m "Nueva feature"
git push
```

### Producción:
```
git push → Vercel detecta → Deploy automático → Sitio actualizado
```

**Simple y automático** ✨

---

## 📱 Usar el Deploy

### Para el Narrador:
```
Abre: https://tu-sitio.vercel.app
Click: "SOY NARRADOR"
Nueva Partida → Código LOBO42
Comparte el código o QR
```

### Para los Jugadores:
```
Abre: https://tu-sitio.vercel.app
Click: "SOY JUGADOR"
Ingresa código: LOBO42
¡Listo!
```

**Ya no necesitan estar en la misma WiFi** 🎉

---

## 🌍 Ventajas del Deploy en la Nube

✅ **Accesible desde cualquier lugar**
- No necesitas estar en la misma red
- Juega con amigos remotos
- Funciona en cualquier dispositivo

✅ **Siempre disponible**
- No necesitas tener tu computadora prendida
- 99.9% uptime

✅ **Más rápido**
- CDN global
- Optimizado automáticamente

✅ **Gratis**
- Sin costos para uso personal

---

## 🎓 Tips Pro

### 1. Preview Deployments

Vercel crea un deploy de preview para cada Pull Request:
- Testing automático
- Ver cambios antes de mergear
- URL única para cada PR

### 2. Custom Domains

Puedes usar múltiples dominios:
- `juego-lobo.com`
- `lobo.tudominio.com`
- `werewolf.app`

### 3. Environment Variables por Branch

```
Production: main branch
Preview: feature branches
Development: development branch
```

Diferentes variables para cada uno.

### 4. Analytics

Vercel ofrece analytics detallados:
- Web Vitals
- Performance metrics
- Real User Monitoring

---

## 📞 Soporte

### Si algo no funciona:

1. **Lee los logs** en Vercel/Netlify
2. **Verifica variables** de entorno
3. **Prueba localmente** primero
4. **Revisa Supabase** que esté funcionando

### Links útiles:

- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs:** [https://docs.netlify.com](https://docs.netlify.com)
- **Supabase Status:** [https://status.supabase.com](https://status.supabase.com)

---

## ✅ Resumen Rápido

**Para hacer deploy en 5 minutos:**

1. Sube tu código a GitHub (si no lo hiciste)
2. Ve a [vercel.com](https://vercel.com)
3. Import proyecto
4. Agrega variables de entorno
5. Deploy
6. ✅ ¡Listo!

**URL de ejemplo:**
```
https://juego-del-lobo.vercel.app
```

---

## 🎉 ¡A JUGAR EN LA NUBE!

Una vez desplegado, comparte la URL con tus amigos y jueguen desde cualquier lugar.

**No más problemas de WiFi o redes locales** 🚀

---

**¿Dudas?** Revisa los logs de Vercel o contacta soporte.

🐺🎮☁️

