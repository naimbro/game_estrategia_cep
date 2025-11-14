# Firebase Setup Guide
## Guía de Configuración Firebase para Juegos Multiplayer con IA

Esta guía documenta la configuración completa de Firebase para juegos educativos multiplayer que usan OpenAI API. Basada en la implementación de "Analista en Modo Crisis".

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Configuración Inicial de Firebase](#configuración-inicial-de-firebase)
3. [Firebase Authentication](#firebase-authentication)
4. [Firestore Database](#firestore-database)
5. [Cloud Functions (OpenAI Integration)](#cloud-functions-openai-integration)
6. [Variables de Entorno](#variables-de-entorno)
7. [GitHub Actions Deployment](#github-actions-deployment)
8. [Testing Local](#testing-local)
9. [Troubleshooting](#troubleshooting)

---

## Arquitectura General

```
┌─────────────────┐
│  React Frontend │ (Vite + TypeScript)
│  (GitHub Pages) │
└────────┬────────┘
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
┌─────────────────┐                  ┌──────────────────┐
│   Firestore DB  │                  │ Cloud Functions  │
│                 │                  │  (Node.js 20)    │
│ - games         │                  │                  │
│ - players       │                  │  evaluateSubmission()
│ - submissions   │                  │         │
└─────────────────┘                  └─────────┼────────┘
         ▲                                     │
         │                                     ▼
         │                            ┌────────────────┐
         │                            │  OpenAI API    │
         │                            │  (gpt-4o-mini) │
         └────────────────────────────┴────────────────┘
                  Firebase Auth
              (Google + Anonymous)
```

**Principio clave:** La API key de OpenAI **NUNCA** va al frontend. Siempre se llama desde Cloud Functions.

---

## Configuración Inicial de Firebase

### 1. Crear Proyecto en Firebase Console

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init
```

Al ejecutar `firebase init`, selecciona:
- ✅ **Firestore** (base de datos)
- ✅ **Functions** (para OpenAI)
- ✅ **Hosting** (opcional, para Firebase Hosting; nosotros usamos GitHub Pages)

### 2. Configuración del Proyecto

Selecciona opciones:
- **Firestore Rules**: `firestore.rules`
- **Firestore Indexes**: `firestore.indexes.json`
- **Functions language**: TypeScript
- **Functions source directory**: `functions`
- **Use ESLint**: No (opcional)
- **Install dependencies**: Yes

### 3. Estructura de Archivos Generada

```
proyecto/
├── .firebaserc           # Configuración de proyectos
├── firebase.json         # Configuración de servicios
├── firestore.rules       # Reglas de seguridad DB
├── firestore.indexes.json
└── functions/
    ├── src/
    │   └── index.ts      # Cloud Functions
    ├── package.json
    └── tsconfig.json
```

---

## Firebase Authentication

### 1. Habilitar Métodos de Autenticación

En Firebase Console → Authentication → Sign-in method:

1. **Google OAuth**
   - Click en "Google"
   - Habilitar
   - Configurar nombre público del proyecto
   - Guardar

2. **Anonymous Authentication**
   - Click en "Anonymous"
   - Habilitar
   - Guardar

### 2. Configurar Dominios Autorizados

En Authentication → Settings → Authorized domains:
- Agregar: `tu-usuario.github.io` (para GitHub Pages)
- Agregar: `localhost` (para desarrollo)

### 3. Código Frontend (React)

**`src/lib/firebase.ts`**

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

// Login anónimo
export const loginAnonymously = async () => {
  const result = await signInAnonymously(auth);
  return result.user;
};

// Login con Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};
```

**`.env.local`** (desarrollo)

```bash
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

> ⚠️ **Importante**: Agregar `.env.local` a `.gitignore`

---

## Firestore Database

### 1. Estructura de Datos Recomendada

```
games/{gameCode}
  - code: string
  - hostId: string
  - state: "lobby" | "playing" | "results" | "completed"
  - currentRound: number
  - totalRounds: number
  - createdAt: timestamp
  - players: {
      [playerId]: {
        name: string
        isActive: boolean
        totalScore: number
      }
    }
  - rounds: {
      [roundNumber]: {
        isActive: boolean
        startTime: timestamp
        submissions: {
          [playerId]: {
            proposal: string
            selectedVariables: string[]
            feedback: JudgeFeedback[]
            totalScore: number
            weightedScore: number
          }
        }
      }
    }
```

### 2. Reglas de Seguridad

**`firestore.rules`**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Games collection
    match /games/{gameCode} {
      // Permitir lectura a todos los autenticados
      allow read: if request.auth != null;

      // Permitir crear juego a usuarios autenticados
      allow create: if request.auth != null
                    && request.resource.data.hostId == request.auth.uid;

      // Permitir actualizar solo al host o a jugadores activos
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

### 3. Ejemplo de Escritura/Lectura

```typescript
import { doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Crear juego
async function createGame(gameCode: string, hostId: string) {
  await setDoc(doc(db, 'games', gameCode), {
    code: gameCode,
    hostId,
    state: 'lobby',
    currentRound: 0,
    totalRounds: 3,
    createdAt: new Date(),
    players: {},
    rounds: {}
  });
}

// Escuchar cambios en tiempo real
function subscribeToGame(gameCode: string, callback: (game: Game) => void) {
  return onSnapshot(doc(db, 'games', gameCode), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as Game);
    }
  });
}

// Actualizar estado
async function updateGameState(gameCode: string, newState: string) {
  await updateDoc(doc(db, 'games', gameCode), {
    state: newState,
    updatedAt: new Date()
  });
}
```

---

## Cloud Functions (OpenAI Integration)

### 1. Instalación de Dependencias

**`functions/package.json`**

```json
{
  "name": "functions",
  "engines": {
    "node": "20"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.5.0",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/node-fetch": "^2.6.13",
    "typescript": "^5.3.0"
  }
}
```

```bash
cd functions
npm install
```

### 2. Implementación de Cloud Function

**`functions/src/index.ts`**

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();

interface JudgeFeedback {
  judge: string;
  emoji: string;
  score: number;
  feedback: string;
  suggestedVariables?: string[];
}

// Cloud Function que llama a OpenAI
export const evaluateSubmission = functions
  .https.onCall(async (data, context) => {
    // 1. Verificar autenticación
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Debes estar autenticado'
      );
    }

    // 2. Validar datos
    const { scenario, proposal, selectedVariables } = data;
    if (!scenario || !proposal) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Faltan datos requeridos'
      );
    }

    // 3. Verificar que usuario está en juego activo
    const db = admin.firestore();
    const gamesSnapshot = await db.collection('games')
      .where(`players.${context.auth.uid}.isActive`, '==', true)
      .limit(1)
      .get();

    if (gamesSnapshot.empty) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'No estás en un juego activo'
      );
    }

    try {
      // 4. Obtener API key de forma segura
      const apiKey = process.env.FUNCTIONS_EMULATOR === 'true'
        ? process.env.OPENAI_API_KEY  // Desarrollo local (.env)
        : functions.config().openai.key;  // Producción

      if (!apiKey) {
        throw new Error('API Key no configurada');
      }

      // 5. Llamar a OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Eres un juez que evalúa propuestas...'
            },
            {
              role: 'user',
              content: `Evalúa esta propuesta: ${proposal}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const evaluation = JSON.parse(result.choices[0].message.content);

      // 6. Retornar resultado
      return {
        feedback: [{
          judge: 'Juez 1',
          emoji: '🎓',
          score: evaluation.score,
          feedback: evaluation.feedback,
          suggestedVariables: evaluation.suggestedVariables || []
        }],
        totalScore: evaluation.score,
        weightedScore: evaluation.score
      };

    } catch (error) {
      console.error('Error en evaluación:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Error al procesar la evaluación'
      );
    }
  });
```

### 3. Llamar Cloud Function desde Frontend

```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

async function evaluateProposal(scenario: any, proposal: string) {
  const evaluateFunc = httpsCallable(functions, 'evaluateSubmission');

  const result = await evaluateFunc({
    scenario,
    proposal,
    selectedVariables: []
  });

  return result.data;
}
```

### 4. Compilar y Desplegar

```bash
# Compilar TypeScript
cd functions
npm run build

# Desplegar a Firebase
cd ..
firebase deploy --only functions
```

---

## Variables de Entorno

### 1. Desarrollo Local

**Frontend: `.env.local`**
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

**Functions: `functions/.env`**
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 2. Producción (Firebase)

Configurar OpenAI API key en Firebase:

```bash
firebase functions:config:set openai.key="sk-proj-xxxxxxxxxxxxx"
```

Ver configuración actual:
```bash
firebase functions:config:get
```

### 3. GitHub Secrets (para GitHub Pages)

En tu repositorio: Settings → Secrets and variables → Actions → New repository secret

Agregar los siguientes secretos:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

> ⚠️ **NO agregar** `VITE_OPENAI_API_KEY` (debe estar solo en Cloud Functions)

---

## GitHub Actions Deployment

**`.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

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

---

## Testing Local

### 1. Modo Desarrollo (Frontend + Emuladores)

**Terminal 1: Frontend**
```bash
npm run dev -- --host
```

**Terminal 2: Firebase Emulators** (opcional)
```bash
firebase emulators:start
```

> ⚠️ **Problema conocido**: El emulador de Functions puede tener problemas con `node-fetch`. Si falla, usa producción directamente.

### 2. Testing con Producción

Para desarrollo rápido, puedes apuntar el frontend local a Cloud Functions en producción:

```typescript
// src/lib/firebase.ts
export const functions = getFunctions(app, 'us-central1');
// NO usar connectFunctionsEmulator en desarrollo si hay problemas
```

Desplegar Functions:
```bash
firebase deploy --only functions
```

### 3. Verificar que Todo Funciona

1. ✅ Login anónimo funciona
2. ✅ Crear juego guarda en Firestore
3. ✅ Llamar Cloud Function retorna evaluación de OpenAI
4. ✅ Cambios en Firestore se reflejan en tiempo real

---

## Troubleshooting

### Error: "User code failed to load"

**Problema**: Cloud Function no compila o tiene timeout

**Solución**:
```bash
cd functions
npm run build  # Ver errores de TypeScript
```

Si usa `fetch()`, importar `node-fetch`:
```typescript
import fetch from 'node-fetch';
```

### Error: "Cannot determine backend specification"

**Problema**: Falta instalar `node-fetch` o sus tipos

**Solución**:
```bash
cd functions
npm install node-fetch
npm install --save-dev @types/node-fetch
```

### Error: "API Key de OpenAI no configurada"

**Problema**: Variable de entorno no está configurada

**Solución**:

- **Local**: Crear `functions/.env` con `OPENAI_API_KEY=sk-proj-...`
- **Producción**: `firebase functions:config:set openai.key="sk-proj-..."`

### Error: CORS en Emulador

**Problema**: Emulador bloquea requests

**Solución**: Usar producción para development:
```bash
firebase deploy --only functions
```

### Error: "No routes matched location /final"

**Problema**: Ruta incorrecta en navegación

**Solución**: Verificar rutas en `App.tsx` y navegaciones:
```typescript
navigate('/end');  // Correcto
navigate('/final'); // ❌ No existe
```

---

## Checklist de Deployment

Antes de lanzar a producción:

- [ ] Firebase project creado
- [ ] Authentication habilitado (Google + Anonymous)
- [ ] Firestore rules configuradas
- [ ] Cloud Functions desplegadas (`firebase deploy --only functions`)
- [ ] OpenAI API key configurada en Firebase (`functions:config:set`)
- [ ] GitHub Secrets agregados (todos los `VITE_FIREBASE_*`)
- [ ] Dominio agregado a "Authorized domains" en Firebase Auth
- [ ] GitHub Actions corriendo sin errores
- [ ] Testing en producción completado

---

## Recursos Útiles

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Best Practices](https://firebase.google.com/docs/functions/tips)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

## Notas Finales

### Costos Aproximados

- **Firestore**: Gratis hasta 1GB almacenamiento, 50k lecturas/día
- **Cloud Functions**: Gratis hasta 2M invocaciones/mes
- **Authentication**: Gratis hasta 10k MAU (monthly active users)
- **OpenAI API**: ~$0.15 por 1M tokens (gpt-4o-mini)

### Recomendaciones

1. **Siempre** mantén la API key de OpenAI en el backend (Cloud Functions)
2. **Nunca** commitees `.env` o `.env.local` al repositorio
3. Usa Firestore security rules restrictivas
4. Monitorea costos en Firebase Console y OpenAI Platform
5. Para juegos con muchos usuarios, considera batch processing en Cloud Functions

---

**Última actualización**: 2025-01-09

Basado en la implementación de "Analista en Modo Crisis" - [github.com/naimbro/game_estrategia_cep](https://github.com/naimbro/game_estrategia_cep)
