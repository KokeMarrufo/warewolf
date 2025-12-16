# 🐛 Fix: Lobos no seleccionan víctima

**Fecha**: 16 de Diciembre, 2025

## Problema Reportado

El usuario reportaba que en la pantalla de "Amanecer" seguía apareciendo el mensaje:
```
⚠️ Los lobos no seleccionaron víctima
```

Incluso cuando el narrador SÍ había seleccionado una víctima durante la fase de los lobos.

---

## Causa Raíz

### El Problema de las Actualizaciones de Estado Múltiples

En React, cuando llamas a `setState` múltiples veces en rápida sucesión, las actualizaciones pueden ser "batcheadas" (agrupadas) y la segunda llamada puede sobrescribir la primera si ambas usan el mismo objeto base.

**Código problemático**:
```javascript
const handleSelectVictim = () => {
  // Primera actualización: Guardar wolfTarget
  setGameState({
    ...gameState,
    wolfTarget: selectedVictim
  })
  
  // Segunda actualización: Avanzar al siguiente paso
  goToNextStep() // Esto internamente hace otro setGameState
}

const goToNextStep = () => {
  setGameState({
    ...gameState,  // ⚠️ Aquí gameState aún no tiene wolfTarget!
    currentStep: gameState.currentStep + 1
  })
}
```

**¿Qué pasaba?**
1. Se llamaba `setGameState` para guardar `wolfTarget`
2. Inmediatamente se llamaba `goToNextStep()`
3. `goToNextStep()` hacía otro `setGameState` usando el `gameState` viejo (sin `wolfTarget`)
4. La segunda actualización sobrescribía la primera
5. El `wolfTarget` se perdía

---

## Solución Implementada

### 1. Combinar Actualizaciones de Estado

En lugar de hacer dos llamadas separadas a `setGameState`, ahora hacemos una sola que incluye TODOS los cambios:

```javascript
const handleSelectVictim = () => {
  if (!selectedVictim) {
    alert('Selecciona una víctima')
    return
  }
  
  console.log('🐺 Confirmando víctima:', selectedVictim)
  
  // ✅ Una sola actualización con TODOS los cambios
  const newState = {
    ...gameState,
    wolfTarget: selectedVictim,      // Guardar víctima
    currentStep: gameState.currentStep + 1  // Y avanzar paso
  }
  
  console.log('🐺 Nuevo estado:', newState)
  setGameState(newState)
}
```

### 2. Misma Solución para el Doctor

Aplicamos la misma corrección a `handleProtect`:

```javascript
const handleProtect = () => {
  if (!selectedProtect) {
    alert('Selecciona a quien proteger')
    return
  }
  
  // ✅ Actualización atómica
  setGameState({
    ...gameState,
    doctorTarget: selectedProtect,
    currentStep: gameState.currentStep + 1
  })
}
```

### 3. Corrección para la Vidente

```javascript
const handleContinueAfterSeer = () => {
  // ✅ Avanzar preservando todos los datos acumulados
  setGameState({
    ...gameState,
    currentStep: gameState.currentStep + 1
  })
}
```

---

## Mejoras de UI y Debugging

### 1. Confirmación Visual al Seleccionar Víctima

Ahora cuando el narrador selecciona una víctima, ve una confirmación inmediata:

```
┌──────────────────────────────────────┐
│ ✓ Víctima seleccionada: María        │
└──────────────────────────────────────┘

[✓ Confirmar y Continuar →]
```

**Antes**: El selector estaba vacío, sin feedback
**Ahora**: Se muestra claramente quién fue seleccionado

### 2. Botón Deshabilitado sin Selección

```javascript
<button
  onClick={handleSelectVictim}
  disabled={!selectedVictim}
  className="..."
>
  {selectedVictim 
    ? '✓ Confirmar y Continuar →' 
    : '⚠️ Selecciona una víctima'}
</button>
```

**Beneficios**:
- No se puede avanzar sin seleccionar
- Mensaje claro de lo que falta

### 3. Información de Debug en Resumen

En la pantalla de "Amanecer", ahora se muestra información de debug:

```
┌──────────────────────────────────────┐
│ 🐺 Lobos atacaron a: María           │
│ Debug: wolfTarget = abc123           │
└──────────────────────────────────────┘
```

O si NO hay víctima:
```
┌──────────────────────────────────────┐
│ ⚠️ Los lobos no seleccionaron        │
│    víctima                            │
│ Debug: wolfTarget = undefined        │
│        (tipo: undefined)              │
└──────────────────────────────────────┘
```

**Beneficios**:
- Podemos ver exactamente qué valor tiene `wolfTarget`
- Podemos ver si es un problema de guardado o de lookup

### 4. Console.logs Detallados

Agregamos logs en puntos clave:

```javascript
// Al seleccionar víctima
console.log('🐺 Lobo selecciona:', e.target.value)

// Al confirmar víctima
console.log('🐺 Confirmando víctima:', selectedVictim)
console.log('🐺 Estado actual:', gameState)
console.log('🐺 Nuevo estado:', newState)

// Al procesar la noche
console.log('☀️ Procesando noche...')
console.log('☀️ gameState completo:', gameState)
console.log('☀️ wolfTarget:', gameState.wolfTarget)
console.log('☀️ doctorTarget:', gameState.doctorTarget)
```

**Beneficios**:
- Podemos rastrear el flujo completo del dato
- Podemos ver exactamente cuándo y cómo cambia el estado
- Facilita debugging de problemas futuros

---

## Archivos Modificados

```
✅ src/components/narrator/NightPhase.jsx
   - handleSelectVictim: Combinar guardado + avance de paso
   - handleProtect: Misma corrección
   - handleContinueAfterSeer: Preservar estado al avanzar
   - UI: Confirmación visual de selección
   - UI: Botón deshabilitado sin selección
   - UI: Debug info en pantalla de resumen
   - Debug: Console.logs detallados
```

---

## Testing

### Test 1: Verificar que se guarda la víctima
1. Inicia una partida
2. En fase de noche, paso de lobos:
   - Selecciona una víctima del dropdown
   - Verifica que aparece "✓ Víctima seleccionada: [Nombre]"
   - Haz clic en "✓ Confirmar y Continuar"
3. Avanza hasta "Amanecer"
4. Verifica en el resumen:
   - ✅ Debe decir: "🐺 Lobos atacaron a: [Nombre]"
   - ✅ Debug debe mostrar: "wolfTarget = [ID]"

### Test 2: Verificar logs en consola
1. Abre DevTools (F12) → Consola
2. Realiza el flujo de noche completo
3. Verifica que aparecen los logs:
   - 🐺 Al seleccionar víctima
   - 🐺 Al confirmar víctima
   - ☀️ Al procesar la noche

### Test 3: Verificar muerte efectiva
1. Completa la fase de noche con víctima seleccionada
2. Haz clic en "☀️ Amanecer - Procesar y Revelar"
3. En fase de día, verifica:
   - ✅ El jugador seleccionado aparece en "MUERTOS"
   - ✅ Ya no está en la lista de vivos
   - ✅ El historial muestra la muerte

### Test 4: Caso con doctor
1. Incluye doctor en la configuración
2. Durante la noche:
   - Lobos seleccionan jugador A
   - Doctor protege al jugador A
3. En "Amanecer", verifica:
   - Resumen muestra ambas acciones
   - Previsualización dice "✨ Nadie morirá (el doctor salvó a la víctima)"
   - Al procesar, nadie muere

---

## Por Qué Esta Solución Funciona

### Atomicidad de Estado

Al combinar todas las actualizaciones en una sola llamada a `setGameState`, garantizamos que:
1. Todos los cambios se aplican juntos
2. No hay race conditions
3. No hay sobrescritura de datos
4. El estado se mantiene consistente

### Principio de React

Esta es la forma correcta de actualizar estado en React cuando:
- Necesitas cambiar múltiples propiedades
- Las actualizaciones están relacionadas
- Necesitas garantizar que todos los cambios se apliquen

---

## Alternativas Consideradas

### Alternativa 1: Callback de setState
```javascript
setGameState(prevState => ({
  ...prevState,
  wolfTarget: selectedVictim
}))
```
**Rechazada**: Todavía tendríamos dos llamadas separadas

### Alternativa 2: useEffect para sincronización
```javascript
useEffect(() => {
  if (wolfTargetJustSet) {
    goToNextStep()
  }
}, [wolfTarget])
```
**Rechazada**: Demasiado complejo, introduce side effects innecesarios

### Alternativa 3: Solución actual (elegida) ✅
```javascript
setGameState({
  ...gameState,
  wolfTarget: selectedVictim,
  currentStep: gameState.currentStep + 1
})
```
**Elegida**: Simple, directa, efectiva

---

## Notas Adicionales

### Los console.logs son temporales

Los `console.log` agregados son para debugging y pueden ser removidos una vez confirmado que todo funciona correctamente. Sin embargo, es útil dejarlos durante las pruebas iniciales.

### Debug UI puede ser removido

La información de debug en la UI ("Debug: wolfTarget = ...") también es temporal y puede ocultarse o removerse en producción.

---

## Resumen Visual del Flujo

### ANTES (❌ Buggy)
```
Usuario selecciona víctima
    ↓
handleSelectVictim()
    ↓
setGameState({ wolfTarget: X })  ← Llamada 1
    ↓
goToNextStep()
    ↓
setGameState({ currentStep: Y }) ← Llamada 2 (sobrescribe!)
    ↓
wolfTarget se pierde ❌
```

### AHORA (✅ Fixed)
```
Usuario selecciona víctima
    ↓
handleSelectVictim()
    ↓
setGameState({ 
  wolfTarget: X,
  currentStep: Y 
}) ← Una sola llamada atómica
    ↓
Ambos valores se guardan ✅
```

---

**Estado**: ✅ Completado  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí  
**Debug tools**: ✅ Agregadas

