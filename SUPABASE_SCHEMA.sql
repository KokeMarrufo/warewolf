-- Schema para Supabase
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase

-- Tabla de salas
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'setup', -- 'setup', 'playing', 'finished'
  num_wolves INTEGER DEFAULT 1,
  include_seer BOOLEAN DEFAULT true,
  include_witch BOOLEAN DEFAULT true,  -- Bruja (reemplaza al Doctor)
  include_hunter BOOLEAN DEFAULT false,
  include_girl BOOLEAN DEFAULT false   -- Niña (nuevo rol pasivo)
);

-- Tabla de jugadores
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT, -- 'wolf', 'seer', 'witch', 'hunter', 'girl', 'villager'
  is_alive BOOLEAN DEFAULT true,
  role_opened BOOLEAN DEFAULT false,
  is_sheriff BOOLEAN DEFAULT false, -- Sheriff del pueblo (desempata votos)
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, name)
);

-- Tabla de estado del juego
CREATE TABLE IF NOT EXISTS game_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE UNIQUE,
  phase TEXT DEFAULT 'night', -- 'night', 'day'
  round INTEGER DEFAULT 1,
  current_step INTEGER DEFAULT 0,
  
  -- Acciones de la noche
  wolf_target UUID REFERENCES players(id),
  seer_target UUID REFERENCES players(id),
  seer_result TEXT, -- El rol completo del investigado
  witch_revive_used BOOLEAN DEFAULT false,
  witch_poison_used BOOLEAN DEFAULT false,
  witch_revive_target UUID REFERENCES players(id),
  witch_poison_target UUID REFERENCES players(id),
  
  -- Historial
  history JSONB DEFAULT '[]'::jsonb,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_players_room ON players(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);

-- Habilitar Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

-- Políticas: permitir lectura y escritura a todos (juego público sin autenticación)
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on game_state" ON game_state FOR ALL USING (true) WITH CHECK (true);

-- Función para generar código de sala único
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generar código aleatorio (LOBO + 2 dígitos)
    new_code := 'LOBO' || LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
    
    -- Verificar si existe
    SELECT EXISTS(SELECT 1 FROM rooms WHERE code = new_code) INTO code_exists;
    
    -- Si no existe, retornar
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

