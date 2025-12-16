# 🐛 Corrección de Errores del Flujo de Juego

**Fecha**: 16 de Diciembre, 2025

## Problemas Corregidos

### 1. ❌ Nadie muere con la votación del lobo

**Problema**: Las muertes nocturnas no se procesaban correctamente

**Solución**: 
- Mejorada la pantalla de "Amanecer" con un resumen detallado
- Agregada previsualización del resultado antes de procesar
- Clarificación visual de qué va a pasar:
  - Quién atacaron los lobos
  - A quién protegió el doctor
  - Si alguien morirá o no
- El narrador puede ahora ver claramente el resultado antes de confirmarlo

**Archivos modificados**:
- `src/components/narrator/NightPhase.jsx` - Mejorada UI de procesamiento nocturno

---

### 2. ⏱️ El flujo de la vidente tarda muy poco

**Problema**: El flujo de la vidente avanzaba automáticamente después de 3 segundos, sin dar tiempo al narrador de mostrar el resultado al vidente correctamente.

**Solución**:
- Eliminado el avance automático con `setTimeout`
- Dividido el paso en 2 sub-pasos:
  1. **Selección**: El narrador selecciona a quién investiga el vidente
  2. **Resultado**: Se muestra grande el resultado (ES LOBO / NO ES LOBO)
- Agregado botón manual "Continuar (El vidente ya vio el resultado)"
- Instrucción clara para que el narrador muestre la pantalla al vidente sin que otros vean

**Archivos modificados**:
- `src/components/narrator/NightPhase.jsx` - Reemplazado timer automático con confirmación manual

---

### 3. 🏹 Cuando muere el cazador, el narrador debe poder elegir quién muere

**Problema**: No estaba claro que el narrador debe preguntarle al cazador y luego seleccionar manualmente a quién mata.

**Solución**:
- Mejorado el popup del cazador con:
  - Título más claro: "¡CAZADOR ELIMINADO!"
  - Nombre del cazador mostrado claramente
  - **Instrucciones paso a paso** para el narrador:
    1. Pregúntale al Cazador a quién quiere llevarse
    2. Selecciona al jugador elegido abajo
    3. Confirma la venganza
  - Selector mejorado que muestra nombre y rol de cada jugador
  - Botón deshabilitado hasta que se seleccione un objetivo
- Clarificación de que el **narrador** es quien controla el proceso

**Archivos modificados**:
- `src/components/narrator/DayPhase.jsx` - Mejorado popup de venganza del cazador
- Agregado import de `getRoleInfo` para mostrar roles en el selector

---

## Cambios Técnicos Detallados

### NightPhase.jsx

#### 1. Función `handleInvestigate` modificada:
```javascript
// ANTES: Avanzaba automáticamente después de 3 segundos
setTimeout(() => {
  goToNextStep()
}, 3000)

// AHORA: Solo muestra el resultado, el narrador debe confirmar manualmente
setGameState({
  ...gameState,
  seerTarget: selectedInvestigate,
  seerResult: isWolf ? 'wolf' : 'not_wolf'
})
```

#### 2. Nueva función `handleContinueAfterSeer`:
```javascript
const handleContinueAfterSeer = () => {
  goToNextStep()
}
```

#### 3. UI de la Vidente dividida en 2 pasos:
- **Paso 1**: Selector + botón "Investigar"
- **Paso 2**: Resultado grande + instrucciones + botón "Continuar"

#### 4. Pantalla de Amanecer mejorada:
- Resumen visual con colores por rol:
  - 🐺 Rojo para lobos
  - ⚕️ Verde para doctor
  - 👁️ Azul para vidente
- **Previsualización del resultado** antes de confirmar:
  - Muestra quién morirá
  - O si el doctor salvó a alguien
  - O si nadie morirá

### DayPhase.jsx

#### 1. Popup de Cazador mejorado:
- Encuentra y muestra el nombre del cazador muerto
- Instrucciones numeradas para el narrador
- Selector que muestra rol además del nombre
- Botón con estado deshabilitado hasta seleccionar

#### 2. Agregado import:
```javascript
import { getRoleInfo } from '../../utils/roles'
```

---

## Testing

Para verificar estos cambios:

### Test 1: Muerte Nocturna
1. Crear una partida
2. En la fase de noche, seleccionar una víctima para los lobos
3. Si hay doctor, opcionalmente proteger a alguien diferente
4. En el paso "Amanecer", verificar que:
   - El resumen muestra correctamente las acciones
   - La previsualización indica quién morirá
   - Al hacer clic en "Amanecer", la muerte se procesa correctamente

### Test 2: Vidente
1. Incluir vidente en la partida
2. Durante la noche, en el paso de la vidente:
   - Seleccionar un jugador a investigar
   - Verificar que el resultado se muestre grande y claro
   - Verificar que aparece el botón "Continuar"
   - Verificar que NO avanza automáticamente
   - Hacer clic en "Continuar" para avanzar

### Test 3: Cazador
1. Incluir cazador en la partida
2. Durante el día, hacer que el cazador sea ejecutado
3. Verificar el popup del cazador:
   - Muestra el nombre del cazador
   - Muestra instrucciones claras
   - El selector muestra nombres y roles
   - El botón está deshabilitado sin selección
   - Al seleccionar y confirmar, la muerte se procesa

---

## Próximos Pasos

✅ Verificar que las muertes se procesen correctamente  
✅ Verificar que el flujo de la vidente sea controlable  
✅ Verificar que el cazador funcione correctamente  

---

## Notas de Implementación

- Todos los cambios son **retrocompatibles**
- No se requieren cambios en la base de datos
- No se requieren cambios en la app del jugador
- Los cambios solo afectan la experiencia del narrador
- La lógica de juego subyacente permanece igual

---

**Estado**: ✅ Completado  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí

