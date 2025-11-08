# 🎮 Analista en Modo Crisis

Juego educativo donde los estudiantes formulan **preguntas analíticas y estrategias de análisis** frente a escenarios realistas de política pública, usando el **dataset del CEP (Centro de Estudios Públicos de Chile)**.

## 🎯 Objetivo Pedagógico

Desarrollar la capacidad de:
- Formular preguntas de investigación claras y respondibles
- Seleccionar variables apropiadas para análisis empírico
- Diseñar estrategias analíticas coherentes
- Comunicar hallazgos potenciales de manera efectiva

## 🚀 Características

- **10 Escenarios Narrativos**: Casos reales de política pública chilena
- **4 Jueces IA Expertos**: Clara Datos, Analytikos, Insighta y Narrativo
- **100+ Variables CEP**: Diccionario completo de variables disponibles
- **Evaluación con GPT-4o-mini**: Feedback educativo personalizado
- **Ranking Global**: Compite con otros analistas
- **3 minutos por ronda**: Presión de tiempo realista

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Backend**: Firebase (Firestore + Auth)
- **IA**: OpenAI GPT-4o-mini
- **Deployment**: GitHub Pages

## 📋 Requisitos Previos

- Node.js 20+
- Cuenta Firebase
- API Key de OpenAI

## ⚙️ Configuración

### 1. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Firestore Database**
3. Habilitar **Authentication** (modo anónimo)
4. Copiar credenciales al archivo \`.env.local\`

### 3. Configurar OpenAI

1. Obtener API Key en [OpenAI Platform](https://platform.openai.com/api-keys)
2. Agregar al archivo \`.env.local\`

### 4. Variables de entorno

Crear archivo \`.env.local\`:

\`\`\`env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_OPENAI_KEY=sk-...
\`\`\`

## 🎮 Uso Local

\`\`\`bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
\`\`\`

## 🚀 Deployment

### GitHub Pages

1. Crear repositorio en GitHub
2. Configurar **GitHub Pages** en Settings → Pages
3. Agregar secrets en Settings → Secrets and variables → Actions:
   - \`VITE_FIREBASE_API_KEY\`
   - \`VITE_FIREBASE_AUTH_DOMAIN\`
   - \`VITE_FIREBASE_PROJECT_ID\`
   - \`VITE_FIREBASE_STORAGE_BUCKET\`
   - \`VITE_FIREBASE_MESSAGING_SENDER_ID\`
   - \`VITE_FIREBASE_APP_ID\`
   - \`VITE_OPENAI_KEY\`
4. Push a \`main\` → Deploy automático

## 📁 Estructura del Proyecto

\`\`\`
src/
├── components/         # Componentes reutilizables
│   ├── Timer.tsx
│   ├── JudgesPanel.tsx
│   ├── FeedbackOverlay.tsx
│   ├── VariableExplorer.tsx
│   └── LeaderboardComponent.tsx
├── pages/             # Páginas principales
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Round.tsx
│   ├── Leaderboard.tsx
│   └── End.tsx
├── lib/               # Lógica de negocio
│   ├── firebase.ts
│   ├── openaiJudges.ts
│   └── gameLogic.ts
├── hooks/             # Custom hooks
│   └── useGame.ts
├── types/             # TypeScript types
│   └── game.ts
└── data/              # Datos estáticos
    ├── scenarios.ts
    ├── variables.json
    └── judges.ts
\`\`\`

## 🎲 Flujo del Juego

1. **Home**: Bienvenida y explicación
2. **Login**: Ingreso de nombre (auth anónima)
3. **Round** (×10):
   - Leer escenario
   - Formular pregunta de investigación
   - Diseñar estrategia de análisis
   - Seleccionar variables CEP
   - Enviar respuesta (3 min límite)
   - Recibir feedback de 4 jueces IA
4. **End**: Resumen de desempeño y mejores respuestas
5. **Leaderboard**: Ranking global

## 🤖 Sistema de Jueces IA

Los 4 jueces evalúan según criterios específicos:

| Juez | Especialidad | Peso |
|------|--------------|------|
| Clara Datos 🧮 | Claridad y formulación | 20% |
| Analytikos 🧩 | Coherencia analítica y variables | 35% |
| Insighta 💡 | Originalidad y potencial | 25% |
| Narrativo 🎭 | Impacto comunicacional | 20% |

**Puntaje final** = Promedio ponderado de las 4 evaluaciones

## 📊 Firestore Structure

\`\`\`typescript
games/{gameId}:
  - gameId: string
  - playerId: string
  - player: {
      uid: string
      name: string
      totalScore: number
      averageScore: number
      submissions: Submission[]
      completedRounds: number
    }
  - currentRound: number
  - rounds: GameRound[]
  - isCompleted: boolean
\`\`\`

## 🔐 Reglas de Seguridad Firestore

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                       request.auth.uid == resource.data.playerId;
    }
  }
}
\`\`\`

## 🎨 Diseño

- **Estilo**: Dramático, analítico, gaming
- **Colores**: Gradientes de azul, morado, cian
- **Animaciones**: Framer Motion para transiciones suaves
- **Responsive**: Mobile-first con Tailwind

## 🧪 Testing Local

Para probar sin gastar créditos de OpenAI, puedes:

1. Comentar temporalmente la llamada a OpenAI en \`openaiJudges.ts\`
2. Retornar mock feedback con puntajes aleatorios
3. Verificar que el flujo de juego funciona correctamente

## 📝 Notas Importantes

- **Costo OpenAI**: ~$0.02 por partida completa (10 rondas × 4 jueces)
- **Límite de tiempo**: 3 minutos por ronda (auto-submit)
- **Persistencia**: Partidas guardadas en Firestore
- **Leaderboard**: Top 10 por puntaje promedio

## 🤝 Contribuir

Este es un proyecto educativo. Sugerencias de mejora:

- Más escenarios narrativos
- Nuevas variables CEP
- Diferentes modos de juego
- Sistema de logros
- Modo multijugador

## 📄 Licencia

Proyecto educativo desarrollado para el aprendizaje de análisis de datos con encuestas del CEP.

---

**Desarrollado con** ❤️ **para estudiantes de política pública**
