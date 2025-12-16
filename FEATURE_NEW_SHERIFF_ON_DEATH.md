# 🌟 Feature: Selección de Nuevo Sheriff cuando Muere

**Fecha**: 16 de Diciembre, 2025

## Problema

Cuando el Sheriff moría durante el juego, el pueblo quedaba sin Sheriff permanentemente. Esto era problemático porque:
- No había forma de desempatar votaciones posteriores
- El rol de Sheriff desaparecía del juego
- No había mecánica para nombrar un sucesor

---

## Solución Implementada

### Detección Automática

El sistema ahora detecta automáticamente cuando el Sheriff ha muerto:
- Verifica `players.find(p => p.is_sheriff && !p.is_alive)`
- Funciona para muertes nocturnas (lobos, bruja, cupido)
- Funciona para muertes diurnas (votación, cazador)

### Modal de Selección

Después del anuncio de muertes, si el Sheriff murió, aparece un modal automático:

```
⭐ EL SHERIFF HA MUERTO

El pueblo necesita un nuevo Sheriff para desempatar votaciones

📋 Instrucciones:
1. El narrador puede elegir un nuevo Sheriff
2. O puede dejar el pueblo sin Sheriff
3. El Sheriff desempata las votaciones en caso de empate

[Dropdown con jugadores vivos]

[Continuar sin Sheriff] [⭐ Confirmar Nuevo Sheriff]
```

### Opciones del Narrador

El narrador tiene 2 opciones:

1. **Seleccionar nuevo Sheriff**:
   - Elige un jugador vivo del dropdown
   - Click "Confirmar Nuevo Sheriff"
   - El jugador seleccionado se convierte en Sheriff
   - Su badge ⭐ aparece en la lista

2. **Continuar sin Sheriff**:
   - Click "Continuar sin Sheriff"
   - El pueblo queda sin Sheriff
   - Los empates no se resuelven

---

## Flujo de Juego

### Escenario 1: Sheriff Muere de Noche

```
Noche → Lobos matan al Sheriff
  ↓
Amanecer → Procesar muertes
  ↓
Día → Click "Anunciar muerte"
  ↓
Mensaje: "💀 [Sheriff] ha sido asesinado por los lobos"
  ↓
Modal aparece: "⭐ EL SHERIFF HA MUERTO"
  ↓
Narrador selecciona nuevo Sheriff o continúa sin Sheriff
  ↓
Continúa fase de día normal (discusión y votación)
```

### Escenario 2: Sheriff Ejecutado en Votación

```
Día → Votación → Sheriff tiene más votos
  ↓
Click "Ejecutar al Más Votado"
  ↓
Sheriff muere
  ↓
Si Sheriff era Cazador → Popup de venganza primero
  ↓
Fin del día → Siguiente ronda
  ↓
Nuevo día → Anuncio de muerte
  ↓
Modal: "⭐ EL SHERIFF HA MUERTO"
  ↓
Narrador selecciona nuevo Sheriff
```

### Escenario 3: Sheriff Flechado por Cupido

```
Noche → Lobos matan a la pareja del Sheriff
  ↓
Sheriff muere por amor (enlace de Cupido)
  ↓
Día → Anuncio muestra ambas muertes:
  - "💀 [Pareja] ha sido asesinado por los lobos"
  - "💀 [Sheriff] ha muerto por amor (💘)"
  ↓
Modal: "⭐ EL SHERIFF HA MUERTO"
  ↓
Narrador selecciona nuevo Sheriff
```

---

## Prioridad de Popups

El orden de popups durante el día es:

```
1. 🏹 Venganza de Cazador Nocturno (si cazador murió de noche)
2. ⭐ Selección de Nuevo Sheriff (si sheriff murió)    ← NUEVO
3. 📢 Anuncio de Muertes
4. 🗳️ Fase de Discusión
5. ⭐ Desempate del Sheriff (si hay empate en votación)
6. 🏹 Venganza de Cazador (si cazador ejecutado)
```

---

## Implementación Técnica

### DayPhase.jsx

**Nuevo estado**:
```javascript
const [showSheriffSelection, setShowSheriffSelection] = useState(false)
const [newSheriffId, setNewSheriffId] = useState('')

// Detectar sheriff muerto
const sheriffDied = players.find(p => p.is_sheriff && !p.is_alive)
```

**Función de selección**:
```javascript
const handleNewSheriffSelection = async () => {
  if (!newSheriffId) {
    alert('Debes seleccionar un nuevo Sheriff')
    return
  }
  
  await onSetSheriff(newSheriffId)
  setShowSheriffSelection(false)
  setNewSheriffId('')
}

const handleSkipSheriff = () => {
  setShowSheriffSelection(false)
  setNewSheriffId('')
}
```

**Mostrar modal automáticamente**:
```javascript
const handleAnnouncement = () => {
  setDeathAnnounced(true)
  
  // Si el sheriff murió, mostrar selector después del anuncio
  if (sheriffDied && alivePlayers.length > 0) {
    setTimeout(() => {
      setShowSheriffSelection(true)
    }, 500)
  }
}
```

### GameView.jsx

**Agregar prop**:
```javascript
function GameView({ ..., onSetSheriff }) {
  // ...
}

<DayPhase
  // ...
  onSetSheriff={onSetSheriff}
/>
```

### Narrator.jsx

**Pasar función**:
```javascript
<GameView
  // ...
  onSetSheriff={setSheriff}
/>
```

La función `setSheriff` ya existía en Narrator.jsx:
```javascript
const setSheriff = async (playerId) => {
  if (!roomId) {
    alert('Error: No hay sala activa')
    return
  }
  
  try {
    // Quitar sheriff de todos primero
    await supabase
      .from('players')
      .update({ is_sheriff: false })
      .eq('room_id', roomId)
    
    // Si se seleccionó un jugador, asignarlo como sheriff
    if (playerId && playerId !== '') {
      await supabase
        .from('players')
        .update({ is_sheriff: true })
        .eq('id', playerId)
    }
    
    // Recargar jugadores
    await fetchPlayers()
    
    // Actualizar estado local inmediatamente
    setPlayers(prevPlayers => 
      prevPlayers.map(p => ({
        ...p,
        is_sheriff: p.id === playerId
      }))
    )
  } catch (error) {
    console.error('Error setting sheriff:', error)
    alert('Error al asignar Sheriff: ' + error.message)
  }
}
```

---

## UI/UX

### Modal de Selección

- **Icono**: ⭐ (estrella grande)
- **Título**: "EL SHERIFF HA MUERTO" (amarillo)
- **Subtítulo**: Explicación clara del rol
- **Instrucciones**: Lista numerada de pasos
- **Dropdown**: Muestra jugadores vivos con sus roles
- **Opciones**: 2 botones claramente diferenciados
  - Gris: "Continuar sin Sheriff"
  - Amarillo: "⭐ Confirmar Nuevo Sheriff"

### Integración Visual

- Aparece después del anuncio de muertes
- Modal centrado con fondo semitransparente
- Animación suave de entrada
- Mismo estilo que otros modales del juego

---

## Testing

### Test 1: Sheriff Muere de Noche
```
1. Setup: Asignar Sheriff al inicio
2. Noche: Lobos matan al Sheriff
3. Día: Anunciar muerte
4. **Verificar**: Modal aparece automáticamente
5. Seleccionar nuevo Sheriff
6. **Verificar**: Badge ⭐ aparece en nuevo Sheriff
7. **Verificar**: Antiguo Sheriff no tiene badge
```

### Test 2: Continuar sin Sheriff
```
1. Sheriff muere
2. Modal aparece
3. Click "Continuar sin Sheriff"
4. **Verificar**: Modal desaparece
5. **Verificar**: Ningún jugador tiene badge ⭐
6. Votación con empate
7. **Verificar**: Mensaje "No hay Sheriff para desempatar"
```

### Test 3: Sheriff Ejecutado + Nuevo Sheriff
```
1. Día: Votan y ejecutan al Sheriff
2. Fin del día
3. Siguiente día: Anunciar muerte
4. Modal aparece
5. Seleccionar nuevo Sheriff
6. **Verificar**: Nuevo Sheriff puede desempatar en esta misma ronda
```

### Test 4: Sheriff Flechado por Cupido
```
1. Cupido flecha Sheriff + otro jugador
2. Noche: Matan al otro jugador
3. Sheriff muere por amor
4. Día: Anunciar ambas muertes
5. Modal aparece
6. **Verificar**: Funciona correctamente con muerte enlazada
```

### Test 5: Último Sheriff Muere
```
1. Quedan 3 jugadores: 1 Lobo, 2 Aldeanos (uno es Sheriff)
2. Lobos matan al Sheriff
3. Día: Modal aparece
4. Seleccionar al último aldeano como Sheriff
5. **Verificar**: Funciona con pocos jugadores
```

---

## Casos Edge

### Sheriff Cazador Muere de Noche
- Primero: Popup de venganza del cazador
- Después: Popup de selección de Sheriff
- Orden correcto mantenido

### Múltiples Muertes Incluyendo Sheriff
- Sheriff + otros jugadores mueren
- Modal aparece después de anunciar TODAS las muertes
- Dropdown solo muestra supervivientes

### Sheriff Muere en Última Ronda
- Si solo quedan lobos vs Sheriff
- Modal puede no ser necesario (juego termina)
- Sistema sigue funcionando correctamente

---

## Notas Importantes

### No es Obligatorio
- El narrador puede elegir continuar sin Sheriff
- El juego funciona correctamente sin Sheriff
- Solo afecta la resolución de empates

### Timing
- Modal aparece DESPUÉS del anuncio de muertes
- Esto permite al narrador procesar qué pasó primero
- Luego decide sobre el nuevo Sheriff

### Reutiliza Código Existente
- Usa la función `setSheriff` ya existente
- Mismo sistema de actualización en BD
- Mismo patrón de estado local + BD

---

## Mejoras Futuras

- [ ] Animación especial cuando se nombra nuevo Sheriff
- [ ] Sonido de campana al nombrar Sheriff
- [ ] Historial de Sheriffs (quiénes fueron Sheriff)
- [ ] Estadística: cuántos Sheriffs hubo en la partida
- [ ] Opción para que el Sheriff anterior "nombre sucesor"

---

**Estado**: ✅ Completado  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí  
**Critical**: 🟡 Mejora de gameplay importante

