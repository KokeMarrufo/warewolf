# 🐛 Fix: Múltiples Problemas Críticos

**Fecha**: 16 de Diciembre, 2025

## Resumen

Se corrigieron 4 bugs críticos reportados por el usuario que afectaban la experiencia de juego:

1. ✅ Color del card del lobo se refleja en lentes
2. ✅ No se puede cambiar configuración al jugar otra ronda
3. ✅ Dice "nadie ha muerto" cuando los lobos sí mataron
4. ✅ Roles no se actualizan sin refrescar en nueva ronda

---

## 1. 🎨 Color del Card se Refleja en Lentes

### Problema
Cuando un jugador revelaba su rol de lobo, el **fondo completo de la pantalla** cambiaba a rojo brillante, lo cual se reflejaba en los lentes de otros jugadores que estaban cerca, revelando involuntariamente que era lobo.

### Solución
- Cambié el fondo para que **SIEMPRE** sea gris oscuro/neutro
- Eliminé los colores de fondo dinámicos por rol
- El color del rol solo está **dentro del card**, no en toda la pantalla

### Antes
```javascript
// Fondo cambiaba según el rol
roleColors = {
  wolf: 'from-red-600 to-red-800',    // 🔴 REFLEJO VISIBLE
  seer: 'from-blue-600 to-blue-800',
  // ...
}
<div className={roleVisible ? roleColors[playerRole] : 'gray'}>
```

### Ahora
```javascript
// Fondo SIEMPRE igual
<div className="from-gray-800 to-gray-900">
  {/* Solo el card interior tiene color si el rol está visible */}
</div>
```

**Archivos modificados**:
- `src/pages/Player.jsx`

---

## 2. ⚙️ No se Puede Cambiar Configuración en "Jugar Otra Ronda"

### Problema
Cuando el narrador hacía clic en "Jugar Otra Ronda", volvía al setup pero **no podía cambiar**:
- Número de lobos
- Roles especiales (Vidente, Bruja, Cazador, Niña)

La configuración quedaba "bloqueada" en la selección original.

### Solución
- Agregué la **configuración completa al SetupView**
- Ahora el narrador puede ajustar todos los parámetros antes de reasignar roles
- La configuración es editable cada vez que se está en el setup

### Nueva UI en SetupView

```
┌─────────────────────────────────────┐
│ ⚙️ Configuración de Roles           │
│                                     │
│ Número de Lobos 🐺: [2]            │
│                                     │
│ ☑ Incluir Vidente 👁️               │
│ ☑ Incluir Bruja 🧙‍♀️                │
│ ☐ Incluir Cazador 🏹                │
│ ☐ Incluir Niña 👧                   │
└─────────────────────────────────────┘

Paso 1: Reunir jugadores...
Paso 2: Asignar roles...
```

**Archivos modificados**:
- `src/pages/Narrator.jsx` - Agregadas props de configuración a SetupView
- `src/components/narrator/SetupView.jsx` - Nueva UI de configuración

---

## 3. 💀 "Nadie Ha Muerto" Cuando Lobos Sí Mataron

### Problema
Cuando los lobos mataban a alguien durante la noche, al llegar el día, la pantalla mostraba:
```
✨ Nadie murió esta noche
```

Pero la persona SÍ había muerto (aparecía en la lista de muertos).

### Causa Raíz
El filtro de historial no era específico. Usaba `.slice(-2)` que tomaba las últimas 2 muertes del historial **completo**, incluyendo rondas anteriores.

```javascript
// ❌ ANTES (Bug)
lastNightDeaths = gameState.history
  .filter(e => e.type === 'wolves' || e.type === 'witch')
  .slice(-2) // Podía tomar muertes de rondas pasadas
```

### Solución
Filtrar específicamente por:
- Tipo de muerte (wolves o witch)
- **Ronda actual** (gameState.round)
- **Fase nocturna** (phase === 'night')

```javascript
// ✅ AHORA (Correcto)
lastNightDeaths = gameState.history
  .filter(e => 
    (e.type === 'wolves' || e.type === 'witch') && 
    e.round === gameState.round && 
    e.phase === 'night'
  )
```

**Archivos modificados**:
- `src/components/narrator/DayPhase.jsx`

---

## 4. 🔄 Roles No se Actualizan Sin Refrescar

### Problema
Cuando el narrador jugaba otra ronda con los mismos jugadores y reasignaba roles, los jugadores veían su **rol viejo** hasta que refrescaban la página manualmente.

**Flujo problemático**:
1. Jugador A es Lobo en ronda 1
2. Narrador hace "Jugar Otra Ronda"
3. Narrador reasigna roles: Jugador A ahora es Aldeano
4. ❌ Jugador A sigue viendo "🐺 LOBO" en su pantalla
5. ✅ Solo al refrescar ve "👤 ALDEANO"

### Solución
Agregué **polling continuo** en la pantalla de rol para detectar cambios:

#### Nuevo `useEffect` en Player.jsx
```javascript
// Polling para detectar cambios de rol (cuando juegan otra ronda)
useEffect(() => {
  if (screen === 'role' && playerId) {
    const interval = setInterval(async () => {
      await checkForRoleUpdate(playerId)
    }, 3000)
    
    return () => clearInterval(interval)
  }
}, [screen, playerId, playerRole])
```

#### Nueva función `checkForRoleUpdate`
```javascript
const checkForRoleUpdate = async (pId) => {
  // Obtener datos actuales del jugador
  const { data } = await supabase
    .from('players')
    .select('*, room_id')
    .eq('id', pId)
    .single()
  
  // Si el rol cambió, actualizar
  if (data.role && data.role !== playerRole) {
    console.log('🔄 Rol actualizado:', data.role)
    setPlayerRole(data.role)
    setRoleVisible(false) // Ocultar para revelar de nuevo
    
    // Actualizar compañeros si es lobo
    if (data.role === 'wolf') {
      // Cargar otros lobos...
    }
  }
  
  // Si el rol se borró (reseteo), volver a waiting
  if (!data.role) {
    console.log('🔄 Rol removido, esperando nueva asignación')
    setScreen('waiting')
  }
}
```

### Comportamiento Ahora

**Escenario 1: Rol Cambia**
1. Narrador reasigna roles
2. Jugador detecta cambio automáticamente (3 segundos)
3. Rol se oculta automáticamente
4. Jugador hace "Tap para revelar" y ve su **nuevo rol**

**Escenario 2: Rol Se Borra** (antes de reasignar)
1. Narrador resetea para nueva ronda
2. Roles se borran en BD
3. Jugador detecta que no tiene rol
4. Automáticamente vuelve a pantalla "Esperando..."

**Archivos modificados**:
- `src/pages/Player.jsx`

---

## Resumen Técnico

### Archivos Modificados
```
✅ src/pages/Player.jsx
   - Fondo siempre gris (no refleja)
   - Polling continuo para detectar cambios de rol
   - Función checkForRoleUpdate

✅ src/pages/Narrator.jsx
   - Props de configuración a SetupView

✅ src/components/narrator/SetupView.jsx
   - UI de configuración editable
   - Inputs para cambiar lobos y roles

✅ src/components/narrator/DayPhase.jsx
   - Filtro correcto de muertes nocturnas
   - Por ronda y fase específica
```

### Líneas de Código
- **Agregadas**: ~150 líneas
- **Modificadas**: ~50 líneas
- **Eliminadas**: ~10 líneas

---

## Testing

### Test 1: Color del Card
1. Únete como jugador con rol de lobo
2. Revela tu rol
3. Verifica que el **fondo de la pantalla sigue siendo gris**
4. Verifica que el color rojo está solo **dentro del card**

### Test 2: Configuración Editable
1. Inicia una partida con 1 lobo
2. Haz clic en "Jugar Otra Ronda"
3. En el setup, verifica que puedes:
   - ✅ Cambiar número de lobos a 2
   - ✅ Marcar/desmarcar roles especiales
4. Asigna roles y verifica que usa la nueva configuración

### Test 3: "Nadie Ha Muerto"
1. Los lobos matan a alguien en la noche
2. Procesa el amanecer
3. En la fase de día, verifica que muestra:
   - ✅ "💀 [Nombre] ha sido asesinado por los lobos"
   - ❌ NO muestra "Nadie murió esta noche"

### Test 4: Actualización Automática de Roles
1. Jugador A ve su rol (ej: Lobo)
2. Narrador hace "Jugar Otra Ronda"
3. Narrador reasigna roles
4. **Espera ~3 segundos** (sin refrescar)
5. Jugador A detecta automáticamente el cambio:
   - ✅ Rol se oculta
   - ✅ Mensaje "Toca para revelar tu rol"
   - ✅ Al revelar, muestra el nuevo rol

---

## Notas de Implementación

### Polling Eficiente
- Solo hace polling en las pantallas necesarias ('waiting' y 'role')
- Intervalo de 3 segundos (equilibrio entre responsividad y carga)
- Se limpia correctamente al desmontar componentes

### Configuración Persistente
- Los cambios de configuración se guardan en localStorage
- Se aplican inmediatamente sin necesidad de crear nueva partida
- Compatible con "Jugar Otra Ronda"

### Filtrado de Historial
- Ahora usa triple filtro: tipo + ronda + fase
- Evita conflictos con muertes de rondas anteriores
- Funciona correctamente con múltiples muertes (lobo + bruja)

---

## Mejoras Futuras Sugeridas

- [ ] Notificación visual cuando el rol cambia (toast/alert)
- [ ] Animación de transición al cambiar de rol
- [ ] Indicador de "Actualizando..." durante el polling
- [ ] Opción de desactivar polling para ahorrar batería

---

**Estado**: ✅ Todos los bugs corregidos  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí

