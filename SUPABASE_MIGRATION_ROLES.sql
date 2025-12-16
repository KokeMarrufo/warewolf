-- Migración: Agregar columnas para nuevos roles (Bruja y Niña)
-- Fecha: 16 de Diciembre, 2025

-- 1. Eliminar columna de doctor (ya no se usa)
ALTER TABLE rooms 
DROP COLUMN IF EXISTS include_doctor;

-- 2. Agregar columna para bruja (reemplazo del doctor)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS include_witch BOOLEAN DEFAULT true;

-- 3. Agregar columna para niña (nuevo rol)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS include_girl BOOLEAN DEFAULT false;

-- 4. Comentarios para documentación
COMMENT ON COLUMN rooms.include_witch IS 'Indica si se incluye el rol de Bruja (reemplaza al Doctor)';
COMMENT ON COLUMN rooms.include_girl IS 'Indica si se incluye el rol de Niña (rol pasivo)';

-- NOTA: Si ya tienes salas activas con include_doctor=true,
-- puedes migrar los datos antes de eliminar la columna:
-- UPDATE rooms SET include_witch = include_doctor WHERE include_doctor IS NOT NULL;

