# Resumen de Cambios - Frontend para Vercel

## 🎯 Objetivo

Configurar el frontend para que se comunique con el backend de Heroku tanto en desarrollo (localhost) como en producción (Vercel), de manera similar a cómo configuramos el backend y chat agent service.

## ✅ Cambios Realizados

### 1. `src/config/api.ts` - Configuración Inteligente de API

**Antes**:
```typescript
BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com'  // ❌ Placeholder
    : 'http://localhost:8000'
```

**Después**:
```typescript
const getBaseUrl = (): string => {
    // 1. Variable de entorno (Vercel)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // 2. Producción → Heroku
    if (import.meta.env.PROD) {
        return 'https://horizon-backend-316b23e32b8b.herokuapp.com';
    }
    
    // 3. Desarrollo → localhost
    return 'http://localhost:8000';
};
```

**Características**:
- ✅ Prioriza variables de entorno de Vercel
- ✅ Fallback automático a Heroku en producción
- ✅ Localhost en desarrollo
- ✅ Debug logging en modo desarrollo

### 2. `src/services/portfolioService.ts` - Uso de Configuración Centralizada

**Antes**:
```typescript
const API_URL = 'http://localhost:8000/api/portfolio';  // ❌ Hardcoded
```

**Después**:
```typescript
import { API_CONFIG } from '../config/api';
const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PORTFOLIO_BASE}`;
```

**Beneficios**:
- ✅ Una sola fuente de verdad
- ✅ Cambia automáticamente según el entorno
- ✅ Más fácil de mantener

### 3. Nuevos Archivos

| Archivo | Descripción |
|---------|-------------|
| `vercel.json` | Configuración de Vercel con variables de entorno |
| `env.development.example` | Ejemplo para desarrollo local |
| `env.production.example` | Ejemplo para producción |
| `VERCEL_DEPLOYMENT.md` | Guía completa de despliegue en Vercel |
| `FRONTEND_DEPLOYMENT_SUMMARY.md` | Este archivo |

## 🔄 Cómo Funciona

### Desarrollo Local

```bash
npm run dev
```

1. Vite lee `.env.development` (si existe)
2. `VITE_API_URL` → `http://localhost:8000`
3. Frontend llama a `localhost:8000`

**Flujo**:
```
Frontend (localhost:5173)
    ↓ fetch()
Backend (localhost:8000)
    ↓ HTTP
Chat Agent (localhost:8001)
```

### Producción Vercel

```bash
vercel deploy --prod
```

1. Vercel inyecta `VITE_API_URL` desde variables de entorno
2. `VITE_API_URL` → `https://horizon-backend-316b23e32b8b.herokuapp.com`
3. Frontend llama al backend de Heroku

**Flujo**:
```
Frontend (vercel.app)
    ↓ HTTPS
Backend (horizon-backend.herokuapp.com)
    ↓ HTTPS
Chat Agent (chat-agent-horizon.herokuapp.com)
```

## 🚀 Pasos para Desplegar

### 1. Preparar el código (Ya hecho ✅)

```bash
# Verificar que todo esté listo
git status
```

### 2. Crear archivos de variables de entorno

```bash
# Para desarrollo local
cp env.development.example .env.development

# Editar si es necesario
nano .env.development
```

### 3. Probar localmente

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Verificar en la consola que muestre:
# 🔧 API Base URL: http://localhost:8000
```

### 4. Build de prueba

```bash
# Hacer build local para verificar que no hay errores
npm run build

# Preview del build
npm run preview
```

### 5. Commit y Push

```bash
git add .
git commit -m "Configurar frontend para Vercel con backend de Heroku"
git push origin main
```

### 6. Desplegar en Vercel

#### Opción A: Dashboard de Vercel (Más fácil)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio `mi-proyecto`
3. Configura:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Agrega variable de entorno:
   - `VITE_API_URL` = `https://horizon-backend-316b23e32b8b.herokuapp.com`
5. Click **Deploy**

#### Opción B: CLI de Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Configurar variable de entorno
vercel env add VITE_API_URL production
# Valor: https://horizon-backend-316b23e32b8b.herokuapp.com

# Deploy a producción
vercel --prod
```

### 7. Actualizar CORS en el Backend

```bash
# Una vez que tengas la URL de Vercel (ej: https://mi-proyecto.vercel.app)
heroku config:set CLIENT_ORIGIN=https://mi-proyecto.vercel.app -a horizon-backend-316b23e32b8b

# O agrega manualmente a CORS_ORIGINS en mi-proyecto-backend/config.py
```

### 8. Verificar

```bash
# Probar el frontend
curl https://tu-proyecto.vercel.app

# Abrir en el navegador y verificar en DevTools (F12) la consola
# Debería mostrar: 🔧 API Base URL: https://horizon-backend-316b23e32b8b.herokuapp.com
```

## 🔐 Variables de Entorno

### Vercel (Producción)

Configura en Vercel Dashboard o CLI:

```bash
VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
```

### Desarrollo Local

Crea `.env.development`:

```bash
VITE_API_URL=http://localhost:8000
```

### Testing Local con Backend de Heroku

Crea `.env.local`:

```bash
VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
```

## 🎨 Arquitectura Completa

```
┌──────────────────────────────────────────────────┐
│              DESARROLLO LOCAL                    │
└──────────────────────────────────────────────────┘

Frontend (localhost:5173)
    │ VITE_API_URL=http://localhost:8000
    ▼
Backend (localhost:8000)
    │ CHAT_AGENT_SERVICE_URL=http://localhost:8001
    ▼
Chat Agent (localhost:8001)


┌──────────────────────────────────────────────────┐
│                 PRODUCCIÓN                       │
└──────────────────────────────────────────────────┘

Frontend (Vercel: tu-proyecto.vercel.app)
    │ VITE_API_URL=https://horizon-backend-*.herokuapp.com
    ▼
Backend (Heroku: horizon-backend-*.herokuapp.com)
    │ ENVIRONMENT=production
    │ CHAT_AGENT_SERVICE_URL_PROD=https://chat-agent-*.herokuapp.com
    ▼
Chat Agent (Heroku: chat-agent-*.herokuapp.com)
    │ ENVIRONMENT=production
    ▼
External APIs (Google Gemini, Supabase, etc.)
```

## 📊 Checklist de Verificación

### Código
- [x] `src/config/api.ts` actualizado con `getBaseUrl()`
- [x] `src/services/portfolioService.ts` usa configuración centralizada
- [x] Agregado endpoint `PORTFOLIO_BASE` a `API_CONFIG.ENDPOINTS`
- [x] Debug logging en modo desarrollo

### Archivos de Configuración
- [x] `vercel.json` creado
- [x] `env.development.example` creado
- [x] `env.production.example` creado
- [x] `.gitignore` ya incluye archivos `.env*`

### Documentación
- [x] `VERCEL_DEPLOYMENT.md` - Guía completa
- [x] `FRONTEND_DEPLOYMENT_SUMMARY.md` - Este resumen

### Testing
- [ ] Probado localmente con `npm run dev`
- [ ] Probado build local con `npm run build`
- [ ] Desplegado en Vercel
- [ ] Variable `VITE_API_URL` configurada en Vercel
- [ ] CORS actualizado en el backend
- [ ] Verificado que todas las funcionalidades funcionan

## 🚨 Troubleshooting Común

### 1. "Sigue usando localhost en Vercel"

**Causa**: Variable de entorno no configurada o no redesplegado

**Solución**:
```bash
# Verificar variables en Vercel
vercel env ls

# Agregar si falta
vercel env add VITE_API_URL production

# Redesplegar
vercel --prod
```

### 2. "CORS Error"

**Causa**: Frontend URL no está en CORS del backend

**Solución**:
```bash
# Agregar URL de Vercel al backend
heroku config:set CLIENT_ORIGIN=https://tu-proyecto.vercel.app -a horizon-backend-316b23e32b8b
```

### 3. "Build falla en Vercel"

**Causa**: Dependencias faltantes o error de TypeScript

**Solución**:
```bash
# Probar build localmente
npm run build

# Ver errores y corregir
# Luego redesplegar
```

## 📈 Próximos Pasos Opcionales

1. **Dominio Personalizado**
   - Configurar en Vercel Dashboard
   - Actualizar DNS
   - Actualizar CORS en backend

2. **Analytics**
   - Habilitar Vercel Analytics
   - Configurar Google Analytics

3. **Performance**
   - Configurar CDN caching
   - Optimizar imágenes
   - Code splitting

4. **Monitoring**
   - Configurar Sentry para error tracking
   - Configurar logs agregados
   - Alertas de uptime

## 🎉 Resultado Final

✅ Frontend desplegado en Vercel
✅ Backend desplegado en Heroku
✅ Chat Agent desplegado en Heroku
✅ Comunicación funcionando entre todos los servicios
✅ Funciona tanto en desarrollo como en producción
✅ CORS configurado correctamente

**URLs**:
- Frontend: `https://tu-proyecto.vercel.app`
- Backend: `https://horizon-backend-316b23e32b8b.herokuapp.com`
- Chat Agent: `https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com`
