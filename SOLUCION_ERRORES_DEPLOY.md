# 🔧 Solución de Errores - Deploy y Autenticación

## ❌ Problemas Identificados

### 1. **Cloud Function no responde**
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
us-central1-analista-en-modo-crisis.cloudfunctions.net/evaluateSubmission
```

**Causa:** Las Cloud Functions están deployed pero con **versión anterior** (sin metadata de variables).

### 2. **Popup de autenticación no carga**
```
https://analista-en-modo-crisis.firebaseapp.com/__/auth/handler?state=...
```

**Causa:** Configuración de dominios autorizados o Google Auth.

---

## ✅ Soluciones

### **PASO 1: Re-deploy de Cloud Functions**

Las funciones necesitan ser re-deployed con los cambios nuevos (metadata de variables).

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd /mnt/c/Users/naim.bro.k/claude_projects/games/game_estrategia_cep

# 2. Verifica que las funciones estén compiladas
cd functions
npm run build

# 3. Vuelve al root
cd ..

# 4. Deploy de funciones
firebase deploy --only functions
```

**Tiempo estimado:** 2-3 minutos

**Qué va a pasar:**
- Se subirá la nueva versión de `evaluateSubmission` con metadata de variables
- Los jueces IA ahora recibirán pregunta completa, tipo y opciones de cada variable
- Se reiniciará la función en Firebase

---

### **PASO 2: Configurar Google Auth (si persiste el popup)**

Si el popup sigue dando problemas:

#### **Opción A: Deshabilitar Google Auth temporalmente**

Edita `src/pages/Home.tsx` y comenta el botón de Google:

```typescript
// Comentar esto temporalmente:
// <button onClick={handleGoogleLogin} ...>
//   Continuar con Google
// </button>
```

#### **Opción B: Configurar correctamente en Firebase Console**

1. Ve a **Firebase Console** → https://console.firebase.google.com/
2. Selecciona proyecto: `analista-en-modo-crisis`
3. **Authentication** → **Sign-in method**
4. Verifica que **Google** esté habilitado
5. En **Authorized domains**, agrega si no están:
   - `localhost`
   - `analista-en-modo-crisis.web.app`
   - `analista-en-modo-crisis.firebaseapp.com`

---

### **PASO 3: Verificar que todo funcione**

Después del deploy:

1. **Limpia caché del navegador** (Ctrl + Shift + R)
2. Recarga la aplicación
3. Intenta enviar una propuesta
4. Deberías ver en la consola:
   ```
   ✅ Evaluando con Leopoldo Cerros...
   ✅ Evaluando con Carolina Tohó...
   ✅ Evaluando con Daniel Matabuena...
   ✅ Evaluando con Profe Naim...
   ```

---

## 📊 Estado Actual

### ✅ Configuración correcta:
- `.env.local` tiene todas las variables de Firebase
- Proyecto configurado: `analista-en-modo-crisis`
- Región de funciones: `us-central1`
- Funciones compiladas con metadata

### ⚠️ Pendiente:
- [ ] Deploy de funciones con nuevos cambios
- [ ] Verificar Google Auth en Firebase Console
- [ ] Probar envío de propuesta

---

## 🔍 Verificación Rápida

Para verificar que las funciones están deployed:

```bash
firebase functions:list
```

Deberías ver:
```
┌────────────────────┬─────────┬──────────┬─────────────┬────────┬──────────┐
│ Function           │ Version │ Trigger  │ Location    │ Memory │ Runtime  │
├────────────────────┼─────────┼──────────┼─────────────┼────────┼──────────┤
│ evaluateSubmission │ v1      │ callable │ us-central1 │ 256    │ nodejs20 │
└────────────────────┴─────────┴──────────┴─────────────┴────────┴──────────┘
```

---

## 🚨 Troubleshooting

### Si después del deploy sigue sin funcionar:

1. **Verifica logs de Cloud Functions:**
   ```bash
   firebase functions:log --only evaluateSubmission
   ```

2. **Verifica que la API key de OpenAI sea válida:**
   - Ve a Firebase Console → Functions → evaluateSubmission
   - Verifica variables de entorno
   - La key debe empezar con `sk-...`

3. **Verifica que el usuario esté autenticado:**
   - Las Cloud Functions requieren autenticación
   - Asegúrate de estar logueado (anónimo o Google)

---

## ✅ Checklist de Deploy

- [ ] `npm run build` en `/functions` sin errores
- [ ] `firebase deploy --only functions` exitoso
- [ ] Navegador recargado con caché limpio
- [ ] Usuario autenticado en la app
- [ ] Propuesta enviada correctamente
- [ ] Jueces IA responden con feedback

---

## 🎯 Resultado Esperado

Después de estos pasos, cuando envíes una propuesta deberías ver:

1. ✅ Spinner de "Evaluando propuesta..."
2. ✅ Progreso de cada juez
3. ✅ Feedback detallado de los 4 jueces
4. ✅ Scores individuales y total
5. ✅ Panel de resultados con efectos dramáticos

**Y lo más importante:** Los jueces ahora verán la metadata completa:
```
VARIABLES SELECCIONADAS:

1. p1_satisfaccion_general
   Pregunta: "En general, considerando todos los aspectos de su vida..."
   Tipo: ordinal
   Opciones: Muy insatisfecho | Insatisfecho | Ni bien ni mal | ...
```

---

## 📝 Notas Importantes

1. **API Key de OpenAI:** Está en `.env.local` - asegúrate que no esté en git
2. **Costos:** Cada evaluación usa ~2,000 tokens con gpt-4o-mini (muy barato)
3. **Rate Limits:** OpenAI tiene límites, pero con 4 jueces secuenciales debería estar bien

---

**¿Necesitas ayuda con el deploy?** Puedo guiarte paso a paso.
