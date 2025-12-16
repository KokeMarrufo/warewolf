import { useState } from 'react'
import { getRoleInfo } from '../../utils/roles'

function DayPhase({ players, alivePlayers, gameState, pendingHunterRevenge, onExecutePlayer, onDayEnd, onHunterRevengeComplete }) {
  const [deathAnnounced, setDeathAnnounced] = useState(false)
  const [votingStarted, setVotingStarted] = useState(false)
  const [votes, setVotes] = useState({})
  const [hunterRevenge, setHunterRevenge] = useState(false)
  const [revengeTarget, setRevengeTarget] = useState(null)
  const [tieBreak, setTieBreak] = useState(false)
  const [tiedPlayers, setTiedPlayers] = useState([])
  const [sheriffChoice, setSheriffChoice] = useState(null)
  const [showNightHunterRevenge, setShowNightHunterRevenge] = useState(!!pendingHunterRevenge)
  
  const sheriff = alivePlayers.find(p => p.is_sheriff)
  
  // Obtener las muertes de la noche anterior del historial
  // Filtrar por ronda actual Y fase 'night' para obtener SOLO las muertes de esta noche
  const lastNightDeaths = gameState.history
    .filter(e => 
      (e.type === 'wolves' || e.type === 'witch') && 
      e.round === gameState.round && 
      e.phase === 'night'
    )
  
  const handleAnnouncement = () => {
    setDeathAnnounced(true)
  }
  
  const handleStartVoting = () => {
    setVotingStarted(true)
    
    // Inicializar votos en 0
    const initialVotes = {}
    alivePlayers.forEach(player => {
      initialVotes[player.id] = 0
    })
    setVotes(initialVotes)
  }
  
  const incrementVote = (playerId) => {
    setVotes({
      ...votes,
      [playerId]: (votes[playerId] || 0) + 1
    })
  }
  
  const decrementVote = (playerId) => {
    setVotes({
      ...votes,
      [playerId]: Math.max(0, (votes[playerId] || 0) - 1)
    })
  }
  
  const handleExecute = () => {
    // Encontrar el jugador con más votos
    let maxVotes = 0
    const voteCounts = {}
    
    Object.entries(votes).forEach(([playerId, voteCount]) => {
      voteCounts[playerId] = voteCount
      if (voteCount > maxVotes) {
        maxVotes = voteCount
      }
    })
    
    if (maxVotes === 0) {
      alert('No hay suficientes votos')
      return
    }
    
    // Encontrar todos los jugadores con el máximo de votos (empate)
    const playersWithMaxVotes = Object.entries(voteCounts)
      .filter(([_, count]) => count === maxVotes)
      .map(([playerId, _]) => playerId)
    
    // Si hay empate y hay sheriff vivo
    if (playersWithMaxVotes.length > 1 && sheriff) {
      setTiedPlayers(playersWithMaxVotes)
      setTieBreak(true)
      return
    }
    
    // Si hay empate sin sheriff, nadie es ejecutado
    if (playersWithMaxVotes.length > 1 && !sheriff) {
      alert('Hay un empate y no hay Sheriff. Nadie será ejecutado.')
      setTimeout(() => {
        onDayEnd()
      }, 2000)
      return
    }
    
    // Si no hay empate, ejecutar al más votado
    const mostVotedId = playersWithMaxVotes[0]
    const result = onExecutePlayer(mostVotedId)
    
    if (result && result.type === 'hunter_revenge') {
      setHunterRevenge(true)
    } else {
      setTimeout(() => {
        onDayEnd()
      }, 2000)
    }
  }
  
  const handleSheriffDecision = () => {
    if (!sheriffChoice) {
      alert('El Sheriff debe elegir a quién ejecutar')
      return
    }
    
    const result = onExecutePlayer(sheriffChoice)
    
    if (result && result.type === 'hunter_revenge') {
      setTieBreak(false)
      setHunterRevenge(true)
    } else {
      setTimeout(() => {
        setTieBreak(false)
        onDayEnd()
      }, 2000)
    }
  }
  
  const handleHunterRevenge = () => {
    if (!revengeTarget) {
      alert('Selecciona el objetivo del cazador')
      return
    }
    
    onExecutePlayer(revengeTarget)
    
    setTimeout(() => {
      onDayEnd()
    }, 2000)
  }
  
  const handleNightHunterRevenge = () => {
    if (!revengeTarget) {
      alert('Selecciona el objetivo del cazador')
      return
    }
    
    console.log('🏹 Cazador de noche mata a:', revengeTarget)
    onExecutePlayer(revengeTarget)
    
    setTimeout(() => {
      setShowNightHunterRevenge(false)
      if (onHunterRevengeComplete) {
        onHunterRevengeComplete()
      }
    }, 2000)
  }
  
  // Popup de venganza del cazador que murió de noche (PRIORIDAD)
  if (showNightHunterRevenge && pendingHunterRevenge) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏹</div>
          <h2 className="text-3xl font-bold text-red-600 mb-2">¡CAZADOR ELIMINADO DURANTE LA NOCHE!</h2>
          <p className="text-gray-600 text-lg">
            <strong>{pendingHunterRevenge.hunterName}</strong> era el Cazador
          </p>
          <p className="text-gray-500 mt-2">
            Murió durante la noche pero puede llevarse a alguien con él
          </p>
        </div>
        
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6">
          <p className="text-orange-900 text-sm">
            <strong>📋 Instrucciones para el Narrador:</strong>
          </p>
          <ol className="list-decimal list-inside text-orange-800 text-sm mt-2 space-y-1">
            <li>Pregúntale al Cazador a quién quiere llevarse</li>
            <li>Selecciona al jugador elegido abajo</li>
            <li>Confirma la venganza</li>
            <li>DESPUÉS anuncia las muertes de la noche</li>
          </ol>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>El Cazador elige llevarse a:</strong>
          </label>
          <select
            value={revengeTarget || ''}
            onChange={(e) => setRevengeTarget(e.target.value)}
            className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 text-lg font-medium"
          >
            <option value="">-- Seleccionar jugador --</option>
            {alivePlayers.map(player => {
              const roleInfo = getRoleInfo(player.role)
              return (
                <option key={player.id} value={player.id}>
                  {player.name} ({roleInfo.name})
                </option>
              )
            })}
          </select>
        </div>
        
        <button
          onClick={handleNightHunterRevenge}
          disabled={!revengeTarget}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-4 rounded-lg transition-colors text-lg"
        >
          💀 Confirmar Venganza del Cazador
        </button>
      </div>
    )
  }
  
  // Popup de desempate del Sheriff
  if (tieBreak) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-3xl font-bold text-yellow-600 mb-2">EMPATE EN VOTACIÓN</h2>
          <p className="text-gray-600 mb-4">
            El Sheriff <strong>{sheriff?.name}</strong> debe desempatar
          </p>
        </div>
        
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-yellow-900 mb-3">Jugadores empatados:</h3>
          <div className="space-y-2">
            {tiedPlayers.map(playerId => {
              const player = alivePlayers.find(p => p.id === playerId)
              return (
                <div key={playerId} className="bg-white p-3 rounded-lg">
                  <span className="font-medium text-gray-800">{player?.name}</span>
                  <span className="text-gray-500 ml-2">({votes[playerId]} votos)</span>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            El Sheriff decide ejecutar a:
          </label>
          <select
            value={sheriffChoice || ''}
            onChange={(e) => setSheriffChoice(e.target.value)}
            className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">-- Seleccionar --</option>
            {tiedPlayers.map(playerId => {
              const player = alivePlayers.find(p => p.id === playerId)
              return (
                <option key={playerId} value={playerId}>
                  {player?.name}
                </option>
              )
            })}
          </select>
        </div>
        
        <button
          onClick={handleSheriffDecision}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          ⭐ Confirmar Decisión del Sheriff
        </button>
      </div>
    )
  }
  
  // Popup de venganza del cazador
  if (hunterRevenge) {
    const hunterPlayer = players.find(p => p.role === 'hunter' && !p.is_alive)
    
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏹</div>
          <h2 className="text-3xl font-bold text-red-600 mb-2">¡CAZADOR ELIMINADO!</h2>
          <p className="text-gray-600 text-lg">
            <strong>{hunterPlayer?.name}</strong> era el Cazador
          </p>
          <p className="text-gray-500 mt-2">
            Puede llevarse a alguien con él antes de morir
          </p>
        </div>
        
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6">
          <p className="text-orange-900 text-sm">
            <strong>📋 Instrucciones para el Narrador:</strong>
          </p>
          <ol className="list-decimal list-inside text-orange-800 text-sm mt-2 space-y-1">
            <li>Pregúntale al Cazador a quién quiere llevarse</li>
            <li>Selecciona al jugador elegido abajo</li>
            <li>Confirma la venganza</li>
          </ol>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>El Cazador elige llevarse a:</strong>
          </label>
          <select
            value={revengeTarget || ''}
            onChange={(e) => setRevengeTarget(e.target.value)}
            className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 text-lg font-medium"
          >
            <option value="">-- Seleccionar jugador --</option>
            {alivePlayers.map(player => {
              const roleInfo = getRoleInfo(player.role)
              return (
                <option key={player.id} value={player.id}>
                  {player.name} ({roleInfo.name})
                </option>
              )
            })}
          </select>
        </div>
        
        <button
          onClick={handleHunterRevenge}
          disabled={!revengeTarget}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-4 rounded-lg transition-colors text-lg"
        >
          💀 Confirmar Venganza del Cazador
        </button>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-yellow-600 mb-2">☀️ FASE DE DÍA</h2>
        <p className="text-gray-600">Discusión y votación</p>
      </div>

      {/* Paso 1: Anunciar muerte */}
      {!deathAnnounced && (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 text-lg mb-4">
              Haz clic para anunciar el resultado de la noche
            </p>
            <button
              onClick={handleAnnouncement}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors text-xl"
            >
              📢 Anunciar muerte
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Anuncio */}
      {deathAnnounced && !votingStarted && (
        <div className="space-y-6">
          {lastNightDeaths && lastNightDeaths.length > 0 ? (
            <div className="space-y-4">
              {lastNightDeaths.map((death, idx) => (
                <div key={idx} className="bg-red-50 border-2 border-red-300 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">💀</div>
                  <p className="text-2xl font-bold text-red-800 mb-2">
                    {death.message}
                  </p>
                  <p className="text-gray-600">
                    {death.type === 'wolves' && 'Ha sido asesinado por los lobos durante la noche'}
                    {death.type === 'witch' && 'Ha sido envenenado por la bruja durante la noche'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-2xl font-bold text-green-800 mb-2">
                Nadie murió esta noche
              </p>
              <p className="text-gray-600">La bruja salvó a la víctima o no hubo ataques</p>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2">Fase de discusión</h3>
            <p className="text-blue-700 mb-4">
              Los jugadores discuten libremente para encontrar a los lobos
            </p>
            <p className="text-sm text-blue-600 mb-4">
              Cuando estén listos para votar, haz clic en el botón
            </p>
            <button
              onClick={handleStartVoting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              🗳️ Iniciar Votación
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Votación */}
      {votingStarted && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-bold text-purple-900 mb-4 text-xl">VOTACIÓN</h3>
            <p className="text-purple-700 mb-4">
              Usa los botones +/- para contar los votos según las manos levantadas
            </p>
            {sheriff && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                <p className="text-yellow-900 text-sm">
                  ⭐ <strong>{sheriff.name}</strong> es el Sheriff y desempatará si es necesario
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {alivePlayers.map(player => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                >
                  <span className="font-bold text-gray-800 flex-1">{player.name}</span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => decrementVote(player.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold w-10 h-10 rounded-lg transition-colors"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                      {votes[player.id] || 0}
                    </span>
                    <button
                      onClick={() => incrementVote(player.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold w-10 h-10 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleExecute}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg transition-colors text-xl"
          >
            ⚖️ Ejecutar al más votado
          </button>
        </div>
      )}
    </div>
  )
}

export default DayPhase

