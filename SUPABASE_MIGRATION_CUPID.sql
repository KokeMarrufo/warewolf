-- Migración: Agregar rol de Cupido
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Agregar include_cupid a la tabla rooms
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS include_cupid BOOLEAN DEFAULT false;

-- 2. Agregar cupid_partner_id a la tabla players
-- Este campo guarda el ID del jugador con quien está flechado
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS cupid_partner_id UUID REFERENCES players(id) ON DELETE SET NULL;

-- 3. Crear índice para optimizar búsquedas de parejas flechadas
CREATE INDEX IF NOT EXISTS idx_players_cupid_partner ON players(cupid_partner_id);

-- Comentarios para referencia:
COMMENT ON COLUMN rooms.include_cupid IS 'Si se incluye el rol de Cupido en la partida';
COMMENT ON COLUMN players.cupid_partner_id IS 'ID del jugador con quien está flechado por Cupido (si uno muere, el otro también muere)';

