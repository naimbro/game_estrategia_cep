# 🎮 Playbook para Desarrollo Rápido de Juegos Educativos

## 🎯 Propósito
Este documento captura la arquitectura y patrones exitosos de juegos educativos multiplayer con Firebase para acelerar el desarrollo de futuros juegos. **IMPORTANTE**: Este es un documento vivo - al terminar cada nuevo juego, actualiza este playbook con los nuevos aprendizajes.

## 📖 CÓMO USAR ESTE PLAYBOOK (PARA CLAUDE CODE)

**CUANDO EL USUARIO PIDA UN NUEVO JUEGO:**

1. **LEE PRIMERO** la sección [🚦 PROTOCOLO DE INICIO PARA CLAUDE CODE](#protocolo-de-inicio-para-claude-code) (al final de este documento)
2. **SIGUE** las 6 fases del protocolo EN ORDEN
3. **USA** los templates de código de las secciones:
   - [🚀 Inicio Rápido](#inicio-rápido) - Setup inicial del proyecto
   - [🏗️ Arquitectura Base Reutilizable](#arquitectura-base-reutilizable) - Estructura y patrones
   - [🎨 Componentes UI Reutilizables](#componentes-ui-reutilizables) - Código de componentes
   - [🎯 Características Educativas Esenciales](#características-educativas-esenciales) - Controles de profesor
4. **CONSULTA** [🐛 TROUBLESHOOTING COMÚN](#troubleshooting-común) cuando encuentres errores
5. **APRENDE** de [📚 Aprendizajes por Juego](#aprendizajes-por-juego) para evitar errores pasados

**REGLAS IMPORTANTES:**
- ✅ **SÍ** copiar templates de código directamente
- ✅ **SÍ** ejecutar comandos en el orden especificado
- ✅ **SÍ** crear TODOS los archivos de configuración (vite.config.ts, tailwind.config.js, etc.)
- ✅ **SÍ** guiar al usuario paso a paso para setup de Firebase
- ❌ **NO** saltar pasos del protocolo
- ❌ **NO** asumir que archivos ya existen
- ❌ **NO** hacer setup incompleto

**META**: Tener ambiente completamente funcional en <30 minutos y prototipo jugable en <4 horas.

## 👤 Información del Usuario

**GitHub Username**: naimbro  
**Firebase Account**: naim.bro@gmail.com
**Preferencias de idioma**: Español (interfaces y mensajes)  
**Estilo de UI**: Gaming/dramático, gradientes, animaciones  
**Target audience**: Estudiantes universitarios (mobile-first)  
**Mobile Support**: SÍ - La app funciona perfectamente en celulares usando Tailwind responsive classes

## 🚀 Inicio Rápido

### Paso 1: Setup Inicial del Proyecto (Ejecutar INMEDIATAMENTE)

```bash
# 1. Crear proyecto con Vite + React + TypeScript
npm create vite@latest [nombre-juego] -- --template react-ts
cd [nombre-juego]

# 2. Instalar dependencias core
npm install

# 3. Instalar dependencias de UI y routing
npm install react-router-dom lucide-react framer-motion

# 4. Instalar Firebase (v11+)
npm install firebase

# 5. Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 6. Instalar gh-pages para deployment
npm install -D gh-pages

# 7. Inicializar Tailwind
# (El comando anterior ya creó tailwind.config.js y postcss.config.js)
```

### Paso 2: Configurar Archivos Esenciales

**A) `vite.config.ts` - Agregar base path para GitHub Pages:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/[nombre-juego]/'  // ⚠️ CRÍTICO para GitHub Pages
})
```

**B) `tailwind.config.js` - Agregar animaciones útiles:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
```

**C) `src/index.css` - Setup base de Tailwind:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos globales del juego */
body {
  @apply bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900;
  @apply min-h-screen text-white;
}

/* Clases reutilizables */
.dramatic-card {
  @apply bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-2xl;
}

.primary-button {
  @apply bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50;
}

.input-field {
  @apply bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50;
}
```

**D) `package.json` - Agregar script de deploy:**
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

### Paso 3: Setup de Firebase Cloud Functions (SI necesitas backend)

**IMPORTANTE**: Solo si el juego requiere backend (ej: integración con OpenAI, lógica compleja del servidor, APIs externas).

```bash
# 1. Instalar Firebase CLI globalmente (si no lo tienes)
npm install -g firebase-tools

# 2. Login a Firebase
firebase login

# 3. Inicializar Firebase en el proyecto
firebase init

# Seleccionar:
# - Functions (Funciones en la nube)
# - Firestore (Base de datos)
# - Emulators (para desarrollo local)
#
# Configuración:
# - Language: TypeScript
# - ESLint: No (para desarrollo rápido)
# - Install dependencies: Yes
# - Emulators: Functions, Firestore
```

**Después del init, instalar dependencias adicionales en /functions:**
```bash
cd functions
npm install node-fetch@2
npm install -D @types/node-fetch
cd ..
```

**Crear `functions/.env` para desarrollo local:**
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
# Agregar otras API keys según necesidad
```

⚠️ **Asegurar que `functions/.env` esté en `.gitignore`**

### Paso 4: Estructura de Carpetas Base (Crear AHORA)

```bash
mkdir -p src/{components,pages,lib,hooks,types,data}
```

**Explicación:**
- `components/` - Timer, Cards, Overlays, JudgesPanel, etc.
- `pages/` - Home, CreateGame, JoinGame, Lobby, Round, Results, End
- `lib/` - firebase.ts, gameLogic.ts, audio.ts
- `hooks/` - useGame.ts, useAuth.ts
- `types/` - game.ts, player.ts (interfaces TypeScript)
- `data/` - Datos específicos del juego (escenarios, preguntas, etc.)

### Paso 5: Dependencias Externas (Requieren acción del usuario)

**A) Firebase Console:**
1. Usuario debe crear proyecto en https://console.firebase.google.com
2. Habilitar servicios:
   - ✅ **Authentication** → Métodos: Google + Anónimo
   - ✅ **Firestore Database** → Modo producción
   - ✅ **Cloud Functions** (si se requiere backend)
3. Obtener credenciales: Settings → General → Your apps → Web app
4. Crear `src/lib/firebase.ts` con la config (ver FIREBASE_SETUP_GUIDE.md)

**B) GitHub Repository:**
1. Crear repo: `https://github.com/naimbro/[nombre-juego]`
2. Configurar GitHub Pages:
   - Settings → Pages → Source: GitHub Actions
3. Agregar Secrets para Firebase (Settings → Secrets → Actions):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Paso 6: Comandos de Desarrollo

**Frontend solo:**
```bash
npm run dev -- --host  # Accesible desde celular en red local
```

**Frontend + Backend (Cloud Functions):**
```bash
# Terminal 1: Frontend
npm run dev -- --host

# Terminal 2: Emulador de Firebase Functions
firebase emulators:start --only functions
```

Acceder a:
- Frontend: `http://localhost:5173`
- Emulador UI: `http://localhost:4000`

### Paso 7: Configurar Firebase (CRÍTICO - Ejecutar Después de Crear Proyecto)

**A) Guiar al usuario para crear proyecto Firebase:**

```
El usuario debe:
1. Ir a https://console.firebase.google.com
2. Click "Add project" / "Agregar proyecto"
3. Nombre: [nombre-juego]
4. Google Analytics: Opcional
5. Wait for creation...
```

**B) Crear `src/lib/firebase.ts` (TEMPLATE COMPLETO):**

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'us-central1');

// Login con Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Login anónimo
export const loginAnonymously = async () => {
  const result = await signInAnonymously(auth);
  return result.user;
};
```

**C) Crear `.env.local` (TEMPLATE):**

```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=[proyecto-id].firebaseapp.com
VITE_FIREBASE_PROJECT_ID=[proyecto-id]
VITE_FIREBASE_STORAGE_BUCKET=[proyecto-id].appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**D) Crear `firestore.rules` (TEMPLATE):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameCode} {
      // Permitir lectura a todos los autenticados
      allow read: if request.auth != null;

      // Permitir crear juego a usuarios autenticados
      allow create: if request.auth != null
                    && request.resource.data.hostId == request.auth.uid;

      // Permitir actualizar al host o jugadores activos
      allow update: if request.auth != null
                    && (resource.data.hostId == request.auth.uid
                        || resource.data.players[request.auth.uid].isActive == true);

      // Permitir eliminar solo al host
      allow delete: if request.auth != null
                    && resource.data.hostId == request.auth.uid;
    }
  }
}
```

**E) Actualizar `.gitignore`:**

```bash
# Agregar estas líneas
.env.local
.env
functions/.env
```

**F) Instrucciones para el usuario en Firebase Console:**

```
Guiar al usuario:

1. Enable Authentication:
   - Firebase Console → Authentication → Get started
   - Sign-in method → Google → Enable → Save
   - Sign-in method → Anonymous → Enable → Save

2. Enable Firestore:
   - Firestore Database → Create database
   - Mode: Production mode (usaremos rules custom)
   - Location: us-central (o la más cercana)

3. Add web app:
   - Project Overview → Add app → Web (</> icon)
   - App nickname: [nombre-juego]-web
   - Firebase Hosting: No (usamos GitHub Pages)
   - Copy config values to .env.local

4. Configure Authorized Domains:
   - Authentication → Settings → Authorized domains
   - Add: [usuario].github.io
   - localhost ya está por defecto

5. Deploy Firestore Rules:
   firebase deploy --only firestore:rules
```

**G) Si usa Cloud Functions:**

```bash
# 1. Init Firebase Functions
firebase init functions

# Seleccionar:
# - TypeScript
# - ESLint: No
# - Install dependencies: Yes

# 2. Agregar dependencias en functions/
cd functions
npm install node-fetch@2
npm install -D @types/node-fetch
cd ..

# 3. Crear functions/.env para desarrollo local
echo "OPENAI_API_KEY=sk-proj-xxxxx" > functions/.env

# 4. Configurar API key en producción
firebase functions:config:set openai.key="sk-proj-xxxxx"
```

### ✅ Checklist Post-Setup

Antes de escribir código del juego, verificar:
- [ ] `npm run dev` corre sin errores
- [ ] Tailwind CSS funciona (ver gradientes en UI)
- [ ] Firebase config creado en `src/lib/firebase.ts`
- [ ] `.env.local` existe con credenciales Firebase
- [ ] Firebase Console: Authentication habilitado (Google + Anonymous)
- [ ] Firebase Console: Firestore Database creado
- [ ] Firestore rules desplegadas (`firebase deploy --only firestore:rules`)
- [ ] Estructura de carpetas creada (`src/{components,pages,lib,hooks,types,data}`)
- [ ] `vite.config.ts` tiene `base` path correcto
- [ ] `.gitignore` incluye `.env.local` y `functions/.env`
- [ ] (Si backend) Cloud Functions inicializadas
- [ ] (Si backend) `firebase functions:config:set` ejecutado

### 🎯 Tiempo Estimado de Setup

- **Sin backend**: ~15 minutos
- **Con Cloud Functions**: ~30 minutos

**Meta**: Tener ambiente completamente funcional en <30 minutos, listo para codear mecánicas del juego.

## 🏗️ Arquitectura Base Reutilizable

### 1. Estructura de Carpetas
```
src/
├── components/          # Componentes reutilizables
│   ├── Timer.tsx       # Timer con pausa (para profesores)
│   ├── JudgeScoreReveal.tsx    # Animación de puntajes (si hay evaluación)
│   ├── JudgeFeedbackDisplay.tsx # Display de feedback educativo
│   └── [componentes específicos del juego]
├── pages/              # Páginas principales
│   ├── Home.tsx        # Pantalla inicial con auth
│   ├── CreateGame.tsx  # Crear nueva partida
│   ├── JoinGame.tsx    # Unirse con código
│   ├── Lobby.tsx       # Sala de espera pre-juego
│   ├── Round.tsx       # Ronda del juego (loop principal)
│   ├── Results.tsx     # Resultados por ronda
│   └── End.tsx         # Podio final / Game Over
├── lib/                # Lógica de negocio
│   ├── firebase.ts     # Config y exports de Firebase
│   ├── gameLogic.ts    # Funciones de lógica del juego
│   └── openaiJudges.ts # (Opcional) Integración con IA
├── hooks/              # Custom hooks
│   ├── useGame.ts      # ⭐ MÁS IMPORTANTE - Sincronización en tiempo real
│   └── useAuth.ts      # Manejo de autenticación
├── types/              # Tipos TypeScript
│   └── game.ts         # Interfaces de Game, Player, Round, etc.
└── data/               # Datos estáticos del juego
    ├── scenarios.ts    # Escenarios/preguntas
    ├── judges.ts       # (Si aplica) Jueces/evaluadores
    └── variables.ts    # (Si aplica) Datos de dominio

functions/              # (Opcional) Cloud Functions
└── src/
    └── index.ts        # Cloud Functions para backend
```

### 2. Flujo de Navegación y Autenticación (PATRÓN OBLIGATORIO)

**TODOS los juegos siguen este flujo:**

```
Home (Pantalla inicial)
  │
  ├─── PROFESOR: Login Google ──→ CreateGame ──→ Lobby (espera alumnos)
  │                                    │              │
  │                                Genera código    Comparte código
  │                                 (ej: "A3F8K2")      │
  │                                                      ↓
  └─── ESTUDIANTES: Login Anónimo ──→ Ingresa nombre ──→ JoinGame (código) ──→ Lobby
                                                                                  │
                                                                                  ↓
                                              Round 1 ──→ [Pantalla Dramática] ──→ Results 1
                                                  ↓                                    ↓
                                              Round 2 ──→ [Pantalla Dramática] ──→ Results 2
                                                  ↓                                    ↓
                                               ...                                    ...
                                                  ↓                                    ↓
                                              Round N ──→ [Pantalla Dramática] ──→ Results N
                                                                                       ↓
                                                                              End (Podio Olímpico)
                                                                                       ↓
                                                                               Restart/Exit
Estados del juego:
- 'waiting'   → Lobby (esperando jugadores, profesor no ha iniciado)
- 'playing'   → Round (ronda activa, estudiantes responden)
- 'results'   → Results (mostrando leaderboard de la ronda)
- 'completed' → End (juego terminado, podio final)
```

#### A) Autenticación de Profesor (Google OAuth)

```typescript
// src/pages/CreateGame.tsx
import { loginWithGoogle } from '../lib/firebase';
import { generateGameCode } from '../lib/gameLogic';

const handleCreateGame = async () => {
  // 1. Login con Google (SOLO para profesores)
  const user = await loginWithGoogle();

  // 2. Generar código único de 6 caracteres
  const gameCode = generateGameCode(); // ej: "A3F8K2"

  // 3. Crear juego en Firestore
  await setDoc(doc(db, 'games', gameCode), {
    code: gameCode,
    hostId: user.uid,                    // UID del profesor
    state: 'waiting',
    createdAt: new Date(),
    currentRound: 0,
    totalRounds: 8,                       // Ajustar según juego
    players: {
      [user.uid]: {
        uid: user.uid,
        name: user.displayName || 'Profesor',
        photoURL: user.photoURL,
        isAdmin: true,                    // SOLO el profesor es admin
        isActive: true,
        totalScore: 0,
        joinedAt: new Date()
      }
    },
    rounds: {}
  });

  // 4. Guardar en localStorage
  localStorage.setItem('gameCode', gameCode);
  localStorage.setItem('playerId', user.uid);
  localStorage.setItem('isAdmin', 'true');

  // 5. Navegar a Lobby
  navigate('/lobby');
};
```

**Función para generar código:**
```typescript
// src/lib/gameLogic.ts
export function generateGameCode(): string {
  // Solo caracteres no ambiguos (sin O, 0, I, 1, etc.)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

#### B) Autenticación de Estudiantes (Anónimo + Nombre Manual)

```typescript
// src/pages/JoinGame.tsx
import { loginAnonymously } from '../lib/firebase';

const handleJoinGame = async () => {
  // 1. Login anónimo (Firebase Auth)
  const user = await loginAnonymously();

  // 2. Pedir nombre al estudiante (OBLIGATORIO)
  const playerName = window.prompt('Ingresa tu nombre:');
  if (!playerName?.trim()) {
    alert('Debes ingresar un nombre');
    return;
  }

  // 3. Validar que el código de juego existe
  const gameRef = doc(db, 'games', gameCode);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    alert('Código de juego inválido');
    return;
  }

  // 4. Agregar jugador al juego
  await updateDoc(gameRef, {
    [`players.${user.uid}`]: {
      uid: user.uid,
      name: playerName.trim(),
      isAdmin: false,                     // Estudiantes NO son admin
      isActive: true,
      totalScore: 0,
      joinedAt: new Date()
    }
  });

  // 5. Guardar en localStorage
  localStorage.setItem('gameCode', gameCode);
  localStorage.setItem('playerId', user.uid);
  localStorage.setItem('isAdmin', 'false');

  // 6. Navegar a Lobby
  navigate('/lobby');
};
```

**IMPORTANTE**: Todos en la misma sala (mismo código) compiten entre sí.

### 3. Estructura de Datos en Firestore (CRÍTICA - NO CAMBIAR)
```typescript
// Colección: games
interface Game {
  gameCode: string;           // Código de 6 caracteres (uppercase, sin ambiguos)
  hostId: string;             // UID del creador/admin
  state: 'waiting' | 'playing' | 'results' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  currentRound: number;       // Ronda actual (1-based)
  totalRounds: number;        // Total de rondas del juego

  players: {
    [userId: string]: {
      uid: string;
      name: string;
      photoURL?: string;      // Si usas Google Auth
      isAdmin: boolean;       // true solo para el host
      isActive: boolean;      // false si se desconectó
      joinedAt: Timestamp;
      // Métricas específicas del juego:
      totalScore?: number;    // Puntaje acumulado
      // ... otros campos según juego
    }
  };

  rounds: {
    [roundNumber: string]: {  // "1", "2", etc.
      startTime: Timestamp;
      isActive: boolean;

      // Submissions por jugador
      submissions: {
        [userId: string]: {
          proposal: string;     // Respuesta del jugador
          selectedVariables?: string[];  // Si aplica
          feedback?: any[];     // Feedback de evaluadores
          totalScore?: number;
          weightedScore?: number;
          submittedAt: Timestamp;
        }
      };

      // Resultados calculados (opcional)
      results?: {
        rankings: Array<{
          playerId: string;
          score: number;
          rank: number;
        }>;
      };
    }
  };
}
```

### 4. Patrón de Persistencia Local (localStorage)

**Crítico para mantener sesión:**
```typescript
// Al crear/unirse a juego, guardar:
localStorage.setItem('gameCode', gameCode);
localStorage.setItem('playerId', user.uid);
localStorage.setItem('isAdmin', isAdmin.toString());

// Al cargar cualquier página:
const gameCode = localStorage.getItem('gameCode');
const playerId = localStorage.getItem('playerId');
const isAdmin = localStorage.getItem('isAdmin') === 'true';

// Al salir del juego:
localStorage.removeItem('gameCode');
localStorage.removeItem('playerId');
localStorage.removeItem('isAdmin');
```

### 5. Setup de React Router (src/App.tsx)

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateGame from './pages/CreateGame';
import JoinGame from './pages/JoinGame';
import Lobby from './pages/Lobby';
import Round from './pages/Round';
import Results from './pages/Results';
import End from './pages/End';

export default function App() {
  return (
    <BrowserRouter basename="/[nombre-juego]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/round/:roundNumber" element={<Round />} />
        <Route path="/results/:roundNumber" element={<Results />} />
        <Route path="/end" element={<End />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

⚠️ **IMPORTANTE**: El `basename` debe coincidir con `base` en `vite.config.ts`

### 6. Hook useGame (Patrón de Sincronización en Tiempo Real)

**El hook MÁS IMPORTANTE del proyecto:**

```typescript
// src/hooks/useGame.ts
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Game } from '../types/game';

export const useGame = (gameCode: string | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!gameCode) {
      setLoading(false);
      return;
    }

    // Suscripción en tiempo real
    const unsubscribe = onSnapshot(
      doc(db, 'games', gameCode),
      (snapshot) => {
        if (snapshot.exists()) {
          setGame({ id: snapshot.id, ...snapshot.data() } as Game);
          setError(null);
        } else {
          setError(new Error('Juego no encontrado'));
          setGame(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error en suscripción:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Cleanup al desmontar
    return () => unsubscribe();
  }, [gameCode]);

  return { game, loading, error };
};
```

**Uso en componentes:**
```typescript
const gameCode = localStorage.getItem('gameCode');
const { game, loading } = useGame(gameCode);

// Automáticamente se actualiza cuando Firestore cambia
useEffect(() => {
  if (game?.state === 'results') {
    navigate('/results');
  }
}, [game?.state]);
```

## 🎨 Componentes UI Reutilizables

### 1. Timer con Pausa (CRÍTICO para contextos educativos)

```typescript
// src/components/Timer.tsx
interface TimerProps {
  endTime: number;           // Timestamp de finalización
  onExpire: () => void;      // Callback cuando expira
  isPaused?: boolean;        // Estado de pausa (control del profesor)
}

export default function Timer({ endTime, onExpire, isPaused }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [pausedTime, setPausedTime] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused) {
      // Guardar tiempo al pausar
      if (pausedTime === null) {
        setPausedTime(timeLeft);
      }
      return;
    }

    // Restaurar tiempo al reanudar
    if (pausedTime !== null) {
      setTimeLeft(pausedTime);
      setPausedTime(null);
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeLeft(remaining);

      if (remaining === 0) {
        onExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire, isPaused, pausedTime]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="dramatic-card px-6 py-3">
      <div className="text-center">
        <p className="text-sm text-gray-400">Tiempo restante</p>
        <p className={`text-3xl font-bold ${timeLeft < 60000 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </p>
        {isPaused && (
          <p className="text-xs text-yellow-400 mt-1">⏸ PAUSADO</p>
        )}
      </div>
    </div>
  );
}
```

**Lección clave**: La funcionalidad de pausa es esencial para profesores que necesitan explicar conceptos durante el juego.

### 2. Efectos de Sonido con Web Audio API

```typescript
// src/lib/audio.ts
export const playCelebrationSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Secuencia ascendente de tonos
  [600, 750, 900].forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    const startTime = audioContext.currentTime + (i * 0.15);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
};

export const playDisappointmentSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Secuencia descendente de tonos graves
  [400, 300, 200].forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sawtooth';

    const startTime = audioContext.currentTime + (i * 0.2);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.4);
  });
};
```

**Uso**: Llamar según puntaje en revelaciones dramáticas.

### 3. Overlay de Resultados Dramático

```typescript
// src/components/JudgeScoreReveal.tsx (ejemplo simplificado)
interface ScoreRevealProps {
  feedbacks: JudgeFeedback[];
  onComplete: () => void;
}

export default function JudgeScoreReveal({ feedbacks, onComplete }: ScoreRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    if (currentIndex < feedbacks.length) {
      // Mostrar juez
      playRevealSound();

      // Después de 300ms, mostrar puntaje
      const scoreTimer = setTimeout(() => {
        setShowScore(true);
        playScoreSound(feedbacks[currentIndex].score);
      }, 300);

      // Después de 2s, siguiente juez
      const nextTimer = setTimeout(() => {
        if (currentIndex < feedbacks.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setShowScore(false);
        } else {
          setTimeout(onComplete, 1000);
        }
      }, 2000);

      return () => {
        clearTimeout(scoreTimer);
        clearTimeout(nextTimer);
      };
    }
  }, [currentIndex, feedbacks, onComplete]);

  // Renderizar con Framer Motion para animaciones dramáticas
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      {/* Contenido animado */}
    </motion.div>
  );
}
```

### 4. Estados de Carga/Error Consistentes

```typescript
// Patrón de loading
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Cargando partida...</p>
      </div>
    </div>
  );
}

// Patrón de error
if (!game) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
        <p className="text-gray-400 mb-6">No se pudo cargar la partida.</p>
        <button onClick={() => navigate('/')} className="primary-button">
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
```

### 5. Clases CSS Reutilizables (Tailwind)

Agregar a `src/index.css`:

```css
/* Tarjeta dramática con backdrop blur */
.dramatic-card {
  @apply bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-2xl;
}

/* Botón principal con gradiente */
.primary-button {
  @apply bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50;
}

/* Campo de input estilizado */
.input-field {
  @apply bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50;
}

/* Texto con gradiente */
.gradient-text {
  @apply bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent;
}

/* Barra de progreso animada */
.progress-bar {
  @apply h-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full transition-all duration-500;
}
```

### 6. Templates de Páginas Críticas (OBLIGATORIAS)

#### A) Results.tsx - Leaderboard por Ronda

**OBLIGATORIO**: Mostrar tabla de posiciones al final de cada ronda.

```typescript
// src/pages/Results.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Results() {
  const { roundNumber } = useParams();
  const navigate = useNavigate();
  const gameCode = localStorage.getItem('gameCode');
  const playerId = localStorage.getItem('playerId');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const { game } = useGame(gameCode);

  const currentRound = parseInt(roundNumber || '1');

  // Sincronizar navegación
  useEffect(() => {
    if (game?.state === 'playing') {
      navigate(`/round/${game.currentRound}`);
    }
    if (game?.state === 'completed') {
      navigate('/end');
    }
  }, [game?.state, game?.currentRound, navigate]);

  if (!game) return <div>Cargando...</div>;

  const round = game.rounds[currentRound];
  const players = Object.values(game.players).filter(p => p.isActive);

  // Calcular rankings
  const rankings = players
    .map(p => ({
      ...p,
      roundScore: round.submissions[p.uid]?.totalScore || 0
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  // Avanzar a siguiente ronda (solo admin)
  const handleNextRound = async () => {
    if (currentRound < game.totalRounds) {
      await updateDoc(doc(db, 'games', gameCode), {
        currentRound: currentRound + 1,
        state: 'playing'
      });
    } else {
      await updateDoc(doc(db, 'games', gameCode), {
        state: 'completed'
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8 gradient-text">
        📊 Resultados - Ronda {currentRound}
      </h1>

      {/* LEADERBOARD */}
      <div className="max-w-4xl mx-auto dramatic-card p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Clasificación</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/30">
              <th className="text-left py-3 text-gray-400">Pos</th>
              <th className="text-left py-3 text-gray-400">Jugador</th>
              <th className="text-right py-3 text-gray-400">Esta Ronda</th>
              <th className="text-right py-3 text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((player, index) => (
              <tr
                key={player.uid}
                className={`border-b border-slate-700 ${
                  player.uid === playerId ? 'bg-purple-500/20' : ''
                }`}
              >
                <td className="py-3">
                  <span className="font-bold text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                  </span>
                </td>
                <td className="py-3 font-semibold">{player.name}</td>
                <td className="py-3 text-right text-cyan-400 font-bold">
                  +{player.roundScore.toFixed(1)}
                </td>
                <td className="py-3 text-right font-bold text-2xl">
                  {player.totalScore.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón siguiente (solo admin) */}
      {isAdmin && (
        <div className="text-center mt-8">
          <button onClick={handleNextRound} className="primary-button">
            {currentRound < game.totalRounds ? '▶️ Siguiente Ronda' : '🏆 Ver Podio Final'}
          </button>
        </div>
      )}

      {/* Mensaje para estudiantes */}
      {!isAdmin && (
        <p className="text-center text-gray-400 mt-8">
          Esperando al profesor...
        </p>
      )}
    </div>
  );
}
```

#### B) End.tsx - Podio Olímpico Final

**OBLIGATORIO**: Podio estilo Juegos Olímpicos + ranking completo.

```typescript
// src/pages/End.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';

export default function End() {
  const navigate = useNavigate();
  const gameCode = localStorage.getItem('gameCode');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const { game } = useGame(gameCode);

  if (!game) return <div>Cargando...</div>;

  const players = Object.values(game.players).filter(p => p.isActive);
  const rankings = players.sort((a, b) => b.totalScore - a.totalScore);

  const [gold, silver, bronze] = rankings;

  const handleNewGame = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-8">
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-4xl font-bold text-center mb-12 gradient-text"
      >
        🏆 ¡Juego Terminado! 🏆
      </motion.h1>

      {/* PODIO OLÍMPICO */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-end justify-center gap-4 h-96">
          {/* Plata (2do lugar) */}
          {silver && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl mb-2">🥈</div>
              <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-lg p-6 w-48 h-64 flex flex-col items-center justify-end shadow-2xl">
                <p className="text-white font-bold text-xl mb-2 text-center">{silver.name}</p>
                <p className="text-4xl font-bold text-white">{silver.totalScore.toFixed(1)}</p>
                <p className="text-white/70 text-sm mt-2">2° Lugar</p>
              </div>
            </motion.div>
          )}

          {/* Oro (1er lugar) */}
          {gold && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="text-8xl mb-2"
              >
                🥇
              </motion.div>
              <div className="bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-t-lg p-6 w-56 h-80 flex flex-col items-center justify-end shadow-2xl">
                <p className="text-white font-bold text-2xl mb-2 text-center">{gold.name}</p>
                <p className="text-5xl font-bold text-white">{gold.totalScore.toFixed(1)}</p>
                <p className="text-white/90 text-lg mt-2">🏆 CAMPEÓN 🏆</p>
              </div>
            </motion.div>
          )}

          {/* Bronce (3er lugar) */}
          {bronze && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl mb-2">🥉</div>
              <div className="bg-gradient-to-b from-orange-300 to-orange-600 rounded-t-lg p-6 w-48 h-48 flex flex-col items-center justify-end shadow-2xl">
                <p className="text-white font-bold text-xl mb-2 text-center">{bronze.name}</p>
                <p className="text-4xl font-bold text-white">{bronze.totalScore.toFixed(1)}</p>
                <p className="text-white/70 text-sm mt-2">3° Lugar</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* RANKING COMPLETO DEBAJO */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto dramatic-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">📋 Clasificación Final</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/30">
              <th className="text-left py-2 text-gray-400">Posición</th>
              <th className="text-left py-2 text-gray-400">Jugador</th>
              <th className="text-right py-2 text-gray-400">Puntaje Final</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((player, index) => (
              <tr
                key={player.uid}
                className={`border-b border-slate-700 ${
                  index < 3 ? 'bg-yellow-500/10' : ''
                }`}
              >
                <td className="py-2 font-bold text-xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                </td>
                <td className="py-2">{player.name}</td>
                <td className="py-2 text-right font-bold text-2xl">
                  {player.totalScore.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Botones finales */}
      <div className="flex gap-4 justify-center mt-8">
        <button onClick={() => navigate('/')} className="primary-button">
          🏠 Volver al Inicio
        </button>
        {isAdmin && (
          <button onClick={handleNewGame} className="primary-button">
            🎮 Nuevo Juego
          </button>
        )}
      </div>
    </div>
  );
}
```

**Nota**: JudgeScoreReveal (pantalla dramática con jueces IA) ya está documentado en subsección 3 arriba.

## 🎯 Características Educativas Esenciales

### 1. Controles de Profesor (SIEMPRE incluir)

```typescript
// En Round.tsx - Sección de controles admin
{isAdmin && (
  <div className="dramatic-card p-6 bg-yellow-900/20">
    <h3 className="text-yellow-300 mb-4">👑 Controles de Profesor</h3>

    {/* Pausar/Reanudar Timer */}
    <button onClick={() => setIsPaused(!isPaused)} className="primary-button w-full">
      {isPaused ? <Play /> : <Pause />}
      {isPaused ? 'Reanudar Tiempo' : 'Pausar Tiempo'}
    </button>

    {/* Procesar Ronda Anticipadamente */}
    <button
      onClick={handleProcessRound}
      disabled={submittedCount === 0}
      className="primary-button w-full mt-3"
    >
      <SkipForward />
      {allSubmitted
        ? 'Ir a Resultados (Todos enviaron)'
        : `Ir a Resultados (${submittedCount}/${totalPlayers})`
      }
    </button>

    {/* Terminar Juego Completamente */}
    <button
      onClick={handleForceFinish}
      className="bg-red-600 hover:bg-red-700 w-full mt-3"
    >
      <Trophy />
      Terminar Juego (Podio Final)
    </button>
  </div>
)}
```

**Lecciones clave:**
- Pausa es crítica para explicar conceptos
- Permitir skip cuando todos enviaron optimiza tiempo
- Terminar anticipadamente útil para clases cortas

### 2. Sincronización Automática de Estado

**CRÍTICO**: Usar useEffect para redirigir jugadores cuando cambia el estado:

```typescript
// En Round.tsx
useEffect(() => {
  if (game?.state === 'results') {
    navigate(`/results/${currentRound}`);
  }
}, [game?.state, currentRound, navigate]);

// En Results.tsx
useEffect(() => {
  if (game?.state === 'playing') {
    navigate(`/round/${game.currentRound}`);
  }
  if (game?.state === 'completed') {
    navigate('/end');
  }
}, [game?.state, game?.currentRound, navigate]);

// En Lobby.tsx
useEffect(() => {
  if (game?.state === 'playing') {
    navigate(`/round/${game.currentRound}`);
  }
}, [game?.state, game?.currentRound, navigate]);
```

**Por qué es crítico**: Admin cambia estado → Firestore actualiza → useGame detecta → useEffect redirige → Todos los jugadores se sincronizan automáticamente.

### 3. Sistema de Feedback Educativo

```typescript
// Estructura de feedback personalizado
interface EducationalFeedback {
  positive: string[];    // Mensajes para buenos resultados
  neutral: string[];     // Mensajes para resultados medios
  negative: string[];    // Mensajes para malos resultados
  contextual: string;    // Explicación del concepto
  suggestions?: string[]; // Sugerencias para mejorar
}

// Ejemplo de uso
const getFeedbackMessage = (score: number, context: any): string => {
  if (score >= 8) {
    return selectRandom(feedback.positive);
  } else if (score >= 5) {
    return selectRandom(feedback.neutral);
  } else {
    return selectRandom(feedback.negative);
  }
};
```

### 4. Prevención de Problemas Comunes

**A) Doble Envío (Critical):**
```typescript
const [hasSubmitted, setHasSubmitted] = useState(false);

// Verificar si ya envió al cargar
useEffect(() => {
  if (round?.submissions[playerId]) {
    setHasSubmitted(true);
  }
}, [round, playerId]);

// Deshabilitar botón
<button
  disabled={isSubmitting || hasSubmitted}
  onClick={handleSubmit}
>
  {hasSubmitted ? 'Respuesta enviada ✓' : 'Enviar Respuesta'}
</button>
```

**B) Auto-procesamiento cuando expira tiempo:**
```typescript
const handleTimeExpire = useCallback(async () => {
  if (isAdmin && game && gameCode && !processing) {
    await handleProcessRound();
  }
}, [isAdmin, game, gameCode, processing]);
```

**C) Validar arrays antes de usar:**
```typescript
// ❌ MALO: puede crashear
const scenario = scenarios[currentRound - 1];

// ✅ BUENO: safe access
const scenario = scenarios[currentRound - 1] || scenarios[0];
```

## 📦 GitHub Actions Workflow

Copiar a `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

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

## 🚦 PROTOCOLO DE INICIO PARA CLAUDE CODE

**CUANDO EL USUARIO PIDE UN NUEVO JUEGO, EJECUTAR ESTE PROTOCOLO:**

### Fase 1: Clarificar Requerimientos (5 min)

**Preguntar al usuario:**
1. ¿Cuál es el tema educativo del juego?
2. ¿Cuántos jugadores simultáneos? (multiplayer vs solo)
3. ¿Necesita integración con IA (OpenAI)?
4. ¿Cuántas rondas/niveles aproximadamente?
5. ¿Hay datos reales que debo manejar (como variables CEP)?

### Fase 2: Setup Automático del Proyecto (10-15 min)

**Ejecutar EN ORDEN sin preguntar:**

1. **Crear proyecto Vite + React + TypeScript**
   ```bash
   npm create vite@latest [nombre-juego] -- --template react-ts
   cd [nombre-juego]
   npm install
   ```

2. **Instalar TODAS las dependencias base**
   ```bash
   npm install react-router-dom lucide-react framer-motion firebase
   npm install -D tailwindcss postcss autoprefixer gh-pages
   npx tailwindcss init -p
   ```

3. **Crear estructura de carpetas completa**
   ```bash
   mkdir -p src/{components,pages,lib,hooks,types,data}
   ```

4. **Crear archivos de configuración:**
   - `vite.config.ts` con base path
   - `tailwind.config.js` con animaciones
   - `src/index.css` con clases reutilizables
   - `package.json` con script de deploy
   - `.gitignore` con `.env.local` y `functions/.env`

5. **Crear `src/lib/firebase.ts`** (template completo from Paso 7)

6. **Crear `firestore.rules`** (template completo from Paso 7)

7. **Crear `.env.local`** (template from Paso 7)

8. **Crear `src/App.tsx`** con React Router setup

9. **Crear `src/hooks/useGame.ts`** (template completo from Arquitectura)

10. **Crear tipos base en `src/types/game.ts`**

### Fase 3: Guiar Setup de Firebase (5 min)

**Mostrar al usuario instrucciones claras:**

```
Por favor, sigue estos pasos en Firebase Console:

1. Crear proyecto: https://console.firebase.google.com
   - Nombre: [nombre-juego]

2. Habilitar Authentication:
   - Google + Anonymous

3. Crear Firestore Database:
   - Mode: Production

4. Add Web App:
   - Copy las credenciales a .env.local

5. Ejecutar: firebase deploy --only firestore:rules
```

### Fase 4: Implementar Arquitectura Base (15 min)

**Crear páginas básicas (templates):**
- `src/pages/Home.tsx` - Con auth (Google + Anonymous)
- `src/pages/CreateGame.tsx` - Crear juego con código
- `src/pages/JoinGame.tsx` - Unirse con código
- `src/pages/Lobby.tsx` - Sala de espera
- `src/pages/Round.tsx` - Loop principal del juego
- `src/pages/Results.tsx` - Resultados por ronda
- `src/pages/End.tsx` - Podio final

**Crear componentes reutilizables:**
- `src/components/Timer.tsx` - Con pausa
- Componentes específicos del juego según tema

### Fase 5: Implementar Mecánicas del Juego (VARIABLE)

**Según el tema educativo, implementar:**
- Lógica de gameLogic.ts
- Datos en src/data/
- Interfaces en types/
- Componentes especiales
- (Si aplica) Cloud Functions para IA

### Fase 6: Testing y Deployment (10 min)

1. **Test local**: `npm run dev -- --host`
2. **Crear repo GitHub**
3. **Configurar GitHub Pages**
4. **Agregar GitHub Secrets**
5. **Push y verificar deploy**

### ⏱️ Tiempo Total Estimado

- **Setup (Fases 1-4)**: 30-40 min
- **Mecánicas (Fase 5)**: Variable (2-6 horas según complejidad)
- **Deployment (Fase 6)**: 10-15 min

**Meta**: Tener prototipo jugable en <4 horas desde cero.

---

## 🐛 TROUBLESHOOTING COMÚN

### Error: "Cannot find module 'firebase/app'"

**Causa**: Firebase no instalado o versión incorrecta

**Solución**:
```bash
npm install firebase@^11.0.0
```

### Error: "Vite cache issues" / Cambios no se reflejan

**Causa**: Cache de Vite persistente

**Solución**:
```bash
rm -rf .vite node_modules/.vite dist
npm run dev
```

### Error: "scenarios[X] is undefined"

**Causa**: Desalineación entre `TOTAL_ROUNDS` y cantidad de escenarios

**Solución**:
```typescript
// ❌ MALO
const TOTAL_ROUNDS = 10;
const scenarios = [...] // solo 8 elementos

// ✅ BUENO
const scenarios = [...]
const TOTAL_ROUNDS = scenarios.length;
```

### Error: "Permission denied" en Firestore

**Causa**: Reglas de Firestore muy restrictivas o usuario no autenticado

**Solución**:
1. Verificar que usuario esté autenticado: `console.log(auth.currentUser)`
2. Verificar reglas: `firebase deploy --only firestore:rules`
3. En desarrollo, temporalmente usar reglas permisivas:
   ```javascript
   allow read, write: if request.auth != null;
   ```

### Error: "Cloud Function timeout" o "Cannot determine backend specification"

**Causa**:
- Código muy grande en Cloud Function
- Falta `node-fetch` o tipos

**Solución**:
```bash
cd functions
npm install node-fetch@2
npm install -D @types/node-fetch
npm run build  # Ver errores
```

### Error: "No routes matched location"

**Causa**: Navegación a ruta no definida en App.tsx

**Solución**:
```typescript
// Verificar que todas las rutas existan:
<Route path="/end" element={<End />} />  // ✅
navigate('/end');  // ✅

<Route path="/final" ... />  // ❌ No existe
navigate('/final');  // ❌ Error
```

### Error: "OpenAI API Key not configured"

**Causa**: Variable de entorno no configurada

**Solución**:
- **Local**: Crear `functions/.env` con `OPENAI_API_KEY=sk-proj-...`
- **Producción**: `firebase functions:config:set openai.key="sk-proj-..."`
- **Verificar**: `firebase functions:config:get`

### Error: Jugadores no se sincronizan cuando admin cambia estado

**Causa**: Falta useEffect para detectar cambios de estado

**Solución**: Agregar en cada página:
```typescript
useEffect(() => {
  if (game?.state === 'results') {
    navigate('/results');
  }
}, [game?.state, navigate]);
```

### Error: Build falla en GitHub Actions

**Causa**: Secrets de Firebase no configurados

**Solución**:
1. Ir a Settings → Secrets → Actions
2. Agregar todos los `VITE_FIREBASE_*`
3. **NO** agregar `VITE_OPENAI_KEY` (debe estar solo en Cloud Functions)

---

## 📚 REFERENCIAS RÁPIDAS

- **FIREBASE_SETUP_GUIDE.md**: Configuración detallada Firebase + OpenAI
- **INSTRUCCIONES_DEPLOYMENT.md**: Deployment a GitHub Pages paso a paso
- **Proyecto de referencia**: `game_estrategia_cep/` (Analista en Modo Crisis)

---

**RECORDATORIO FINAL**: Este playbook existe para acelerar desarrollo, no para limitar creatividad. Úsalo como base sólida sobre la cual innovar. ¡Cada juego debe ser único y emocionante mientras mantiene la calidad educativa!