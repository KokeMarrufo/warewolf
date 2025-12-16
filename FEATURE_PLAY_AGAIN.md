# 🔄 FEATURE: JUGAR OTRA RONDA

## 🎮 ¿Qué es Jugar Otra Ronda?

Después de terminar una partida, el narrador puede elegir entre:

1. **🔄 Jugar Otra Ronda** - Mismos jugadores, nuevos roles
2. **🎮 Nueva Partida Completa** - Empezar desde cero

---

## ✨ ¿Cómo Funciona?

### Pantalla de Victoria

```
┌─────────────────────────────────────┐
│         🎉 ¡ALDEANOS GANAN!         │
├─────────────────────────────────────┤
│                                     │
│    REVELACIÓN DE ROLES              │
│    • Juan - Lobo 🐺                 │
│    • María - Aldeana 👤             │
│    • Pedro - Vidente 👁️             │
│    ...                              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   [🔄 Jugar Otra Ronda]            │
│   Los mismos jugadores, nuevos roles│
│                                     │
│   [🎮 Nueva Partida Completa]      │
│   Empezar desde cero                │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Opción 1: Jugar Otra Ronda

### ¿Qué hace?

**MANTIENE:**
- ✅ Los mismos jugadores en la sala
- ✅ El código de sala (LOBO42)
- ✅ La conexión de los jugadores

**RESETEA:**
- 🔄 Roles (se borran)
- 🔄 Estado de vida (todos vivos)
- 🔄 Sheriff (se borra)
- 🔄 Historial del juego
- 🔄 Estado de las fases

**RESULTADO:**
Vuelves al **Setup** con los mismos jugadores listos para:
1. Reasignar roles
2. Redesignar Sheriff
3. Iniciar nueva partida

---

### Flujo Completo

```
PARTIDA 1 TERMINA
    ↓
🎉 ¡ALDEANOS GANAN!
    ↓
[🔄 Jugar Otra Ronda] ← Click
    ↓
VUELVE AL SETUP
    ↓
Lista de jugadores:
✓ Juan (sin rol)
✓ María (sin rol)
✓ Pedro (sin rol)
    ↓
NARRADOR:
1. Asigna roles (Paso 2)
2. Designa Sheriff (Paso 3)
3. Inicia juego (Paso 4)
    ↓
PARTIDA 2 EMPIEZA
```

---

## 🎮 Opción 2: Nueva Partida Completa

### ¿Qué hace?

**RESETEA TODO:**
- ❌ Borra la sala
- ❌ Borra a los jugadores
- ❌ Limpia localStorage
- ❌ Vuelve a la pantalla de inicio

**RESULTADO:**
Empiezas desde cero como si acabaras de abrir la app.

---

## 💡 Casos de Uso

### Caso A: Sesión Larga con Amigos

```
Escenario: Quieres jugar varias partidas seguidas

1. Partida 1: Ganan Lobos
   → [🔄 Jugar Otra Ronda]
   
2. Partida 2: Ganan Aldeanos  
   → [🔄 Jugar Otra Ronda]
   
3. Partida 3: Ganan Lobos
   → [🔄 Jugar Otra Ronda]
   
Ventaja: No pierdes tiempo reclutando jugadores
```

---

### Caso B: Alguien Tiene que Irse

```
Escenario: Un jugador se va a la mitad

1. Partida termina
2. Juan se tiene que ir
3. Narrador: [🔄 Jugar Otra Ronda]
4. En Setup, elimina a Juan
5. Continúa con 1 jugador menos

O si prefieres:

1. Narrador: [🎮 Nueva Partida Completa]
2. Recluta nuevos jugadores
3. Empieza desde cero
```

---

### Caso C: Cambiar Configuración

```
Escenario: Quieres cambiar número de lobos

OPCIÓN A (con mismos jugadores):
1. [🔄 Jugar Otra Ronda]
2. En Setup, ve a inicio (botón Volver)
3. Cambia configuración
4. [Nueva Partida] con nueva config
5. Jugadores se quedan en sala

OPCIÓN B (empezar desde cero):
1. [🎮 Nueva Partida Completa]
2. Cambia configuración desde el inicio
3. Recluta jugadores de nuevo
```

---

## 🎯 Experiencia del Jugador

### Durante la Partida:
```
Jugador ve su rol:
🐺 ERES LOBO
...
```

### Cuando Termina:
```
[Jugador NO ve pantalla de victoria]
[Rol sigue visible en su pantalla]
[Espera a que narrador decida]
```

### Si Narrador elige "Jugar Otra Ronda":
```
El rol del jugador se BORRA automáticamente
Vuelve a pantalla de ESPERA:

⏳
Sala: LOBO42
Esperando que el narrador inicie el juego
🟢 Conectado
```

### Narrador Asigna Nuevos Roles:
```
Jugador recibe NUEVO ROL:
👁️ ERES VIDENTE
...
```

---

## 🔧 Detalles Técnicos

### Función `restartWithSamePlayers()`

```javascript
async function restartWithSamePlayers() {
  // 1. Resetear jugadores en BD
  for (player of players) {
    UPDATE players SET
      role = null,
      is_alive = true,
      role_opened = false,
      is_sheriff = false
    WHERE id = player.id
  }
  
  // 2. Borrar estado del juego
  DELETE FROM game_state
  WHERE room_id = roomId
  
  // 3. Cambiar sala a setup
  UPDATE rooms SET status = 'setup'
  WHERE id = roomId
  
  // 4. Resetear estado local
  setGameStatus('setup')
  setGameState({ initial state })
  setWinner(null)
  
  // 5. Recargar jugadores
  fetchPlayers()
}
```

---

## 📊 Comparación

| Feature | Jugar Otra Ronda | Nueva Partida |
|---------|------------------|---------------|
| Jugadores | ✅ Se mantienen | ❌ Se borran |
| Código sala | ✅ Se mantiene | ❌ Nuevo código |
| Roles | 🔄 Se resetean | ❌ Se borran |
| Sheriff | 🔄 Se resetea | ❌ Se borra |
| Configuración | ✅ Se mantiene | 🔄 Se puede cambiar |
| Velocidad | ⚡ Rápido | 🐢 Lento |
| Uso | 🎮 Sesiones largas | 🆕 Grupo nuevo |

---

## ✅ Beneficios

### Para el Narrador:
✅ **Ahorra tiempo** - No recluta jugadores entre partidas  
✅ **Flujo continuo** - Mantiene el ritmo del juego  
✅ **Flexible** - Puede ajustar configuración si quiere  
✅ **Control total** - Dos opciones claras  

### Para los Jugadores:
✅ **No se desconectan** - Mantienen la sesión  
✅ **Menos espera** - No hay fase de reclutamiento  
✅ **Nueva experiencia** - Roles diferentes cada ronda  
✅ **Diversión continua** - Más partidas, menos setup  

---

## 🎭 Estrategia y Diversión

### Jugar Varias Rondas:

**Ventajas estratégicas:**
- Los jugadores aprenden del comportamiento mutuo
- Pueden ajustar estrategias entre rondas
- Se crea meta-juego interesante
- Más desafiante y divertido

**Ejemplo:**
```
Ronda 1: Juan era Lobo → Lo descubren fácil
Ronda 2: Juan es Aldeano → Todos sospechan igual
Ronda 3: Juan es Lobo de nuevo → Juega diferente
```

---

## 🔄 Workflow Recomendado

### Sesión de Juego Típica:

```
1. Setup Inicial (5 min)
   - Crear sala
   - Reclutar jugadores
   - Configurar roles
   
2. Partida 1 (15-30 min)
   - Jugar normalmente
   
3. Pantalla Victoria
   → [🔄 Jugar Otra Ronda] (30 segundos)
   
4. Partida 2 (15-30 min)
   - Nuevos roles, mismos jugadores
   
5. Pantalla Victoria
   → [🔄 Jugar Otra Ronda] (30 segundos)
   
6. Partida 3 (15-30 min)
   ...
   
7. Cuando terminen:
   → [🎮 Nueva Partida Completa]
```

**Tiempo ahorrado:** ~4-5 minutos por ronda

---

## 💬 Mensajes del Sistema

### Al hacer clic en "Jugar Otra Ronda":

**Narrador ve:**
```
[Transición suave]
↓
Pantalla de Setup
Con los mismos jugadores
Roles borrados, listos para reasignar
```

**Jugadores ven:**
```
[Su pantalla de rol se cierra]
↓
Vuelven a pantalla de espera
⏳ Esperando que el narrador inicie...
```

---

## 📝 Versión

- **Versión:** 1.3.0
- **Fecha:** 16 de Diciembre, 2025
- **Feature:** Jugar Otra Ronda
- **Tipo:** Minor Version (Nueva funcionalidad)

---

## 🎉 ¡Disfruta Jugando Múltiples Rondas!

Ahora puedes tener **sesiones de juego continuas** sin perder tiempo en setup entre partidas.

**¡Que empiecen las rondas! 🔄🐺🎮**

