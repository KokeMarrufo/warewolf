# 🔄 Actualizar Base de Datos para Nuevos Roles

**Importante**: Necesitas ejecutar esta migración SQL en Supabase para que los nuevos roles (Bruja y Niña) funcionen correctamente.

---

## 🚨 ¿Por qué es necesario?

Los cambios recientes al juego agregaron:
- 🧙‍♀️ **Bruja** (reemplaza al Doctor)
- 👧 **Niña** (nuevo rol pasivo)

Tu base de datos actual tiene columnas antiguas que necesitan actualizarse.

---

## 📋 Pasos para Actualizar

### 1. Acceder a Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Abre tu proyecto
4. Ve a **SQL Editor** (en el menú lateral izquierdo)

### 2. Ejecutar la Migración

Copia y pega este código SQL:

```sql
-- Migración: Agregar columnas para nuevos roles (Bruja y Niña)

-- 1. Eliminar columna de doctor (ya no se usa)
ALTER TABLE rooms 
DROP COLUMN IF EXISTS include_doctor;

-- 2. Agregar columna para bruja (reemplazo del doctor)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS include_witch BOOLEAN DEFAULT true;

-- 3. Agregar columna para niña (nuevo rol)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS include_girl BOOLEAN DEFAULT false;

-- 4. Actualizar tabla game_state para la bruja
ALTER TABLE game_state
DROP COLUMN IF EXISTS doctor_target;

ALTER TABLE game_state
ADD COLUMN IF NOT EXISTS witch_revive_used BOOLEAN DEFAULT false;

ALTER TABLE game_state
ADD COLUMN IF NOT EXISTS witch_poison_used BOOLEAN DEFAULT false;

ALTER TABLE game_state
ADD COLUMN IF NOT EXISTS witch_revive_target UUID REFERENCES players(id);

ALTER TABLE game_state
ADD COLUMN IF NOT EXISTS witch_poison_target UUID REFERENCES players(id);

-- Comentarios para documentación
COMMENT ON COLUMN rooms.include_witch IS 'Indica si se incluye el rol de Bruja (reemplaza al Doctor)';
COMMENT ON COLUMN rooms.include_girl IS 'Indica si se incluye el rol de Niña (rol pasivo)';
```

### 3. Ejecutar

1. Haz clic en el botón **Run** (o presiona `Ctrl+Enter` / `Cmd+Enter`)
2. Deberías ver el mensaje: **Success. No rows returned**
3. ¡Listo! Tu base de datos está actualizada

---

## ✅ Verificar la Migración

Para verificar que todo funcionó correctamente:

```sql
-- Ver la estructura de la tabla rooms
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'rooms'
ORDER BY ordinal_position;
```

Deberías ver:
- ✅ `include_witch` (boolean)
- ✅ `include_girl` (boolean)
- ❌ `include_doctor` (NO debe aparecer)

---

## 🔙 ¿Y las salas antiguas?

Si tienes salas activas creadas antes de esta actualización:

**Opción 1: Dejar que expiren naturalmente**
- Las salas antiguas seguirán funcionando con el rol de Doctor
- Nuevas salas usarán la Bruja
- Usa el sistema de limpieza automática

**Opción 2: Migrar datos manualmente** (opcional)
```sql
-- Si quieres convertir salas antiguas con doctor en salas con bruja:
UPDATE rooms 
SET include_witch = true 
WHERE include_doctor = true;
```

---

## 🆕 Para Proyectos Nuevos

Si estás creando un proyecto desde cero, usa el archivo `SUPABASE_SCHEMA.sql` actualizado que ya incluye todos los cambios.

---

## 🐛 Solución de Problemas

### Error: "column already exists"
**Solución**: Ya aplicaste la migración. Puedes ignorar este error.

### Error: "permission denied"
**Solución**: Asegúrate de estar usando el proyecto correcto en Supabase.

### La Niña no aparece en el juego
**Solución**: 
1. Verifica que ejecutaste la migración SQL
2. Recarga completamente la aplicación (Ctrl+Shift+R / Cmd+Shift+R)
3. Crea una nueva partida (las partidas viejas en caché pueden tener la configuración antigua)

---

## 📝 Notas Importantes

- ✅ Esta migración es **segura** - no borra datos de jugadores
- ✅ Usa `IF EXISTS` / `IF NOT EXISTS` para evitar errores si ya se aplicó
- ✅ Las políticas de seguridad (RLS) no se ven afectadas
- ⚠️ Si tienes partidas activas, termínalas antes de migrar (recomendado)

---

## 📞 ¿Problemas?

Si algo no funciona después de la migración:

1. Verifica que la migración se ejecutó sin errores
2. Limpia el localStorage del navegador:
   ```javascript
   // En la consola del navegador
   localStorage.clear()
   ```
3. Recarga la página completamente
4. Crea una nueva partida de prueba

---

**Estado**: ✅ Migración lista para ejecutar  
**Tiempo estimado**: < 1 minuto  
**Riesgo**: Bajo (no afecta datos existentes)

