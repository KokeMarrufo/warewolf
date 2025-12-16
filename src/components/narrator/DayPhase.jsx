import { useState } from 'react'

function DayPhase({ players, alivePlayers, gameState, onExecutePlayer, onDayEnd }) {
  const [deathAnnounced, setDeathAnnounced] = useState(false)
  const [votingStarted, setVotingStarted] = useState(false)
  const [votes, setVotes] = useState({})
  const [hunterRevenge, setHunterRevenge] = useState(false)
  const [revengeTarget, setRevengeTarget] = useState(null)
  
  // Obtener las muertes de la noche anterior del historial
  const lastNightDeath = gameState.history
    .filter(e => e.type === 'wolves')
    .slice(-1)[0]
  
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
    let mostVotedId = null
    
    Object.entries(votes).forEach(([playerId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount
        mostVotedId = playerId
      }
    })
    
    if (!mostVotedId || maxVotes === 0) {
      alert('No hay suficientes votos')
      return
    }
    
    const result = onExecutePlayer(mostVotedId)
    
    if (result === 'hunter_revenge') {
      setHunterRevenge(true)
    } else {
      // Si no hay venganza de cazador, pasar a la noche
      setTimeout(() => {
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
  
  // Popup de venganza del cazador
  if (hunterRevenge) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏹</div>
          <h2 className="text-3xl font-bold text-red-600 mb-2">CAZADOR ELIMINADO</h2>
          <p className="text-gray-600">El cazador puede llevarse a alguien con él</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            El cazador elige llevarse a:
          </label>
          <select
            value={revengeTarget || ''}
            onChange={(e) => setRevengeTarget(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="">-- Seleccionar --</option>
            {alivePlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleHunterRevenge}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Confirmar venganza
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
          {lastNightDeath ? (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">💀</div>
              <p className="text-2xl font-bold text-red-800 mb-2">
                {lastNightDeath.message}
              </p>
              <p className="text-gray-600">Ha sido asesinado por los lobos durante la noche</p>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-2xl font-bold text-green-800 mb-2">
                Nadie murió esta noche
              </p>
              <p className="text-gray-600">El doctor salvó a la víctima o no hubo ataque</p>
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

