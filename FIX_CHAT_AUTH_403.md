# 🔧 Fix: Error 403 en Chat del Agente de IA

## 📋 Problema Identificado

**Error:** `Error del servidor: 403` al intentar usar el chat del agente de IA.

**Causa Raíz:** Los endpoints del backend ahora requieren autenticación JWT (implementación multiusuario), pero el frontend no estaba enviando el token en las peticiones al chat.

---

## 🔍 Diagnóstico

### Logs del Error
```
horizon-backend-316b23e32b8b.herokuapp.com/api/ai/chat:1 
  Failed to load resource: the server responded with a status of 403 (Forbidden)

Error enviando mensaje: Error: Error del servidor: 403
```

### Análisis
1. ✅ Backend funcionando correctamente (otros componentes cargan bien)
2. ✅ Endpoint `/api/ai/chat` accesible
3. ❌ **Frontend NO enviaba token JWT en header `Authorization`**
4. ✅ Backend rechaza peticiones sin autenticación (403 Forbidden)

---

## ✅ Solución Implementada

### Archivo Modificado: `src/pages/AIAgentPage.tsx`

#### 1. Importar `getAuthHeaders`
```typescript
// ANTES
import { API_CONFIG, getApiUrl } from '../config/api';

// DESPUÉS
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';
```

#### 2. Actualizar función `sendMessage` - Petición sin archivo
```typescript
// ANTES
response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message })
});

// DESPUÉS
response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
    method: 'POST',
    headers: getAuthHeaders(),  // ✅ Incluye Authorization: Bearer {token}
    body: JSON.stringify({ message })
});
```

#### 3. Actualizar función `sendMessage` - Petición con archivo
```typescript
// ANTES
response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT_UPLOAD), {
    method: 'POST',
    body: formData
});

// DESPUÉS
// ✅ Obtener token para autenticación
const token = localStorage.getItem('token');
const headers: HeadersInit = {};
if (token) {
    headers['Authorization'] = `Bearer ${token}`;
}

response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT_UPLOAD), {
    method: 'POST',
    headers,  // ✅ Incluir headers con Authorization
    body: formData
});
```

**Nota:** En el caso de FormData, no se puede usar `getAuthHeaders()` directamente porque no debe incluir `Content-Type` (el browser lo establece automáticamente con el boundary correcto).

#### 4. Mejorar manejo de errores de autenticación
```typescript
// ANTES
if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}`);
}

// DESPUÉS
if (!response.ok) {
    // ✅ Manejar errores de autenticación
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('authError', { 
            detail: { 
                status: response.status,
                message: 'Sesión expirada. Por favor inicia sesión nuevamente.'
            } 
        }));
    }
    throw new Error(`Error del servidor: ${response.status}`);
}
```

---

## 🔐 Funcionamiento del Sistema de Autenticación

### Flujo Completo

```
1. Usuario inicia sesión
   └─> Login.tsx guarda token en localStorage

2. Usuario abre el chat
   └─> AIAgentPage.tsx

3. Usuario envía mensaje
   ├─> getAuthHeaders() lee token de localStorage
   ├─> Construye header: Authorization: Bearer {token}
   └─> Envía petición a /api/ai/chat

4. Backend recibe petición
   ├─> Extrae token del header Authorization
   ├─> Valida token JWT (auth/dependencies.py)
   ├─> Extrae user_id del token
   └─> Procesa mensaje y responde

5. Si token inválido/expirado
   ├─> Backend responde 401/403
   ├─> Frontend elimina token corrupto
   ├─> Emite evento authError
   └─> App.tsx redirige a login
```

### Función `getAuthHeaders()` (ya existente en `api.ts`)

```typescript
export const getAuthHeaders = (): HeadersInit => {
    const rawToken = localStorage.getItem('token');
    const token = rawToken ? rawToken.trim() : '';
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token && token.toLowerCase() !== 'undefined' && token.toLowerCase() !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
    } else if (rawToken) {
        // Valor corrupto, limpiar para forzar nuevo login
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('authError', { detail: { status: 401 } }));
    }
    
    return headers;
};
```

---

## 🧪 Testing y Validación

### Tests Requeridos

1. **Test de autenticación exitosa:**
   ```
   1. Login con credenciales válidas
   2. Abrir página del chat
   3. Enviar mensaje
   4. Verificar: respuesta exitosa del agente
   ```

2. **Test de token expirado:**
   ```
   1. Login con credenciales válidas
   2. Esperar expiración del token (o invalidar manualmente)
   3. Intentar enviar mensaje
   4. Verificar: redirección a login con mensaje apropiado
   ```

3. **Test de sin token:**
   ```
   1. Limpiar localStorage (sin login)
   2. Intentar acceder al chat
   3. Verificar: redirección a login
   ```

4. **Test de upload con archivo:**
   ```
   1. Login con credenciales válidas
   2. Adjuntar archivo en el chat
   3. Enviar mensaje con archivo
   4. Verificar: respuesta exitosa del agente
   ```

### Comandos de Verificación

```bash
# En el navegador (DevTools Console)
# Verificar que existe el token
localStorage.getItem('token')

# Ver headers de la petición (Network tab)
# Debe incluir: Authorization: Bearer eyJ...
```

---

## 📊 Otros Endpoints Afectados

Los siguientes endpoints también requieren autenticación (ya implementados en sus servicios):

### ✅ Ya funcionando con autenticación:
- `/api/portfolio-manager/*` - ✅ Usa `getAuthHeaders()`
- `/api/home/dashboard` - ✅ Usa `getAuthHeaders()`
- `/api/portfolio/*` - ✅ Usa `getAuthHeaders()`

### ✅ Recién corregidos:
- `/api/ai/chat` - ✅ Ahora usa `getAuthHeaders()`
- `/api/ai/chat/upload` - ✅ Ahora incluye token en headers

### ⚠️ Pendientes de revisar (si se usan):
- `/api/ai/search-news`
- `/api/ai/analyze-url`
- `/api/ai/predict`
- `/api/ribbon/custom-report`
- `/api/ribbon/custom-report/start`

**Nota:** Estos endpoints probablemente no se usan directamente desde el frontend actual, pero si se implementan en el futuro, deben seguir el mismo patrón.

---

## 🚀 Deployment

### Pasos para Desplegar

1. **Commit y push del fix:**
   ```bash
   cd c:\Users\mikia\mi-proyecto
   git add src/pages/AIAgentPage.tsx
   git commit -m "fix: agregar autenticación JWT al chat del agente (error 403)"
   git push
   ```

2. **Desplegar en Vercel (automático):**
   - Vercel detectará el push automáticamente
   - Construirá y desplegará la nueva versión
   - URL: https://mi-proyecto-topaz-omega.vercel.app

3. **Verificar funcionamiento:**
   ```
   1. Ir a https://mi-proyecto-topaz-omega.vercel.app
   2. Hacer login
   3. Ir a la página del chat
   4. Enviar un mensaje
   5. Verificar: respuesta exitosa del agente
   ```

---

## ✅ Resultado Esperado

### ANTES (Error 403)
```
POST https://horizon-backend-316b23e32b8b.herokuapp.com/api/ai/chat
Status: 403 Forbidden
Response: null

Error en consola:
Error enviando mensaje: Error: Error del servidor: 403
```

### DESPUÉS (Funcionando)
```
POST https://horizon-backend-316b23e32b8b.herokuapp.com/api/ai/chat
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Status: 200 OK
Response:
{
  "response": "Hola! ¿En qué puedo ayudarte hoy?",
  "session_id": "abc-123",
  "model_used": "gemini-2.5-flash",
  "tools_used": [],
  "metadata": {...}
}
```

---

## 📚 Referencias

- **Implementación multiusuario:** `MULTIUSER_IMPLEMENTATION_COMPLETE.md`
- **Configuración de API:** `src/config/api.ts`
- **Página del chat:** `src/pages/AIAgentPage.tsx`
- **Backend AI Router:** `mi-proyecto-backend/api/ai_router.py`
- **Autenticación Backend:** `mi-proyecto-backend/auth/dependencies.py`

---

## ✅ Conclusión

El error 403 era esperado después de la implementación multiusuario, ya que todos los endpoints ahora requieren autenticación para identificar al usuario y acceder solo a sus datos.

**El fix es simple:** Usar `getAuthHeaders()` (función ya existente) en todas las peticiones al backend que requieren autenticación.

**Resultado:** El chat del agente ahora:
1. ✅ Envía token JWT en cada petición
2. ✅ El backend identifica al usuario
3. ✅ El agente accede solo a los datos del usuario
4. ✅ No hay cross-contamination entre usuarios
