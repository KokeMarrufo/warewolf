# 💘 Feature: Visual Indicator for Cupid's Arrows

**Fecha**: 16 de Diciembre, 2025

## Problema

El narrador no tenía forma de ver visualmente quiénes estaban flechados por Cupido durante el juego. Esto era problemático porque:
- No podía recordar fácilmente qué jugadores estaban enlazados
- No había referencia visual rápida durante la partida
- Dificultaba explicar las muertes en cascada

---

## Solución Implementada

### 1. Indicador en Panel de Jugadores (GameView)

Los jugadores flechados ahora muestran:

**Para Jugadores Vivos:**
- 💘 Icono rosa junto al nombre
- Texto: "• 💘 [Nombre de la pareja]"
- Tooltip al pasar el mouse: "Flechado con [nombre]"

**Para Jugadores Muertos:**
- 💘 Icono rosa semitransparente
- Texto: "• 💘 [Nombre de la pareja]"
- Tooltip: "Estaba flechado con [nombre]"
- Permite ver conexiones históricas

### 2. Panel de Flechados (SetupView)

Después de asignar las flechas de Cupido, aparece un panel especial:

```
┌─────────────────────────────────┐
│  💘 Flechados por Cupido        │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Alice  💘  Bob           │  │
│  │  Si uno muere, el otro    │  │
│  │  también muere            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Visualización

### Panel de Jugadores Durante el Juego

```
VIVOS (6)

┌──────────────────────────┐
│ ⭐ 💘 Alice     👁️      │  ← Sheriff + Flechada
│ Vidente • Sheriff        │
│ • 💘 Bob                 │  ← Muestra su pareja
└──────────────────────────┘

┌──────────────────────────┐
│ 💘 Bob         👤        │  ← Flechado
│ Aldeano                  │
│ • 💘 Alice               │  ← Muestra su pareja
└──────────────────────────┘

┌──────────────────────────┐
│ Charlie        🐺        │  ← Sin flechar
│ Lobo                     │
└──────────────────────────┘


MUERTOS (2)

┌──────────────────────────┐
│ 💘 David       🏹        │  ← Estaba flechado
│ Cazador                  │
│ • 💘 Eve                 │  ← Su pareja (histórico)
└──────────────────────────┘
```

---

## Detalles de Implementación

### GameView.jsx - Panel de Vivos

```javascript
{alivePlayers.map(player => {
  const roleInfo = getRoleInfo(player.role)
  const partner = player.cupid_partner_id 
    ? players.find(p => p.id === player.cupid_partner_id)
    : null
  
  return (
    <div className="bg-green-50 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {player.is_sheriff && (
            <span className="text-yellow-500" title="Sheriff">⭐</span>
          )}
          {partner && (
            <span className="text-pink-500" title={`Flechado con ${partner.name}`}>💘</span>
          )}
          <span className="font-medium">{player.name}</span>
        </div>
        <span>{roleInfo.emoji}</span>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {roleInfo.name}
        {player.is_sheriff && <span>• Sheriff</span>}
        {partner && (
          <span className="text-pink-700 font-bold ml-2">
            • 💘 {partner.name}
          </span>
        )}
      </div>
    </div>
  )
})}
```

### GameView.jsx - Panel de Muertos

```javascript
{deadPlayers.map(player => {
  const roleInfo = getRoleInfo(player.role)
  const partner = player.cupid_partner_id 
    ? players.find(p => p.id === player.cupid_partner_id)
    : null
  
  return (
    <div className="bg-gray-100 p-3 rounded-lg opacity-60">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {partner && (
            <span className="text-pink-400" title={`Estaba flechado con ${partner.name}`}>💘</span>
          )}
          <span className="line-through">{player.name}</span>
        </div>
        <span>{roleInfo.emoji}</span>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {roleInfo.name}
        {partner && (
          <span className="text-pink-600 font-bold ml-2">
            • 💘 {partner.name}
          </span>
        )}
      </div>
    </div>
  )
})}
```

### SetupView.jsx - Panel de Flechados

```javascript
{cupidArrowsSet && !hasCupidAndNeedsArrows && (
  <div className="bg-pink-50 border border-pink-300 rounded-lg p-4">
    <h3 className="font-bold text-pink-900 mb-2">💘 Flechados por Cupido</h3>
    <div className="space-y-2">
      {players.filter(p => p.cupid_partner_id).map(player => {
        const partner = players.find(p2 => p2.id === player.cupid_partner_id)
        if (!partner || partner.id < player.id) return null // Evitar duplicados
        
        return (
          <div key={player.id} className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="flex items-center justify-center space-x-2 text-pink-700 font-medium">
              <span>{player.name}</span>
              <span className="text-2xl">💘</span>
              <span>{partner.name}</span>
            </div>
            <p className="text-xs text-pink-600 text-center mt-1">
              Si uno muere, el otro también muere
            </p>
          </div>
        )
      })}
    </div>
  </div>
)}
```

---

## Experiencia del Narrador

### Durante Setup
1. Asigna roles → Cupido aparece
2. Click "Seleccionar Flechados"
3. Elige 2 jugadores
4. **Nuevo**: Ve panel con "Alice 💘 Bob"
5. Inicia juego con referencia visual clara

### Durante el Juego
1. Ve lista de jugadores vivos
2. Flechados tienen 💘 junto a su nombre
3. Debajo muestra: "• 💘 [Pareja]"
4. Tooltip al pasar mouse: "Flechado con [nombre]"
5. Si uno muere → puede ver inmediatamente quién es la pareja
6. En muertos → histórico de quién estaba flechado

### Al Procesar Muertes
1. Narrador ve: "Lobos matan a Alice"
2. Ve que Alice tiene 💘 Bob
3. Sabe que Bob también morirá
4. Sistema automáticamente mata a Bob
5. Anuncio muestra ambas muertes

---

## Casos de Uso

### Caso 1: Recordatorio Visual
```
Ronda 3 - Fase de Noche
Narrador ve:
  ⭐ 💘 Alice (Vidente) • 💘 Bob
  💘 Bob (Aldeano) • 💘 Alice
  Charlie (Lobo)

Lobos eligen a Alice
Narrador piensa: "Alice está flechada con Bob, ambos morirán"
```

### Caso 2: Sheriff Flechado
```
Panel muestra:
  ⭐ 💘 David (Sheriff + Flechado)
  • Sheriff • 💘 Eve

Narrador sabe:
- David es Sheriff
- Está flechado con Eve
- Si David muere → Eve muere → necesita nuevo Sheriff
```

### Caso 3: Histórico de Muertes
```
MUERTOS (3)
  💘 Alice (Aldeano) • 💘 Bob
  💘 Bob (Lobo) • 💘 Alice
  Charlie (Cazador)

Narrador puede revisar:
- Alice y Bob murieron enlazados
- Bob era el lobo flechado
- Charlie murió independientemente
```

---

## Beneficios

### Para el Narrador

1. **Referencia Rápida**: No necesita recordar quién está flechado
2. **Prevención de Errores**: Ve las conexiones antes de anunciar muertes
3. **Storytelling**: Puede narrar mejor las muertes en cascada
4. **Histórico**: Ve conexiones pasadas en jugadores muertos

### Para la Experiencia del Juego

1. **Menos Confusión**: El narrador no se equivoca con las muertes
2. **Timing Correcto**: Puede anunciar ambas muertes juntas
3. **Narrativa Coherente**: "Alice murió, y Bob por amor a Alice"
4. **Transparencia**: Los jugadores confían en las muertes

---

## Detalles Visuales

### Colores
- **Icono 💘**: Rosa (#EC4899)
- **Texto de pareja**: Rosa oscuro (#BE185D)
- **Fondo del panel**: Rosa claro (#FDF2F8)
- **Borde**: Rosa medio (#FBCFE8)

### Para Muertos
- **Icono 💘**: Rosa claro (#F9A8D4) - más transparente
- **Texto**: Rosa gris (#BE185D) - menos saturado
- **Mantiene información**: Aun muertos, se ve el enlace

### Tooltips
- Hover sobre 💘 en vivos: "Flechado con [nombre]"
- Hover sobre 💘 en muertos: "Estaba flechado con [nombre]"
- Ayuda contextual instantánea

---

## Testing

### Test 1: Ver Flechados en Setup
```
1. Asignar roles con Cupido
2. Seleccionar Alice y Bob como flechados
3. **Verificar**: Panel muestra "Alice 💘 Bob"
4. **Verificar**: Texto dice "Si uno muere, el otro también muere"
```

### Test 2: Ver Durante el Juego
```
1. Iniciar juego
2. Panel de jugadores vivos
3. **Verificar**: Alice tiene 💘 junto al nombre
4. **Verificar**: Debajo dice "• 💘 Bob"
5. **Verificar**: Bob también tiene 💘 y "• 💘 Alice"
```

### Test 3: Tooltip Funcional
```
1. Pasar mouse sobre 💘 de Alice
2. **Verificar**: Tooltip dice "Flechado con Bob"
3. Pasar mouse sobre 💘 de Bob
4. **Verificar**: Tooltip dice "Flechado con Alice"
```

### Test 4: Ver en Muertos
```
1. Lobos matan a Alice
2. Bob muere automáticamente (enlace)
3. Panel de muertos
4. **Verificar**: Ambos tienen 💘 semitransparente
5. **Verificar**: Ambos muestran su pareja
6. **Verificar**: Tooltip dice "Estaba flechado con..."
```

### Test 5: Sheriff + Flechado
```
1. Alice es Sheriff y está flechada
2. Panel muestra: "⭐ 💘 Alice"
3. **Verificar**: Ambos iconos visibles
4. **Verificar**: Texto muestra ambos: "• Sheriff • 💘 Bob"
```

---

## Mejoras Futuras

- [ ] Línea visual conectando a los flechados
- [ ] Animación cuando uno muere y el otro también
- [ ] Color diferente si la pareja está muerta
- [ ] Contador de flechas de Cupido (cuántas parejas)
- [ ] Estadística: parejas que sobrevivieron juntas

---

**Estado**: ✅ Completado  
**Probado**: Pendiente de pruebas del usuario  
**Documentado**: ✅ Sí  
**UX**: ✅✅ Mejora significativa de usabilidad

