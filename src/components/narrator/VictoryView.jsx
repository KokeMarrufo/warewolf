import { getRoleInfo } from '../../utils/roles'

function VictoryView({ winner, players, onNewGame }) {
  const isWolvesWin = winner.winner === 'wolves'
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Victoria */}
        <div className={`rounded-3xl shadow-2xl p-12 text-center mb-8 ${
          isWolvesWin
            ? 'bg-gradient-to-br from-red-600 to-red-800'
            : 'bg-gradient-to-br from-green-500 to-green-700'
        }`}>
          <div className="text-8xl mb-6">
            {isWolvesWin ? '🐺' : '🎉'}
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">
            {isWolvesWin ? '¡LOBOS GANAN!' : '¡ALDEANOS GANAN!'}
          </h1>
          <p className="text-2xl text-white opacity-90">
            {winner.message}
          </p>
        </div>

        {/* Revelación de roles */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            REVELACIÓN DE ROLES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map(player => {
              const roleInfo = getRoleInfo(player.role)
              return (
                <div
                  key={player.id}
                  className={`p-6 rounded-xl border-2 ${
                    player.is_alive
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xl font-bold ${
                      player.is_alive ? 'text-gray-800' : 'text-gray-500 line-through'
                    }`}>
                      {player.name}
                    </span>
                    {!player.is_alive && <span className="text-2xl">💀</span>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl">{roleInfo.emoji}</span>
                    <span className="text-lg font-medium text-gray-700">
                      {roleInfo.name}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <button
              onClick={onNewGame}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 Nueva Partida
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VictoryView

