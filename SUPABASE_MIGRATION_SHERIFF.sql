-- Migración para agregar el Sheriff
-- Ejecuta esto en el SQL Editor de Supabase si ya tienes la base de datos creada

-- Agregar columna is_sheriff a la tabla players
ALTER TABLE players ADD COLUMN IF NOT EXISTS is_sheriff BOOLEAN DEFAULT false;

-- Crear índice para búsquedas de sheriff
CREATE INDEX IF NOT EXISTS idx_players_sheriff ON players(room_id, is_sheriff) WHERE is_sheriff = true;

-- Nota: Solo puede haber un sheriff por sala
-- El narrador lo asigna manualmente al inicio del juego

