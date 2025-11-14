# 📋 Instrucciones de Deployment - Analista en Modo Crisis

## 🔧 Configuración Previa al Deployment

### 1. Configurar Proyecto Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Crear nuevo proyecto: **"analista-en-modo-crisis"**
3. Habilitar servicios:
   - ✅ **Firestore Database**
   - ✅ **Authentication** → Habilitar "Google" y "Inicio anónimo"
   - ✅ **Cloud Functions**

#### Reglas de Firestore

En Firestore → Rules:

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

#### Dominios Autorizados

En Authentication → Settings → Authorized domains:
- Agregar: `tu-usuario.github.io`
- `localhost` ya está por defecto

### 2. Configurar Variables de Entorno Local

**Frontend: `.env.local`**

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=analista-en-modo-crisis.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=analista-en-modo-crisis
VITE_FIREBASE_STORAGE_BUCKET=analista-en-modo-crisis.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

⚠️ Asegúrate de que `.env.local` esté en `.gitignore`

**Cloud Functions: `functions/.env`**

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

⚠️ Asegúrate de que `functions/.env` esté en `.gitignore`

### 3. Desplegar Cloud Functions a Firebase

**IMPORTANTE**: Las Cloud Functions manejan la integración con OpenAI de forma segura. La API key **NUNCA** va al frontend.

```bash
# 1. Configurar API key de OpenAI en Firebase (producción)
firebase functions:config:set openai.key="sk-proj-xxxxxxxxxxxxx"

# 2. Verificar configuración
firebase functions:config:get

# 3. Compilar y desplegar
cd functions
npm run build
cd ..
firebase deploy --only functions
```

Verificar deployment:
- Firebase Console → Functions
- Debe aparecer: `evaluateSubmission` (us-central1)

**Costo estimado OpenAI:**
- ~$0.02 por partida completa (8 escenarios × 4 jueces)
- Monitorear en [OpenAI Platform](https://platform.openai.com/usage)

## 🚀 Deployment a GitHub Pages

### Paso 1: Crear Repositorio GitHub

```bash
# Conectar con repo remoto
git remote add origin https://github.com/tu-usuario/game_estrategia_cep.git

# Push
git push -u origin main
```

### Paso 2: Configurar GitHub Pages

1. Ir a **Settings** del repositorio
2. En el menú lateral: **Pages**
3. En "Build and deployment":
   - Source: **GitHub Actions**

El workflow `.github/workflows/deploy.yml` ya está configurado.

### Paso 3: Agregar GitHub Secrets

En **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agregar los siguientes secrets con las credenciales de tu proyecto Firebase:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

⚠️ **NO agregar** `VITE_OPENAI_KEY` ni `OPENAI_API_KEY` - la API key debe estar solo en Cloud Functions por seguridad.

### Paso 4: Trigger Deploy

El workflow se ejecuta automáticamente en cada push a `main`.

Para forzar un deploy manual:
- Ir a **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### Paso 5: Verificar Deployment

Después de ~2-3 minutos:
- URL: `https://tu-usuario.github.io/game_estrategia_cep/`
- Verificar que cargue correctamente
- Probar crear juego como admin y unirse como jugador

## 🧪 Testing del Flujo Completo

1. ✅ **Home** → Login con Google o anónimo
2. ✅ **Crear juego** → Se genera código de 6 caracteres
3. ✅ **Lobby** → Otros jugadores pueden unirse con el código
4. ✅ **Round 1-8** → Ver escenario, explorar variables CEP, enviar propuesta
5. ✅ **Evaluación IA** → Los 4 jueces evalúan con OpenAI (gpt-4o-mini)
6. ✅ **Feedback** → Ver puntajes con animación y sonidos
7. ✅ **Results** → Ver tabla de posiciones de la ronda
8. ✅ **End** → Podio final con ganador

## 📊 Monitoreo Post-Deployment

### Firebase Console

Monitorear:
- **Firestore** → Database → games: Ver partidas creadas
- **Authentication** → Users: Ver jugadores
- **Functions** → Dashboard: Ver invocaciones y errores
- **Usage**: Verificar no exceder cuota gratuita

### OpenAI Platform

Monitorear en [OpenAI Usage](https://platform.openai.com/usage):
- Tokens usados por día
- Costo acumulado
- Configurar alertas de presupuesto

## 🐛 Troubleshooting

### Error: "Firebase config undefined"
- Verificar que los secrets estén en GitHub Actions
- Verificar nombres exactos (prefijo `VITE_`)
- Revisar logs en Actions

### Error: "Error al evaluar con Cloud Function"
- Verificar que Cloud Functions estén desplegadas
- Verificar API key de OpenAI: `firebase functions:config:get`
- Revisar logs en Firebase Console → Functions → Logs

### Error: "OpenAI rate limit"
- Verificar créditos en OpenAI Platform
- Reducir frecuencia de testing
- La evaluación ya es secuencial (no paralela)

### Error: "Firestore permission denied"
- Verificar reglas de Firestore
- Verificar que Authentication esté habilitado
- Verificar que usuario esté autenticado

### Build error: TypeScript compilation
- Ejecutar `npm run build` localmente
- Revisar errores de tipos
- Verificar todas las dependencias: `npm install`

## ✨ Features Implementadas

- ✅ Sistema multiplayer con códigos de sala
- ✅ 8 escenarios de política pública chilena
- ✅ 4 jueces IA especializados (Leopoldo Cerros, Carolina Tohó, Daniel Matabuena, Profe Naim)
- ✅ 100+ variables del CEP con explorador searchable
- ✅ Evaluación con OpenAI (gpt-4o-mini)
- ✅ Feedback con efectos de sonido y mensajes dramáticos
- ✅ Respuestas ideales por escenario para feedback educativo
- ✅ Timer con pausa (control del profesor)
- ✅ Podio final con ganador
- ✅ Responsive design (mobile-first)
- ✅ Animaciones con Framer Motion
- ✅ Sincronización en tiempo real (Firestore)
- ✅ Auth con Google y anónima

## 📈 Costos Estimados

**Firebase (Spark Plan - Gratis):**
- Firestore: 1GB storage, 50k reads/day
- Cloud Functions: 2M invocaciones/mes
- Authentication: 10k MAU (monthly active users)

**OpenAI:**
- gpt-4o-mini: ~$0.15 por 1M tokens
- Costo por partida completa: ~$0.02
- 100 partidas/mes: ~$2.00

## 📚 Documentación Adicional

Para configuración detallada de Firebase en futuros proyectos, consultar:
- `FIREBASE_SETUP_GUIDE.md` - Guía completa de integración Firebase + OpenAI

---

**¡El proyecto está listo para producción! 🚀**

Última actualización: 2025-01-09
