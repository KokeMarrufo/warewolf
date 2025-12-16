// Utilidades para asignación de roles

export const ROLES = {
  WOLF: { id: 'wolf', name: 'Lobo', emoji: '🐺', description: 'Cada noche elige una víctima con los otros lobos' },
  SEER: { id: 'seer', name: 'Vidente', emoji: '👁️', description: 'Cada noche puede investigar el rol de un jugador' },
  WITCH: { id: 'witch', name: 'Bruja', emoji: '🧙‍♀️', description: 'Puede envenenar a alguien O revivir a la víctima (una vez cada uno)' },
  HUNTER: { id: 'hunter', name: 'Cazador', emoji: '🏹', description: 'Si muere, puede llevarse a alguien con él' },
  GIRL: { id: 'girl', name: 'Niña', emoji: '👧', description: 'Rol especial sin habilidades activas' },
  CUPID: { id: 'cupid', name: 'Cupido', emoji: '💘', description: 'Al inicio del juego, flecha a 2 jugadores. Si uno muere, el otro también muere' },
  VILLAGER: { id: 'villager', name: 'Aldeano', emoji: '👤', description: 'Vota durante el día para eliminar sospechosos' }
}

/**
 * Asigna roles aleatoriamente a los jugadores
 * @param {Array} players - Array de jugadores
 * @param {Object} config - Configuración { numWolves, includeSeer, includeWitch, includeHunter, includeGirl, includeCupid }
 * @returns {Array} Array de jugadores con roles asignados
 */
export function assignRoles(players, config) {
  const { numWolves, includeSeer, includeWitch, includeHunter, includeGirl, includeCupid } = config
  
  if (players.length < numWolves + 2) {
    throw new Error('No hay suficientes jugadores')
  }

  // Crear array de roles
  const roles = []
  
  // Agregar lobos
  for (let i = 0; i < numWolves; i++) {
    roles.push(ROLES.WOLF.id)
  }
  
  // Agregar roles especiales
  if (includeSeer) roles.push(ROLES.SEER.id)
  if (includeWitch) roles.push(ROLES.WITCH.id)
  if (includeHunter) roles.push(ROLES.HUNTER.id)
  if (includeGirl) roles.push(ROLES.GIRL.id)
  if (includeCupid) roles.push(ROLES.CUPID.id)
  
  // Llenar el resto con aldeanos
  while (roles.length < players.length) {
    roles.push(ROLES.VILLAGER.id)
  }
  
  // Mezclar roles aleatoriamente (Fisher-Yates shuffle)
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]]
  }
  
  // Asignar roles a jugadores
  return players.map((player, index) => ({
    ...player,
    role: roles[index]
  }))
}

/**
 * Obtiene información del rol
 */
export function getRoleInfo(roleId) {
  return Object.values(ROLES).find(r => r.id === roleId) || ROLES.VILLAGER
}

/**
 * Obtiene todos los jugadores con un rol específico
 */
export function getPlayersByRole(players, roleId) {
  return players.filter(p => p.role === roleId)
}

/**
 * Verifica condiciones de victoria
 */
export function checkWinCondition(players) {
  const alivePlayers = players.filter(p => p.is_alive)
  const aliveWolves = alivePlayers.filter(p => p.role === ROLES.WOLF.id)
  const aliveVillagers = alivePlayers.filter(p => p.role !== ROLES.WOLF.id)
  
  if (aliveWolves.length === 0) {
    return { winner: 'villagers', message: '¡ALDEANOS GANAN! Todos los lobos eliminados' }
  }
  
  if (aliveWolves.length >= aliveVillagers.length) {
    return { winner: 'wolves', message: '¡LOBOS GANAN! Superan o igualan a los aldeanos' }
  }
  
  return null
}

