import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getRoleInfo } from '../../utils/roles'

function SetupView({ roomCode, players, onAddPlayer, onRemovePlayer, onAssignRoles, onStartGame, onBack }) {
  const [newPlayerName, setNewPlayerName] = useState('')
  
  const playerUrl = `${window.location.origin}/jugador?code=${roomCode}`
  
  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName)
      setNewPlayerName('')
    }
  }
  
  const allRolesAssigned = players.length > 0 && players.every(p => p.role)
  
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
                        <span className="font-medium text-gray-800">{player.name}</span>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Acciones</h2>
            
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
                  onClick={onAssignRoles}
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

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-2">Paso 3: Iniciar juego</h3>
                <p className="text-sm text-green-700 mb-3">
                  Los jugadores verán su rol asignado
                </p>
                <button
                  onClick={onStartGame}
                  disabled={!allRolesAssigned}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                    !allRolesAssigned
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
    </div>
  )
}

export default SetupView

