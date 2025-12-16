import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getRoleInfo } from '../../utils/roles'

function SetupView({ 
  roomCode,
  roomId,
  players,
  setPlayers,
  onAddPlayer, 
  onRemovePlayer, 
  onAssignRoles, 
  onSetSheriff, 
  onStartGame, 
  onBack,
  // Configuración editable
  numWolves,
  setNumWolves,
  includeSeer,
  setIncludeSeer,
  includeWitch,
  setIncludeWitch,
  includeHunter,
  setIncludeHunter,
  includeGirl,
  setIncludeGirl,
  includeCupid,
  setIncludeCupid,
  // Cupido
  cupidArrowsSet,
  setCupidArrowsSet
}) {
  const [newPlayerName, setNewPlayerName] = useState('')
  const [showCupidSelection, setShowCupidSelection] = useState(false)
  const [arrow1, setArrow1] = useState('')
  const [arrow2, setArrow2] = useState('')
  
  const playerUrl = `${window.location.origin}/jugador?code=${roomCode}`
  
  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName)
      setNewPlayerName('')
    }
  }
  
  const allRolesAssigned = players.length > 0 && players.every(p => p.role)
  const sheriff = players.find(p => p.is_sheriff)
  const cupidPlayer = players.find(p => p.role === 'cupid')
  const hasCupidAndNeedsArrows = cupidPlayer && !cupidArrowsSet
  
  // Detectar cuando se asignan roles con Cupido
  const handleAssignRoles = async () => {
    await onAssignRoles()
    
    // Si hay Cupido, mostrar selector de flechados
    if (includeCupid) {
      setTimeout(() => {
        const cupid = players.find(p => p.role === 'cupid')
        if (cupid) {
          setShowCupidSelection(true)
        }
      }, 500) // Esperar a que se actualicen los roles
    }
  }
  
  const handleSetCupidArrows = async () => {
    if (!arrow1 || !arrow2) {
      alert('Debes seleccionar 2 jugadores diferentes')
      return
    }
    
    if (arrow1 === arrow2) {
      alert('Debes seleccionar 2 jugadores DIFERENTES')
      return
    }
    
    try {
      const { supabase } = await import('../../lib/supabase')
      
      // Actualizar ambos jugadores con su pareja
      const { error: error1 } = await supabase
        .from('players')
        .update({ cupid_partner_id: arrow2 })
        .eq('id', arrow1)
      
      if (error1) throw error1
      
      const { error: error2 } = await supabase
        .from('players')
        .update({ cupid_partner_id: arrow1 })
        .eq('id', arrow2)
      
      if (error2) throw error2
      
      // Actualizar estado local
      const updatedPlayers = players.map(p => {
        if (p.id === arrow1) return { ...p, cupid_partner_id: arrow2 }
        if (p.id === arrow2) return { ...p, cupid_partner_id: arrow1 }
        return p
      })
      
      setPlayers(updatedPlayers)
      setCupidArrowsSet(true)
      setShowCupidSelection(false)
      setArrow1('')
      setArrow2('')
      
      alert('💘 Flechas de Cupido asignadas correctamente')
    } catch (error) {
      console.error('Error setting cupid arrows:', error)
      alert('Error al asignar flechas de Cupido: ' + error.message)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Volver</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Configuración de Partida</h1>
            <div className="w-20"></div>
          </div>
          
          {/* Código de sala y QR */}
          <div className="flex items-center justify-center space-x-8 py-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Código de Sala</p>
              <div className="text-6xl font-bold text-purple-600 tracking-wider">
                {roomCode}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Los jugadores pueden unirse con este código
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border-4 border-purple-600">
              <QRCodeSVG value={playerUrl} size={200} />
              <p className="text-xs text-center text-gray-500 mt-2">Escanear para unirse</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de jugadores */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Jugadores ({players.length})
            </h2>
            
            {/* Agregar jugador manualmente */}
            <form onSubmit={handleAddPlayer} className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Agregar jugador manualmente..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Agregar
                </button>
              </div>
            </form>
            
            {/* Lista */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {players.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>Esperando jugadores...</p>
                  <p className="text-sm mt-2">Se actualizará automáticamente</p>
                </div>
              ) : (
                players.map((player) => {
                  const roleInfo = player.role ? getRoleInfo(player.role) : null
                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {player.role_opened && (
                          <span className="text-green-500 text-xl">☑️</span>
                        )}
                        {player.is_sheriff && (
                          <span className="text-yellow-600 text-xl">⭐</span>
                        )}
                        <span className="font-medium text-gray-800">{player.name}</span>
                        {player.is_sheriff && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">
                            SHERIFF
                          </span>
                        )}
                        {roleInfo && (
                          <span className="text-sm text-gray-500">
                            {roleInfo.emoji} {roleInfo.name}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onRemovePlayer(player.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración y Acciones</h2>
            
            {/* Configuración de Roles */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5 mb-4">
              <h3 className="font-bold text-indigo-900 mb-4 text-lg">⚙️ Configuración de Roles</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Lobos 🐺
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={numWolves}
                    onChange={(e) => setNumWolves(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-bold text-center"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeSeer}
                      onChange={(e) => setIncludeSeer(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 font-medium">Incluir Vidente 👁️</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeWitch}
                      onChange={(e) => setIncludeWitch(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 font-medium">Incluir Bruja 🧙‍♀️</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeHunter}
                      onChange={(e) => setIncludeHunter(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 font-medium">Incluir Cazador 🏹</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeGirl}
                      onChange={(e) => setIncludeGirl(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 font-medium">Incluir Niña 👧</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeCupid}
                      onChange={(e) => setIncludeCupid(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 font-medium">Incluir Cupido 💘</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Paso 1: Reunir jugadores</h3>
                <p className="text-sm text-blue-700">
                  Los jugadores pueden unirse escaneando el QR o ingresando el código manualmente
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-2">Paso 2: Asignar roles</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Los roles se asignarán aleatoriamente según la configuración
                </p>
                <button
                  onClick={handleAssignRoles}
                  disabled={players.length < 3}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                    players.length < 3
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {allRolesAssigned ? '✓ Roles Asignados' : '🎲 Asignar Roles'}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-900 mb-2">Paso 3: Designar Sheriff ⭐</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  El Sheriff desempata las votaciones. Elige quién será el Sheriff del pueblo.
                </p>
                {sheriff ? (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-3">
                    <p className="text-yellow-900 font-bold text-center">
                      ⭐ {sheriff.name} es el Sheriff
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-yellow-600 mb-3 text-center italic">
                    Ningún sheriff asignado
                  </p>
                )}
                <select
                  onChange={(e) => onSetSheriff(e.target.value)}
                  value={sheriff?.id || ''}
                  disabled={players.length === 0}
                  className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                >
                  <option value="">-- Seleccionar Sheriff --</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              {hasCupidAndNeedsArrows && (
                <div className="bg-pink-50 border border-pink-300 rounded-lg p-4">
                  <h3 className="font-bold text-pink-900 mb-2">💘 Paso 3.5: Cupido debe flechar</h3>
                  <p className="text-sm text-pink-700 mb-3">
                    Antes de iniciar, el narrador debe preguntarle a Cupido quiénes quiere flechar (2 jugadores)
                  </p>
                  <button
                    onClick={() => setShowCupidSelection(true)}
                    className="w-full py-3 px-4 rounded-lg font-bold bg-pink-500 hover:bg-pink-600 text-white transition-colors"
                  >
                    💘 Seleccionar Flechados
                  </button>
                </div>
              )}

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

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-2">Paso 4: Iniciar juego</h3>
                <p className="text-sm text-green-700 mb-3">
                  Los jugadores verán su rol asignado
                </p>
                {hasCupidAndNeedsArrows && (
                  <p className="text-sm text-orange-600 font-bold mb-3">
                    ⚠️ Primero debes asignar las flechas de Cupido
                  </p>
                )}
                <button
                  onClick={onStartGame}
                  disabled={!allRolesAssigned || hasCupidAndNeedsArrows}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                    !allRolesAssigned || hasCupidAndNeedsArrows
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  }`}
                >
                  🎮 Iniciar Juego
                </button>
              </div>

              {players.length > 0 && players.length < 3 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-700">
                    ⚠️ Se necesitan al menos 3 jugadores para comenzar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Selección de Cupido */}
      {showCupidSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💘</div>
              <h2 className="text-3xl font-bold text-pink-600 mb-2">Cupido Flecha</h2>
              <p className="text-gray-600">
                El narrador pregunta a <strong>{cupidPlayer?.name}</strong> (Cupido) quiénes quiere flechar
              </p>
            </div>

            <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-4 mb-6">
              <p className="text-pink-900 text-sm mb-2">
                <strong>📋 Instrucciones:</strong>
              </p>
              <ol className="list-decimal list-inside text-pink-800 text-sm space-y-1">
                <li>El narrador pregunta a Cupido en secreto</li>
                <li>Cupido elige 2 jugadores cualesquiera</li>
                <li>Si uno de los flechados muere, el otro también muere</li>
                <li>Esto solo se hace UNA VEZ al inicio del juego</li>
              </ol>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primera flecha 💘
                </label>
                <select
                  value={arrow1}
                  onChange={(e) => setArrow1(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-lg"
                >
                  <option value="">-- Seleccionar jugador --</option>
                  {players.filter(p => p.role && p.id !== arrow2).map(player => {
                    const roleInfo = getRoleInfo(player.role)
                    return (
                      <option key={player.id} value={player.id}>
                        {player.name} ({roleInfo.emoji} {roleInfo.name})
                      </option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segunda flecha 💘
                </label>
                <select
                  value={arrow2}
                  onChange={(e) => setArrow2(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-lg"
                >
                  <option value="">-- Seleccionar jugador --</option>
                  {players.filter(p => p.role && p.id !== arrow1).map(player => {
                    const roleInfo = getRoleInfo(player.role)
                    return (
                      <option key={player.id} value={player.id}>
                        {player.name} ({roleInfo.emoji} {roleInfo.name})
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            {arrow1 && arrow2 && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 mb-4 text-center">
                <p className="text-green-800 font-medium">
                  💘 {players.find(p => p.id === arrow1)?.name} ↔️ {players.find(p => p.id === arrow2)?.name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Si uno muere, el otro también muere
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCupidSelection(false)
                  setArrow1('')
                  setArrow2('')
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSetCupidArrows}
                disabled={!arrow1 || !arrow2}
                className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors ${
                  !arrow1 || !arrow2
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                }`}
              >
                💘 Confirmar Flechas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SetupView

