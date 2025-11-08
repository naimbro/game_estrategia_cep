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

## ⚡ PROTOCOLO DE ITERACIÓN RÁPIDA (CRÍTICO)

### 🔄 Workflow para Aplicar Cambios del Usuario

Cuando el usuario reporta que los cambios no se ven o solicita modificaciones:

**1. SIEMPRE hacer estos pasos en orden:**
```bash
# Paso 1: Matar TODOS los procesos antiguos
pkill -9 -f "vite"
pkill -9 -f "node"

# Paso 2: Limpiar cache de Vite completamente
rm -rf .vite node_modules/.vite dist

# Paso 3: Iniciar servidor limpio
npm run dev -- --host
```

**2. Comunicar al usuario:**
```
✅ Servidor reiniciado con cache limpio en: http://localhost:5173/[nombre-juego]/

Por favor realiza un HARD REFRESH en tu navegador:
• Windows/Linux: Ctrl + Shift + R
• Mac: Cmd + Shift + R

Esto asegurará que veas la versión actualizada con los cambios.
```

### ⚠️ Señales de Problemas de Cache

El usuario dirá cosas como:
- "No veo los cambios"
- "Sigue mostrando la versión anterior"
- "Todavía aparece [feature antigua]"

**Acción inmediata**: Ejecutar el protocolo de limpieza de cache arriba.

### 🎯 Verificación de Cambios Aplicados

Después de cada modificación importante:
1. Confirmar que el archivo fue editado (mostrar línea específica)
2. Matar procesos antiguos y limpiar cache
3. Iniciar servidor nuevo
4. Instruir hard refresh al usuario
5. Esperar confirmación del usuario antes de continuar

### 🚫 Anti-Patrones que Causan Fricción

**NO hacer:**
- ❌ Asumir que el cambio en código se refleja automáticamente en el navegador
- ❌ Dejar múltiples procesos `npm run dev` corriendo simultáneamente
- ❌ Continuar con más cambios sin confirmar que el usuario ve los anteriores
- ❌ Olvidar recordar al usuario hacer hard refresh

**SÍ hacer:**
- ✅ Limpiar cache después de cambios significativos
- ✅ Matar procesos antiguos antes de levantar uno nuevo
- ✅ Dar instrucciones claras de hard refresh al usuario
- ✅ Esperar confirmación visual del usuario

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

## 🐛 Errores Comunes y Soluciones

### Error: "Cannot read properties of undefined (reading 'X')"

**Causa común**: Desincronización entre datos y código (ej: crear 10 rondas pero solo 8 escenarios)

**Solución**:
1. Verificar que arrays/objetos de datos coincidan con loops
2. Revisar variables de configuración (ej: `TOTAL_ROUNDS` vs `scenarios.length`)
3. Agregar validación: `scenarios[i - 1] || scenarios[0]`

**Ejemplo de esta sesión**:
```typescript
// ❌ MALO: creaba 10 rondas pero solo había 8 escenarios
const TOTAL_ROUNDS = 10;
for (let i = 1; i <= TOTAL_ROUNDS; i++) {
  scenarioId: scenarios[i - 1].id  // scenarios[9] = undefined!
}

// ✅ BUENO: alinear con datos reales
const TOTAL_ROUNDS = 8;  // Coincide con scenarios.length
```

### Problema: Cambios en Código No Se Reflejan en Navegador

**Causa**: Cache de Vite + cache del navegador

**Solución**: Ver "Protocolo de Iteración Rápida" arriba

### Problema: Múltiples Procesos Corriendo

**Síntoma**: Puerto 5173 ocupado, múltiples `npm run dev` activos

**Solución**:
```bash
# Ver todos los procesos
ps aux | grep vite

# Matar todos
pkill -9 -f "vite"
```

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

## 📚 Aprendizajes por Juego

### Game: Analista en Modo Crisis (game_estrategia_cep)

**Fecha**: Noviembre 2025
**Tema**: Análisis de datos CEP (Centro de Estudios Públicos Chile)
**Innovaciones clave**:

#### 1. Sistema de Jueces con IA (OpenAI)
```typescript
// Cloud Function que evalúa propuestas con múltiples jueces IA
// Cada juez tiene especialidad y peso diferente
// Ver: functions/src/index.ts
const judges = [
  { name: 'Leopoldo Cerros', specialty: 'rigor metodológico', weight: 0.25 },
  { name: 'Carolina Tohó', specialty: 'utilidad política', weight: 0.25 },
  { name: 'Daniel Matabuena', specialty: 'claridad comunicacional', weight: 0.25 },
  { name: 'Profe Naim', specialty: 'visualización de datos', weight: 0.25 }
];
```

**Lección**: Los jueces con IA funcionan excelente para feedback educativo personalizado. Usar `gpt-4o-mini` con `response_format: { type: 'json_object' }` para respuestas estructuradas y consistentes.

#### 2. Controles de Profesor Mejorados
- **Pausa de Timer**: Permite al profesor explicar variables sin presión de tiempo
- **Skip a Resultados**: Avanzar aunque no todos hayan enviado
- **Terminar Juego**: Mostrar podio final en cualquier momento

**Implementación clave** (ver `src/pages/Round.tsx:353-403`):
```typescript
// Timer con pausa
const [isPaused, setIsPaused] = useState(false);
<Timer endTime={endTime} onExpire={handleTimeExpire} isPaused={isPaused} />

// Botón de pausa
<button onClick={() => setIsPaused(!isPaused)}>
  {isPaused ? <Play /> : <Pause />}
  {isPaused ? 'Reanudar Tiempo' : 'Pausar Tiempo'}
</button>
```

**Lección**: La funcionalidad de pausa es CRÍTICA para contextos educativos. Guardar `pausedTime` en estado y restaurarlo al reanudar.

#### 3. Validación de Propuestas Sin Mínimo de Palabras

**Decisión**: Originalmente había mínimo de 200 palabras, pero se eliminó porque:
- Los estudiantes escribían relleno para cumplir
- La calidad no correlaciona con cantidad de palabras
- Los jueces IA evalúan mejor la calidad que un contador

**Lección**: Confiar en evaluación cualitativa (IA) > métricas cuantitativas arbitrarias

#### 4. Datos Complejos: Variables CEP

**Desafío**: Manejar >100 variables de encuestas reales con códigos, años, descripciones

**Solución**: Explorador de variables con búsqueda y filtros
```typescript
// src/components/VariableExplorer.tsx
// Permite buscar por código, tema, año
// Muestra información detallada de cada variable
```

**Lección**: Para juegos con datos reales complejos, crear herramientas de exploración dentro del juego en lugar de enlaces externos.

#### 5. Escenarios Realistas con Contexto Político

**Formato exitoso** (ver `src/data/scenarios.ts`):
```typescript
{
  id: 1,
  title: "La Paradoja de Carabineros",
  text: "Marzo 2024. El Director General de Carabineros enfrenta una crisis...",
  category: "Seguridad y Justicia",
  respuesta_ideal: {
    pregunta_investigacion: "...",
    variables_esperadas: [...],
    cruces_esperados: [...],
    insights_clave: [...]
  }
}
```

**Lección**: Incluir fecha, contexto real, urgencia, y stakeholder específico hace los escenarios mucho más inmersivos. Guardar "respuesta ideal" ayuda a calibrar jueces IA.

#### 6. Arquitectura con Firebase Functions

**Setup**:
- Frontend: Vite + React + Firebase SDK
- Backend: Cloud Functions para evaluación con OpenAI
- Firestore: Estado del juego en tiempo real

**Comando para desarrollo local**:
```bash
# Terminal 1: Frontend
npm run dev -- --host

# Terminal 2: Emulador de Functions
firebase emulators:start --only functions
```

**Lección**: Separar lógica de IA en Cloud Functions protege API keys y permite rate limiting. Firebase emulators funcionan perfectamente para desarrollo local.

#### 7. Problemas Encontrados y Solucionados

**a) Error: scenarios[9] undefined**
- Causa: `TOTAL_ROUNDS = 10` pero solo 8 escenarios
- Fix: Alinear `TOTAL_ROUNDS` con `scenarios.length`
- Prevención: Usar `scenarios.length` directamente en lugar de constante hardcodeada

**b) Cache de Vite persistente**
- Causa: `.vite/` y `node_modules/.vite/` cachean código viejo
- Fix: `rm -rf .vite node_modules/.vite dist` antes de reiniciar
- Prevención: Documentar protocolo de limpieza (ver arriba)

**c) Timer pausado no restauraba tiempo correctamente**
- Causa: No guardar `pausedTime` separado de `timeLeft`
- Fix: Usar dos estados distintos y restaurar en useEffect
- Código: `src/components/Timer.tsx:15-42`

### Componentes Reutilizables Generados

- `VariableExplorer.tsx`: Explorador de datos con búsqueda/filtros
- `JudgesPanel.tsx`: Panel visual mostrando jueces y estado de evaluación
- `JudgeScoreReveal.tsx`: Animación dramática revelando puntajes
- `JudgeFeedbackDisplay.tsx`: Display organizado de feedback por juez
- `Timer.tsx` con pausa: Versión mejorada con `isPaused` prop

### Próximas Mejoras Potenciales

- [ ] Guardar historial de partidas del profesor
- [ ] Analytics de variables más seleccionadas
- [ ] Exportar resultados a CSV para análisis
- [ ] Modo "torneo" con múltiples clases compitiendo
- [ ] Biblioteca de mejores respuestas para mostrar como ejemplos

---

**RECORDATORIO FINAL**: Este playbook existe para acelerar desarrollo, no para limitar creatividad. Úsalo como base sólida sobre la cual innovar. ¡Cada juego debe ser único y emocionante mientras mantiene la calidad educativa!