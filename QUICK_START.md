# Quick Start - Mi Proyecto

Guía rápida para comenzar con el proyecto tanto en desarrollo local como en producción.

## 🚀 Setup Rápido

### 1. Setup Inicial del Frontend

```bash
# Clonar el repositorio (si no lo tienes)
git clone <tu-repo-url>
cd mi-proyecto

# Crear archivo de variables de entorno
# En Linux/Mac:
./setup-env.sh

# En Windows:
setup-env.bat

# O manualmente:
cp env.development.example .env.development

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### 2. Setup del Backend (opcional, si trabajas localmente)

```bash
cd mi-proyecto-backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Ejecutar backend
python main.py
```

El backend estará disponible en: `http://localhost:8000`

### 3. Setup del Chat Agent (opcional, si trabajas localmente)

```bash
cd chat_agent_service

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
# Windows:
.\.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Ejecutar chat agent
python main.py
```

El chat agent estará disponible en: `http://localhost:8001`

## 🌐 URLs de Producción

Los servicios ya están desplegados en:

- **Frontend**: Pendiente de desplegar en Vercel
- **Backend**: https://horizon-backend-316b23e32b8b.herokuapp.com
- **Chat Agent**: https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com

## 🔧 Configuración de Entornos

### Desarrollo Local

El frontend usa automáticamente `localhost:8000` cuando ejecutas `npm run dev`.

**Archivo**: `.env.development`
```bash
VITE_API_URL=http://localhost:8000
```

### Probar con Backend de Heroku (Local)

Si quieres probar el frontend local contra el backend de Heroku:

**Edita**: `.env.development`
```bash
VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
```

### Producción (Vercel)

En Vercel, configura la variable de entorno:
```bash
VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
```

## 📦 Comandos Útiles

### Frontend

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

### Backend

```bash
# Desarrollo
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Con el script
./start-backend.sh  # Linux/Mac
start-backend.bat   # Windows
```

### Chat Agent

```bash
# Desarrollo
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## 🎯 Verificar que Todo Funciona

### 1. Frontend

Abre `http://localhost:5173` y verifica:
- La página carga correctamente
- No hay errores en la consola (F12)
- Aparece el mensaje: `🔧 API Base URL: http://localhost:8000`

### 2. Backend

```bash
# Health check
curl http://localhost:8000/api/health

# Debería responder:
# {"status":"healthy","environment":"development"}
```

### 3. Chat Agent

```bash
# Health check
curl http://localhost:8001/health

# Debería responder:
# {"status":"healthy",...}
```

### 4. Comunicación Entre Servicios

```bash
# El backend debe poder llamar al chat agent
curl http://localhost:8000/api/ai/health

# Debería responder con información del chat agent
```

## 🚀 Desplegar

### Frontend en Vercel

Ver guía completa en: `VERCEL_DEPLOYMENT.md`

```bash
# Opción 1: Dashboard de Vercel (recomendado)
1. Ve a https://vercel.com/new
2. Importa tu repositorio
3. Configura VITE_API_URL en variables de entorno
4. Deploy

# Opción 2: CLI
vercel
vercel env add VITE_API_URL production
vercel --prod
```

### Backend en Heroku

Ver guía completa en: `mi-proyecto-backend/HEROKU_DEPLOY.md`

```bash
heroku create mi-proyecto-backend
git subtree push --prefix=mi-proyecto-backend heroku main
```

### Chat Agent en Heroku

Ver guía completa en: `chat_agent_service/HEROKU_DEPLOY.md`

```bash
heroku create chat-agent-service
git subtree push --prefix=chat_agent_service heroku main
```

## 📚 Documentación

### General
- `README.md` - Documentación principal del proyecto
- `QUICK_START.md` - Esta guía

### Frontend
- `VERCEL_DEPLOYMENT.md` - Despliegue en Vercel
- `FRONTEND_DEPLOYMENT_SUMMARY.md` - Resumen de cambios
- `src/config/api.ts` - Configuración de API

### Backend
- `mi-proyecto-backend/HEROKU_DEPLOY.md` - Despliegue en Heroku
- `mi-proyecto-backend/HEROKU_ENV_VARS.md` - Variables de entorno
- `mi-proyecto-backend/README.md` - Documentación del backend

### Chat Agent
- `chat_agent_service/HEROKU_DEPLOY.md` - Despliegue en Heroku
- `chat_agent_service/HEROKU_ENV_VARS.md` - Variables de entorno
- `chat_agent_service/README.md` - Documentación del chat agent

### Arquitectura
- `ARCHITECTURE_DIAGRAM.md` - Diagrama de arquitectura
- `HEROKU_DEPLOYMENT_GUIDE.md` - Guía general de Heroku
- `DEPLOYMENT_CHANGES_SUMMARY.md` - Resumen de todos los cambios

## 🆘 Problemas Comunes

### "Cannot find module" al ejecutar npm run dev

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### "CORS Error" al llamar a la API

1. Verifica que el backend esté corriendo
2. Verifica que `VITE_API_URL` apunte a la URL correcta
3. Verifica que el backend tenga CORS configurado para `localhost:5173`

### "Connection refused" al llamar a localhost:8000

1. Verifica que el backend esté corriendo
2. Verifica que el puerto sea 8000
3. Intenta con `http://127.0.0.1:8000` en lugar de `localhost`

### Variables de entorno no se aplican

1. Las variables deben empezar con `VITE_`
2. Reinicia el servidor de desarrollo después de cambiar `.env`
3. Limpia la caché: `rm -rf .vite`

## 🎉 ¡Listo!

Si todo funciona:
- ✅ Frontend en `localhost:5173`
- ✅ Backend en `localhost:8000`
- ✅ Chat Agent en `localhost:8001`
- ✅ Sin errores en la consola
- ✅ Comunicación entre servicios funcionando

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación específica de cada servicio
2. Verifica los logs en la consola
3. Revisa las variables de entorno
4. Asegúrate de que todas las dependencias estén instaladas
