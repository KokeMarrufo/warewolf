# ⭐ NUEVO FEATURE: SHERIFF DEL PUEBLO

## 🎯 ¿Qué es el Sheriff?

El **Sheriff** es un jugador designado por el narrador al inicio del juego que tiene un poder especial: **desempatar las votaciones**.

---

## ✨ Características

### Sheriff NO es un rol secreto
- El Sheriff es una **designación pública**
- Todos los jugadores saben quién es el Sheriff
- El Sheriff tiene su rol secreto normal (puede ser Lobo, Vidente, Aldeano, etc.)
- Es una posición adicional que se combina con el rol secreto

### Poder del Sheriff
- ⭐ **Desempata votaciones** durante el día
- Si hay empate en votos, el Sheriff decide quién es ejecutado
- Solo actúa cuando hay empate

---

## 🎮 Cómo Funciona

### 1. Designación (Setup)

```
NARRADOR:
┌────────────────────────────────┐
│  Paso 3: Designar Sheriff ⭐  │
├────────────────────────────────┤
│                                │
│  [Selector de jugadores]       │
│  ├ Juan                        │
│  ├ María                       │
│  ├ Pedro                       │
│  └ Ana                         │
│                                │
│  El Sheriff desempata          │
│  las votaciones                │
│                                │
└────────────────────────────────┘
```

El narrador selecciona manualmente quién será el Sheriff antes de iniciar el juego.

---

### 2. Durante el Juego

#### Vista del Narrador:
```
JUGADORES VIVOS:
☑️ ⭐ Juan (Lobo) - Sheriff
☑️ María (Aldeana)
☑️ Pedro (Vidente)
```

El Sheriff se muestra con una estrella ⭐ en todas las vistas.

---

### 3. Votación sin Empate

```
VOTACIÓN:
Juan:   3 votos
María:  1 voto
Pedro:  2 votos

→ Juan tiene más votos
→ Juan es ejecutado
→ Sheriff NO interviene
```

El Sheriff solo actúa si hay empate.

---

### 4. Votación con Empate (CON Sheriff)

```
VOTACIÓN:
Juan:   2 votos
María:  2 votos
Pedro:  1 voto

→ EMPATE entre Juan y María
→ Aparece popup:

┌─────────────────────────────────┐
│      ⭐ EMPATE EN VOTACIÓN      │
├─────────────────────────────────┤
│  El Sheriff Pedro debe decidir  │
│                                 │
│  Jugadores empatados:           │
│  • Juan (2 votos)               │
│  • María (2 votos)              │
│                                 │
│  El Sheriff decide ejecutar a:  │
│  [Selector: Juan / María]       │
│                                 │
│  [Confirmar Decisión]           │
└─────────────────────────────────┘

→ Pedro (Sheriff) elige
→ Se ejecuta al elegido
```

---

### 5. Votación con Empate (SIN Sheriff)

```
VOTACIÓN:
Juan:   2 votos
María:  2 votos
Pedro:  1 voto

→ EMPATE entre Juan y María
→ NO hay Sheriff designado
→ Alert: "Hay un empate y no hay Sheriff"
→ NADIE es ejecutado
→ Se pasa a la noche
```

Sin Sheriff, un empate resulta en ninguna ejecución.

---

## 📋 Flujo Completo

### Setup:
```
1. Narrador crea partida
2. Jugadores se unen
3. Narrador asigna roles (Paso 2)
4. Narrador designa Sheriff (Paso 3) ⭐ NUEVO
5. Narrador inicia juego
```

### Durante el Juego:
```
DÍA → VOTACIÓN:

Caso A: No hay empate
  → Ejecutar al más votado
  
Caso B: Empate + Sheriff vivo
  → Sheriff desempata
  → Ejecutar al elegido por Sheriff
  
Caso C: Empate + Sheriff muerto/no existe
  → Nadie es ejecutado
  → Continuar a la noche
```

---

## 🎯 Estrategia

### Para los Lobos:
- **Eliminar al Sheriff** puede ser estratégico
- Sin Sheriff, los empates les benefician
- Pueden forzar empates en votaciones

### Para los Aldeanos:
- **Proteger al Sheriff** es importante
- El Sheriff puede ser clave en decisiones difíciles
- Si el Sheriff muere, pierden el desempate

### Para el Sheriff:
- **Gran responsabilidad**
- Debe decidir en empates
- Puede ser señalado como objetivo
- Debe actuar con lógica y justicia

---

## 💡 Tips para el Narrador

### Al Designar Sheriff:
1. **Hazlo público**: "Juan es el Sheriff del pueblo"
2. **Explica el rol**: "Desempatará las votaciones"
3. **Es opcional**: No estás obligado a designar Sheriff
4. **No lo cambies**: Una vez designado, no cambia durante la partida

### Durante Votaciones:
1. **Menciona al Sheriff**: "Recuerden que Juan es el Sheriff"
2. **Si hay empate**: "Tenemos un empate. Sheriff, ¿cuál es tu decisión?"
3. **Si el Sheriff muere**: "Ya no hay Sheriff para desempatar"

---

## 🔧 Detalles Técnicos

### Base de Datos

**Campo agregado:**
```sql
ALTER TABLE players ADD COLUMN is_sheriff BOOLEAN DEFAULT false;
```

**Restricción:** Solo un Sheriff por sala

### Lógica de Desempate

```javascript
// Detectar empate
const playersWithMaxVotes = Object.entries(votes)
  .filter(([_, count]) => count === maxVotes)
  .map(([playerId, _]) => playerId)

// Si hay empate (más de 1 con max votos)
if (playersWithMaxVotes.length > 1) {
  if (sheriff && sheriff.is_alive) {
    // Mostrar popup de desempate
    setTieBreak(true)
  } else {
    // Sin sheriff = nadie ejecutado
    alert('Empate sin Sheriff. Nadie ejecutado')
    onDayEnd()
  }
}
```

---

## 📊 Migración de Base de Datos

### Si ya tienes el juego desplegado:

Ejecuta en Supabase SQL Editor:

```sql
-- Agregar columna is_sheriff
ALTER TABLE players ADD COLUMN IF NOT EXISTS is_sheriff BOOLEAN DEFAULT false;

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_players_sheriff 
ON players(room_id, is_sheriff) 
WHERE is_sheriff = true;
```

**Archivo:** `SUPABASE_MIGRATION_SHERIFF.sql`

---

## ✅ Verificación

### Para probar el feature:

1. ✅ Crear nueva partida
2. ✅ Agregar jugadores (mínimo 3)
3. ✅ Asignar roles
4. ✅ Designar Sheriff (Paso 3)
5. ✅ Iniciar juego
6. ✅ Durante el día, crear un empate intencional
7. ✅ Verificar que aparece popup de Sheriff
8. ✅ Sheriff selecciona a quién ejecutar
9. ✅ Verificar que se ejecuta al elegido

---

## 🎨 Diseño Visual

### Indicador del Sheriff:

**En Setup:**
```
⭐ Juan - SHERIFF
   María
   Pedro
```

**En Juego:**
```
VIVOS:
⭐ Juan (Lobo) • Sheriff
   María (Aldeana)
   Pedro (Vidente)
```

**En Votación:**
```
VOTACIÓN:
⭐ Pedro es el Sheriff y desempatará si es necesario

Juan:  [- 2 +]
María: [- 2 +]
Pedro: [- 1 +]

[Ejecutar al más votado]
```

**Popup de Empate:**
```
┌─────────────────────────────────┐
│          ⭐                     │
│    EMPATE EN VOTACIÓN           │
├─────────────────────────────────┤
│  El Sheriff Pedro debe decidir  │
│                                 │
│  Jugadores empatados:           │
│  • Juan (2 votos)               │
│  • María (2 votos)              │
│                                 │
│  [Selector]                     │
│  [⭐ Confirmar Decisión]        │
└─────────────────────────────────┘
```

---

## 🔄 Casos Especiales

### ¿Qué pasa si el Sheriff muere?

- Ya no puede desempatar votaciones futuras
- Los empates resultan en ninguna ejecución
- No se designa un nuevo Sheriff

### ¿El Sheriff puede ser Lobo?

- **SÍ** - El Sheriff es una designación separada del rol
- Un Lobo puede ser Sheriff
- Esto añade complejidad estratégica

### ¿El Sheriff puede votar?

- **SÍ** - El Sheriff vota normalmente
- Solo desempata si hay empate después de todos los votos

### ¿Se puede cambiar al Sheriff?

- **NO** - Una vez designado, es permanente
- Solo pierde el poder si muere

---

## 📝 Versión

- **Versión:** 1.2.0
- **Fecha:** 16 de Diciembre, 2025
- **Feature:** Sheriff del Pueblo
- **Tipo:** Minor Version (Nueva funcionalidad)

---

## 🎉 ¡Disfruta del Nuevo Feature!

El Sheriff añade una **capa estratégica** y resuelve el problema de los empates de forma elegante.

**¡Que empiece el juego! ⭐🐺**

