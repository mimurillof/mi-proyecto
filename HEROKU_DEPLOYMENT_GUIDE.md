# Guía de Despliegue en Heroku - Ambos Servicios

Este proyecto contiene dos servicios independientes que deben desplegarse por separado en Heroku:

1. **mi-proyecto-backend** - Backend principal de la aplicación
2. **chat_agent_service** - Servicio de agente de chat con IA

## Resumen de cambios realizados

### Archivos creados/modificados:

#### mi-proyecto-backend/
- ✅ `Procfile` - Configuración de Heroku para ejecutar el servidor
- ✅ `runtime.txt` - Especifica la versión de Python (3.11.9)
- ✅ `requirements.txt` - Agregado `gunicorn>=21.2.0`
- ✅ `.slugignore` - Optimiza el tamaño del despliegue
- ✅ `HEROKU_DEPLOY.md` - Guía detallada de despliegue

#### chat_agent_service/
- ✅ `Procfile` - Configuración de Heroku para ejecutar el servidor
- ✅ `runtime.txt` - Especifica la versión de Python (3.11.9)
- ✅ `requirements.txt` - Agregado `gunicorn>=21.2.0`
- ✅ `.slugignore` - Optimiza el tamaño del despliegue
- ✅ `HEROKU_DEPLOY.md` - Guía detallada de despliegue

## Despliegue rápido

### Opción 1: Desplegar desde subdirectorios (Recomendado para monorepo)

#### Backend Principal:
```bash
# Crear app en Heroku
heroku create mi-proyecto-backend

# Configurar variables de entorno (ver HEROKU_DEPLOY.md en cada directorio)
heroku config:set DATABASE_URL=... SUPABASE_URL=... GEMINI_API_KEY=...

# Desplegar usando git subtree
git subtree push --prefix=mi-proyecto-backend heroku main
```

#### Chat Agent Service:
```bash
# Crear app en Heroku (usa un nombre diferente)
heroku create chat-agent-service

# Configurar variables de entorno
heroku config:set SUPABASE_URL=... GEMINI_API_KEY=...

# Desplegar usando git subtree
git subtree push --prefix=chat_agent_service heroku main
```

### Opción 2: Desplegar desde repositorios separados

Si prefieres tener repositorios Git separados para cada servicio:

#### Backend Principal:
```bash
cd mi-proyecto-backend
git init
git add .
git commit -m "Initial commit"
heroku create mi-proyecto-backend
git push heroku main
```

#### Chat Agent Service:
```bash
cd chat_agent_service
git init
git add .
git commit -m "Initial commit"
heroku create chat-agent-service
git push heroku main
```

## Variables de entorno requeridas

### mi-proyecto-backend
```bash
DATABASE_URL              # PostgreSQL connection string
SUPABASE_URL              # Supabase project URL
SUPABASE_KEY              # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY # Supabase service role key
SECRET_KEY                # JWT secret key
PROJECT_NAME              # Project name
API_V1_STR                # API version prefix (/api)
ENVIRONMENT               # production
CLIENT_ORIGIN             # Frontend URL
GEMINI_API_KEY            # Google AI API key (si usas AI)
```

### chat_agent_service
```bash
SUPABASE_URL              # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY # Supabase service role key
GEMINI_API_KEY            # Google AI API key
PROJECT_NAME              # Project name
ENVIRONMENT               # production
```

## Configuración del Procfile

Ambos servicios usan Gunicorn con workers de Uvicorn para máximo rendimiento:

```
web: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

### Parámetros:
- `-w 4`: 4 workers (ajustar según el dyno type)
- `-k uvicorn.workers.UvicornWorker`: Worker class para FastAPI
- `--bind 0.0.0.0:$PORT`: Bind a todas las interfaces en el puerto de Heroku

## Verificación post-despliegue

### Backend Principal:
```bash
curl https://mi-proyecto-backend.herokuapp.com/
curl https://mi-proyecto-backend.herokuapp.com/api/health
```

### Chat Agent Service:
```bash
curl https://chat-agent-service.herokuapp.com/
curl https://chat-agent-service.herokuapp.com/health
```

## Comandos útiles

```bash
# Ver logs en tiempo real
heroku logs --tail -a mi-proyecto-backend
heroku logs --tail -a chat-agent-service

# Reiniciar la aplicación
heroku restart -a mi-proyecto-backend
heroku restart -a chat-agent-service

# Ver estado de los dynos
heroku ps -a mi-proyecto-backend
heroku ps -a chat-agent-service

# Escalar dynos
heroku ps:scale web=1 -a mi-proyecto-backend
heroku ps:scale web=1 -a chat-agent-service

# Abrir en el navegador
heroku open -a mi-proyecto-backend
heroku open -a chat-agent-service
```

## Consideraciones de producción

### Seguridad:
- ✅ Usar variables de entorno para credenciales
- ✅ Usar HTTPS (Heroku lo proporciona automáticamente)
- ✅ Configurar CORS correctamente
- ✅ Usar SECRET_KEY seguro y único

### Performance:
- ✅ Usar Gunicorn con múltiples workers
- ✅ Considerar Heroku Postgres para mejor rendimiento
- ✅ Implementar caching si es necesario
- ✅ Monitorear logs y métricas

### Costos:
- Plan Free: 550-1000 horas/mes, dyno duerme después de 30 min
- Plan Hobby: $7/mes por dyno, sin sleep, SSL incluido
- Plan Standard: $25-50/mes, más recursos

## Troubleshooting

### El despliegue falla:
1. Verificar que todos los archivos estén en el repositorio Git
2. Verificar que `requirements.txt` esté actualizado
3. Revisar logs: `heroku logs --tail -a nombre-app`

### La app no responde:
1. Verificar que el dyno esté corriendo: `heroku ps -a nombre-app`
2. Verificar variables de entorno: `heroku config -a nombre-app`
3. Reiniciar: `heroku restart -a nombre-app`

### Error de memoria:
1. Reducir número de workers en el Procfile
2. Actualizar a un dyno type superior
3. Optimizar el código para usar menos memoria

## Documentación adicional

- Ver `mi-proyecto-backend/HEROKU_DEPLOY.md` para detalles del backend
- Ver `chat_agent_service/HEROKU_DEPLOY.md` para detalles del servicio de chat
- [Heroku Python Documentation](https://devcenter.heroku.com/categories/python-support)
- [Deploying with Git](https://devcenter.heroku.com/articles/git)
