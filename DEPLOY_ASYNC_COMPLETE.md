# 🚀 Guía de Despliegue - Procesamiento Asíncrono Completo

## ✅ Resumen de Cambios

Se implementó **procesamiento asíncrono en 3 niveles**:
1. Frontend → Backend (polling)
2. Backend → Chat Agent (polling)  
3. Chat Agent → Gemini Pro (background task)

**Resultado**: Ahora puedes usar **Gemini 2.5 Pro** sin timeouts ⭐

## 📋 Orden de Despliegue

**IMPORTANTE**: Desplegar en este orden:

### 1. Chat Agent (PRIMERO) ⬅️ Comenzar aquí

```bash
cd chat_agent_service

# Ver cambios
git status

# Agregar archivos modificados
git add main.py Procfile

# Commit
git commit -m "feat: Procesamiento asíncrono con polling para Gemini Pro

- Nuevos endpoints: /start y /status/{task_id}
- Función de procesamiento en background
- Cambio a 1 worker para memoria compartida
- Permite generar reportes con Gemini Pro sin timeout"

# Desplegar a Heroku
git push heroku master

# Ver logs para verificar
heroku logs --tail -a chat-agent-horizon
```

**Verificación Chat Agent:**
```bash
# Debe mostrar:
# [YYYY-MM-DD HH:MM:SS +0000] [XX] [INFO] Booting worker with pid: XX
# [YYYY-MM-DD HH:MM:SS +0000] [XX] [INFO] Starting gunicorn XX.XX.X
# [YYYY-MM-DD HH:MM:SS +0000] [XX] [INFO] Listening at: http://0.0.0.0:XXXX
# [YYYY-MM-DD HH:MM:SS +0000] [XX] [INFO] Using worker: uvicorn.workers.UvicornWorker
```

### 2. Backend (SEGUNDO)

```bash
cd ../mi-proyecto-backend

# Ver cambios
git status

# Agregar archivos modificados
git add services/remote_agent_client.py api/ribbon_router.py Procfile

# Commit
git commit -m "feat: Cliente async para chat agent - Permite Gemini Pro sin timeout

- remote_agent_client hace polling al chat agent
- Cambio a 1 worker para memoria compartida  
- Revertido a usar Gemini Pro (mejor calidad)
- Timeout resuelto con procesamiento async"

# Desplegar a Heroku
git push heroku master

# Ver logs para verificar
heroku logs --tail -a horizon-backend
```

**Verificación Backend:**
```bash
# Debe mostrar lo mismo que chat agent
# Sin errores de sintaxis
```

### 3. Frontend (NO REQUIERE CAMBIOS)

El frontend ya tiene implementado el polling desde antes. Vercel desplegará automáticamente si hiciste push al repositorio principal.

## 🧪 Testing Completo

### Test Rápido desde Terminal

```bash
# 1. Test Chat Agent directo
curl -X POST https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/acciones/generar_informe_portafolio/start \
  -H "Content-Type: application/json" \
  -d '{}'

# Debe devolver: {"task_id":"...","status":"pending",...}
```

```bash
# 2. Espera 3 segundos y consulta estado (reemplaza {task_id})
curl https://chat-agent-horizon-cc5e16d4b37e.herokuapp.com/acciones/generar_informe_portafolio/status/{task_id}

# Debe devolver: {"status":"processing",...}
```

### Test desde el Frontend

1. **Abrir**: https://mi-proyecto-topaz-omega.vercel.app

2. **Ir a**: Sección de Reportes / AI Control Panel

3. **Click en**: "Generar Reporte" (último botón, ícono rojo)

4. **Verificar flujo completo**:
   ```
   T=0s:    Modal se abre
   T=1s:    "Iniciando generación del reporte..."
   T=2s:    "⏳ Generando reporte con IA... Esto puede tomar 1-2 minutos."
   T=3s:    Barra de progreso animada
   T=10s:   Sigue mostrando "⏳ Generando..."
   T=30s:   Sigue mostrando "⏳ Generando..." (sin timeout!)
   T=60s:   Sigue mostrando "⏳ Generando..." (sin timeout!)
   T=75-90s: "✅ Informe generado correctamente"
   T=91s:   Muestra JSON del reporte completo
   ```

5. **Verificar calidad**:
   - El reporte debe ser detallado y profundo
   - Análisis completo de múltiples aspectos
   - Gemini 2.5 Pro genera reportes de mayor calidad

## 📊 Monitoreo de Logs

### Logs del Backend

```bash
heroku logs --tail -a horizon-backend | grep "Reporte"

# Deberías ver:
# INFO:api.ribbon_router:Reporte {uuid} iniciado
# INFO:api.ribbon_router:Reporte {uuid} generado exitosamente
```

### Logs del Chat Agent

```bash
heroku logs --tail -a chat-agent-horizon | grep "generar_informe\|task"

# Deberías ver:
# ✅ Salida estructurada parseada correctamente con gemini-2.5-pro
# (sin errores H12 de timeout)
```

### Logs Combinados (Ventana Separada)

```bash
# Terminal 1: Backend
heroku logs --tail -a horizon-backend

# Terminal 2: Chat Agent  
heroku logs --tail -a chat-agent-horizon

# Luego genera un reporte desde el frontend y observa ambos logs
```

## ❌ Solución de Problemas

### Problema 1: "Tarea no encontrada"

**Síntoma**: `{"detail":"Tarea con ID ... no encontrada"}`

**Causa**: El dyno del chat agent se reinició y perdió la memoria

**Solución**:
1. Es normal después de un redeploy
2. Genera un nuevo reporte
3. Para producción, migrar a Redis/PostgreSQL

### Problema 2: Backend sigue dando 503

**Síntoma**: Error 503 al generar reporte

**Causa**: Chat agent no desplegado correctamente

**Solución**:
```bash
# Verificar estado del chat agent
heroku ps -a chat-agent-horizon

# Debe mostrar: web.1: up YYYY/MM/DD HH:MM:SS

# Si está down:
heroku restart -a chat-agent-horizon
heroku logs --tail -a chat-agent-horizon
```

### Problema 3: "Timeout esperando resultado"

**Síntoma**: Error después de 3 minutos

**Causa**: El reporte tomó más de 3 minutos o hay un error

**Solución**:
```bash
# Ver logs del chat agent
heroku logs -a chat-agent-horizon --num 200 | grep "error\|ERROR"

# Si ves errores de Gemini API:
# - Verifica que GOOGLE_API_KEY esté configurada
# - Verifica créditos de la API
```

### Problema 4: Frontend sigue mostrando "Failed to fetch"

**Síntoma**: Error al hacer click en "Generar Reporte"

**Causa**: Backend no desplegado o CORS

**Solución**:
```bash
# Verificar que el backend esté up
curl https://horizon-backend-316b23e32b8b.herokuapp.com/health

# Verificar variable CLIENT_ORIGIN
heroku config:get CLIENT_ORIGIN -a horizon-backend
# Debe devolver: https://mi-proyecto-topaz-omega.vercel.app
```

## 🎉 Checklist Final

Antes de dar por terminado, verifica:

### Chat Agent
- [ ] Desplegado sin errores
- [ ] Dyno en estado "up"
- [ ] Endpoint `/start` responde con task_id
- [ ] Endpoint `/status/{id}` responde correctamente
- [ ] Logs muestran "✅ Salida estructurada parseada..."
- [ ] SIN errores H12 (timeout)

### Backend
- [ ] Desplegado sin errores
- [ ] Dyno en estado "up"
- [ ] Endpoint `/custom-report/start` responde con report_id
- [ ] Endpoint `/custom-report/status/{id}` responde correctamente
- [ ] Logs muestran "Reporte {id} iniciado"
- [ ] Logs muestran "Reporte {id} generado exitosamente"

### Frontend
- [ ] Botón "Generar Reporte" funciona
- [ ] Modal se abre inmediatamente
- [ ] Muestra mensajes de progreso
- [ ] Barra de progreso se anima
- [ ] NO muestra "Failed to fetch"
- [ ] Después de 60-90s muestra "✅ Informe generado"
- [ ] Muestra JSON del reporte completo

### Integración End-to-End
- [ ] Reporte se genera completamente
- [ ] Calidad del reporte es alta (Gemini Pro)
- [ ] No hay timeouts en ningún nivel
- [ ] Proceso toma entre 60-90 segundos total
- [ ] Usuario ve feedback en tiempo real

## 📚 Documentación

- **Técnica completa**: `ASYNC_COMPLETE_IMPLEMENTATION.md`
- **Problema original**: `REPORTE_TIMEOUT_SOLUTION.md`
- **Implementación frontend**: `ASYNC_REPORT_IMPLEMENTATION.md`
- **Esta guía**: `DEPLOY_ASYNC_COMPLETE.md`

---

**¿Todo listo?** ✅ Si todos los checks están marcados, ¡la implementación está completa!

**Siguiente paso**: Disfrutar de reportes de alta calidad con Gemini 2.5 Pro sin timeouts 🎉
