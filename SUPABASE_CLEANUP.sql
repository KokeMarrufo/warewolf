-- Script de Limpieza para Salas Inactivas
-- Ejecutar periódicamente en Supabase para mantener la base de datos limpia

-- ============================================
-- OPCIÓN 1: Limpieza Manual (Ejecutar cuando quieras)
-- ============================================

-- Ver salas viejas (más de 24 horas)
SELECT 
  r.code,
  r.status,
  r.created_at,
  COUNT(p.id) as num_players,
  AGE(NOW(), r.created_at) as age
FROM rooms r
LEFT JOIN players p ON p.room_id = r.id
WHERE r.created_at < NOW() - INTERVAL '24 hours'
GROUP BY r.id, r.code, r.status, r.created_at
ORDER BY r.created_at DESC;

-- Eliminar salas de más de 24 horas
-- (Esto también elimina jugadores y game_state por CASCADE)
DELETE FROM rooms
WHERE created_at < NOW() - INTERVAL '24 hours';

-- Ver cuántas salas hay actualmente
SELECT 
  status,
  COUNT(*) as count,
  MIN(created_at) as oldest,
  MAX(created_at) as newest
FROM rooms
GROUP BY status;

-- ============================================
-- OPCIÓN 2: Limpieza Automática con Función
-- ============================================

-- Crear función de limpieza
CREATE OR REPLACE FUNCTION cleanup_old_rooms()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Eliminar salas de más de 24 horas
  DELETE FROM rooms
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar manualmente la función
SELECT cleanup_old_rooms();

-- ============================================
-- OPCIÓN 3: Programar Limpieza Automática
-- ============================================

-- NOTA: Supabase no tiene cron jobs nativos en el plan free
-- Tienes que usar una de estas opciones:

-- A) Supabase Edge Functions (con cron trigger)
--    https://supabase.com/docs/guides/functions/schedule-functions

-- B) GitHub Actions (gratis)
--    Ejecuta el cleanup cada 24 horas

-- C) Vercel Cron Jobs (si usas Vercel)
--    https://vercel.com/docs/cron-jobs

-- D) Manual: Ejecutar este script cada semana

-- ============================================
-- OPCIÓN 4: Limpieza Selectiva
-- ============================================

-- Solo eliminar salas en estado 'setup' (nunca iniciadas) de más de 2 horas
DELETE FROM rooms
WHERE status = 'setup'
  AND created_at < NOW() - INTERVAL '2 hours';

-- Solo eliminar salas 'finished' de más de 12 horas
DELETE FROM rooms
WHERE status = 'finished'
  AND created_at < NOW() - INTERVAL '12 hours';

-- ============================================
-- OPCIÓN 5: Limpieza Conservadora
-- ============================================

-- Ver salas antiguas antes de eliminar
WITH old_rooms AS (
  SELECT 
    r.id,
    r.code,
    r.status,
    r.created_at,
    COUNT(p.id) as players
  FROM rooms r
  LEFT JOIN players p ON p.room_id = r.id
  WHERE r.created_at < NOW() - INTERVAL '48 hours'
  GROUP BY r.id
)
SELECT * FROM old_rooms;

-- Eliminar solo si estás seguro
-- DELETE FROM rooms WHERE id IN (SELECT id FROM old_rooms);

-- ============================================
-- ESTADÍSTICAS Y MONITOREO
-- ============================================

-- Ver uso de espacio en base de datos
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Contar registros por tabla
SELECT 
  'rooms' as table_name, 
  COUNT(*) as count,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h
FROM rooms
UNION ALL
SELECT 
  'players' as table_name, 
  COUNT(*) as count,
  COUNT(CASE WHEN joined_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h
FROM players
UNION ALL
SELECT 
  'game_state' as table_name, 
  COUNT(*) as count,
  COUNT(CASE WHEN updated_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h
FROM game_state;

-- ============================================
-- POLÍTICAS RECOMENDADAS
-- ============================================

/*
POLÍTICA SUGERIDA PARA LIMPIEZA:

1. Salas en 'setup' (nunca iniciadas):
   - Eliminar después de 2 horas
   - Probablemente el narrador abandonó

2. Salas en 'playing' (en progreso):
   - Eliminar después de 6 horas
   - Una partida normal dura 30-60 minutos
   
3. Salas en 'finished' (terminadas):
   - Eliminar después de 12 horas
   - Ya cumplieron su propósito

4. Ejecutar limpieza:
   - Diaria (ideal)
   - Semanal (mínimo)
*/

-- Script completo con política sugerida
DELETE FROM rooms WHERE status = 'setup' AND created_at < NOW() - INTERVAL '2 hours';
DELETE FROM rooms WHERE status = 'playing' AND created_at < NOW() - INTERVAL '6 hours';
DELETE FROM rooms WHERE status = 'finished' AND created_at < NOW() - INTERVAL '12 hours';

-- ============================================
-- BACKUP ANTES DE LIMPIEZA (OPCIONAL)
-- ============================================

-- Crear tabla de backup (solo primera vez)
CREATE TABLE IF NOT EXISTS rooms_backup (LIKE rooms INCLUDING ALL);
CREATE TABLE IF NOT EXISTS players_backup (LIKE players INCLUDING ALL);

-- Hacer backup antes de limpiar
INSERT INTO rooms_backup SELECT * FROM rooms WHERE created_at < NOW() - INTERVAL '24 hours';
INSERT INTO players_backup SELECT * FROM players WHERE room_id IN (
  SELECT id FROM rooms WHERE created_at < NOW() - INTERVAL '24 hours'
);

-- Luego hacer el DELETE normal

