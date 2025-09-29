# Guía Rápida de Despliegue en Heroku

## 🚀 Despliegue rápido de ambos servicios

Esta guía te ayudará a desplegar ambos servicios en Heroku en minutos.

## URLs de producción

- **Backend**: https://horizon-backend-316b23e32b8b.herokuapp.com
- **Chat Agent**: https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com

## Paso 1: Preparar el código

Ya están listos los siguientes archivos:
- ✅ `Procfile` en ambos servicios
- ✅ `runtime.txt` especificando Python 3.11.9
- ✅ `requirements.txt` con gunicorn agregado
- ✅ `.slugignore` optimizado
- ✅ Configuración CORS actualizada
- ✅ URLs de producción configuradas

## Paso 2: Commit de los cambios

```bash
# Asegúrate de estar en el directorio raíz del proyecto
cd C:\Users\mikia\mi-proyecto

# Agregar todos los cambios
git add .

# Commit
git commit -m "Configurar servicios para despliegue en Heroku"

# Push al repositorio principal (opcional pero recomendado)
git push origin main
```

## Paso 3: Desplegar Chat Agent Service

```bash
# 1. El app ya existe, así que solo necesitas hacer push
git subtree push --prefix=chat_agent_service heroku main

# Si da error, puede que necesites forzar el push:
# git push heroku `git subtree split --prefix=chat_agent_service main`:main --force
```

### 3.1 Configurar variables de entorno del Chat Agent

```bash
heroku config:set \
  ENVIRONMENT=production \
  SERVICE_NAME="Chat Agent Service" \
  GEMINI_API_KEY="TU_GEMINI_API_KEY" \
  SUPABASE_URL="TU_SUPABASE_URL" \
  SUPABASE_SERVICE_ROLE_KEY="TU_SUPABASE_KEY" \
  -a chat-agent-horizon-cc5e16d4b37e
```

### 3.2 Verificar despliegue del Chat Agent

```bash
# Ver logs
heroku logs --tail -a chat-agent-horizon-cc5e16d4b37e

# Probar el endpoint
curl https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/health
```

## Paso 4: Desplegar Backend

```bash
# Primero necesitas agregar el remote de Heroku del backend
heroku git:remote -a horizon-backend-316b23e32b8b

# Desplegar usando subtree
git subtree push --prefix=mi-proyecto-backend heroku main

# Si da error, puede que necesites forzar el push:
# git push heroku `git subtree split --prefix=mi-proyecto-backend main`:main --force
```

### 4.1 Configurar variables de entorno del Backend

```bash
heroku config:set \
  ENVIRONMENT=production \
  PROJECT_NAME="Mi Proyecto API" \
  API_V1_STR="/api" \
  SECRET_KEY="$(openssl rand -base64 32)" \
  CLIENT_ORIGIN="https://tu-frontend.vercel.app" \
  CHAT_AGENT_SERVICE_URL_PROD="https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com" \
  GEMINI_API_KEY="TU_GEMINI_API_KEY" \
  SUPABASE_URL="TU_SUPABASE_URL" \
  SUPABASE_SERVICE_ROLE="TU_SUPABASE_SERVICE_ROLE" \
  SUPABASE_ANON_KEY="TU_SUPABASE_ANON_KEY" \
  -a horizon-backend-316b23e32b8b
```

### 4.2 Agregar PostgreSQL (si no lo tienes)

```bash
heroku addons:create heroku-postgresql:essential-0 -a horizon-backend-316b23e32b8b
```

### 4.3 Verificar despliegue del Backend

```bash
# Ver logs
heroku logs --tail -a horizon-backend-316b23e32b8b

# Probar el endpoint
curl https://horizon-backend-316b23e32b8b.herokuapp.com/
curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/health
```

## Paso 5: Verificar comunicación entre servicios

### Probar que el backend puede comunicarse con el chat agent:

```bash
# Desde el backend, verificar el status del chat agent
curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/ai/health
```

Debería responder con información del chat agent service.

## Comandos útiles post-despliegue

### Ver todas las variables de entorno configuradas

```bash
# Backend
heroku config -a horizon-backend-316b23e32b8b

# Chat Agent
heroku config -a chat-agent-horizon-cc5e16d4b37e
```

### Ver logs en tiempo real

```bash
# Backend
heroku logs --tail -a horizon-backend-316b23e32b8b

# Chat Agent
heroku logs --tail -a chat-agent-horizon-cc5e16d4b37e
```

### Reiniciar servicios

```bash
# Backend
heroku restart -a horizon-backend-316b23e32b8b

# Chat Agent
heroku restart -a chat-agent-horizon-cc5e16d4b37e
```

### Escalar dynos (si necesitas más recursos)

```bash
# Backend
heroku ps:scale web=1:standard-1x -a horizon-backend-316b23e32b8b

# Chat Agent
heroku ps:scale web=1:standard-1x -a chat-agent-horizon-cc5e16d4b37e
```

## Troubleshooting

### Error: "Couldn't find any supported Python package manager files"
- Verifica que `.slugignore` NO excluya `requirements.txt`
- Solución: Ya está corregido en los archivos actuales

### Error: "Application error" después del despliegue
- Revisa los logs: `heroku logs --tail -a nombre-app`
- Verifica que `ENVIRONMENT=production` esté configurado
- Verifica que todas las variables de entorno requeridas estén configuradas

### Los servicios no se comunican entre sí
- Verifica que `ENVIRONMENT=production` esté configurado en AMBOS servicios
- Verifica las URLs en las variables de entorno:
  - Backend: `CHAT_AGENT_SERVICE_URL_PROD`
  - Chat Agent: `BACKEND_SERVICE_URL_PROD`

### Error H10 - App crashed
- Usualmente por variables de entorno faltantes
- Revisa los logs: `heroku logs --tail -a nombre-app`

## Checklist final

### Backend (horizon-backend-316b23e32b8b)
- [ ] Código desplegado
- [ ] `ENVIRONMENT=production` configurado
- [ ] Variables de entorno de Supabase configuradas
- [ ] `CHAT_AGENT_SERVICE_URL_PROD` apunta al chat agent
- [ ] PostgreSQL addon agregado
- [ ] Endpoints responden correctamente

### Chat Agent (chat-agent-horizon-cc5e16d4b37e)
- [ ] Código desplegado  
- [ ] `ENVIRONMENT=production` configurado
- [ ] `GEMINI_API_KEY` configurado
- [ ] Variables de entorno de Supabase configuradas
- [ ] `BACKEND_SERVICE_URL_PROD` apunta al backend
- [ ] Endpoints responden correctamente

### Comunicación entre servicios
- [ ] Backend puede llamar al Chat Agent
- [ ] CORS configurado correctamente
- [ ] No hay errores en los logs

## 🎉 ¡Listo!

Tus servicios deberían estar funcionando en producción. Puedes acceder a:

- **Backend API**: https://horizon-backend-316b23e32b8b.herokuapp.com/docs
- **Chat Agent API**: https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/docs

## Documentación adicional

- `mi-proyecto-backend/HEROKU_ENV_VARS.md` - Variables de entorno del backend
- `chat_agent_service/HEROKU_ENV_VARS.md` - Variables de entorno del chat agent
- `mi-proyecto-backend/HEROKU_DEPLOY.md` - Guía detallada del backend
- `chat_agent_service/HEROKU_DEPLOY.md` - Guía detallada del chat agent
