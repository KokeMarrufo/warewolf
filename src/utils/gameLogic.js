// Lógica del juego

/**
 * Procesa las acciones de la noche y determina quién muere
 */
export function processNightActions(gameState, players) {
  const { wolf_target, doctor_target } = gameState
  
  let result = {
    deaths: [],
    saved: false
  }
  
  // Si hay víctima de lobos
  if (wolf_target) {
    // Verificar si el doctor salvó a la víctima
    if (doctor_target && wolf_target === doctor_target) {
      result.saved = true
    } else {
      result.deaths.push({
        playerId: wolf_target,
        cause: 'wolves'
      })
    }
  }
  
  return result
}

/**
 * Genera los pasos de la fase noche según los roles en juego
 */
export function generateNightSteps(players) {
  const steps = [
    {
      id: 'sleep',
      title: 'Todos duermen',
      description: '"Todos cierran los ojos y duermen"',
      action: null
    }
  ]
  
  // Paso de lobos (siempre existe)
  const wolves = players.filter(p => p.role === 'wolf' && p.is_alive)
  if (wolves.length > 0) {
    steps.push({
      id: 'wolves',
      title: 'Lobos despiertan',
      description: `"Lobos despiertan. ${wolves.map(w => w.name).join(' y ')} levanten la mano. Elijan su víctima señalándola en silencio"`,
      action: 'select_victim',
      roleInvolved: 'wolf'
    })
  }
  
  // Paso de vidente
  const seer = players.find(p => p.role === 'seer' && p.is_alive)
  if (seer) {
    steps.push({
      id: 'seer',
      title: 'Vidente despierta',
      description: `"${seer.name}, abre los ojos. Señala a quien quieres investigar"`,
      action: 'select_investigate',
      roleInvolved: 'seer'
    })
  }
  
  // Paso de doctor
  const doctor = players.find(p => p.role === 'doctor' && p.is_alive)
  if (doctor) {
    steps.push({
      id: 'doctor',
      title: 'Doctor despierta',
      description: `"${doctor.name}, abre los ojos. Señala a quien quieres proteger"`,
      action: 'select_protect',
      roleInvolved: 'doctor'
    })
  }
  
  // Amanecer
  steps.push({
    id: 'dawn',
    title: 'Amanecer',
    description: '"Amanece... todos pueden abrir los ojos"',
    action: 'process_night'
  })
  
  return steps
}

/**
 * Genera código de sala aleatorio
 */
export function generateRoomCode() {
  const num = Math.floor(Math.random() * 100)
  return `LOBO${num.toString().padStart(2, '0')}`
}

/**
 * Formatea el historial de eventos
 */
export function formatHistoryEvent(event) {
  const icons = {
    night_death: '💀',
    day_vote: '⚖️',
    hunter_revenge: '🏹',
    saved: '⚕️'
  }
  
  return {
    icon: icons[event.type] || '•',
    text: event.message,
    round: event.round,
    phase: event.phase
  }
}

