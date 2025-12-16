import { useState } from 'react'
import { getRoleInfo } from '../../utils/roles'

function NightPhase({ players, alivePlayers, gameState, setGameState, nightSteps, onNightEnd }) {
  const [selectedVictim, setSelectedVictim] = useState(null)
  const [selectedInvestigate, setSelectedInvestigate] = useState(null)
  const [witchWantsRevive, setWitchWantsRevive] = useState(null) // true, false, null
  const [selectedPoison, setSelectedPoison] = useState(null)
  
  const currentStepData = nightSteps[gameState.currentStep]
  
  const goToNextStep = () => {
    if (gameState.currentStep < nightSteps.length - 1) {
      setGameState({
        ...gameState,
        currentStep: gameState.currentStep + 1
      })
    }
  }
  
  const handleSelectVictim = () => {
    if (!selectedVictim) {
      alert('Selecciona una víctima')
      return
    }
    
    console.log('🐺 Confirmando víctima:', selectedVictim)
    console.log('🐺 Estado actual:', gameState)
    
    // Actualizar estado y avanzar en una sola operación
    const newState = {
      ...gameState,
      wolfTarget: selectedVictim,
      currentStep: gameState.currentStep + 1
    }
    
    console.log('🐺 Nuevo estado:', newState)
    setGameState(newState)
  }
  
  const handleInvestigate = () => {
    if (!selectedInvestigate) {
      alert('Selecciona a quien investigar')
      return
    }
    
    const targetPlayer = players.find(p => p.id === selectedInvestigate)
    const roleInfo = getRoleInfo(targetPlayer.role)
    
    setGameState({
      ...gameState,
      seerTarget: selectedInvestigate,
      seerResult: targetPlayer.role, // Guardar el rol completo
      seerRoleName: roleInfo.name, // Guardar el nombre del rol
      seerRoleEmoji: roleInfo.emoji // Guardar el emoji
    })
  }
  
  const handleContinueAfterSeer = () => {
    // Avanzar preservando todos los datos acumulados
    setGameState({
      ...gameState,
      currentStep: gameState.currentStep + 1
    })
  }
  
  const handleWitchRevive = (decision) => {
    // decision: true (revivir), false (no revivir)
    if (decision) {
      // Bruja decide revivir
      setGameState({
        ...gameState,
        witchReviveTarget: gameState.wolfTarget, // Revivir a la víctima de los lobos
        witchReviveUsed: true,
        currentStep: gameState.currentStep + 1
      })
    } else {
      // Bruja decide no revivir
      setGameState({
        ...gameState,
        witchReviveTarget: null,
        currentStep: gameState.currentStep + 1
      })
    }
  }
  
  const handleWitchPoison = () => {
    if (selectedPoison) {
      // Bruja decide envenenar
      setGameState({
        ...gameState,
        witchPoisonTarget: selectedPoison,
        witchPoisonUsed: true,
        currentStep: gameState.currentStep + 1
      })
    } else {
      // Bruja decide no envenenar (skip)
      setGameState({
        ...gameState,
        witchPoisonTarget: null,
        currentStep: gameState.currentStep + 1
      })
    }
  }
  
  const handleProcessNight = () => {
    console.log('☀️ Procesando noche...')
    console.log('☀️ gameState completo:', gameState)
    console.log('☀️ wolfTarget:', gameState.wolfTarget)
    console.log('☀️ witchReviveTarget:', gameState.witchReviveTarget)
    console.log('☀️ witchPoisonTarget:', gameState.witchPoisonTarget)
    
    // Determinar quién muere
    const deaths = []
    
    // 1. Víctima de los lobos
    if (gameState.wolfTarget) {
      // Verificar si la bruja revivió a la víctima
      if (gameState.witchReviveTarget && gameState.wolfTarget === gameState.witchReviveTarget) {
        console.log('☀️ La bruja revivió a la víctima de los lobos')
        // Nadie muere, la bruja salvó a la víctima
      } else {
        console.log('☀️ La víctima de los lobos morirá:', gameState.wolfTarget)
        deaths.push({
          playerId: gameState.wolfTarget,
          cause: 'wolves'
        })
      }
    } else {
      console.log('☀️ No hay wolfTarget')
    }
    
    // 2. Víctima de la bruja (veneno)
    if (gameState.witchPoisonTarget) {
      console.log('☀️ La bruja envenenó a:', gameState.witchPoisonTarget)
      deaths.push({
        playerId: gameState.witchPoisonTarget,
        cause: 'witch'
      })
    }
    
    console.log('☀️ Deaths array:', deaths)
    onNightEnd(deaths)
  }
  
  if (!currentStepData) return null
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Guía Narrativa</h2>
          <span className="text-sm text-gray-500">
            Paso {gameState.currentStep + 1} de {nightSteps.length}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((gameState.currentStep + 1) / nightSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Lista de pasos */}
      <div className="space-y-3 mb-6">
        {nightSteps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border-2 ${
              idx === gameState.currentStep
                ? 'bg-purple-50 border-purple-500'
                : idx < gameState.currentStep
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {idx < gameState.currentStep && (
                    <span className="text-green-600 font-bold">✅</span>
                  )}
                  {idx === gameState.currentStep && (
                    <span className="text-purple-600 font-bold">▶</span>
                  )}
                  <h3 className="font-bold text-gray-800">{step.title}</h3>
                </div>
                {idx === gameState.currentStep && (
                  <p className="text-gray-600 mt-2 italic">{step.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paso actual - Acciones */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="font-bold text-xl text-gray-800 mb-4">{currentStepData.title}</h3>
        <p className="text-gray-700 mb-6 text-lg italic">"{currentStepData.description}"</p>
        
        {/* Acción: Seleccionar víctima (Lobos) */}
        {currentStepData.action === 'select_victim' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Víctima seleccionada por los lobos:
            </label>
            <select
              value={selectedVictim || ''}
              onChange={(e) => {
                console.log('🐺 Lobo selecciona:', e.target.value)
                setSelectedVictim(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
            >
              <option value="">-- Seleccionar --</option>
              {alivePlayers
                .filter(p => p.role !== 'wolf')
                .map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
            </select>
            
            {selectedVictim && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ✓ Víctima seleccionada: <strong>{players.find(p => p.id === selectedVictim)?.name}</strong>
                </p>
              </div>
            )}
            
            <button
              onClick={handleSelectVictim}
              disabled={!selectedVictim}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {selectedVictim ? '✓ Confirmar y Continuar →' : '⚠️ Selecciona una víctima'}
            </button>
          </div>
        )}
        
        {/* Acción: Investigar (Vidente) */}
        {currentStepData.action === 'select_investigate' && (
          <div>
            {!gameState.seerResult ? (
              // Paso 1: Seleccionar jugador a investigar
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  El vidente investiga a:
                </label>
                <select
                  value={selectedInvestigate || ''}
                  onChange={(e) => setSelectedInvestigate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
                >
                  <option value="">-- Seleccionar --</option>
                  {alivePlayers
                    .filter(p => p.role !== 'seer')
                    .map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleInvestigate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  🔍 Investigar →
                </button>
              </>
            ) : (
              // Paso 2: Mostrar resultado y permitir continuar
              <div>
                <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <p className="text-blue-900 font-medium mb-3">
                    Resultado de la investigación:
                  </p>
                  <div className={`p-6 rounded-lg font-bold text-center ${
                    gameState.seerResult === 'wolf'
                      ? 'bg-red-100 border-2 border-red-300 text-red-800'
                      : 'bg-purple-100 border-2 border-purple-300 text-purple-800'
                  }`}>
                    <div className="text-6xl mb-4">
                      {gameState.seerRoleEmoji}
                    </div>
                    <div className="text-3xl">
                      {gameState.seerRoleName?.toUpperCase()}
                    </div>
                    {gameState.seerResult === 'wolf' && (
                      <div className="mt-3 text-red-600 text-xl">
                        ⚠️ ES LOBO ⚠️
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Instrucción:</strong> Muéstrale este resultado al Vidente (sin que los demás vean). 
                    Cuando esté listo, haz clic en continuar.
                  </p>
                </div>
                
                <button
                  onClick={handleContinueAfterSeer}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  ✓ Continuar (El vidente ya vio el resultado)
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Acción: Bruja - Poción de Vida (Revivir) */}
        {currentStepData.action === 'witch_revive' && (
          <div>
            {gameState.witchReviveUsed ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p className="text-gray-600 font-medium mb-3">
                  La bruja ya usó su poción de vida en una noche anterior
                </p>
                <button
                  onClick={() => handleWitchRevive(false)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Continuar →
                </button>
              </div>
            ) : gameState.wolfTarget ? (
              <div>
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <p className="text-red-900 font-medium">
                    💀 Los lobos atacaron a: <strong>{players.find(p => p.id === gameState.wolfTarget)?.name}</strong>
                  </p>
                </div>
                
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Instrucción:</strong> Pregúntale a la bruja si quiere usar su poción de vida para revivir a esta persona.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleWitchRevive(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    ✨ SÍ - Usar Poción de Vida (Revivir)
                  </button>
                  <button
                    onClick={() => handleWitchRevive(false)}
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    ❌ NO - No usar (Skip)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p className="text-gray-600 font-medium mb-3">
                  No hay víctima de los lobos esta noche
                </p>
                <button
                  onClick={() => handleWitchRevive(false)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Continuar →
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Acción: Bruja - Poción de Muerte (Envenenar) */}
        {currentStepData.action === 'witch_poison' && (
          <div>
            {gameState.witchPoisonUsed ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p className="text-gray-600 font-medium mb-3">
                  La bruja ya usó su poción de muerte en una noche anterior
                </p>
                <button
                  onClick={handleWitchPoison}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Continuar →
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Instrucción:</strong> La bruja puede elegir envenenar a alguien esta noche (o hacer skip).
                  </p>
                </div>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Envenenar a:
                </label>
                <select
                  value={selectedPoison || ''}
                  onChange={(e) => setSelectedPoison(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
                >
                  <option value="">-- No envenenar (Skip) --</option>
                  {alivePlayers
                    .filter(p => p.role !== 'witch')
                    .map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                </select>
                
                {selectedPoison && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-purple-800 font-medium">
                      ☠️ Víctima seleccionada: <strong>{players.find(p => p.id === selectedPoison)?.name}</strong>
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleWitchPoison}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  {selectedPoison ? '☠️ Confirmar Envenenamiento' : '➡️ Skip (No envenenar)'}
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Acción: Solo avanzar */}
        {!currentStepData.action && currentStepData.id !== 'dawn' && (
          <button
            onClick={goToNextStep}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Siguiente →
          </button>
        )}
        
        {/* Acción: Procesar noche (Amanecer) */}
        {currentStepData.action === 'process_night' && (
          <div>
            <div className="mb-4 p-4 bg-purple-50 border-2 border-purple-300 rounded-xl">
              <p className="text-purple-900 font-bold text-lg mb-3">
                📋 Resumen de la noche:
              </p>
              <div className="space-y-2">
                {gameState.wolfTarget ? (
                  <div className="bg-red-100 p-3 rounded-lg border border-red-300">
                    <p className="text-red-900 font-medium">
                      🐺 Lobos atacaron a: <strong>{players.find(p => p.id === gameState.wolfTarget)?.name || `ID: ${gameState.wolfTarget}`}</strong>
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Debug: wolfTarget = {gameState.wolfTarget}
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-100 p-3 rounded-lg border-2 border-red-400">
                    <p className="text-red-700 font-bold">⚠️ Los lobos no seleccionaron víctima</p>
                    <p className="text-xs text-red-600 mt-1">
                      Debug: wolfTarget = {String(gameState.wolfTarget)} (tipo: {typeof gameState.wolfTarget})
                    </p>
                  </div>
                )}
                
                {gameState.witchReviveTarget && (
                  <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                    <p className="text-green-900 font-medium">
                      🧙‍♀️✨ Bruja usó poción de vida en: <strong>{players.find(p => p.id === gameState.witchReviveTarget)?.name}</strong>
                    </p>
                  </div>
                )}
                
                {gameState.witchPoisonTarget && (
                  <div className="bg-purple-100 p-3 rounded-lg border border-purple-300">
                    <p className="text-purple-900 font-medium">
                      🧙‍♀️☠️ Bruja envenenó a: <strong>{players.find(p => p.id === gameState.witchPoisonTarget)?.name}</strong>
                    </p>
                  </div>
                )}
                
                {gameState.seerTarget && (
                  <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
                    <p className="text-blue-900 font-medium">
                      👁️ Vidente investigó a: <strong>{players.find(p => p.id === gameState.seerTarget)?.name}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Previsualización del resultado */}
            <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl">
              <p className="text-yellow-900 font-bold mb-2">⚠️ Resultado del amanecer:</p>
              {(() => {
                const deaths = []
                
                // Muerte por lobos
                if (gameState.wolfTarget) {
                  // Verificar si la bruja revivió
                  if (!gameState.witchReviveTarget || gameState.wolfTarget !== gameState.witchReviveTarget) {
                    deaths.push({
                      name: players.find(p => p.id === gameState.wolfTarget)?.name,
                      cause: 'lobos'
                    })
                  }
                }
                
                // Muerte por bruja
                if (gameState.witchPoisonTarget) {
                  deaths.push({
                    name: players.find(p => p.id === gameState.witchPoisonTarget)?.name,
                    cause: 'bruja'
                  })
                }
                
                if (deaths.length === 0) {
                  if (gameState.wolfTarget && gameState.witchReviveTarget) {
                    return (
                      <p className="text-green-800 font-medium text-lg">
                        ✨ Nadie morirá (la bruja salvó a la víctima)
                      </p>
                    )
                  } else {
                    return (
                      <p className="text-green-800 font-medium text-lg">
                        ✨ Nadie morirá (no hubo ataques)
                      </p>
                    )
                  }
                } else if (deaths.length === 1) {
                  return (
                    <p className="text-red-800 font-medium text-lg">
                      💀 <strong>{deaths[0].name}</strong> morirá ({deaths[0].cause})
                    </p>
                  )
                } else {
                  return (
                    <div className="space-y-1">
                      <p className="text-red-800 font-medium text-lg">
                        💀💀 Múltiples muertes esta noche:
                      </p>
                      {deaths.map((death, idx) => (
                        <p key={idx} className="text-red-700">
                          • <strong>{death.name}</strong> ({death.cause})
                        </p>
                      ))}
                    </div>
                  )
                }
              })()}
            </div>
            
            <button
              onClick={handleProcessNight}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-4 rounded-lg transition-colors text-xl shadow-lg"
            >
              ☀️ Amanecer - Procesar y Revelar Resultado
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NightPhase

