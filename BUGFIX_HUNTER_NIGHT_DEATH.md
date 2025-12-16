# 🐛 Fix: Cazador Muerto de Noche + Anuncio de Muertes

**Fecha**: 16 de Diciembre, 2025

## Problemas Reportados

El usuario reportó 2 bugs críticos relacionados con muertes nocturnas:

1. **"Nadie murió" cuando sí hubo muerte**: El cazador aparecía en la lista de muertos, pero el anuncio decía "✨ Nadie murió esta noche"

2. **Cazador no dispara venganza al morir de noche**: Cuando el cazador moría por ataque de lobos o bruja durante la noche, NO se activaba su habilidad especial de llevarse a alguien con él

---

## Causa Raíz

### Problema 1: Mensaje Incorrecto
El filtro de historial funcionaba correctamente (ya estaba arreglado en commits anteriores), pero el problema era que el mensaje en el historial no diferenciaba entre muerte por lobos y por bruja.

### Problema 2: Venganza No se Activa
La función `killPlayer()` SÍ devolvía `'hunter_revenge'` cuando moría el cazador, PERO:

**En muertes de votación (día)**: ✅ Se capturaba el resultado
```javascript
const result = killPlayer(playerId, 'vote')
if (result === 'hunter_revenge') {
  setHunterRevenge(true) // ✅ Funciona
}
```

**En muertes de noche**: ❌ Se ignoraba el resultado
```javascript
deaths.forEach(death => {
  killPlayer(death.playerId, death.cause) // ❌ No se captura el return
})
```

El resultado nunca se capturaba, por lo que el cazador moría pero su habilidad no se activaba.

---

## Solución Implementada

### 1. Mejorar Mensajes de Historial

Ahora `killPlayer()` genera mensajes específicos por tipo de muerte:

```javascript
// Antes
message = `${player.name} ha muerto (${cause === 'wolves' ? 'lobos' : 'votación'})`

// Ahora
if (cause === 'wolves') {
  message = `${player.name} ha muerto (lobos)`
} else if (cause === 'witch') {
  message = `${player.name} ha muerto (bruja)`
} else if (cause === 'vote') {
  message = `${player.name} ha muerto (votación)`
} else {
  message = `${player.name} ha muerto`
}
```

### 2. Devolver Objeto en Lugar de String

Para mejor manejo de información del cazador:

```javascript
// Antes
if (player.role === 'hunter') {
  return 'hunter_revenge'
}

// Ahora
if (player.role === 'hunter') {
  return { 
    type: 'hunter_revenge',
    hunterId: playerId,
    hunterName: player.name
  }
}
```

### 3. Capturar Venganza en Muertes Nocturnas

Modificado `onNightEnd` en GameView:

```javascript
onNightEnd={(deaths) => {
  console.log('🌅 Procesando muertes nocturnas:', deaths)
  
  let hunterRevengeData = null
  
  deaths.forEach(death => {
    const result = killPlayer(death.playerId, death.cause)
    
    // Si murió un cazador, guardar para el día
    if (result && result.type === 'hunter_revenge') {
      console.log('🏹 Cazador muerto de noche:', result)
      hunterRevengeData = result
    }
  })
  
  // Si hubo cazador, guardarlo para mostrarlo al inicio del día
  if (hunterRevengeData) {
    setPendingHunterRevenge(hunterRevengeData)
  }
  
  changePhase('day')
}}
```

### 4. Nuevo Estado para Venganza Pendiente

Agregado en GameView:

```javascript
const [pendingHunterRevenge, setPendingHunterRevenge] = useState(null)
```

Este estado guarda la información del cazador que murió de noche para procesarla al inicio del día.

### 5. Nuevo Popup de Venganza Nocturna

Agregado en DayPhase con **MÁXIMA PRIORIDAD**:

```javascript
// Popup de venganza del cazador que murió de noche (PRIORIDAD)
if (showNightHunterRevenge && pendingHunterRevenge) {
  return (
    <div>
      <h2>¡CAZADOR ELIMINADO DURANTE LA NOCHE!</h2>
      <p>{pendingHunterRevenge.hunterName} era el Cazador</p>
      <p>Murió durante la noche pero puede llevarse a alguien con él</p>
      
      {/* Selector de víctima */}
      <select value={revengeTarget} onChange={...}>
        {alivePlayers.map(player => ...)}
      </select>
      
      <button onClick={handleNightHunterRevenge}>
        💀 Confirmar Venganza del Cazador
      </button>
    </div>
  )
}
```

Este popup aparece **ANTES** del anuncio de muertes, asegurando que el cazador ejecute su venganza primero.

### 6. Orden de Prioridad de Popups

```
1. 🏹 Venganza de Cazador (murió de noche)     ← NUEVO
2. ⭐ Desempate del Sheriff                    
3. 🏹 Venganza de Cazador (murió de votación)  
4. 📢 Anuncio de muertes                       
5. 🗳️ Votación                                  
```

### 7. Actualizar Comparaciones

Como ahora `killPlayer()` devuelve objeto, se actualizaron las comparaciones:

```javascript
// Antes
if (result === 'hunter_revenge') {
  setHunterRevenge(true)
}

// Ahora
if (result && result.type === 'hunter_revenge') {
  setHunterRevenge(true)
}
```

---

## Flujo Completo

### Escenario: Lobos Matan al Cazador

#### 1. Fase de Noche
```
Lobos seleccionan → Cazador
Bruja decide → No intervenir
Amanecer → Procesar
```

#### 2. Procesamiento (onNightEnd)
```javascript
deaths = [{ playerId: 'cazador-id', cause: 'wolves' }]

// killPlayer detecta cazador
result = {
  type: 'hunter_revenge',
  hunterId: 'cazador-id',
  hunterName: 'fire guy'
}

// Se guarda en pendingHunterRevenge
setPendingHunterRevenge(result)

// Cambiar a día
changePhase('day')
```

#### 3. Inicio de Día
```
DayPhase detecta: pendingHunterRevenge !== null
↓
Muestra popup: "¡CAZADOR ELIMINADO DURANTE LA NOCHE!"
↓
Narrador pregunta al cazador a quién elegir
↓
Narrador selecciona víctima
↓
Click "Confirmar Venganza"
↓
Víctima muere
↓
setShowNightHunterRevenge(false)
↓
Continúa con anuncio de muertes normal
```

#### 4. Anuncio de Muertes
```
"💀 fire guy ha sido asesinado por los lobos durante la noche"
"💀 [víctima del cazador] ha muerto (votación)"
```

---

## Archivos Modificados

### GameView.jsx
```javascript
✅ Agregado: pendingHunterRevenge state
✅ Modificado: killPlayer() - devuelve objeto con más info
✅ Modificado: killPlayer() - mensajes específicos por causa
✅ Modificado: onNightEnd - captura hunter_revenge
✅ Modificado: DayPhase props - pasa pendingHunterRevenge
✅ Modificado: onDayEnd - limpia pendingHunterRevenge
```

### DayPhase.jsx
```javascript
✅ Agregado: pendingHunterRevenge prop
✅ Agregado: onHunterRevengeComplete prop
✅ Agregado: showNightHunterRevenge state
✅ Agregado: handleNightHunterRevenge function
✅ Agregado: Popup de venganza nocturna (prioridad máxima)
✅ Modificado: Comparaciones de hunter_revenge (string → object)
```

---

## Testing

### Test 1: Lobos Matan al Cazador
1. Setup: Incluir cazador
2. Noche: Lobos seleccionan al cazador
3. Amanecer: Procesar
4. **Verificar**: Antes de anunciar muertes, aparece popup
   - ✅ "¡CAZADOR ELIMINADO DURANTE LA NOCHE!"
   - ✅ Muestra nombre del cazador
   - ✅ Selector de víctima disponible
5. **Narrador**: Pregunta al cazador, selecciona víctima
6. **Click**: "Confirmar Venganza"
7. **Verificar**: 
   - ✅ Víctima elegida muere
   - ✅ Popup desaparece
   - ✅ Ahora se anuncia muerte del cazador
   - ✅ Se anuncia muerte de la víctima del cazador

### Test 2: Bruja Envenena al Cazador
1. Setup: Incluir bruja y cazador
2. Noche: Bruja envenena al cazador
3. Amanecer: Procesar
4. **Verificar**: Mismo flujo que Test 1
   - ✅ Popup aparece primero
   - ✅ Cazador puede elegir víctima
   - ✅ Se anuncia: "ha muerto (bruja)"

### Test 3: Múltiples Muertes con Cazador
1. Setup: Lobos + Bruja + Cazador
2. Noche: 
   - Lobos matan a jugador A
   - Bruja envenena al cazador
3. **Verificar**:
   - ✅ Popup de cazador aparece PRIMERO
   - ✅ Después se anuncian 3 muertes:
     - Jugador A (lobos)
     - Cazador (bruja)
     - Víctima del cazador (votación)

### Test 4: Cazador NO Muere de Noche
1. Noche: Lobos matan a aldeano normal
2. Día: Anuncio normal de muerte
3. **Verificar**: 
   - ❌ NO aparece popup de cazador
   - ✅ Flujo normal del día

### Test 5: Cazador Muere en Votación (Caso Anterior)
1. Día: Votan y ejecutan al cazador
2. **Verificar**: 
   - ✅ Popup de cazador aparece (el de votación)
   - ✅ Funciona como antes

---

## Logs de Debug

Agregados console.logs para debugging:

```javascript
console.log('🌅 Procesando muertes nocturnas:', deaths)
console.log('🏹 Cazador muerto de noche:', result)
console.log('🏹 Cazador de noche mata a:', revengeTarget)
```

Estos ayudan a rastrear el flujo del cazador en la consola del navegador.

---

## Notas Importantes

### Prioridad del Popup
El popup del cazador nocturno tiene la **máxima prioridad** porque:
- Debe resolverse antes de anunciar muertes
- Las muertes deben incluir la víctima del cazador
- Mantiene el orden lógico: "procesar acciones → anunciar resultados"

### Limpieza de Estado
`pendingHunterRevenge` se limpia en dos momentos:
1. Después de completar la venganza (`onHunterRevengeComplete`)
2. Al finalizar el día (`onDayEnd`)

Esto evita que el popup reaparezca incorrectamente.

### Retrocompatibilidad
- Las muertes de votación siguen funcionando igual
- El popup de cazador en votación no se afecta
- Solo se agrega un nuevo caso (muerte nocturna)

---

## Mejoras Futuras Sugeridas

- [ ] Animación de transición entre popup y anuncio
- [ ] Sonido cuando aparece el popup del cazador
- [ ] Mostrar causa de muerte en la lista de muertos
- [ ] Historial más detallado con íconos por tipo

---

**Estado**: ✅ Completado  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí  
**Critical**: ✅ Sí (bug que rompía mecánica core del juego)

