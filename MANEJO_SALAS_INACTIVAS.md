# 🧹 MANEJO DE SALAS INACTIVAS

## 🤔 El Problema

Cuando creas salas para jugar, estas quedan guardadas en Supabase. Si nadie las elimina:

❌ **Problemas:**
- Salas "zombies" que nadie usa
- Base de datos se llena con datos viejos
- Uso innecesario del límite de Supabase
- Códigos de sala ocupados sin uso

---

## ✅ Soluciones Implementadas

### 1. **Limpieza Automática al Cerrar Partida** ✨ NUEVO

Cuando el narrador hace clic en **"Nueva Partida Completa"**, la sala se elimina automáticamente de la base de datos.

```javascript
resetGame() {
  // Elimina la sala de Supabase
  DELETE FROM rooms WHERE id = roomId
  
  // También elimina (por CASCADE):
  // - Jugadores de esa sala
  // - Estado del juego
}
```

**Resultado:** ✅ Limpieza automática cuando terminas

---

### 2. **Limpieza Manual Periódica** (Recomendado)

Ejecuta el script `SUPABASE_CLEANUP.sql` en Supabase cada cierto tiempo.

#### Opción A: Limpieza Simple (Semanal)

```sql
-- Elimina salas de más de 24 horas
DELETE FROM rooms
WHERE created_at < NOW() - INTERVAL '24 hours';
```

**Cuándo:** Una vez por semana  
**Tiempo:** 10 segundos  
**Efecto:** Elimina todas las salas viejas

---

#### Opción B: Limpieza Selectiva (Recomendado)

```sql
-- Salas nunca iniciadas (2 horas)
DELETE FROM rooms
WHERE status = 'setup'
  AND created_at < NOW() - INTERVAL '2 hours';

-- Salas en juego (6 horas)
DELETE FROM rooms
WHERE status = 'playing'
  AND created_at < NOW() - INTERVAL '6 hours';

-- Salas terminadas (12 horas)
DELETE FROM rooms
WHERE status = 'finished'
  AND created_at < NOW() - INTERVAL '12 hours';
```

**Cuándo:** Diario o cada 3 días  
**Ventaja:** Más inteligente, elimina según estado

---

### 3. **Limpieza Automática con GitHub Actions** (Avanzado)

Crea un workflow que ejecute el cleanup automáticamente.

```yaml
# .github/workflows/cleanup.yml
name: Cleanup Old Rooms

on:
  schedule:
    - cron: '0 3 * * *'  # Diario a las 3 AM

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup Supabase
        run: |
          curl -X POST '${{ secrets.SUPABASE_URL }}/rest/v1/rpc/cleanup_old_rooms' \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

**Ventaja:** ✅ Totalmente automático  
**Requiere:** Configurar función en Supabase

---

## 📊 Políticas Recomendadas

### Por Estado de Sala:

| Estado | Descripción | Eliminar después de |
|--------|-------------|---------------------|
| `setup` | Nunca iniciada | 2 horas |
| `playing` | En juego | 6 horas |
| `finished` | Terminada | 12 horas |

### Justificación:

- **Setup (2 horas):** Si no inician en 2 horas, probablemente abandonaron
- **Playing (6 horas):** Una partida normal dura 30-60 min. 6 horas es generoso
- **Finished (12 horas):** Ya terminó, no necesita estar más tiempo

---

## 🔍 Monitoreo

### Ver Salas Actuales:

```sql
-- En Supabase SQL Editor
SELECT 
  code,
  status,
  created_at,
  AGE(NOW(), created_at) as age
FROM rooms
ORDER BY created_at DESC;
```

### Ver Estadísticas:

```sql
SELECT 
  status,
  COUNT(*) as count,
  MIN(created_at) as oldest,
  MAX(created_at) as newest
FROM rooms
GROUP BY status;
```

Resultado ejemplo:
```
status   | count | oldest              | newest
---------|-------|---------------------|--------------------
setup    | 3     | 2025-12-15 10:00:00 | 2025-12-16 14:00:00
playing  | 1     | 2025-12-16 13:30:00 | 2025-12-16 13:30:00
finished | 5     | 2025-12-14 09:00:00 | 2025-12-16 12:00:00
```

---

## 💰 Límites de Supabase Free

### Plan Gratis:
- **Almacenamiento:** 500 MB
- **Requests:** 50,000/mes
- **Bandwidth:** 2 GB/mes

### ¿Cuántas salas caben?

Tamaño aproximado por sala:
- 1 sala = ~1 KB
- 10 jugadores = ~2 KB
- 1 game_state = ~1 KB
- **Total por partida:** ~4 KB

**En 500 MB caben ~125,000 partidas** 😅

### ¿Entonces por qué limpiar?

✅ **Buenas prácticas:**
- Base de datos limpia y organizada
- Queries más rápidos
- Códigos de sala disponibles (LOBO01-LOBO99)
- Profesionalismo

---

## 🛠️ Guía Práctica

### Para el Usuario Normal:

**No necesitas hacer nada especial:**
1. Juega normalmente
2. Al terminar, haz clic en "Nueva Partida Completa"
3. ✅ La sala se elimina automáticamente

**Si abandonas a la mitad:**
- La sala queda en la BD
- Se auto-limpiará con el script manual (si lo configuras)
- O quedará ahí (no es problema crítico)

---

### Para el Administrador/Desarrollador:

**Setup Inicial (Una vez):**

1. Guarda el script de limpieza:
   - Ya está en `SUPABASE_CLEANUP.sql`

2. **Opción A: Manual (Simple)**
   ```
   - Cada semana, ve a Supabase SQL Editor
   - Ejecuta: DELETE FROM rooms WHERE created_at < NOW() - INTERVAL '24 hours';
   - Listo
   ```

3. **Opción B: Función (Mejor)**
   ```sql
   -- En Supabase SQL Editor
   CREATE OR REPLACE FUNCTION cleanup_old_rooms()
   RETURNS INTEGER AS $$
   BEGIN
     DELETE FROM rooms WHERE status = 'setup' AND created_at < NOW() - INTERVAL '2 hours';
     DELETE FROM rooms WHERE status = 'playing' AND created_at < NOW() - INTERVAL '6 hours';
     DELETE FROM rooms WHERE status = 'finished' AND created_at < NOW() - INTERVAL '12 hours';
     RETURN 1;
   END;
   $$ LANGUAGE plpgsql;
   ```
   
   Luego ejecutar manualmente:
   ```sql
   SELECT cleanup_old_rooms();
   ```

4. **Opción C: GitHub Actions (Automático)**
   - Crea `.github/workflows/cleanup.yml`
   - Configura el workflow
   - Se ejecuta solo cada día

---

## 📅 Calendario de Limpieza Recomendado

### Si juegas ocasionalmente (1-2 veces por semana):
```
Limpieza: Una vez por semana (domingo)
Método: Manual, 30 segundos
```

### Si juegas frecuentemente (varias veces por semana):
```
Limpieza: Cada 3 días
Método: Función + manual
```

### Si es un servidor público (muchos usuarios):
```
Limpieza: Diaria
Método: GitHub Actions (automático)
```

---

## 🚨 Qué NO Hacer

❌ **NO elimines salas activas manualmente**
- Si alguien está jugando, perderá la partida

❌ **NO uses intervalos muy cortos**
- No elimines salas de menos de 1 hora
- Puede haber gente jugando

❌ **NO olvides el CASCADE**
- Al eliminar una sala, también se eliminan jugadores y game_state
- Esto ya está configurado en el schema

---

## ✅ Checklist de Mantenimiento

### Semanal:
- [ ] Ver cuántas salas hay: `SELECT COUNT(*) FROM rooms;`
- [ ] Si son > 50, ejecutar limpieza
- [ ] Verificar que funcionó

### Mensual:
- [ ] Ver estadísticas de uso
- [ ] Ajustar intervalos de limpieza si es necesario
- [ ] Revisar logs de Supabase

### Cada 3 Meses:
- [ ] Hacer backup de datos importantes (opcional)
- [ ] Revisar uso de almacenamiento
- [ ] Optimizar si es necesario

---

## 🎯 Resumen Ejecutivo

### Para Usuarios:
✅ No te preocupes, todo se limpia automáticamente al hacer "Nueva Partida"

### Para Admins:
✅ Ejecuta `SUPABASE_CLEANUP.sql` una vez por semana
✅ O configura GitHub Actions para que sea automático

### Problema Resuelto:
✅ Las salas viejas se eliminan
✅ Base de datos limpia
✅ Todo funciona perfecto

---

## 📚 Archivos Relacionados

- **SUPABASE_CLEANUP.sql** - Script de limpieza completo
- **SUPABASE_SCHEMA.sql** - Schema original (incluye CASCADE)
- **.github/workflows/cleanup.yml** - (Opcional) Automatización

---

## 🔗 Links Útiles

- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)
- [GitHub Actions Cron](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

---

**¡Tu base de datos estará siempre limpia! 🧹✨**

