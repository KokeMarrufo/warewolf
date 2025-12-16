import { useState } from 'react'
import { getRoleInfo } from '../../utils/roles'

function NightPhase({ players, alivePlayers, gameState, setGameState, nightSteps, onNightEnd }) {
  const [selectedVictim, setSelectedVictim] = useState(null)
  const [selectedInvestigate, setSelectedInvestigate] = useState(null)
  const [selectedProtect, setSelectedProtect] = useState(null)
  
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
    
    setGameState({
      ...gameState,
      wolfTarget: selectedVictim
    })
    
    goToNextStep()
  }
  
  const handleInvestigate = () => {
    if (!selectedInvestigate) {
      alert('Selecciona a quien investigar')
      return
    }
    
    const targetPlayer = players.find(p => p.id === selectedInvestigate)
    const isWolf = targetPlayer.role === 'wolf'
    
    setGameState({
      ...gameState,
      seerTarget: selectedInvestigate,
      seerResult: isWolf ? 'wolf' : 'not_wolf'
    })
    
    // Mostrar resultado al narrador
    setTimeout(() => {
      goToNextStep()
    }, 3000)
  }
  
  const handleProtect = () => {
    if (!selectedProtect) {
      alert('Selecciona a quien proteger')
      return
    }
    
    setGameState({
      ...gameState,
      doctorTarget: selectedProtect
    })
    
    goToNextStep()
  }
  
  const handleProcessNight = () => {
    // Determinar quién muere
    const deaths = []
    
    if (gameState.wolfTarget) {
      // Verificar si el doctor salvó a la víctima
      if (gameState.doctorTarget && gameState.wolfTarget === gameState.doctorTarget) {
        // Nadie muere, el doctor salvó a la víctima
      } else {
        deaths.push({
          playerId: gameState.wolfTarget,
          cause: 'wolves'
        })
      }
    }
    
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
              onChange={(e) => setSelectedVictim(e.target.value)}
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
            <button
              onClick={handleSelectVictim}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Confirmar víctima →
            </button>
          </div>
        )}
        
        {/* Acción: Investigar (Vidente) */}
        {currentStepData.action === 'select_investigate' && (
          <div>
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
            
            {gameState.seerResult && (
              <div className={`mb-4 p-4 rounded-lg font-bold text-center text-xl ${
                gameState.seerResult === 'wolf'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {gameState.seerResult === 'wolf' ? '🐺 ES LOBO' : '✓ NO ES LOBO'}
              </div>
            )}
            
            <button
              onClick={handleInvestigate}
              disabled={gameState.seerResult}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {gameState.seerResult ? 'Resultado mostrado...' : 'Investigar →'}
            </button>
          </div>
        )}
        
        {/* Acción: Proteger (Doctor) */}
        {currentStepData.action === 'select_protect' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              El doctor protege a:
            </label>
            <select
              value={selectedProtect || ''}
              onChange={(e) => setSelectedProtect(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
            >
              <option value="">-- Seleccionar --</option>
              {alivePlayers.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleProtect}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Confirmar protección →
            </button>
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
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Resumen de la noche:</strong>
              </p>
              <ul className="mt-2 text-sm text-yellow-700">
                {gameState.wolfTarget && (
                  <li>• Lobos atacaron a: {players.find(p => p.id === gameState.wolfTarget)?.name}</li>
                )}
                {gameState.doctorTarget && (
                  <li>• Doctor protegió a: {players.find(p => p.id === gameState.doctorTarget)?.name}</li>
                )}
                {gameState.seerTarget && (
                  <li>• Vidente investigó a: {players.find(p => p.id === gameState.seerTarget)?.name}</li>
                )}
              </ul>
            </div>
            <button
              onClick={handleProcessNight}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-4 rounded-lg transition-colors text-xl"
            >
              ☀️ Amanecer - Revelar resultado
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NightPhase

