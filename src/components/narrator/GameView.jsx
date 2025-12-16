import { useState } from 'react'
import { getRoleInfo, checkWinCondition } from '../../utils/roles'
import { processNightActions, generateNightSteps } from '../../utils/gameLogic'
import NightPhase from './NightPhase'
import DayPhase from './DayPhase'

function GameView({ roomCode, players, setPlayers, gameState, setGameState, nightSteps, setNightSteps, onGameEnd }) {
  
  const alivePlayers = players.filter(p => p.is_alive)
  const deadPlayers = players.filter(p => !p.is_alive)
  
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
    const newHistory = [
      ...gameState.history,
      {
        type: cause,
        message: `${player.name} ha muerto (${cause === 'wolves' ? 'lobos' : 'votación'})`,
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
    
    // Si era cazador, mostrar opción de venganza
    if (player.role === 'hunter') {
      return 'hunter_revenge'
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
        doctorTarget: null
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
        doctorTarget: null
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
            
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                {alivePlayers.length} vivos
              </p>
              <p className="text-sm text-gray-500">
                {deadPlayers.length} muertos
              </p>
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
                  // Procesar muertes
                  deaths.forEach(death => {
                    killPlayer(death.playerId, death.cause)
                  })
                  
                  // Cambiar a día
                  changePhase('day')
                }}
              />
            ) : (
              <DayPhase
                players={players}
                alivePlayers={alivePlayers}
                gameState={gameState}
                onExecutePlayer={(playerId) => {
                  const result = killPlayer(playerId, 'vote')
                  return result
                }}
                onDayEnd={() => {
                  changePhase('night')
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
    </div>
  )
}

export default GameView

