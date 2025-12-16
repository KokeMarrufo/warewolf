# 📝 CHANGELOG

## [1.2.0] - 2025-12-16

### 🎉 New Features
- **Sheriff del Pueblo**: Nueva designación para desempatar votaciones
  - El narrador designa manualmente al Sheriff en el setup (Paso 3)
  - El Sheriff desempata las votaciones durante el día
  - Si hay empate sin Sheriff, nadie es ejecutado
  - Indicador visual ⭐ para el Sheriff en todas las vistas
  - El Sheriff puede ser cualquier jugador (incluso Lobo)
  - Añade estrategia y resuelve empates

### 🗄️ Database Changes
- Nuevo campo `is_sheriff` en la tabla `players`
- Migración disponible en `SUPABASE_MIGRATION_SHERIFF.sql`

### ✨ Improvements
- Popup dedicado para decisión del Sheriff en empates
- Mejor visualización de empates en votaciones
- Mensajes claros cuando no hay Sheriff

---

## [1.1.0] - 2025-12-16

### 🎉 New Features
- **Tap to Reveal Role**: Los jugadores ahora deben hacer tap para ver su rol
  - Por defecto, el rol está oculto con pantalla gris neutra
  - Botón grande "Toca para revelar tu rol"
  - Botón "Ocultar Rol" para volver a ocultarlo en cualquier momento
  - Previene que otros jugadores vean el rol por accidente
  - Mejora significativa de privacidad y seguridad del juego

### ✨ Improvements
- Animación suave al revelar el rol
- Fondo cambia de color solo cuando el rol está visible
- Mensaje de advertencia: "Asegúrate de que nadie esté mirando"

---

## [1.0.0] - 2025-12-16

### 🎮 Initial Release

#### Features Completas:
- ✅ App Narrador (Desktop/Tablet)
  - Setup de partida con código único
  - QR Code para que jugadores se unan
  - Asignación aleatoria de roles
  - Guía narrativa paso a paso para fase noche
  - Sistema de votaciones para fase día
  - Habilidades especiales (Cazador)
  - Detección automática de victoria
  - Revelación de roles al final
  - Estado persistente en localStorage

- ✅ App Jugador (Mobile)
  - Unirse con código de sala
  - Pantalla de espera
  - Visualización de rol asignado
  - Lista de compañeros (para lobos)

- ✅ 5 Roles Implementados
  - 🐺 Lobo - Elige víctima cada noche
  - 👁️ Vidente - Investiga si alguien es lobo
  - ⚕️ Doctor - Protege de los lobos
  - 🏹 Cazador - Venganza al morir
  - 👤 Aldeano - Vota durante el día

- ✅ Sistema de Juego
  - Fase de noche con pasos guiados
  - Fase de día con votaciones
  - Historial de eventos
  - Condiciones de victoria

#### Tecnologías:
- React 18.2
- Vite 5.0
- Tailwind CSS 3.4
- Supabase (Backend)
- React Router 6.21
- QR Code Generator

#### Arquitectura:
- Sin WebSockets (polling simple)
- Estado local en el narrador
- Persistencia con localStorage
- Sin sincronización en tiempo real durante el juego

#### Documentación:
- 17 archivos de documentación completa
- Guías paso a paso
- Instrucciones de deployment
- Schema de base de datos

---

## 🔮 Roadmap Futuro (Opcional)

### v1.2.0 - Mejoras de UX
- [ ] Sonidos ambientales opcionales
- [ ] Modo oscuro
- [ ] Temas personalizables
- [ ] Avatares para jugadores

### v1.3.0 - Roles Adicionales
- [ ] Cupido 💘
- [ ] Bruja 🧙‍♀️
- [ ] Niña 👧
- [ ] Guardaespaldas 🛡️

### v1.4.0 - Estadísticas
- [ ] Historial de partidas
- [ ] Win rate por rol
- [ ] Estadísticas de jugadores
- [ ] Achievements

### v1.5.0 - Social
- [ ] Chat de texto opcional (para juego remoto)
- [ ] Compartir resultados
- [ ] Ranking de jugadores

### v2.0.0 - Multijugador Remoto
- [ ] Videollamada integrada
- [ ] Chat de voz
- [ ] Juego completamente remoto

---

## 🐛 Bug Fixes

### [1.0.1] - Si es necesario
- Ninguno reportado aún

---

## 📊 Notas de Versión

### Versionado Semántico
Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.x.x): Cambios incompatibles
- **MINOR** (x.1.x): Nuevas funcionalidades compatibles
- **PATCH** (x.x.1): Bug fixes

### Changelog Categories
- 🎉 **New Features**: Nuevas funcionalidades
- ✨ **Improvements**: Mejoras a features existentes
- 🐛 **Bug Fixes**: Corrección de errores
- 🔧 **Refactor**: Cambios internos sin afectar funcionalidad
- 📚 **Documentation**: Actualizaciones de documentación
- 🚀 **Performance**: Mejoras de rendimiento
- 🔒 **Security**: Mejoras de seguridad

---

**Última actualización:** 16 de Diciembre, 2025

