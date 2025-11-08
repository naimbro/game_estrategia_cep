# 📋 Instrucciones de Deployment - Analista en Modo Crisis

## ✅ Estado del Proyecto

El proyecto está **100% implementado y listo para deployment**. El build se completó exitosamente sin errores.

## 🔧 Pasos Previos al Deployment

### 1. Configurar Firebase

**IMPORTANTE**: Las credenciales actuales en `.env.local` son del proyecto `mgt300-risk-game`. Debes crear un nuevo proyecto Firebase específico para este juego.

#### Pasos:

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Crear nuevo proyecto llamado: **"analista-en-modo-crisis"**
3. Habilitar servicios:
   - ✅ **Firestore Database** (modo test para empezar)
   - ✅ **Authentication** → Habilitar "Inicio anónimo"
4. Obtener credenciales:
   - Click en el ícono de configuración (⚙️) → Configuración del proyecto
   - En "Tus apps" → Seleccionar plataforma Web (<//>)
   - Copiar las credenciales de Firebase Config

#### Reglas de Firestore recomendadas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      // Permitir lectura a usuarios autenticados
      allow read: if request.auth != null;

      // Permitir creación a usuarios autenticados
      allow create: if request.auth != null;

      // Permitir actualización solo al dueño del juego
      allow update: if request.auth != null &&
                       request.auth.uid == resource.data.playerId;
    }
  }
}
```

### 2. Actualizar `.env.local`

Reemplazar las credenciales actuales con las del nuevo proyecto:

```env
VITE_FIREBASE_API_KEY=TU_API_KEY_NUEVA
VITE_FIREBASE_AUTH_DOMAIN=analista-en-modo-crisis.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=analista-en-modo-crisis
VITE_FIREBASE_STORAGE_BUCKET=analista-en-modo-crisis.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=TU_SENDER_ID
VITE_FIREBASE_APP_ID=TU_APP_ID
VITE_OPENAI_KEY=sk-... (tu clave actual está OK, pero verifica que esté activa)
```

### 3. Verificar Clave OpenAI

**Verificar tu clave de OpenAI en `.env.local`:**
1. Que esté activa en [OpenAI Platform](https://platform.openai.com/api-keys)
2. Que tenga créditos disponibles
3. Que tenga permisos para GPT-4o-mini

**Costo estimado:**
- ~$0.02 por partida completa (10 rondas × 4 jueces)
- Usar para testing: limitar a 2-3 partidas primero

## 🚀 Deployment a GitHub Pages

### Paso 1: Crear Repositorio GitHub

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "feat: implementación completa de Analista en Modo Crisis

- 10 escenarios narrativos de política pública
- 4 jueces IA con GPT-4o-mini
- 100+ variables del CEP
- Sistema de evaluación y feedback
- Leaderboard global
- UI con Tailwind y Framer Motion"

# Conectar con repo remoto
git remote add origin https://github.com/naimbro/game_estrategia_cep.git

# Push
git push -u origin main
```

### Paso 2: Configurar GitHub Pages

1. Ir a **Settings** del repositorio
2. En el menú lateral: **Pages**
3. En "Build and deployment":
   - Source: **GitHub Actions**
4. El workflow `.github/workflows/deploy.yml` ya está configurado

### Paso 3: Agregar Secrets

En **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agregar los siguientes secrets (USAR LAS CREDENCIALES DEL NUEVO PROYECTO FIREBASE):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_OPENAI_KEY=...
```

### Paso 4: Trigger Deploy

El workflow se ejecutará automáticamente en cada push a `main`.

Para forzar un deploy manual:
- Ir a **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### Paso 5: Verificar Deployment

Después de ~2-3 minutos:
- URL: `https://naimbro.github.io/game_estrategia_cep/`
- Verificar que cargue correctamente
- Probar flow completo: Home → Login → Round 1 → Submit → Ver feedback

## 🧪 Testing Local

Antes de deployment, probar localmente:

```bash
# Ejecutar en modo desarrollo
npm run dev

# Abrir en navegador: http://localhost:5173
```

**Flow de testing:**
1. ✅ Home carga correctamente
2. ✅ Login → ingresar nombre → crea partida en Firestore
3. ✅ Round 1 → ver escenario y explorador de variables
4. ✅ Escribir pregunta y estrategia
5. ✅ Enviar → ver evaluación de jueces IA (esto usa OpenAI)
6. ✅ Ver feedback overlay con puntajes
7. ✅ Continuar a Round 2
8. ✅ Al completar 10 rondas → ver página End
9. ✅ Ver Leaderboard

## 📊 Monitoreo Post-Deployment

### Firebase Console

Monitorear:
- **Firestore**: Ver games creados
- **Authentication**: Ver usuarios anónimos
- **Usage**: Verificar reads/writes

### Costos OpenAI

Monitorear en [OpenAI Usage](https://platform.openai.com/usage):
- Tokens usados por día
- Costo acumulado
- Alertas si excede presupuesto

## 🐛 Troubleshooting

### Error: "Firebase config undefined"
- Verificar que los secrets estén configurados en GitHub
- Verificar nombres exactos de variables (VITE_ prefix)

### Error: "OpenAI rate limit"
- Reducir concurrencia (evaluación secuencial ya implementada)
- Verificar créditos disponibles
- Agregar retry logic si es necesario

### Error: "Firestore permission denied"
- Verificar reglas de Firestore
- Verificar que Authentication esté habilitado

### Build warning: "Chunks larger than 500kB"
- Es normal para esta app (React + Firebase + Framer Motion)
- Opcional: implementar code splitting en futuras versiones

## ✨ Features Implementadas

- ✅ Sistema completo de 10 rondas
- ✅ 4 jueces IA con prompts especializados
- ✅ 100+ variables CEP con explorador searchable
- ✅ Timer con auto-submit
- ✅ Feedback overlay animado
- ✅ Leaderboard global
- ✅ Página de resultados final
- ✅ Responsive design (mobile-first)
- ✅ Animaciones con Framer Motion
- ✅ Persistencia en Firestore
- ✅ Auth anónima de Firebase

## 📈 Próximas Mejoras (Opcionales)

1. **Code splitting** para reducir bundle size
2. **Caché de variables** para mejorar performance
3. **Modo offline** con service workers
4. **Análisis de respuestas** con visualizaciones
5. **Comparación con otros jugadores**
6. **Sistema de logros y badges**
7. **Exportar resultados a PDF**

## 📞 Soporte

Para issues o preguntas:
- GitHub Issues: `https://github.com/naimbro/game_estrategia_cep/issues`
- Email: [tu email]

---

**¡El proyecto está listo para producción! 🚀**

Última actualización: $(date)
