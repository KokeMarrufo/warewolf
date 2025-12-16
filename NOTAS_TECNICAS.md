# 🔧 NOTAS TÉCNICAS

## Arquitectura

### Sin Sincronización en Tiempo Real

**Decisión clave**: No usar WebSockets/Realtime porque:
- ✅ Más robusto (sin problemas de desconexión)
- ✅ Más simple (menos código, menos bugs)
- ✅ Suficiente para este caso de uso

### Polling Simple

**Durante el setup (jugadores):**
- Cada 3 segundos preguntan: "¿Ya tengo rol?"
- Cuando tienen rol → dejan de hacer polling
- Marcan `role_opened = true` para que narrador vea checkmark ✅

**Durante el juego:**
- ❌ NO hay polling
- Los jugadores solo leen su rol (estático)
- El narrador tiene todo el estado local

### Estado Persistente

**Narrador** → `localStorage`:
```javascript
{
  roomCode: "LOBO42",
  roomId: "uuid",
  gameStatus: "playing",
  players: [...],
  gameState: {...},
  nightSteps: [...]
}
```

**Jugador** → `localStorage`:
```javascript
{
  roomCode: "LOBO42",
  playerName: "Juan",
  roomId: "uuid",
  playerId: "uuid",
  playerRole: "wolf"
}
```

**Ventajas:**
- Si cierras la pestaña → recupera el estado
- Si recargas → vuelves donde estabas
- Sin necesidad de sesiones

## Base de Datos

### Tablas

**rooms** (salas):
```sql
id, code, status, num_wolves, include_seer, include_doctor, include_hunter
```

**players** (jugadores):
```sql
id, room_id, name, role, is_alive, role_opened, joined_at
```

**game_state** (estado del juego):
```sql
id, room_id, phase, round, current_step, 
wolf_target, seer_target, seer_result, doctor_target, 
history (JSONB)
```

### Por qué NO usamos game_state mucho

- El narrador tiene todo el estado en `localStorage`
- Solo se usa Supabase para:
  1. Crear sala
  2. Agregar jugadores
  3. Asignar roles
  4. Los jugadores lean su rol

**Durante el juego:**
- Todo sucede localmente en el narrador
- No hay escrituras a la BD (por diseño)
- Más rápido, más simple

## Flujo de Datos

### Setup

```
1. Narrador crea sala → Supabase (INSERT rooms)
2. Jugadores se unen → Supabase (INSERT players)
3. Narrador hace polling → Supabase (SELECT players)
4. Narrador asigna roles → Supabase (UPDATE players SET role)
5. Jugadores hacen polling → Supabase (SELECT my role)
6. Jugadores reciben rol → dejan de hacer polling
```

### Durante el juego

```
1. Narrador controla todo localmente
2. NO hay comunicación con Supabase
3. NO hay comunicación con jugadores
4. Jugadores solo ven su rol (offline)
```

### ¿Por qué funciona?

Porque el juego del Lobo es **presencial**:
- El narrador dice en voz alta qué pasa
- Los jugadores NO necesitan actualizaciones
- Solo consultan su rol si lo olvidan

## Rendimiento

### Polling Eficiente

**Setup phase:**
- 10 jugadores × 1 query cada 3s = ~3 queries/s
- Muy manejable para Supabase (límite: miles/s)

**Durante el juego:**
- 0 queries (todo local)

### LocalStorage

- < 1MB por partida
- Persiste entre recargas
- Sincronización automática del navegador

## Escalabilidad

**Límites teóricos:**
- Salas simultáneas: ilimitadas
- Jugadores por sala: limitado por UI (~20 máx recomendado)
- Duración de partida: ilimitada

**Costo de Supabase:**
- Free tier: 50,000 solicitudes/mes
- Setup + 10 jugadores = ~40 queries
- → Puedes hacer ~1,250 partidas/mes gratis
- → Más que suficiente

## Seguridad

### Row Level Security (RLS)

```sql
CREATE POLICY "Allow all operations" ON rooms 
FOR ALL USING (true) WITH CHECK (true);
```

**¿Por qué `USING (true)`?**
- Es un juego casual sin cuentas
- No hay información sensible
- Simplifica el código
- En producción podrías agregar autenticación

### Validación

**Backend (Supabase):**
- UNIQUE(room_id, name) → no duplicados
- Foreign keys → integridad referencial
- CHECK constraints (si quieres agregar)

**Frontend:**
- Validación básica de inputs
- Manejo de errores
- Feedback al usuario

## Testing Local

### Probar en la misma máquina

**Ventana 1 (Narrador):**
```bash
http://localhost:3000 → Normal
```

**Ventana 2 (Jugador):**
```bash
http://localhost:3000 → Incógnito
```

### Probar con múltiples dispositivos

**Requisito**: Misma red WiFi

**1. Encuentra tu IP:**
```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

**2. Inicia con --host:**
```bash
npm run dev -- --host
```

**3. Accede desde celulares:**
```
http://192.168.1.10:3000
```

## Deploy

### Opción 1: Vercel (Recomendado)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Configurar env vars en el dashboard
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Opción 2: Netlify

Similar a Vercel:
1. `npm run build`
2. Deploy carpeta `dist/`
3. Configurar env vars

### Opción 3: Docker (opcional)

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "3000"]
```

## Mejoras Futuras (Opcional)

### 1. Autenticación
- Agregar login opcional
- Guardar estadísticas
- Historial de partidas

### 2. Más Roles
- Cupido 💘
- Bruja 🧙‍♀️
- Niña 👧

### 3. Chat (opcional)
- Chat de texto durante el día
- Solo para partidas remotas

### 4. Analytics
- Estadísticas de roles
- Win rate
- Partidas jugadas

### 5. Temas
- Modo oscuro 🌙
- Temas personalizados
- Sonidos ambientales

## Troubleshooting

### Error: "fetch failed"
- Verifica `.env`
- Verifica que Supabase esté activo
- Revisa la consola del navegador

### Los roles no se asignan
- Mínimo 3 jugadores
- Verifica que SQL schema esté ejecutado
- Revisa permisos RLS en Supabase

### Polling no funciona
- Verifica que `room_id` sea correcto
- Abre Network tab en DevTools
- Busca errores 4xx/5xx

### localStorage lleno
- Raro (límite 5-10MB)
- Borrar storage: `localStorage.clear()`
- Reset desde nueva partida

---

**¿Dudas?** Abre un issue en GitHub o contacta al autor.

