import { useState } from 'react'
import { getRoleInfo, checkWinCondition } from '../../utils/roles'
import { processNightActions, generateNightSteps } from '../../utils/gameLogic'
import NightPhase from './NightPhase'
import DayPhase from './DayPhase'

function GameView({ roomCode, players, setPlayers, gameState, setGameState, nightSteps, setNightSteps, onGameEnd, onExitGame }) {
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [pendingHunterRevenge, setPendingHunterRevenge] = useState(null) // Para cazador que muere de noche
  
  const alivePlayers = players.filter(p => p.is_alive)
  const deadPlayers = players.filter(p => !p.is_alive)
  
  const handleExitClick = () => {
    setShowExitConfirm(true)
  }
  
  const handleConfirmExit = () => {
    if (onExitGame) {
      onExitGame()
    }
  }
  
  const handleCancelExit = () => {
    setShowExitConfirm(false)
  }
  
  // Actualizar jugador
  const updatePlayer = (playerId, updates) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, ...updates } : p
    ))
  }

  // Matar jugador
  const killPlayer = (playerId, cause) => {
    updatePlayer(playerId, { is_alive: false })
    
    // Agregar al historial
    const player = players.find(p => p.id === playerId)
    
    // Mensaje según causa de muerte
    let message
    if (cause === 'wolves') {
      message = `${player.name} ha muerto (lobos)`
    } else if (cause === 'witch') {
      message = `${player.name} ha muerto (bruja)`
    } else if (cause === 'vote') {
      message = `${player.name} ha muerto (votación)`
    } else {
      message = `${player.name} ha muerto`
    }
    
    const newHistory = [
      ...gameState.history,
      {
        type: cause,
        message: message,
        round: gameState.round,
        phase: gameState.phase
      }
    ]
    
    setGameState({ ...gameState, history: newHistory })
    
    // Verificar condición de victoria
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, is_alive: false } : p
    )
    
    const winCondition = checkWinCondition(updatedPlayers)
    if (winCondition) {
      onGameEnd(winCondition)
    }
    
    // Si era cazador, devolver objeto con más info
    if (player.role === 'hunter') {
      return { 
        type: 'hunter_revenge',
        hunterId: playerId,
        hunterName: player.name
      }
    }
    
    return null
  }

  // Cambiar de fase
  const changePhase = (newPhase) => {
    if (newPhase === 'day') {
      setGameState({
        ...gameState,
        phase: 'day',
        currentStep: 0,
        wolfTarget: null,
        seerTarget: null,
        seerResult: null,
        seerRoleName: null,
        seerRoleEmoji: null,
        witchReviveTarget: null,
        witchPoisonTarget: null
      })
    } else if (newPhase === 'night') {
      // Regenerar pasos de la noche con jugadores actuales
      const steps = generateNightSteps(players)
      setNightSteps(steps)
      
      setGameState({
        ...gameState,
        phase: 'night',
        round: gameState.round + 1,
        currentStep: 0,
        wolfTarget: null,
        seerTarget: null,
        seerResult: null,
        seerRoleName: null,
        seerRoleEmoji: null,
        witchReviveTarget: null,
        witchPoisonTarget: null
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">
                {gameState.phase === 'night' ? '🌙' : '☀️'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {gameState.phase === 'night' ? 'NOCHE' : 'DÍA'} {gameState.round}
                </h1>
                <p className="text-gray-600">Código: {roomCode}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {alivePlayers.length} vivos
                </p>
                <p className="text-sm text-gray-500">
                  {deadPlayers.length} muertos
                </p>
              </div>
              
              <button
                onClick={handleExitClick}
                className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                title="Salir de la partida"
              >
                🚪 Salir
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Jugadores */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Jugadores</h2>
              
              {/* Vivos */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-green-600 mb-2">VIVOS ({alivePlayers.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alivePlayers.map(player => {
                    const roleInfo = getRoleInfo(player.role)
                    return (
                      <div
                        key={player.id}
                        className="bg-green-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {player.is_sheriff && (
                              <span className="text-yellow-500" title="Sheriff">⭐</span>
                            )}
                            <span className="font-medium text-gray-800">{player.name}</span>
                          </div>
                          <span className="text-xl">{roleInfo.emoji}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {roleInfo.name}
                          {player.is_sheriff && <span className="text-yellow-700 font-bold ml-2">• Sheriff</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Muertos */}
              {deadPlayers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-red-600 mb-2">MUERTOS ({deadPlayers.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {deadPlayers.map(player => {
                      const roleInfo = getRoleInfo(player.role)
                      return (
                        <div
                          key={player.id}
                          className="bg-gray-100 p-3 rounded-lg opacity-60"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800 line-through">{player.name}</span>
                            <span className="text-xl">{roleInfo.emoji}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {roleInfo.name}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna central y derecha: Fase del juego */}
          <div className="lg:col-span-2">
            {gameState.phase === 'night' ? (
              <NightPhase
                players={players}
                alivePlayers={alivePlayers}
                gameState={gameState}
                setGameState={setGameState}
                nightSteps={nightSteps}
                onNightEnd={(deaths) => {
                  console.log('🌅 Procesando muertes nocturnas:', deaths)
                  
                  // Procesar muertes y detectar cazador
                  let hunterRevengeData = null
                  
                  deaths.forEach(death => {
                    const result = killPlayer(death.playerId, death.cause)
                    
                    // Si murió un cazador, guardar para el día
                    if (result && result.type === 'hunter_revenge') {
                      console.log('🏹 Cazador muerto de noche:', result)
                      hunterRevengeData = result
                    }
                  })
                  
                  // Si hubo cazador, guardarlo para mostrarlo al inicio del día
                  if (hunterRevengeData) {
                    setPendingHunterRevenge(hunterRevengeData)
                  }
                  
                  // Cambiar a día
                  changePhase('day')
                }}
              />
            ) : (
              <DayPhase
                players={players}
                alivePlayers={alivePlayers}
                gameState={gameState}
                pendingHunterRevenge={pendingHunterRevenge}
                onExecutePlayer={(playerId) => {
                  const result = killPlayer(playerId, 'vote')
                  return result
                }}
                onDayEnd={() => {
                  setPendingHunterRevenge(null) // Limpiar venganza pendiente
                  changePhase('night')
                }}
                onHunterRevengeComplete={() => {
                  setPendingHunterRevenge(null) // Limpiar después de venganza
                }}
              />
            )}
          </div>
        </div>

        {/* Historial */}
        {gameState.history.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Historial</h2>
            <div className="space-y-2">
              {gameState.history.slice().reverse().map((event, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-sm">
                  <span className="text-2xl">
                    {event.type === 'wolves' ? '💀' : event.type === 'vote' ? '⚖️' : '🏹'}
                  </span>
                  <span className="text-gray-700">{event.message}</span>
                  <span className="text-gray-400 text-xs ml-auto">
                    {event.phase === 'night' ? '🌙' : '☀️'} Ronda {event.round}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de confirmación de salida */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ¿Salir de la partida?
              </h2>
              <p className="text-gray-600">
                Esta acción terminará la partida actual y no se podrá recuperar el progreso.
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ Advertencia:</strong> Todos los jugadores perderán acceso a la sala y tendrán que unirse a una nueva partida.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelExit}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                ✓ Salir de la Partida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameView

