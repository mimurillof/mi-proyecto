# Arquitectura de Servicios - Desarrollo vs Producción

## 🏗️ Arquitectura General

```
┌─────────────┐
│   Frontend  │
│  (React/    │
│   Vue/etc)  │
└──────┬──────┘
       │
       │ HTTP Requests
       ▼
┌─────────────────────────────────────────┐
│         Backend API                     │
│  (horizon-backend-316b23e32b8b)         │
│                                         │
│  • FastAPI                              │
│  • Authentication                       │
│  • Portfolio Management                 │
│  • AI Integration Router                │
└──────┬──────────────────────────────────┘
       │
       │ HTTP Requests (Internal)
       │ settings.get_chat_agent_url()
       ▼
┌─────────────────────────────────────────┐
│      Chat Agent Service                 │
│  (chat-agent-horizon-cc5e16d4b37e)      │
│                                         │
│  • Google Gemini AI                     │
│  • Portfolio Analysis                   │
│  • Chat Sessions                        │
│  • Report Generation                    │
└─────────────────────────────────────────┘
       │
       │ API Calls
       ▼
┌─────────────────────────────────────────┐
│      External Services                  │
│                                         │
│  • Google Gemini API                    │
│  • Supabase Storage                     │
│  • PostgreSQL Database                  │
└─────────────────────────────────────────┘
```

## 🔄 Comunicación entre Servicios

### Desarrollo Local
```
┌──────────────────────────────────────────────────────┐
│                  Development Mode                    │
│              (ENVIRONMENT=development)               │
└──────────────────────────────────────────────────────┘

Frontend (localhost:3000)
    │
    ▼
Backend (localhost:8000)
    │ settings.get_chat_agent_url()
    │ → "http://localhost:8001"
    │
    ▼
Chat Agent (localhost:8001)
    │ settings.get_backend_url()
    │ → "http://localhost:8000"
    │
    ▼
External APIs
```

### Producción Heroku
```
┌──────────────────────────────────────────────────────┐
│                   Production Mode                    │
│              (ENVIRONMENT=production)                │
└──────────────────────────────────────────────────────┘

Frontend (tu-frontend.vercel.app)
    │
    ▼
Backend (horizon-backend-316b23e32b8b.herokuapp.com)
    │ settings.get_chat_agent_url()
    │ → "https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com"
    │
    ▼
Chat Agent (chat-agent-horizon-cc5e16d4b37e.herokuapp.com)
    │ settings.get_backend_url()
    │ → "https://horizon-backend-316b23e32b8b.herokuapp.com"
    │
    ▼
External APIs
```

## 🔐 Configuración CORS

### Backend CORS (mi-proyecto-backend)
```python
CORS_ORIGINS = [
    # Desarrollo
    "http://localhost:3000",      # Frontend local
    "http://localhost:5173",      # Vite dev
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    # Producción
    "https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com",  # Chat Agent
    # + CLIENT_ORIGIN (tu frontend en producción)
]
```

### Chat Agent CORS (chat_agent_service)
```python
cors_origins = [
    # Desarrollo
    "http://localhost:3000",      # Frontend local
    "http://localhost:8000",      # Backend local
    "http://localhost:5173",      # Vite dev
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5173",
    # Producción
    "https://horizon-backend-316b23e32b8b.herokuapp.com",      # Backend
    "https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com",   # Self (websockets)
]
```

## 📡 Endpoints Principales

### Backend (horizon-backend-316b23e32b8b.herokuapp.com)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | Health check raíz |
| `/api/health` | GET | Health check detallado |
| `/api/auth/*` | POST | Autenticación |
| `/api/users/*` | GET/POST | Gestión de usuarios |
| `/api/ai/chat` | POST | Chat con IA (proxy al agent) |
| `/api/ai/health` | GET | Estado del chat agent |
| `/api/portfolio/*` | GET/POST | Gestión de portafolio |
| `/docs` | GET | Documentación Swagger |

### Chat Agent (chat-agent-horizon-cc5e16d4b37e.herokuapp.com)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | Información del servicio |
| `/health` | GET | Health check |
| `/chat` | POST | Procesar mensaje de chat |
| `/sessions/create` | POST | Crear nueva sesión |
| `/sessions` | GET | Listar sesiones |
| `/sessions/{id}` | GET | Info de sesión |
| `/sessions/{id}` | DELETE | Cerrar sesión |
| `/acciones/generar_informe_portafolio` | POST | Generar informe |
| `/docs` | GET | Documentación Swagger |

## 🔑 Variables de Entorno Críticas

### Backend
```bash
# Determina qué URL usar para el Chat Agent
ENVIRONMENT=production

# URL del Chat Agent en producción
CHAT_AGENT_SERVICE_URL_PROD=https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com

# URL del Chat Agent en desarrollo (default)
CHAT_AGENT_SERVICE_URL=http://localhost:8001
```

### Chat Agent
```bash
# Determina qué URL usar para el Backend
ENVIRONMENT=production

# URL del Backend en producción
BACKEND_SERVICE_URL_PROD=https://horizon-backend-316b23e32b8b.herokuapp.com

# URL del Backend en desarrollo (default)
BACKEND_SERVICE_URL=http://localhost:8000
```

## 🔀 Flujo de una Petición de Chat

```
1. Frontend → POST /api/ai/chat
   ↓
2. Backend (main.py) → Router /api/ai/chat
   ↓
3. ai_router.py → remote_agent_client.process_message()
   ↓
4. remote_agent_client.py → HTTP POST a settings.get_chat_agent_url()
   │
   ├─ Desarrollo: http://localhost:8001/chat
   └─ Producción: https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/chat
   ↓
5. Chat Agent (main.py) → /chat endpoint
   ↓
6. agent_service.py → Google Gemini API
   ↓
7. Gemini Response → Chat Agent
   ↓
8. Chat Agent Response → Backend
   ↓
9. Backend Response → Frontend
```

## 🚀 Proceso de Despliegue

```
1. Código Local
   ↓
2. Git Commit
   ↓
3. Git Subtree Push → Heroku
   │
   ├─ chat_agent_service → chat-agent-horizon-cc5e16d4b37e
   └─ mi-proyecto-backend → horizon-backend-316b23e32b8b
   ↓
4. Heroku Build
   │ • Detecta Python
   │ • Lee requirements.txt
   │ • Lee runtime.txt
   │ • Instala dependencias
   │ • Aplica .slugignore
   ↓
5. Heroku Release
   │ • Ejecuta Procfile
   │ • Asigna $PORT
   │ • Inicia Gunicorn + Uvicorn
   ↓
6. Servicio en Producción ✅
```

## 📊 Recursos de Heroku

### Dyno Configuration
```
Procfile: web: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT

• Gunicorn: Servidor WSGI robusto
• 4 Workers: Maneja 4 peticiones concurrentes
• UvicornWorker: Soporte para ASGI/FastAPI
• $PORT: Puerto asignado por Heroku
```

### Resource Types
- **Free Dyno**: 512MB RAM, duerme después de 30 min
- **Hobby Dyno**: 512MB RAM, no duerme ($7/mes)
- **Standard-1x**: 512MB RAM, auto-scaling ($25/mes)
- **Standard-2x**: 1GB RAM, auto-scaling ($50/mes)

## 🔍 Monitoreo y Debugging

### Ver logs en tiempo real
```bash
# Backend
heroku logs --tail -a horizon-backend-316b23e32b8b

# Chat Agent
heroku logs --tail -a chat-agent-horizon-cc5e16d4b37e
```

### Health Checks
```bash
# Backend
curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/health

# Chat Agent
curl https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/health

# Backend verificando Chat Agent
curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/ai/health
```

## 🎯 Ventajas de esta Arquitectura

1. ✅ **Separación de Responsabilidades**
   - Backend: Autenticación, datos, orquestación
   - Chat Agent: IA, procesamiento, generación de reportes

2. ✅ **Escalabilidad Independiente**
   - Escala el Chat Agent si hay mucho uso de IA
   - Escala el Backend si hay mucho tráfico de datos

3. ✅ **Desarrollo Flexible**
   - Trabaja localmente con ambos servicios
   - Despliega independientemente

4. ✅ **Mantenimiento Simplificado**
   - Actualiza un servicio sin afectar el otro
   - Rollback independiente si hay problemas

5. ✅ **Costos Optimizados**
   - Usa dynos free/hobby según necesites
   - Paga solo por lo que usas
