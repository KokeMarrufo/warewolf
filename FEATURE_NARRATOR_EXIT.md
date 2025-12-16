# 🚪 Feature: Narrador puede salir de la partida

**Fecha**: 16 de Diciembre, 2025

## Descripción

Ahora el **Narrador** puede salir de una partida en curso en cualquier momento, permitiéndole terminar la sesión actual e iniciar una nueva partida.

---

## ¿Por qué era necesario?

**Problema anterior**:
- El narrador quedaba "atrapado" en una partida una vez iniciada
- No había forma de cancelar una partida en progreso
- Si algo salía mal, el narrador no podía empezar de nuevo
- Tenía que esperar hasta que terminara el juego o cerrar la aplicación

**Solución**:
- Botón "🚪 Salir" visible durante toda la partida
- Modal de confirmación para evitar salidas accidentales
- Limpieza automática del estado y la sala en la base de datos

---

## Funcionalidad Implementada

### 1. Botón de Salida en el Header

Durante la partida (fase de juego), el narrador ve un botón "🚪 Salir" en la esquina superior derecha:

```
┌─────────────────────────────────────────────┐
│  🌙 NOCHE 1              3 vivos    🚪 Salir │
│  Código: LOBO42          2 muertos           │
└─────────────────────────────────────────────┘
```

**Ubicación**: Header del GameView, al lado de los contadores de jugadores

---

### 2. Modal de Confirmación

Al hacer clic en "Salir", aparece un modal de confirmación:

```
┌─────────────────────────────────────┐
│              ⚠️                      │
│                                      │
│      ¿Salir de la partida?          │
│                                      │
│  Esta acción terminará la partida   │
│  actual y no se podrá recuperar     │
│  el progreso.                        │
│                                      │
│  ⚠️ Advertencia: Todos los          │
│  jugadores perderán acceso a la     │
│  sala y tendrán que unirse a        │
│  una nueva partida.                 │
│                                      │
│  ┌──────────┐  ┌─────────────────┐ │
│  │❌ Cancelar│  │✓ Salir de la    │ │
│  └──────────┘  │  Partida        │ │
│                └─────────────────┘ │
└─────────────────────────────────────┘
```

**Opciones**:
- **❌ Cancelar**: Cierra el modal y regresa al juego
- **✓ Salir de la Partida**: Confirma la salida y termina la partida

---

### 3. Proceso de Salida

Cuando el narrador confirma la salida:

1. ✅ Se elimina la sala de la base de datos
2. ✅ Se limpia el `localStorage` del narrador
3. ✅ Se resetea todo el estado local
4. ✅ El narrador regresa a la pantalla inicial
5. ✅ Los jugadores quedarán en la sala pero podrán usar su botón "Salir de la Sala" para unirse a otra

---

## Experiencia del Usuario

### Para el Narrador

**Durante Setup** (configuración de jugadores):
- Ya existía un botón "← Volver" que permite cancelar antes de empezar
- Funcionaba igual que antes

**Durante la Partida** (juego en curso):
- Nuevo botón "🚪 Salir" siempre visible
- Confirmación obligatoria para evitar errores
- Salida rápida y limpia

**Después de la salida**:
- Regresa a la pantalla inicial
- Puede crear una nueva partida inmediatamente
- Todo el estado anterior se borra

### Para los Jugadores

Cuando el narrador sale:
- Los jugadores permanecen en su vista actual
- No reciben notificación automática (no hay websockets)
- Pueden usar el botón "🚪 Salir de la Sala" en su app
- Luego pueden unirse a una nueva sala normalmente

---

## Implementación Técnica

### Archivos Modificados

#### 1. `src/components/narrator/GameView.jsx`

**Cambios**:
- Agregado prop `onExitGame`
- Agregado estado `showExitConfirm` para controlar el modal
- Agregadas funciones:
  - `handleExitClick()`: Muestra el modal de confirmación
  - `handleConfirmExit()`: Ejecuta la salida
  - `handleCancelExit()`: Cierra el modal
- Agregado botón "🚪 Salir" en el header
- Agregado modal de confirmación con overlay

**Código del botón**:
```jsx
<button
  onClick={handleExitClick}
  className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
  title="Salir de la partida"
>
  🚪 Salir
</button>
```

**Modal de confirmación**:
```jsx
{showExitConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      {/* Contenido del modal */}
    </div>
  </div>
)}
```

#### 2. `src/pages/Narrator.jsx`

**Cambios**:
- Agregado prop `onExitGame={resetGame}` al `GameView`
- Reutiliza la función `resetGame()` existente que:
  - Elimina la sala de Supabase
  - Limpia el `localStorage`
  - Resetea el estado local
  - Vuelve a `gameStatus: 'idle'`

**Código**:
```jsx
<GameView
  // ... otros props
  onExitGame={resetGame}
/>
```

---

## Casos de Uso

### Caso 1: Error en la Configuración
**Situación**: El narrador asignó mal los roles  
**Solución**: Hace clic en "🚪 Salir", confirma, y empieza una nueva partida correctamente

### Caso 2: Jugadores Abandonan
**Situación**: Varios jugadores se van y no hay suficientes para continuar  
**Solución**: El narrador puede salir limpiamente y crear una nueva sala

### Caso 3: Quiere Cambiar Configuración
**Situación**: El narrador quiere cambiar número de lobos o roles especiales  
**Solución**: Sale de la partida actual y crea una nueva con la configuración deseada

### Caso 4: Problema Técnico
**Situación**: Algo no funciona como esperado  
**Solución**: Salida rápida sin necesidad de cerrar la aplicación

---

## Seguridad y Validaciones

✅ **Modal de confirmación obligatorio**: Evita salidas accidentales  
✅ **Advertencia clara**: El usuario sabe que perderá el progreso  
✅ **Limpieza completa**: Se eliminan todos los datos de la sala  
✅ **Sin efectos secundarios**: El estado se resetea correctamente  
✅ **Jugadores no bloqueados**: Pueden salir y unirse a otra sala  

---

## Testing

### Test 1: Salida Durante la Noche
1. Inicia una partida
2. Durante una fase de noche, haz clic en "🚪 Salir"
3. Verifica que aparece el modal de confirmación
4. Haz clic en "❌ Cancelar"
5. Verifica que el modal se cierra y el juego continúa
6. Vuelve a hacer clic en "🚪 Salir"
7. Haz clic en "✓ Salir de la Partida"
8. Verifica que regresas a la pantalla inicial

### Test 2: Salida Durante el Día
1. Inicia una partida
2. Avanza hasta la fase de día
3. Haz clic en "🚪 Salir"
4. Confirma la salida
5. Verifica que regresas a la pantalla inicial
6. Verifica que puedes crear una nueva partida

### Test 3: Estado Limpio
1. Inicia y sal de una partida
2. Crea una nueva partida
3. Verifica que:
   - El código de sala es nuevo
   - No hay jugadores de la partida anterior
   - Todas las configuraciones están en valores por defecto

### Test 4: Impacto en Jugadores
1. Narrador inicia partida, jugadores se unen
2. Narrador sale de la partida
3. Jugadores verifican su app:
   - Todavía ven su pantalla actual
   - Pueden hacer clic en "🚪 Salir de la Sala"
   - Pueden unirse a una nueva sala

---

## Comparación: Antes vs Ahora

| Aspecto | Antes ❌ | Ahora ✅ |
|---------|----------|----------|
| **Salir durante juego** | No disponible | Botón "🚪 Salir" visible |
| **Protección** | N/A | Modal de confirmación |
| **Limpieza** | Manual (cerrar pestaña) | Automática (BD + estado) |
| **Nueva partida** | Requería recargar página | Inmediato |
| **Experiencia** | Frustante | Fluida y controlada |

---

## Próximos Pasos Sugeridos (Opcional)

### Mejoras Futuras Posibles:
1. **Notificación a jugadores**: Mostrar mensaje cuando el narrador sale (requeriría polling)
2. **Guardar partida**: Opción de "pausar" en lugar de salir completamente
3. **Historial de partidas**: Guardar estadísticas de partidas anteriores
4. **Reanudar partida**: Permitir al narrador retomar una partida guardada

---

## Notas de Implementación

- ✅ **Retrocompatible**: No afecta funcionalidad existente
- ✅ **Sin cambios en BD**: Usa funciones existentes de limpieza
- ✅ **Sin cambios en Player App**: Los jugadores no se ven afectados
- ✅ **UI consistente**: Sigue el diseño existente de la app
- ✅ **Accesible**: Botón visible y fácil de encontrar
- ✅ **Responsive**: Funciona en tablet y desktop

---

**Estado**: ✅ Completado  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí

