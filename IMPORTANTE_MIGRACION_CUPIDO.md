# ⚠️ IMPORTANTE: Migración de Base de Datos para Cupido

**ANTES DE PROBAR CUPIDO**, debes ejecutar esta migración SQL en tu base de datos.

---

## 📋 Pasos para Migrar

### 1. Abrir Supabase SQL Editor

1. Ve a tu proyecto en [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click en el ícono "SQL Editor" en el menú lateral izquierdo
3. Click en "+ New Query"

### 2. Copiar y Ejecutar el SQL

Copia y pega este SQL completo en el editor:

```sql
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
```

### 3. Ejecutar

- Click en el botón "Run" o presiona `Ctrl+Enter` (Windows) o `Cmd+Enter` (Mac)
- Deberías ver: "Success. No rows returned"

---

## ✅ Verificación

Para verificar que la migración se ejecutó correctamente:

```sql
-- Verificar columnas de rooms
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rooms' AND column_name = 'include_cupid';

-- Verificar columnas de players
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'players' AND column_name = 'cupid_partner_id';
```

Deberías ver ambas columnas listadas.

---

## 📝 ¿Qué hace esta migración?

### `rooms.include_cupid`
- Tipo: `BOOLEAN`
- Default: `false`
- Función: Indica si el Cupido está incluido en la configuración de la partida

### `players.cupid_partner_id`
- Tipo: `UUID` (referencia a otro jugador)
- Default: `NULL`
- Función: Guarda el ID del jugador con quien está flechado
- Si el jugador **A** tiene `cupid_partner_id = B`, y B muere, A también muere automáticamente

### Índice
- Optimiza búsquedas cuando un jugador muere y necesitamos verificar si tiene pareja

---

## ⚠️ Si Ya Tienes Partidas en Curso

Si tienes partidas activas cuando ejecutas la migración:
- ✅ Las partidas existentes NO se afectarán
- ✅ `include_cupid` será `false` por default (Cupido no incluido)
- ✅ `cupid_partner_id` será `NULL` (sin flechados)
- ✅ Solo las NUEVAS partidas pueden usar Cupido

---

## 🚨 Errores Comunes

### Error: "relation 'rooms' does not exist"
**Solución**: Asegúrate de ejecutar primero `SUPABASE_SCHEMA.sql` para crear las tablas base.

### Error: "column already exists"
**Solución**: Ya ejecutaste la migración. Puedes ignorar este error o usar `IF NOT EXISTS` (ya incluido en el SQL).

### Error: "permission denied"
**Solución**: Asegúrate de estar ejecutando el SQL como el owner del proyecto en Supabase.

---

## 📁 Archivos Relacionados

- **SUPABASE_MIGRATION_CUPID.sql**: El archivo con el SQL completo
- **SUPABASE_SCHEMA.sql**: Schema completo actualizado (incluye Cupido)
- **BUGFIX_PLAYER_STATE_SYNC.md**: Documentación técnica de los cambios

---

## ✅ Después de Migrar

Una vez ejecutada la migración, puedes:

1. ✅ Crear una nueva partida
2. ✅ Marcar el checkbox "Incluir Cupido 💘"
3. ✅ Asignar roles (Cupido aparecerá como rol)
4. ✅ Seleccionar 2 jugadores para flechar
5. ✅ Jugar normalmente

---

**Fecha**: 16 de Diciembre, 2025  
**Versión**: v1.0.0-cupid  
**Crítico**: ⚠️ SÍ - Requerido antes de usar Cupido

