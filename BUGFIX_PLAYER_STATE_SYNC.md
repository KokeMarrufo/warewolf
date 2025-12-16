# 🐛 Fix: Multiple Deaths and Player State Synchronization

**Fecha**: 16 de Diciembre, 2025

## Problemas Reportados por Usuario

1. **Cazador sigue vivo después de morir**: Los lobos mataron al cazador, el cazador eligió su venganza, pero el cazador seguía apareciendo vivo en la votación.

2. **Muertes múltiples no se reflejan**: Cuando hay varias muertes (lobos + cazador + bruja), la lista de jugadores no se actualiza correctamente.

3. **Falta rol de Cupido**: Necesita implementar Cupido con las siguientes características:
   - Se asigna como un rol más al inicio
   - Al inicio del juego, flecha a 2 jugadores (los vincula)
   - Si uno de los flechados muere (por cualquier causa), el otro también muere
   - Esto debe funcionar en TODAS las fases del juego

---

## Problema Raíz: Estado Asíncrono

### El Bug

```javascript
// ANTES (❌ Problemático)
const killPlayer = (playerId, cause) => {
  updatePlayer(playerId, { is_alive: false })  // ← setPlayers() asíncrono
  
  // Este código se ejecuta ANTES de que setPlayers se complete
  const player = players.find(p => p.id === playerId)  // ← Todavía vivo!
  
  return player.role === 'hunter' ? 'hunter_revenge' : null
}

// Cuando se procesa segunda muerte:
killPlayer(hunterTargetId, 'hunter')
// players TODAVÍA tiene al cazador como vivo
// Resultado: Cazador aparece vivo en la UI
```

### La Cascada de Problemas

```
Lobos matan al cazador
  ↓
killPlayer(cazadorId, 'wolves')
  ↓
setPlayers(...) ← ASYNC, no completa inmediatamente
  ↓
Retorna: hunter_revenge
  ↓
Cazador elige víctima
  ↓
killPlayer(victimaId, 'hunter')
  ↓
Usa players antiguo (cazador TODAVÍA vivo)
  ↓
UI muestra cazador vivo en votación ❌
```

---

## Solución: Estado Inmutable Pasado por Referencia

### Nuevo Enfoque

En lugar de depender del estado asíncrono de React, **pasamos el estado actualizado directamente** de una muerte a la siguiente.

### Cambios Implementados

#### 1. killPlayer Ahora Devuelve Estado Actualizado

```javascript
// NUEVO (✅ Correcto)
const killPlayer = (playerId, cause, currentPlayers = players) => {
  const player = currentPlayers.find(p => p.id === playerId)
  
  if (!player || !player.is_alive) {
    console.log('⚠️ Jugador ya muerto o no encontrado:', playerId)
    return { updatedPlayers: currentPlayers, hunterRevenge: null }
  }
  
  console.log(`💀 Matando a ${player.name} (${cause})`)
  
  // Actualizar jugadores (local e inmediato)
  const updatedPlayers = currentPlayers.map(p => 
    p.id === playerId ? { ...p, is_alive: false } : p
  )
  
  // ... resto de lógica (historial, victoria, etc)
  
  // Devolver cazador info si aplica
  const hunterRevenge = player.role === 'hunter' ? { 
    type: 'hunter_revenge',
    hunterId: playerId,
    hunterName: player.name
  } : null
  
  return { updatedPlayers, hunterRevenge }
}
```

**Ventajas**:
- ✅ `updatedPlayers` tiene el estado INMEDIATO
- ✅ Cada muerte recibe el estado actualizado de la anterior
- ✅ No hay race conditions
- ✅ Muertes en cascada funcionan correctamente

#### 2. onNightEnd Procesa Muertes en Batch

```javascript
onNightEnd={(deaths) => {
  console.log('🌅 Procesando muertes nocturnas:', deaths)
  
  // Procesar TODAS las muertes manteniendo estado sincronizado
  let currentPlayers = [...players]  // ← Copia inicial
  let hunterRevengeData = null
  const deathsWithNames = []
  
  deaths.forEach(death => {
    const player = currentPlayers.find(p => p.id === death.playerId)
    if (!player) return
    
    // Guardar para anuncio (ANTES de matar)
    deathsWithNames.push({
      playerId: death.playerId,
      playerName: player.name,
      cause: death.cause
    })
    
    // Matar jugador y actualizar estado
    const result = killPlayer(death.playerId, death.cause, currentPlayers)
    currentPlayers = result.updatedPlayers  // ← ACTUALIZAR para siguiente muerte
    
    if (result.hunterRevenge) {
      hunterRevengeData = result.hunterRevenge
    }
  })
  
  // Actualizar estado global con TODOS los cambios
  console.log('👥 Actualizando jugadores:', currentPlayers.filter(p => !p.is_alive).map(p => p.name))
  
  setPlayers(currentPlayers)  // ← Una sola actualización con todo
  setLastNightDeaths(deathsWithNames)
  
  if (hunterRevengeData) {
    setPendingHunterRevenge(hunterRevengeData)
  }
  
  changePhase('day')
}}
```

**Flujo**:
```
Death 1: currentPlayers = [A, B, C, D]
  ↓
killPlayer(A) → updatedPlayers = [A†, B, C, D]
  ↓
currentPlayers = [A†, B, C, D]
  ↓
Death 2: currentPlayers = [A†, B, C, D]
  ↓
killPlayer(B) → updatedPlayers = [A†, B†, C, D]
  ↓
currentPlayers = [A†, B†, C, D]
  ↓
setPlayers([A†, B†, C, D])  ← Una sola actualización
```

#### 3. DayPhase También Actualiza Inmediatamente

```javascript
onExecutePlayer={(playerId, cause = 'vote') => {
  const result = killPlayer(playerId, cause, players)
  // Actualizar estado inmediatamente
  setPlayers(result.updatedPlayers)  // ← INMEDIATO
  return result.hunterRevenge
}}
```

---

## Preparación para Cupido

### Database Schema

Se crearon las migraciones necesarias:

**SUPABASE_MIGRATION_CUPID.sql**:
```sql
-- Agregar include_cupid a la tabla rooms
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS include_cupid BOOLEAN DEFAULT false;

-- Agregar cupid_partner_id a la tabla players
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS cupid_partner_id UUID REFERENCES players(id) ON DELETE SET NULL;

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_players_cupid_partner ON players(cupid_partner_id);
```

### Rol de Cupido

**src/utils/roles.js**:
```javascript
CUPID: { 
  id: 'cupid', 
  name: 'Cupido', 
  emoji: '💘', 
  description: 'Al inicio del juego, flecha a 2 jugadores. Si uno muere, el otro también muere' 
}
```

### Estado en Narrator.jsx

```javascript
const [includeCupid, setIncludeCupid] = useState(false)
const [cupidArrowsSet, setCupidArrowsSet] = useState(false)
```

---

## Testing

### Test 1: Cazador Muere de Noche
```
Setup: Incluir cazador
  ↓
Noche: Lobos seleccionan al cazador
  ↓
Amanecer: Procesar muertes
  ↓
Día: Popup de cazador nocturno
  ↓
Narrador selecciona víctima
  ↓
**Verificar**: 
  ✅ Cazador aparece como MUERTO
  ✅ Víctima aparece como MUERTA
  ✅ Ambos en lista de "MUERTOS"
  ❌ Ninguno en lista de "VIVOS"
```

### Test 2: Múltiples Muertes (Lobos + Bruja + Cazador)
```
Setup: Lobos + Bruja + Cazador
  ↓
Noche:
  - Lobos matan a A
  - Bruja envenena a Cazador
  ↓
Amanecer: Procesar ambas muertes
  ↓
**Verificar**:
  ✅ A aparece muerto
  ✅ Cazador aparece muerto
  ✅ Popup de venganza aparece
  ↓
Cazador elige víctima B
  ↓
**Verificar**:
  ✅ A, Cazador, B todos muertos
  ✅ Lista de muertos correcta (3 jugadores)
  ✅ Lista de vivos correcta (no incluye a ninguno de los 3)
```

### Test 3: Votación con Cazador Vivo
```
Día: Votan y ejecutan al cazador
  ↓
Popup de cazador aparece
  ↓
Cazador elige víctima
  ↓
**Verificar**:
  ✅ Cazador aparece muerto
  ✅ Víctima aparece muerta
  ✅ Ambos en lista de muertos
```

---

## Archivos Modificados

### GameView.jsx
```javascript
✅ Modificado: killPlayer() - devuelve { updatedPlayers, hunterRevenge }
✅ Modificado: killPlayer() - acepta currentPlayers como parámetro
✅ Modificado: onNightEnd - procesa muertes en batch con estado sincronizado
✅ Modificado: onExecutePlayer - actualiza setPlayers inmediatamente
✅ Agregado: Console logs para debugging
```

### DayPhase.jsx
```javascript
✅ Modificado: handleExecute - usa nuevo formato de hunterRevenge
✅ Modificado: handleSheriffDecision - usa nuevo formato
✅ Modificado: handleHunterRevenge - pasa 'hunter' como cause
✅ Modificado: handleNightHunterRevenge - pasa 'hunter' como cause
```

### Narrator.jsx
```javascript
✅ Agregado: includeCupid state
✅ Agregado: cupidArrowsSet state
✅ Modificado: createNewGame - incluye include_cupid
✅ Modificado: assignRolesToPlayers - pasa includeCupid
✅ Modificado: localStorage - guarda cupid states
✅ Modificado: SetupView props - pasa cupid props
✅ Agregado: UI checkbox para Cupido
```

### roles.js
```javascript
✅ Agregado: ROLES.CUPID
✅ Modificado: assignRoles - acepta includeCupid
✅ Actualizado: JSDoc comments
```

### Database Schemas
```javascript
✅ Creado: SUPABASE_MIGRATION_CUPID.sql
✅ Actualizado: SUPABASE_SCHEMA.sql - incluye cupid
```

---

## Próximos Pasos (Cupido - TODO)

### 1. Actualizar SetupView
- [ ] Agregar UI para seleccionar flechados
- [ ] Mostrar quién flecha Cupido a quiénes
- [ ] Guardar cupid_partner_id en BD

### 2. Mostrar Flechados en Player App
- [ ] Mostrar corazones 💘💘 si está flechado
- [ ] Mostrar nombre de su pareja (opcional)

### 3. Implementar Muertes Enlazadas
- [ ] Cuando muere un jugador, verificar si tiene cupid_partner_id
- [ ] Si tiene, matar automáticamente a su pareja
- [ ] Funciona en TODAS las fases (noche, día, cazador, bruja)

### 4. Actualizar GameLogic
- [ ] processNightActions debe verificar parejas
- [ ] Agregar función checkCupidLinkedDeath(playerId, players)
- [ ] Devolver muertes adicionales

---

## Logs de Debug

Agregados console.logs para tracking:

```javascript
'⚠️ Jugador ya muerto o no encontrado'
'💀 Matando a ${player.name} (${cause})'
'🌅 Procesando muertes nocturnas'
'👥 Actualizando jugadores'
'🏹 Cazador muerto de noche'
'🏹 Cazador de noche mata a'
```

Estos ayudan a rastrear el flujo de muertes en la consola.

---

## Notas Importantes

### Estado Inmutable
- `currentPlayers` es una copia que se va actualizando
- Cada muerte recibe el estado fresco de la anterior
- Solo se hace `setPlayers()` UNA vez al final

### Causa de Muerte 'hunter'
- Agregado 'hunter' como causa de muerte
- Diferencia entre muerte por lobos/bruja/voto/cazador
- Historial más claro

### Retrocompatibilidad
- Todo el código anterior sigue funcionando
- Solo se agregó el parámetro opcional `currentPlayers`
- Si no se pasa, usa `players` del scope

---

**Estado**: ✅ Sincronización Fixed, 🚧 Cupido Partial  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí  
**Critical**: ✅✅ Sí (bug que rompía mecánica core del juego)  
**Next**: Implementar UI y lógica completa de Cupido

