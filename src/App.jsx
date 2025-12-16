import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Narrator from './pages/Narrator'
import Player from './pages/Player'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/narrador" element={<Narrator />} />
      <Route path="/jugador" element={<Player />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

