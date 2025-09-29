# Guía de Despliegue en Vercel - Frontend

Esta guía te ayudará a desplegar el frontend de Mi Proyecto en Vercel, configurado para comunicarse con el backend en Heroku.

## 🎯 URLs Configuradas

- **Frontend (Vercel)**: https://tu-proyecto.vercel.app (se genera al desplegar)
- **Backend (Heroku)**: https://horizon-backend-316b23e32b8b.herokuapp.com
- **Chat Agent (Heroku)**: https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com

## 📋 Cambios Realizados

### 1. Configuración de API Actualizada (`src/config/api.ts`)

Ahora la configuración detecta automáticamente el entorno:

```typescript
const getBaseUrl = (): string => {
    // 1. Variable de entorno de Vercel (prioridad máxima)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // 2. Producción sin variable de entorno → Heroku
    if (import.meta.env.PROD) {
        return 'https://horizon-backend-316b23e32b8b.herokuapp.com';
    }
    
    // 3. Desarrollo → localhost
    return 'http://localhost:8000';
};
```

### 2. Servicio de Portfolio Actualizado

`src/services/portfolioService.ts` ahora usa la configuración centralizada:

```typescript
import { API_CONFIG } from '../config/api';
const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PORTFOLIO_BASE}`;
```

### 3. Archivos Creados

- ✅ `vercel.json` - Configuración de Vercel
- ✅ `env.development.example` - Ejemplo para desarrollo local
- ✅ `env.production.example` - Ejemplo para producción

## 🚀 Despliegue Rápido en Vercel

### Opción 1: Despliegue desde el Dashboard de Vercel (Recomendado)

1. **Ve a [vercel.com](https://vercel.com) e inicia sesión**

2. **Click en "Add New Project"**

3. **Importa tu repositorio de Git**
   - Conecta tu cuenta de GitHub/GitLab/Bitbucket
   - Selecciona el repositorio `mi-proyecto`

4. **Configuración del Proyecto**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Variables de Entorno** (Sección "Environment Variables"):
   
   Agrega la siguiente variable:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_API_URL` | `https://horizon-backend-316b23e32b8b.herokuapp.com` | Production, Preview, Development |

6. **Click en "Deploy"**

7. **Espera a que se complete el despliegue** ⏳

8. **¡Listo!** 🎉 Tu frontend está desplegado

### Opción 2: Despliegue desde la CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar (desde el directorio raíz del proyecto)
vercel

# Seguir las instrucciones:
# - Set up and deploy? Y
# - Which scope? Tu cuenta
# - Link to existing project? N
# - Project name? mi-proyecto (o el que prefieras)
# - In which directory is your code located? ./
# - Want to override settings? N

# Configurar la variable de entorno
vercel env add VITE_API_URL production
# Valor: https://horizon-backend-316b23e32b8b.herokuapp.com

# Desplegar a producción
vercel --prod
```

## 🔧 Desarrollo Local

### 1. Crear archivo de variables de entorno

Crea un archivo `.env.development` (o `.env.local`) en la raíz del proyecto:

```bash
# Copia el archivo de ejemplo
cp env.development.example .env.development

# O créalo manualmente con:
VITE_API_URL=http://localhost:8000
```

### 2. Ejecutar en desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El frontend estará en: http://localhost:5173
# Y se conectará al backend en: http://localhost:8000
```

### 3. Probar contra Heroku en desarrollo (opcional)

Si quieres probar localmente contra el backend de Heroku:

```bash
# En .env.development
VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
```

## 📝 Configuración de Variables de Entorno en Vercel

### Desde el Dashboard

1. Ve a tu proyecto en Vercel
2. Click en **Settings**
3. Click en **Environment Variables**
4. Agrega:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `VITE_API_URL` | `https://horizon-backend-316b23e32b8b.herokuapp.com` | Production, Preview, Development |

### Desde la CLI

```bash
# Producción
vercel env add VITE_API_URL production
# Ingresa: https://horizon-backend-316b23e32b8b.herokuapp.com

# Preview (opcional)
vercel env add VITE_API_URL preview
# Ingresa: https://horizon-backend-316b23e32b8b.herokuapp.com

# Development (opcional)
vercel env add VITE_API_URL development
# Ingresa: http://localhost:8000
```

## 🔍 Verificar el Despliegue

### 1. Verificar que el frontend cargue

```bash
curl https://tu-proyecto.vercel.app
```

### 2. Verificar la consola del navegador

Abre las DevTools (F12) y busca en la consola:

```
🔧 API Base URL: https://horizon-backend-316b23e32b8b.herokuapp.com
```

Esto confirma que está usando la URL correcta.

### 3. Probar la conexión con el backend

En la aplicación, intenta:
- Hacer login
- Cargar el dashboard
- Usar el chat de IA
- Generar un reporte

## 🔄 Cómo Funciona en Diferentes Entornos

### Desarrollo Local (`npm run dev`)

```
Frontend (localhost:5173)
    ↓
    VITE_API_URL = http://localhost:8000
    ↓
Backend Local (localhost:8000)
```

### Vercel Preview (Pull Requests)

```
Frontend (tu-proyecto-git-branch.vercel.app)
    ↓
    VITE_API_URL = https://horizon-backend-316b23e32b8b.herokuapp.com
    ↓
Backend Heroku (Producción)
```

### Vercel Production

```
Frontend (tu-proyecto.vercel.app)
    ↓
    VITE_API_URL = https://horizon-backend-316b23e32b8b.herokuapp.com
    ↓
Backend Heroku (Producción)
```

## ⚙️ Configuración Avanzada

### Usar diferentes backends por entorno

En Vercel, puedes configurar diferentes URLs para cada entorno:

**Production**:
```
VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
```

**Preview** (para testing):
```
VITE_API_URL=https://horizon-backend-staging.herokuapp.com
```

**Development**:
```
VITE_API_URL=http://localhost:8000
```

### Configurar dominios personalizados

1. Ve a **Settings → Domains** en tu proyecto de Vercel
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones
4. Actualiza el `CLIENT_ORIGIN` en el backend de Heroku:

```bash
heroku config:set CLIENT_ORIGIN=https://tudominio.com -a horizon-backend-316b23e32b8b
```

## 🔐 Actualizar CORS en el Backend

Después de desplegar en Vercel, actualiza las variables de entorno del backend para incluir tu URL de Vercel:

```bash
# Obtener la URL de tu despliegue en Vercel
# Por ejemplo: https://mi-proyecto-abc123.vercel.app

# Actualizar el backend para aceptar peticiones desde Vercel
heroku config:set CLIENT_ORIGIN=https://mi-proyecto-abc123.vercel.app -a horizon-backend-316b23e32b8b
```

O si tienes múltiples orígenes, actualiza `CORS_ORIGINS` en el código del backend.

## 🚨 Troubleshooting

### Error: CORS blocked

**Síntoma**: Error de CORS en la consola del navegador

**Solución**:
1. Verifica que la URL del frontend esté en `CLIENT_ORIGIN` del backend
2. O agrega la URL a `CORS_ORIGINS` en `mi-proyecto-backend/config.py`
3. Redesplega el backend

### Error: Network request failed

**Síntoma**: No puede conectarse al backend

**Solución**:
1. Verifica que `VITE_API_URL` esté configurada en Vercel
2. Verifica que el backend esté corriendo: `curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/health`
3. Revisa la consola del navegador para ver la URL que está usando

### Build falla en Vercel

**Síntoma**: Error durante el build

**Solución**:
1. Verifica que todas las dependencias estén en `package.json`
2. Verifica que `npm run build` funcione localmente
3. Revisa los logs de build en Vercel

### Variables de entorno no se aplican

**Síntoma**: Sigue usando localhost en producción

**Solución**:
1. Las variables de entorno deben empezar con `VITE_`
2. Después de agregar variables, haz un **redeploy** en Vercel
3. Limpia el cache del navegador

## 📊 Monitoreo y Logs

### Ver logs en Vercel

```bash
# Logs en tiempo real
vercel logs tu-proyecto.vercel.app

# O desde el dashboard
# Ve a Deployments → Click en un deployment → Runtime Logs
```

### Analytics (opcional)

Vercel ofrece analytics gratuitos:
1. Ve a **Analytics** en el dashboard
2. Habilita Vercel Analytics
3. Agrega el script a tu proyecto (opcional)

## 🎉 Resultado Final

Una vez desplegado correctamente:

```
┌─────────────────────┐
│   Vercel Frontend   │
│  (tu-proyecto.app)  │
└──────────┬──────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────┐
│   Heroku Backend    │
│  (horizon-backend)  │
└──────────┬──────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────┐
│  Heroku Chat Agent  │
│  (chat-agent)       │
└─────────────────────┘
```

## 📚 Próximos Pasos

1. ✅ Desplegar frontend en Vercel
2. ✅ Configurar `VITE_API_URL`
3. ✅ Actualizar `CLIENT_ORIGIN` en el backend
4. ✅ Probar todas las funcionalidades
5. ✅ Configurar dominio personalizado (opcional)
6. ✅ Configurar Analytics (opcional)

## 🔗 Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
