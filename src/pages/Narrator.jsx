import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { assignRoles, getRoleInfo, checkWinCondition, getPlayersByRole } from '../utils/roles'
import { generateNightSteps, processNightActions } from '../utils/gameLogic'
import SetupView from '../components/narrator/SetupView'
import GameView from '../components/narrator/GameView'
import VictoryView from '../components/narrator/VictoryView'

function Narrator() {
  // Estado de la sala
  const [roomCode, setRoomCode] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [gameStatus, setGameStatus] = useState('idle') // 'idle', 'setup', 'playing', 'finished'
  
  // Configuración
  const [numWolves, setNumWolves] = useState(1)
  const [includeSeer, setIncludeSeer] = useState(true)
  const [includeWitch, setIncludeWitch] = useState(true)
  const [includeHunter, setIncludeHunter] = useState(false)
  const [includeGirl, setIncludeGirl] = useState(false)
  const [includeCupid, setIncludeCupid] = useState(false)
  
  // Jugadores
  const [players, setPlayers] = useState([])
  
  // Flechas de Cupido
  const [cupidArrowsSet, setCupidArrowsSet] = useState(false) // Si ya se flecharon jugadores
  
  // Estado del juego
  const [gameState, setGameState] = useState({
    phase: 'night', // 'night', 'day'
    round: 1,
    currentStep: 0,
    wolfTarget: null,
    seerTarget: null,
    seerResult: null,
    witchReviveUsed: false,
    witchPoisonUsed: false,
    witchReviveTarget: null,
    witchPoisonTarget: null,
    history: []
  })
  
  const [nightSteps, setNightSteps] = useState([])
  const [winner, setWinner] = useState(null)

  // Polling para actualizar jugadores en setup
  useEffect(() => {
    if (gameStatus === 'setup' && roomId) {
      const interval = setInterval(async () => {
        await fetchPlayers()
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [gameStatus, roomId])

  // Cargar desde localStorage si existe
  useEffect(() => {
    const savedState = localStorage.getItem('narrator_state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setRoomCode(parsed.roomCode)
        setRoomId(parsed.roomId)
        setGameStatus(parsed.gameStatus)
        setPlayers(parsed.players || [])
        setGameState(parsed.gameState || gameState)
        setNightSteps(parsed.nightSteps || [])
        setNumWolves(parsed.numWolves || 1)
        setIncludeSeer(parsed.includeSeer !== false)
        setIncludeWitch(parsed.includeWitch !== false)
        setIncludeHunter(parsed.includeHunter || false)
        setIncludeGirl(parsed.includeGirl || false)
        setIncludeCupid(parsed.includeCupid || false)
        setCupidArrowsSet(parsed.cupidArrowsSet || false)
      } catch (e) {
        console.error('Error loading state:', e)
      }
    }
  }, [])

  // Guardar en localStorage cuando cambia el estado
  useEffect(() => {
    if (roomCode) {
      localStorage.setItem('narrator_state', JSON.stringify({
        roomCode,
        roomId,
        gameStatus,
        players,
        gameState,
        nightSteps,
        numWolves,
        includeSeer,
        includeWitch,
        includeHunter,
        includeGirl,
        includeCupid,
        cupidArrowsSet
      }))
    }
  }, [roomCode, roomId, gameStatus, players, gameState, nightSteps, numWolves, includeSeer, includeWitch, includeHunter, includeGirl, includeCupid, cupidArrowsSet])

  const createNewGame = async () => {
    try {
      // Generar código único
      const code = `LOBO${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`
      
      // Crear sala en Supabase
      const { data: room, error } = await supabase
        .from('rooms')
        .insert({
          code,
          status: 'setup',
          num_wolves: numWolves,
          include_seer: includeSeer,
          include_witch: includeWitch,
          include_hunter: includeHunter,
          include_girl: includeGirl,
          include_cupid: includeCupid
        })
        .select()
        .single()
      
      if (error) throw error
      
      setRoomCode(code)
      setRoomId(room.id)
      setGameStatus('setup')
      
    } catch (error) {
      console.error('Error creating game:', error)
      alert('Error al crear la partida')
    }
  }

  const fetchPlayers = async () => {
    if (!roomId) return
    
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true })
      
      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Error fetching players:', error)
    }
  }

  const addPlayerManually = async (name) => {
    if (!roomId || !name.trim()) return
    
    try {
      const { data, error } = await supabase
        .from('players')
        .insert({
          room_id: roomId,
          name: name.trim()
        })
        .select()
        .single()
      
      if (error) throw error
      await fetchPlayers()
    } catch (error) {
      console.error('Error adding player:', error)
      alert('Error al agregar jugador (puede que el nombre ya exista)')
    }
  }

  const removePlayer = async (playerId) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)
      
      if (error) throw error
      await fetchPlayers()
    } catch (error) {
      console.error('Error removing player:', error)
    }
  }

  const setSheriff = async (playerId) => {
    if (!roomId) {
      alert('Error: No hay sala activa')
      return
    }
    
    try {
      // Quitar sheriff de todos primero
      const { error: removeError } = await supabase
        .from('players')
        .update({ is_sheriff: false })
        .eq('room_id', roomId)
      
      if (removeError) throw removeError
      
      // Si se seleccionó un jugador, asignarlo como sheriff
      if (playerId && playerId !== '') {
        const { error: assignError } = await supabase
          .from('players')
          .update({ is_sheriff: true })
          .eq('id', playerId)
        
        if (assignError) throw assignError
      }
      
      // Recargar jugadores para ver el cambio
      await fetchPlayers()
      
      // Actualizar estado local inmediatamente
      setPlayers(prevPlayers => 
        prevPlayers.map(p => ({
          ...p,
          is_sheriff: p.id === playerId
        }))
      )
    } catch (error) {
      console.error('Error setting sheriff:', error)
      alert('Error al asignar Sheriff: ' + error.message)
    }
  }

  const assignRolesToPlayers = async () => {
    if (players.length < numWolves + 2) {
      alert(`Se necesitan al menos ${numWolves + 2} jugadores`)
      return
    }
    
    try {
      // Asignar roles localmente
      const playersWithRoles = assignRoles(players, {
        numWolves,
        includeSeer,
        includeWitch,
        includeHunter,
        includeGirl,
        includeCupid
      })
      
      // Actualizar en BD
      for (const player of playersWithRoles) {
        await supabase
          .from('players')
          .update({ role: player.role })
          .eq('id', player.id)
      }
      
      // Crear estado del juego
      const { error: gameStateError } = await supabase
        .from('game_state')
        .insert({
          room_id: roomId,
          phase: 'night',
          round: 1,
          current_step: 0,
          history: []
        })
      
      if (gameStateError && gameStateError.code !== '23505') { // Ignorar error de duplicado
        throw gameStateError
      }
      
      await fetchPlayers()
    } catch (error) {
      console.error('Error assigning roles:', error)
      alert('Error al asignar roles')
    }
  }

  const startGame = async () => {
    if (!players.every(p => p.role)) {
      alert('Primero debes asignar roles')
      return
    }
    
    try {
      await supabase
        .from('rooms')
        .update({ status: 'playing' })
        .eq('id', roomId)
      
      setGameStatus('playing')
      
      // Generar pasos de la noche
      const steps = generateNightSteps(players)
      setNightSteps(steps)
      
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  const resetGame = async () => {
    try {
      // Eliminar sala de la base de datos (limpieza)
      if (roomId) {
        await supabase
          .from('rooms')
          .delete()
          .eq('id', roomId)
      }
    } catch (error) {
      console.error('Error deleting room:', error)
    }
    
    // Limpiar estado local
    localStorage.removeItem('narrator_state')
    setRoomCode(null)
    setRoomId(null)
    setGameStatus('idle')
    setPlayers([])
    setGameState({
      phase: 'night',
      round: 1,
      currentStep: 0,
      wolfTarget: null,
      seerTarget: null,
      seerResult: null,
      witchReviveUsed: false,
      witchPoisonUsed: false,
      witchReviveTarget: null,
      witchPoisonTarget: null,
      history: []
    })
    setNightSteps([])
    setWinner(null)
  }

  const restartWithSamePlayers = async () => {
    try {
      // Resetear estado de jugadores en BD
      for (const player of players) {
        await supabase
          .from('players')
          .update({
            role: null,
            is_alive: true,
            role_opened: false
          })
          .eq('id', player.id)
      }

      // Resetear estado del juego en BD
      await supabase
        .from('game_state')
        .delete()
        .eq('room_id', roomId)

      // Actualizar sala a setup
      await supabase
        .from('rooms')
        .update({ status: 'setup' })
        .eq('id', roomId)

      // Resetear estado local pero mantener sala y jugadores
      setGameStatus('setup')
      setGameState({
        phase: 'night',
        round: 1,
        currentStep: 0,
        wolfTarget: null,
        seerTarget: null,
        seerResult: null,
        witchReviveUsed: false,
        witchPoisonUsed: false,
        witchReviveTarget: null,
        witchPoisonTarget: null,
        history: []
      })
      setNightSteps([])
      setWinner(null)

      // Recargar jugadores
      await fetchPlayers()
    } catch (error) {
      console.error('Error restarting game:', error)
      alert('Error al reiniciar la partida')
    }
  }

  // Renderizar vista según estado
  if (gameStatus === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👑</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel del Narrador</h1>
            <p className="text-gray-600">Configura tu partida del Lobo</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Lobos
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={numWolves}
                onChange={(e) => setNumWolves(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSeer}
                  onChange={(e) => setIncludeSeer(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">Incluir Vidente 👁️</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWitch}
                  onChange={(e) => setIncludeWitch(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">Incluir Bruja 🧙‍♀️</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHunter}
                  onChange={(e) => setIncludeHunter(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">Incluir Cazador 🏹</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGirl}
                  onChange={(e) => setIncludeGirl(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">Incluir Niña 👧</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCupid}
                  onChange={(e) => setIncludeCupid(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">Incluir Cupido 💘</span>
              </label>
            </div>

            <button
              onClick={createNewGame}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 Nueva Partida
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameStatus === 'setup') {
    return (
      <SetupView
        roomCode={roomCode}
        roomId={roomId}
        players={players}
        setPlayers={setPlayers}
        onAddPlayer={addPlayerManually}
        onRemovePlayer={removePlayer}
        onAssignRoles={assignRolesToPlayers}
        onSetSheriff={setSheriff}
        onStartGame={startGame}
        onBack={resetGame}
        // Configuración editable
        numWolves={numWolves}
        setNumWolves={setNumWolves}
        includeSeer={includeSeer}
        setIncludeSeer={setIncludeSeer}
        includeWitch={includeWitch}
        setIncludeWitch={setIncludeWitch}
        includeHunter={includeHunter}
        setIncludeHunter={setIncludeHunter}
        includeGirl={includeGirl}
        setIncludeGirl={setIncludeGirl}
        includeCupid={includeCupid}
        setIncludeCupid={setIncludeCupid}
        // Cupido
        cupidArrowsSet={cupidArrowsSet}
        setCupidArrowsSet={setCupidArrowsSet}
      />
    )
  }

  if (gameStatus === 'playing') {
    return (
      <GameView
        roomCode={roomCode}
        players={players}
        setPlayers={setPlayers}
        gameState={gameState}
        setGameState={setGameState}
        nightSteps={nightSteps}
        setNightSteps={setNightSteps}
        onGameEnd={(winnerData) => {
          setWinner(winnerData)
          setGameStatus('finished')
        }}
        onExitGame={resetGame}
        onSetSheriff={setSheriff}
      />
    )
  }

  if (gameStatus === 'finished') {
    return (
      <VictoryView
        winner={winner}
        players={players}
        onPlayAgain={restartWithSamePlayers}
        onNewGame={resetGame}
      />
    )
  }

  return null
}

export default Narrator

