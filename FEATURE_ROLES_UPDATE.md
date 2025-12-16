# 🎭 Feature: Actualización de Roles - Vidente, Bruja y Niña

**Fecha**: 16 de Diciembre, 2025

## Resumen de Cambios

Se realizaron 3 cambios importantes en el sistema de roles del juego:

1. **Vidente** → Ahora muestra el rol completo del jugador investigado (no solo si es lobo)
2. **Doctor → Bruja** → Nuevo rol con poderes de envenenar O revivir (una vez cada uno)
3. **Niña** → Nuevo rol pasivo agregado al juego

---

## 1. Vidente - Mostrar Rol Completo

### Antes
La vidente solo podía ver:
- ✅ "ES LOBO"
- ✅ "NO ES LOBO"

### Ahora
La vidente ve el **rol completo** del jugador:
- 🐺 **LOBO** (con advertencia roja)
- 👤 **ALDEANO**
- 🧙‍♀️ **BRUJA**
- 🏹 **CAZADOR**
- 👧 **NIÑA**

### Pantalla de Resultado

```
┌────────────────────────────────┐
│  Resultado de la investigación │
│                                │
│         🧙‍♀️                    │
│         BRUJA                  │
│                                │
└────────────────────────────────┘

💡 Instrucción: Muéstrale este resultado al Vidente
```

Si el investigado es lobo:
```
┌────────────────────────────────┐
│         🐺                     │
│         LOBO                   │
│    ⚠️ ES LOBO ⚠️               │
└────────────────────────────────┘
```

### Cambios Técnicos

**`NightPhase.jsx`**:
```javascript
// Antes
seerResult: isWolf ? 'wolf' : 'not_wolf'

// Ahora
seerResult: targetPlayer.role, // Rol completo
seerRoleName: roleInfo.name,    // Nombre legible
seerRoleEmoji: roleInfo.emoji   // Emoji del rol
```

---

## 2. Doctor → Bruja

### Cambio Conceptual

**Doctor (Antes)**:
- ⚕️ Cada noche protege a alguien
- Uso ilimitado
- Solo previene muertes

**Bruja (Ahora)**:
- 🧙‍♀️ Tiene 2 pociones diferentes
- **Poción de Vida** ✨: Revivir a la víctima de los lobos (1 vez por juego)
- **Poción de Muerte** ☠️: Envenenar a alguien (1 vez por juego)
- Ambas son **opcionales** (puede hacer skip)

### Flujo de la Bruja en la Noche

#### Paso 1: Poción de Vida

**Si aún no la ha usado:**
```
┌─────────────────────────────────────┐
│ 💀 Los lobos atacaron a: María      │
└─────────────────────────────────────┘

💡 Pregúntale a la bruja si quiere usar su
   poción de vida para revivir a esta persona.

┌─────────────────────────────────────┐
│ ✨ SÍ - Usar Poción de Vida         │
│    (Revivir)                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ❌ NO - No usar (Skip)              │
└─────────────────────────────────────┘
```

**Si ya la usó:**
```
La bruja ya usó su poción de vida en una
noche anterior

[Continuar →]
```

**Si no hay víctima:**
```
No hay víctima de los lobos esta noche

[Continuar →]
```

#### Paso 2: Poción de Muerte

**Si aún no la ha usado:**
```
💡 La bruja puede elegir envenenar a
   alguien esta noche (o hacer skip).

Envenenar a:
[-- No envenenar (Skip) --]
  Pedro
  Juan
  María
  ...

☠️ Víctima seleccionada: Juan

[☠️ Confirmar Envenenamiento]
```

**Si ya la usó:**
```
La bruja ya usó su poción de muerte en
una noche anterior

[Continuar →]
```

### Procesamiento de la Noche

La bruja puede crear **múltiples muertes** en una misma noche:

**Escenario 1: Solo lobos matan**
```
💀 Pedro morirá (lobos)
```

**Escenario 2: Bruja revive**
```
✨ Nadie morirá (la bruja salvó a la víctima)
```

**Escenario 3: Lobos + Bruja envenenan**
```
💀💀 Múltiples muertes esta noche:
• Pedro (lobos)
• María (bruja)
```

### Cambios Técnicos

**Estado del Juego** (`Narrator.jsx`):
```javascript
gameState: {
  // Antes
  doctorTarget: null,
  
  // Ahora
  witchReviveUsed: false,    // ¿Ya usó revivir?
  witchPoisonUsed: false,    // ¿Ya usó envenenar?
  witchReviveTarget: null,   // A quién revivió
  witchPoisonTarget: null,   // A quién envenenó
}
```

**Configuración** (`Narrator.jsx`):
```javascript
// Antes
includeDoctor: true

// Ahora
includeWitch: true
```

**Pasos de la Noche** (`gameLogic.js`):
```javascript
// Antes
{ id: 'doctor', action: 'select_protect' }

// Ahora
{ id: 'witch_revive', action: 'witch_revive' }
{ id: 'witch_poison', action: 'witch_poison' }
```

---

## 3. Nuevo Rol: Niña

### Características

- 👧 **Rol pasivo**: No tiene acciones especiales desde la app
- Se asigna normalmente en el setup
- Es parte del equipo de aldeanos
- **Importante**: Tiene reglas especiales durante el juego físico (puede espiar a los lobos)

### Configuración

En la pantalla inicial del narrador:
```
☐ Incluir Vidente 👁️
☑ Incluir Bruja 🧙‍♀️
☐ Incluir Cazador 🏹
☐ Incluir Niña 👧
```

### Descripción del Rol

```
👧 Niña
"Rol especial sin habilidades activas"
```

### Cambios Técnicos

**`roles.js`**:
```javascript
GIRL: { 
  id: 'girl', 
  name: 'Niña', 
  emoji: '👧', 
  description: 'Rol especial sin habilidades activas' 
}
```

**`Narrator.jsx`**:
```javascript
const [includeGirl, setIncludeGirl] = useState(false)
```

**No genera pasos nocturnos** - No se agrega a `nightSteps`

---

## Archivos Modificados

### Core Logic
```
✅ src/utils/roles.js
   - Agregado rol WITCH (bruja)
   - Agregado rol GIRL (niña)
   - Eliminado rol DOCTOR
   - Actualizado assignRoles para usar witch y girl

✅ src/utils/gameLogic.js
   - Cambiado paso de doctor por pasos de bruja
   - witch_revive: Poción de vida
   - witch_poison: Poción de muerte
```

### Components
```
✅ src/pages/Narrator.jsx
   - Cambiado includeDoctor → includeWitch
   - Agregado includeGirl
   - Actualizado gameState con estados de bruja
   - Actualizado UI de configuración inicial

✅ src/components/narrator/NightPhase.jsx
   - Actualizado handleInvestigate para mostrar rol completo
   - Agregadas funciones handleWitchRevive y handleWitchPoison
   - Agregada UI para pasos de la bruja
   - Actualizado handleProcessNight para procesar bruja
   - Actualizado resumen y previsualización

✅ src/components/narrator/GameView.jsx
   - Actualizado changePhase para limpiar estados de bruja
   - Eliminadas referencias a doctorTarget

✅ src/components/narrator/DayPhase.jsx
   - Actualizado para mostrar múltiples muertes
   - Soporta muertes por lobos Y por bruja
   - Mensajes diferenciados por tipo de muerte
```

---

## Testing

### Test 1: Vidente - Ver Rol Completo
1. Incluye vidente en la configuración
2. Durante la noche, en el paso de la vidente:
   - Selecciona un jugador que NO sea lobo
   - Verifica que se muestra el **rol completo** (ej: "ALDEANO", "BRUJA", "CAZADOR")
   - Verifica que se muestra el **emoji** del rol
3. Selecciona un jugador que SÍ sea lobo
   - Verifica que se muestra "LOBO" con la advertencia "⚠️ ES LOBO ⚠️"

### Test 2: Bruja - Poción de Vida
1. Incluye bruja en la configuración
2. Durante la noche:
   - Los lobos seleccionan una víctima (ej: Pedro)
   - En el paso de la bruja - Poción de Vida:
     - Verifica que se muestra: "Los lobos atacaron a: Pedro"
     - Haz clic en "✨ SÍ - Usar Poción de Vida"
3. En el amanecer:
   - Verifica que el resumen muestra: "Bruja usó poción de vida en: Pedro"
   - Verifica la previsualización: "✨ Nadie morirá (la bruja salvó a la víctima)"
   - Procesa la noche
   - Verifica que Pedro NO muere
4. En la siguiente noche:
   - Verifica que ya no puede usar la poción de vida (mensaje: "ya usó su poción")

### Test 3: Bruja - Poción de Muerte
1. Durante la noche, en el paso de la bruja - Poción de Muerte:
   - Selecciona un jugador del dropdown (ej: María)
   - Verifica confirmación: "☠️ Víctima seleccionada: María"
   - Haz clic en "☠️ Confirmar Envenenamiento"
2. En el amanecer:
   - Verifica que el resumen muestra: "Bruja envenenó a: María"
   - Verifica la previsualización de muertes
   - Procesa la noche
   - Verifica que María muere
3. En el día:
   - Verifica que se anuncia: "Ha sido envenenado por la bruja durante la noche"
4. En la siguiente noche:
   - Verifica que ya no puede usar la poción de muerte

### Test 4: Bruja - Skip (No usar pociones)
1. Durante la noche, en cada paso de la bruja:
   - Haz clic en "❌ NO - No usar (Skip)" para la poción de vida
   - Selecciona "-- No envenenar (Skip) --" y haz clic en "➡️ Skip"
2. Verifica que la bruja AÚN PUEDE usar sus pociones en noches futuras

### Test 5: Bruja - Múltiples Muertes
1. Durante la noche:
   - Lobos atacan a Pedro
   - Bruja NO revive
   - Bruja envenena a María
2. En el amanecer:
   - Verifica la previsualización muestra ambas muertes
3. Procesa la noche
4. En el día:
   - Verifica que se anuncian AMBAS muertes
   - Una por lobos, otra por bruja

### Test 6: Niña
1. Marca el checkbox "Incluir Niña 👧"
2. Crea una partida con al menos 5 jugadores
3. Asigna roles
4. Verifica que un jugador recibe el rol "Niña"
5. Durante la noche, verifica que NO aparece ningún paso para la niña
6. El jugador con rol de niña ve en su app:
   ```
   👧
   NIÑA
   "Rol especial sin habilidades activas"
   ```

---

## Retrocompatibilidad

### ⚠️ Breaking Changes

**Base de Datos**:
- Las salas antiguas con `include_doctor: true` seguirán funcionando
- Nuevas salas usan `include_witch: true` y `include_girl: true`

**localStorage**:
- El estado guardado del narrador con `includeDoctor` será migrado automáticamente a `includeWitch` en el próximo uso

### Migración Suave

El código maneja gracefully roles antiguos:
- Si un jugador tiene `role: 'doctor'` de una partida vieja, `getRoleInfo()` lo mostrará como VILLAGER
- Se recomienda empezar partidas nuevas después de este update

---

## Notas de Juego

### Estrategias con la Bruja

**Cuándo usar la Poción de Vida:**
- Si la víctima es un rol importante (vidente, cazador)
- En las primeras noches (tienes más juego por delante)
- Si sospechas quién es lobo y quieres más tiempo

**Cuándo usar la Poción de Muerte:**
- Cuando estás seguro de quién es lobo
- En las últimas noches para hacer un movimiento decisivo
- Para crear confusión entre los aldeanos

**Cuándo hacer Skip:**
- Guardar las pociones para momentos críticos
- No revelar tu identidad como bruja muy pronto
- Esperar información de la vidente

### La Niña en el Juego Físico

Aunque no tiene acciones en la app, la niña tiene una regla especial:
- **Puede** espiar a los lobos durante la noche
- Si los lobos la ven espiando, pueden matarla inmediatamente
- Esto se maneja manualmente por el narrador (no en la app)

---

## Próximas Mejoras Sugeridas

- [ ] Agregar contador visual de pociones usadas/disponibles
- [ ] Historial más detallado de acciones de la bruja
- [ ] Estadísticas de uso de pociones al final del juego
- [ ] Más roles especiales (Cupido, Alcalde, etc.)

---

**Estado**: ✅ Completado  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí

---

## Resumen Visual

### Antes
```
Roles: Lobo, Vidente, Doctor, Cazador, Aldeano
Vidente: "ES LOBO" o "NO ES LOBO"
Doctor: Proteger cada noche (ilimitado)
```

### Ahora
```
Roles: Lobo, Vidente, Bruja, Cazador, Niña, Aldeano
Vidente: Muestra rol completo (🐺 LOBO, 👤 ALDEANO, etc.)
Bruja: 2 pociones de un solo uso (revivir O envenenar)
Niña: Rol pasivo (sin acciones en app)
```

