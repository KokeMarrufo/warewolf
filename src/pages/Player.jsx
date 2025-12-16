import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getRoleInfo, getPlayersByRole } from '../utils/roles'

function Player() {
  const [searchParams] = useSearchParams()
  const codeFromUrl = searchParams.get('code')
  
  const [screen, setScreen] = useState('join') // 'join', 'waiting', 'role'
  const [roomCode, setRoomCode] = useState(codeFromUrl || '')
  const [playerName, setPlayerName] = useState('')
  const [roomId, setRoomId] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const [playerRole, setPlayerRole] = useState(null)
  const [allPlayers, setAllPlayers] = useState([])
  const [error, setError] = useState('')
  const [roleVisible, setRoleVisible] = useState(false)
  const [cupidPartner, setCupidPartner] = useState(null) // Pareja de Cupido

  // Cargar desde localStorage si existe
  useEffect(() => {
    const savedPlayer = localStorage.getItem('player_data')
    if (savedPlayer) {
      try {
        const parsed = JSON.parse(savedPlayer)
        setRoomCode(parsed.roomCode)
        setPlayerName(parsed.playerName)
        setRoomId(parsed.roomId)
        setPlayerId(parsed.playerId)
        
        // Verificar si ya tiene rol
        if (parsed.playerId) {
          checkForRole(parsed.playerId)
        }
      } catch (e) {
        console.error('Error loading player data:', e)
      }
    }
  }, [])

  // Polling para verificar si ya tiene rol asignado
  useEffect(() => {
    if (screen === 'waiting' && playerId) {
      const interval = setInterval(async () => {
        await checkForRole(playerId)
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [screen, playerId])

  // Polling para detectar cambios de rol (cuando juegan otra ronda)
  useEffect(() => {
    if (screen === 'role' && playerId) {
      const interval = setInterval(async () => {
        await checkForRoleUpdate(playerId)
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [screen, playerId, playerRole])

  const checkForRole = async (pId) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*, room_id')
        .eq('id', pId)
        .single()
      
      if (error) throw error
      
      if (data.role) {
        setPlayerRole(data.role)
        setRoomId(data.room_id)
        
        // Marcar que abrió su rol
        if (!data.role_opened) {
          await supabase
            .from('players')
            .update({ role_opened: true })
            .eq('id', pId)
        }
        
        // Si tiene pareja de Cupido, buscar su nombre
        if (data.cupid_partner_id) {
          const { data: partner } = await supabase
            .from('players')
            .select('name')
            .eq('id', data.cupid_partner_id)
            .single()
          
          if (partner) {
            setCupidPartner(partner.name)
          }
        }
        
        // Obtener otros jugadores para mostrar compañeros (si es lobo)
        if (data.role === 'wolf') {
          const { data: players } = await supabase
            .from('players')
            .select('*')
            .eq('room_id', data.room_id)
          
          setAllPlayers(players || [])
        }
        
        setScreen('role')
        
        // Guardar en localStorage
        localStorage.setItem('player_data', JSON.stringify({
          roomCode,
          playerName,
          roomId: data.room_id,
          playerId: pId,
          playerRole: data.role
        }))
      }
    } catch (error) {
      console.error('Error checking role:', error)
    }
  }

  const checkForRoleUpdate = async (pId) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*, room_id')
        .eq('id', pId)
        .single()
      
      if (error) throw error
      
      // Si el rol cambió, actualizar
      if (data.role && data.role !== playerRole) {
        console.log('🔄 Rol actualizado:', data.role)
        setPlayerRole(data.role)
        setRoleVisible(false) // Ocultar el rol para que lo revelen de nuevo
        
        // Si tiene pareja de Cupido, buscar su nombre
        if (data.cupid_partner_id) {
          const { data: partner } = await supabase
            .from('players')
            .select('name')
            .eq('id', data.cupid_partner_id)
            .single()
          
          if (partner) {
            setCupidPartner(partner.name)
          }
        } else {
          setCupidPartner(null)
        }
        
        // Actualizar otros jugadores si es lobo
        if (data.role === 'wolf') {
          const { data: players } = await supabase
            .from('players')
            .select('*')
            .eq('room_id', data.room_id)
          
          setAllPlayers(players || [])
        } else {
          setAllPlayers([]) // Limpiar si ya no es lobo
        }
        
        // Actualizar localStorage
        localStorage.setItem('player_data', JSON.stringify({
          roomCode,
          playerName,
          roomId: data.room_id,
          playerId: pId,
          playerRole: data.role
        }))
      }
      
      // Si el rol se borró (nueva ronda sin asignar), volver a waiting
      if (!data.role) {
        console.log('🔄 Rol removido, esperando nueva asignación')
        setPlayerRole(null)
        setRoleVisible(false)
        setScreen('waiting')
      }
    } catch (error) {
      console.error('Error checking role update:', error)
    }
  }

  const handleLeaveRoom = () => {
    // Limpiar localStorage
    localStorage.removeItem('player_data')
    
    // Resetear estado
    setRoomCode('')
    setPlayerName('')
    setRoomId(null)
    setPlayerId(null)
    setPlayerRole(null)
    setAllPlayers([])
    setScreen('join')
    setRoleVisible(false)
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!roomCode.trim() || !playerName.trim()) {
      setError('Por favor completa todos los campos')
      return
    }
    
    try {
      // Buscar la sala
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode.toUpperCase())
        .single()
      
      if (roomError || !room) {
        setError('Código de sala no encontrado')
        return
      }
      
      // Unirse a la sala
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({
          room_id: room.id,
          name: playerName.trim()
        })
        .select()
        .single()
      
      if (playerError) {
        if (playerError.code === '23505') {
          setError('Este nombre ya está en uso en esta sala')
        } else {
          setError('Error al unirse a la sala')
        }
        return
      }
      
      setRoomId(room.id)
      setPlayerId(player.id)
      setScreen('waiting')
      
      // Guardar en localStorage
      localStorage.setItem('player_data', JSON.stringify({
        roomCode: roomCode.toUpperCase(),
        playerName: playerName.trim(),
        roomId: room.id,
        playerId: player.id
      }))
      
      // Verificar si ya hay rol asignado
      if (player.role) {
        await checkForRole(player.id)
      }
      
    } catch (error) {
      console.error('Error joining:', error)
      setError('Error al conectarse')
    }
  }

  // Pantalla 1: Unirse
  if (screen === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🐺</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">JUEGO DEL LOBO</h1>
            <p className="text-gray-600">Únete a una partida</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de sala:
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="LOBO42"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl font-bold tracking-wider uppercase"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu nombre:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ingresa tu nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-forest to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 UNIRSE
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Pantalla 2: Esperando
  if (screen === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-7xl mb-6 animate-pulse">⏳</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sala: {roomCode}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Esperando que el narrador inicie el juego
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Conectado</span>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Se actualizará automáticamente cuando te asignen un rol
          </p>

          <button
            onClick={handleLeaveRoom}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            🚪 Salir de la Sala
          </button>
        </div>
      </div>
    )
  }

  // Pantalla 3: Rol asignado
  if (screen === 'role') {
    const roleInfo = getRoleInfo(playerRole)
    const teammates = playerRole === 'wolf' 
      ? allPlayers.filter(p => p.role === 'wolf' && p.id !== playerId)
      : []
    
    // Fondo SIEMPRE igual para evitar reflejos en lentes
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Tu Rol</h2>
            
            {!roleVisible ? (
              // Estado oculto - Tap para revelar
              <button
                onClick={() => setRoleVisible(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-12 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-2xl active:scale-95"
              >
                <div className="text-6xl mb-4">👁️</div>
                <p className="text-xl">Toca para revelar tu rol</p>
                <p className="text-sm mt-3 opacity-80">Asegúrate de que nadie esté mirando</p>
              </button>
            ) : (
              // Estado visible - Mostrando el rol
              <>
                <div className="text-9xl mb-6 animate-fade-in">
                  {roleInfo.emoji}
                </div>
                
                <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
                  {roleInfo.name.toUpperCase()}
                </h1>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-6 animate-fade-in">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {roleInfo.description}
                  </p>
                </div>

                {/* Mostrar compañeros lobos */}
                {playerRole === 'wolf' && teammates.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 animate-fade-in">
                    <h3 className="font-bold text-red-900 mb-3 text-lg">
                      🐺 Otros Lobos:
                    </h3>
                    <ul className="space-y-2">
                      {teammates.map(teammate => (
                        <li key={teammate.id} className="text-red-800 font-medium text-lg">
                          • {teammate.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mostrar pareja de Cupido */}
                {cupidPartner && (
                  <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-6 mb-6 animate-fade-in">
                    <h3 className="font-bold text-pink-900 mb-3 text-lg">
                      💘 Flechado por Cupido:
                    </h3>
                    <p className="text-pink-800 font-medium text-lg mb-2">
                      Estás enlazado con <strong>{cupidPartner}</strong>
                    </p>
                    <p className="text-pink-700 text-sm">
                      ⚠️ Si {cupidPartner} muere, tú también mueres
                    </p>
                  </div>
                )}

                {/* Botón para ocultar */}
                <button
                  onClick={() => setRoleVisible(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4"
                >
                  🔒 Ocultar Rol
                </button>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm">
                    💡 Puedes ocultar y revelar tu rol cuando lo necesites
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <p className="text-xs text-gray-500">Sala: {roomCode}</p>
              <p className="text-xs text-gray-500 mt-1">Jugador: {playerName}</p>
            </div>
            
            <button
              onClick={handleLeaveRoom}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              🚪 Salir de la Sala
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Player

