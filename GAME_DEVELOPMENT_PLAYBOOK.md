# 🎮 Playbook para Desarrollo Rápido de Juegos Educativos

## 🎯 Propósito
Este documento captura la arquitectura y patrones exitosos del juego de riesgo político MGT300 para acelerar el desarrollo de futuros juegos educativos. **IMPORTANTE**: Este es un documento vivo - al terminar cada nuevo juego, actualiza este playbook con los nuevos aprendizajes.

## 👤 Información del Usuario

**GitHub Username**: naimbro  
**Firebase Account**: [email del usuario]  
**Preferencias de idioma**: Español (interfaces y mensajes)  
**Estilo de UI**: Gaming/dramático, gradientes, animaciones  
**Target audience**: Estudiantes universitarios (mobile-first)  
**Mobile Support**: SÍ - La app funciona perfectamente en celulares usando Tailwind responsive classes

## 🚀 Inicio Rápido

### Stack Obligatorio (NO cambiar - funcionó perfectamente)
```bash
# Claude Code debe ejecutar inmediatamente:
npm create vite@latest [nombre-juego] -- --template react-ts
cd [nombre-juego]
npm install
npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom
npm install react-router-dom lucide-react
npx tailwindcss init -p
```

### Dependencias Externas que requieren acción del usuario:
1. **Firebase**: El usuario debe crear proyecto en https://console.firebase.google.com
   - Guiar para: Crear proyecto → Habilitar Firestore → Obtener config → Crear `src/lib/firebase.ts`
   - Configuración típica: Authentication (anónimo), Firestore, Hosting
   - Reglas de Firestore: permitir lectura/escritura para usuarios autenticados

2. **GitHub Pages**: El usuario debe crear repo en GitHub
   - Formato de repo: `[nombre-juego]` bajo usuario `naimbro`
   - URL esperada: `https://naimbro.github.io/[nombre-juego]/`
   - Guiar para: Crear repo → Configurar Settings → Pages → Actions

## 🏗️ Arquitectura Base Reutilizable

### 1. Estructura de Carpetas
```
src/
├── components/     # Timer, Cards, Overlays, etc.
├── pages/         # Home, CreateGame, JoinGame, Round, Leaderboard
├── lib/           # firebase.ts, audio.ts, gameLogic.ts
├── hooks/         # useGame.ts (el más importante)
├── types/         # game.ts con interfaces
└── data/          # Datos específicos del juego
```

### 2. Flujo de Navegación Estándar
```
Home → CreateGame/JoinGame → Round → Leaderboard
         ↓                      ↓         ↓
    (crea partida)      (loop de rondas) (final/reinicio)
```

### 3. Estructura de Datos en Firestore (NO CAMBIAR)
```typescript
// Colección: games
{
  gameCode: string,          // Código de 6 caracteres
  createdAt: Timestamp,
  currentRound: number,
  totalRounds: number,
  players: {
    [userId]: {
      uid: string,
      name: string,
      capital: number,     // O equivalente según juego
      isAdmin: boolean,
      isActive: boolean,
      joinedAt: Timestamp,
      submissions: []      // Respuestas por ronda
    }
  },
  rounds: {
    [roundNumber]: {
      startTime: Timestamp,
      endTime: Timestamp,
      isActive: boolean,
      data: {},           // Datos específicos del juego
      results: {}         // Resultados calculados
    }
  }
}
```

## 🎨 Componentes UI Reutilizables

### Timer Component
```typescript
// Siempre mostrar tiempo restante con auto-procesamiento al expirar
<Timer endTime={roundEndTime} onExpire={handleTimeExpire} />
```

### Overlay de Resultados Dramático
- Pantalla completa con gradientes según resultado
- Animaciones (bounce, pulse, fadeIn)
- Efectos visuales (emojis flotantes)
- Barra de progreso de jugadores
- Botón skip para admin

### Estados de Carga/Error
- Spinner consistente con mensaje contextual
- Manejo de errores con retry automático
- Estados vacíos informativos

## 🔄 Sistema Multiplayer en Tiempo Real

### Hook useGame (COPIAR Y ADAPTAR)
```typescript
// Este hook maneja TODA la lógica de sincronización
// Incluye: suscripciones, actualizaciones, roles, estados
export const useGame = (gameId?: string) => {
  // Ver implementación en proyecto MGT300
}
```

### Características Clave:
1. **Auto-procesamiento**: Admin procesa automáticamente cuando todos envían o expira tiempo
2. **Sincronización en tiempo real**: Todos ven actualizaciones instantáneamente
3. **Manejo de desconexiones**: Marcar jugadores como inactivos
4. **Prevención de duplicados**: Un solo envío por ronda

## 🎯 Características Educativas

### Sistema de Feedback
```typescript
// Mensajes educativos personalizados según resultado
const generateEducationalMessage = (outcome, context) => {
  // Múltiples variantes para evitar repetición
  // Incluir contexto específico del tema
  // Tono: informativo pero entretenido
}
```

### Controles de Profesor
- Siempre incluir botón "Terminar Ronda Ahora"
- Botón skip en pantallas de espera/resultados
- Vista especial con más información en leaderboard

### Experiencia Solo vs Multijugador
```typescript
const isSoloPlay = Object.keys(players).length === 1;
// Ajustar timers y transiciones según modo
```

## 📦 Scripts y Deployment

### package.json essentials
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### GitHub Actions Workflow
- Copiar `.github/workflows/deploy.yml` del proyecto MGT300
- Ajustar base path según nombre del repo

## 💡 Proceso Creativo y Propuestas

### Claude Code debe ser PROACTIVO:
1. **Proponer mecánicas nuevas** basadas en el tema educativo
2. **Sugerir elementos de gamificación**: logros, power-ups, eventos especiales
3. **Innovar en visualización**: gráficos, animaciones temáticas, sonidos
4. **Pensar en rejugabilidad**: variación entre partidas, dificultad adaptativa

### Ideas para Explorar:
- Eventos aleatorios durante rondas
- Interacción entre jugadores (comercio, alianzas)
- Múltiples recursos/métricas a gestionar
- Mini-juegos dentro del juego principal
- Sistema de progresión entre partidas

## 🔧 Mejoras Continuas

### Al terminar cada juego, actualizar:
1. Nuevos componentes reutilizables creados
2. Patrones de diseño descubiertos
3. Soluciones a problemas comunes
4. Optimizaciones de rendimiento
5. Feedback de usuarios/profesores

### Métricas de Éxito:
- Tiempo de desarrollo del juego anterior: ~8 horas
- Meta para próximo juego: < 4 horas
- Indicadores: código reutilizado, problemas evitados, features nuevos

## 🚨 Advertencias y Mejores Prácticas

1. **NO cambiar el stack base** - ya está optimizado
2. **Siempre usar TypeScript** - previene muchos bugs
3. **Mobile-first design** - estudiantes usan phones (usar `md:`, `lg:` classes de Tailwind)
4. **Testear con >10 jugadores** - encontrar problemas de escala
5. **Calcular resultados deterministicamente** - usar seeds para fairness

## 📝 Checklist de Inicio

Cuando el usuario pida un nuevo juego:
- [ ] Crear proyecto con Vite + React + TS inmediatamente
- [ ] Instalar todas las dependencias base
- [ ] Copiar estructura de carpetas
- [ ] Implementar navegación básica
- [ ] Configurar Firebase (con guía para usuario)
- [ ] Adaptar hook useGame
- [ ] Proponer 3-5 mecánicas innovadoras para el tema
- [ ] Crear prototipo jugable en <2 horas

---

**RECORDATORIO FINAL**: Este playbook existe para acelerar desarrollo, no para limitar creatividad. Úsalo como base sólida sobre la cual innovar. ¡Cada juego debe ser único y emocionante mientras mantiene la calidad educativa!