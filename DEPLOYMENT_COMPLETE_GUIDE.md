# Guía Completa de Despliegue - Mi Proyecto

Esta es la guía maestra que coordina el despliegue de todos los servicios del proyecto.

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────┐
│                    ARQUITECTURA                         │
└─────────────────────────────────────────────────────────┘

                    Frontend (React + Vite)
                    📍 Vercel
                    https://tu-proyecto.vercel.app
                            │
                            │ HTTPS API Calls
                            │ VITE_API_URL
                            ▼
                    Backend (FastAPI)
                    📍 Heroku
                    https://horizon-backend-316b23e32b8b.herokuapp.com
                            │
                            │ HTTPS Internal Calls
                            │ get_chat_agent_url()
                            ▼
                    Chat Agent Service (FastAPI)
                    📍 Heroku
                    https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com
                            │
                            │ External APIs
                            ▼
            ┌───────────────┴───────────────┐
            │                               │
        Google Gemini API             Supabase
        (AI/ML)                       (Storage/DB)
```

## 📦 Componentes del Proyecto

### 1. Frontend (Carpeta Raíz)
- **Tecnología**: React + TypeScript + Vite
- **Despliegue**: Vercel
- **Puerto Local**: 5173
- **Documentación**: `VERCEL_DEPLOYMENT.md`

### 2. Backend (mi-proyecto-backend/)
- **Tecnología**: FastAPI + Python
- **Despliegue**: Heroku
- **Puerto Local**: 8000
- **Documentación**: `mi-proyecto-backend/HEROKU_DEPLOY.md`

### 3. Chat Agent Service (chat_agent_service/)
- **Tecnología**: FastAPI + Python + Google Gemini
- **Despliegue**: Heroku
- **Puerto Local**: 8001
- **Documentación**: `chat_agent_service/HEROKU_DEPLOY.md`

### 4. PDF Generator (Generacion de Informe/)
- **Tecnología**: FastAPI + Python
- **Despliegue**: Heroku (opcional)
- **Puerto Local**: 8002
- **Estado**: Pendiente de configuración para Heroku

## 🚀 Orden de Despliegue Recomendado

### Fase 1: Chat Agent Service ✅
```bash
cd mi-proyecto
git subtree push --prefix=chat_agent_service heroku main
heroku config:set ENVIRONMENT=production GEMINI_API_KEY=... -a chat-agent-horizon-cc5e16d4b37e
```

### Fase 2: Backend ✅
```bash
cd mi-proyecto
git subtree push --prefix=mi-proyecto-backend heroku main
heroku config:set ENVIRONMENT=production CHAT_AGENT_SERVICE_URL_PROD=https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com -a horizon-backend-316b23e32b8b
```

### Fase 3: Frontend 🔄 (Siguiente paso)
```bash
# Opción 1: Dashboard de Vercel
1. Ve a vercel.com/new
2. Importa tu repositorio
3. Configura variables de entorno
4. Deploy

# Opción 2: CLI
vercel
vercel env add VITE_API_URL production
# Valor: https://horizon-backend-316b23e32b8b.herokuapp.com
vercel --prod
```

## 🔑 Variables de Entorno Críticas

### Frontend (Vercel)
```bash
VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
```

### Backend (Heroku)
```bash
ENVIRONMENT=production
CHAT_AGENT_SERVICE_URL_PROD=https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com
SECRET_KEY=<tu-secret-key>
DATABASE_URL=<auto-configurado-por-heroku>
SUPABASE_URL=<tu-supabase-url>
SUPABASE_SERVICE_ROLE=<tu-service-role-key>
GEMINI_API_KEY=<tu-gemini-key>
```

### Chat Agent (Heroku)
```bash
ENVIRONMENT=production
BACKEND_SERVICE_URL_PROD=https://horizon-backend-316b23e32b8b.herokuapp.com
GEMINI_API_KEY=<tu-gemini-key>
SUPABASE_URL=<tu-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
```

## 📋 Checklist Completo de Despliegue

### Pre-Despliegue
- [x] Código del Chat Agent configurado para Heroku
- [x] Código del Backend configurado para Heroku
- [x] Código del Frontend configurado para Vercel
- [x] `.slugignore` corregido en todos los servicios
- [x] Procfiles creados
- [x] runtime.txt creados
- [x] requirements.txt actualizados con gunicorn
- [x] Configuración de CORS actualizada

### Chat Agent Service
- [ ] Desplegado en Heroku
- [ ] `ENVIRONMENT=production` configurado
- [ ] `GEMINI_API_KEY` configurado
- [ ] Variables de Supabase configuradas
- [ ] Health check responde: `curl https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/health`

### Backend
- [ ] Desplegado en Heroku
- [ ] `ENVIRONMENT=production` configurado
- [ ] `CHAT_AGENT_SERVICE_URL_PROD` configurado
- [ ] PostgreSQL addon agregado
- [ ] Variables de Supabase configuradas
- [ ] `SECRET_KEY` configurado
- [ ] Health check responde: `curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/health`
- [ ] Puede comunicarse con Chat Agent: `curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/ai/health`

### Frontend
- [ ] Desplegado en Vercel
- [ ] `VITE_API_URL` configurado
- [ ] Build exitoso
- [ ] La aplicación carga correctamente
- [ ] No hay errores de CORS
- [ ] Puede hacer login
- [ ] Puede cargar datos del portfolio
- [ ] El chat de IA funciona

### Comunicación Entre Servicios
- [ ] Frontend → Backend ✅
- [ ] Backend → Chat Agent ✅
- [ ] Chat Agent → APIs Externas ✅
- [ ] CORS configurado correctamente ✅

## 🔍 Verificación Post-Despliegue

### 1. Health Checks

```bash
# Chat Agent
curl https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/health

# Backend
curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/health

# Backend → Chat Agent
curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/ai/health

# Frontend (en el navegador)
# Debería cargar sin errores
```

### 2. Funcionalidades Clave

- [ ] **Autenticación**: Login y registro funcionan
- [ ] **Dashboard**: Carga datos del portfolio
- [ ] **Gráficos**: Se muestran correctamente
- [ ] **Chat IA**: Responde mensajes
- [ ] **Reportes**: Se pueden generar
- [ ] **Portfolio**: CRUD funciona

### 3. Performance

- [ ] Tiempo de carga inicial < 3s
- [ ] API responses < 1s (promedio)
- [ ] Chat IA responde < 5s
- [ ] No hay memory leaks
- [ ] No hay errores en logs

## 🛠️ Comandos Útiles

### Ver Logs

```bash
# Frontend (Vercel)
vercel logs tu-proyecto.vercel.app

# Backend (Heroku)
heroku logs --tail -a horizon-backend-316b23e32b8b

# Chat Agent (Heroku)
heroku logs --tail -a chat-agent-horizon-cc5e16d4b37e
```

### Reiniciar Servicios

```bash
# Backend
heroku restart -a horizon-backend-316b23e32b8b

# Chat Agent
heroku restart -a chat-agent-horizon-cc5e16d4b37e

# Frontend (redesplegar)
vercel --prod
```

### Ver Variables de Entorno

```bash
# Backend
heroku config -a horizon-backend-316b23e32b8b

# Chat Agent
heroku config -a chat-agent-horizon-cc5e16d4b37e

# Frontend
vercel env ls
```

## 🚨 Troubleshooting

### Frontend no se conecta al Backend

**Síntomas**:
- Errores de CORS en la consola
- "Network request failed"
- Timeout en API calls

**Soluciones**:
1. Verificar `VITE_API_URL` en Vercel
2. Verificar que el backend esté corriendo
3. Actualizar CORS en el backend:
   ```bash
   heroku config:set CLIENT_ORIGIN=https://tu-proyecto.vercel.app -a horizon-backend-316b23e32b8b
   ```

### Backend no se comunica con Chat Agent

**Síntomas**:
- Error al usar el chat
- "Service unavailable" en `/api/ai/health`

**Soluciones**:
1. Verificar `ENVIRONMENT=production` en el backend
2. Verificar `CHAT_AGENT_SERVICE_URL_PROD` en el backend
3. Verificar que el chat agent esté corriendo

### Chat Agent no puede acceder a Gemini

**Síntomas**:
- Error en el chat: "API key invalid"
- Error 401 en logs

**Soluciones**:
1. Verificar `GEMINI_API_KEY` en el chat agent
2. Verificar que la API key sea válida
3. Verificar cuota de la API

### Build falla en Vercel

**Síntomas**:
- Error durante el build
- "Command failed"

**Soluciones**:
1. Probar build localmente: `npm run build`
2. Verificar todas las dependencias en `package.json`
3. Revisar logs de build en Vercel

### "Application Error" en Heroku

**Síntomas**:
- Página de error de Heroku
- H10 o H14 error codes

**Soluciones**:
1. Revisar logs: `heroku logs --tail -a <app-name>`
2. Verificar variables de entorno
3. Verificar que el Procfile sea correcto
4. Reiniciar el dyno

## 📚 Documentación Detallada

### Por Servicio

| Servicio | Guía de Despliegue | Variables de Entorno | Resumen |
|----------|-------------------|---------------------|---------|
| Frontend | `VERCEL_DEPLOYMENT.md` | - | `FRONTEND_DEPLOYMENT_SUMMARY.md` |
| Backend | `mi-proyecto-backend/HEROKU_DEPLOY.md` | `mi-proyecto-backend/HEROKU_ENV_VARS.md` | - |
| Chat Agent | `chat_agent_service/HEROKU_DEPLOY.md` | `chat_agent_service/HEROKU_ENV_VARS.md` | `chat_agent_service/DEPLOYMENT_FIX.md` |

### Guías Generales

- `QUICK_START.md` - Inicio rápido para desarrollo
- `HEROKU_QUICK_DEPLOY.md` - Despliegue rápido en Heroku
- `HEROKU_DEPLOYMENT_GUIDE.md` - Guía general de Heroku
- `ARCHITECTURE_DIAGRAM.md` - Arquitectura detallada
- `DEPLOYMENT_CHANGES_SUMMARY.md` - Resumen de cambios

## 🎯 Próximos Pasos

### Después del Despliegue

1. **Monitoreo**
   - Configurar alertas en Heroku
   - Configurar Analytics en Vercel
   - Implementar error tracking (Sentry)

2. **Performance**
   - Optimizar imágenes
   - Implementar caching
   - Code splitting

3. **Seguridad**
   - Configurar rate limiting
   - Implementar HTTPS everywhere
   - Configurar CSP headers

4. **Backups**
   - Configurar backups de PostgreSQL
   - Backup de configuraciones
   - Plan de disaster recovery

5. **CI/CD**
   - Automatizar despliegues
   - Tests automáticos
   - Preview deployments

## 🎉 Estado Actual

```
✅ Chat Agent Service - Configurado y listo para desplegar
✅ Backend - Configurado y listo para desplegar  
✅ Frontend - Configurado y listo para desplegar
⏳ Esperando despliegue final
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del servicio afectado
2. Consulta la documentación específica del servicio
3. Verifica las variables de entorno
4. Revisa esta guía completa

---

**Última actualización**: Configuración completada para despliegue en Vercel (Frontend), Heroku (Backend y Chat Agent)
