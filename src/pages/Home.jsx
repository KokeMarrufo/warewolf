import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-night via-gray-900 to-night flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="text-8xl mb-4">🐺</div>
          <h1 className="text-6xl font-bold text-white mb-4">JUEGO DEL LOBO</h1>
          <p className="text-gray-400 text-lg">Werewolf/Mafia presencial</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/narrador')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            👑 SOY NARRADOR
          </button>

          <button
            onClick={() => navigate('/jugador')}
            className="w-full bg-forest hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            👥 SOY JUGADOR
          </button>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Sin sincronización • Sin sockets • Simple y robusto</p>
        </div>
      </div>
    </div>
  )
}

export default Home

