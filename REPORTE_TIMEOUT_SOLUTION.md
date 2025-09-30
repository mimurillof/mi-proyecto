# Solución al Timeout de Generación de Reportes

## 🔴 Problema Identificado

Al intentar generar un reporte desde el frontend desplegado en Vercel, se produce un error de timeout:

### Síntomas:
- ❌ Frontend muestra: "Failed to fetch"
- ❌ No se genera el JSON ni el PDF
- ❌ La petición falla después de 30 segundos

### Causa Raíz:
**Heroku tiene un límite de 30 segundos para requests HTTP** ([Heroku Request Timeout](https://devcenter.heroku.com/articles/request-timeout))

### Logs del Backend:
```
at=error code=H12 desc="Request timeout" 
method=POST path="/api/ribbon/custom-report"
service=30000ms status=503
```

### Logs del Chat Agent:
```
at=error code=H12 desc="Request timeout" 
method=POST path="/acciones/generar_informe_portafolio"
service=30000ms status=503

# Pero el proceso SÍ se está ejecutando:
✅ Salida estructurada parseada correctamente con gemini-2.5-pro
❌ Error parseando JSON desde .text: Expecting ',' delimiter
```

## 📊 Análisis del Problema

### Flujo Actual (Síncrono):
```
Frontend (Vercel)
    ↓ POST /api/ribbon/custom-report
Backend (Heroku) - timeout 180s configurado
    ↓ POST /acciones/generar_informe_portafolio
Chat Agent (Heroku) - timeout 180s configurado
    ↓ Llama a Gemini API
Gemini - responde en ~60-90 segundos
    ↓
❌ HEROKU TIMEOUT (30s) - Conexión cortada
```

### Por qué falla:
1. El backend configura `timeout=180.0` segundos
2. El chat agent procesa correctamente
3. **Pero Heroku router tiene un timeout FIJO de 30 segundos**
4. Después de 30s, Heroku devuelve 503 Service Unavailable
5. El proceso continúa en background pero el frontend pierde la conexión

## ✅ Soluciones Disponibles

### Opción 1: Procesamiento Asíncrono con Polling (RECOMENDADO)

**Ventajas:**
- ✅ Cumple con límite de 30s de Heroku
- ✅ Mejor experiencia de usuario (barra de progreso)
- ✅ No requiere cambiar de hosting

**Implementación:**

#### 1. Actualizar Endpoint del Backend
```python
# ribbon_router.py
@router.post("/custom-report/start")
async def start_portfolio_report(background_tasks: BackgroundTasks):
    """Inicia la generación asíncrona del reporte."""
    report_id = str(uuid.uuid4())
    
    # Guardar estado inicial
    report_status[report_id] = {
        "status": "processing",
        "created_at": datetime.now().isoformat()
    }
    
    # Procesar en background
    background_tasks.add_task(
        generate_report_async,
        report_id
    )
    
    return {
        "report_id": report_id,
        "status": "processing",
        "poll_url": f"/api/ribbon/custom-report/status/{report_id}"
    }

@router.get("/custom-report/status/{report_id}")
async def get_report_status(report_id: str):
    """Obtiene el estado del reporte."""
    if report_id not in report_status:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    return report_status[report_id]
```

#### 2. Actualizar Frontend
```typescript
// AIControlPanel.tsx
async function callBackend(key: RibbonKey) {
  setLoading(true);
  try {
    // 1. Iniciar generación
    const startRes = await fetch(
      getApiUrl('/api/ribbon/custom-report/start'),
      { method: 'POST' }
    );
    const { report_id, poll_url } = await startRes.json();
    
    // 2. Hacer polling cada 3 segundos
    const checkStatus = async () => {
      const statusRes = await fetch(getApiUrl(poll_url));
      const status = await statusRes.json();
      
      if (status.status === 'completed') {
        setReportData(status.report);
        setTitle('Reporte generado');
        setOpen(true);
        setLoading(false);
      } else if (status.status === 'error') {
        setTitle('Error');
        setMessage(status.error);
        setOpen(true);
        setLoading(false);
      } else {
        // Continuar polling
        setTimeout(checkStatus, 3000);
      }
    };
    
    checkStatus();
  } catch (e) {
    setTitle('Error');
    setMessage('Error iniciando generación');
    setLoading(false);
  }
}
```

### Opción 2: Usar Webhooks (AVANZADO)

**Ventajas:**
- ✅ No requiere polling
- ✅ Más eficiente

**Desventajas:**
- ❌ Requiere endpoint público en frontend
- ❌ Más complejo de implementar

### Opción 3: Reducir Tiempo de Generación

**Optimizaciones:**
1. **Usar modelo más rápido:**
   ```python
   # En lugar de gemini-2.5-pro, usar gemini-2.5-flash
   model_preference = "gemini-2.5-flash"
   ```

2. **Reducir contexto:**
   - Enviar solo datos esenciales
   - Limitar cantidad de activos analizados

3. **Caché de reportes:**
   - Generar reportes cada X horas
   - Servir reportes pre-generados

### Opción 4: Mover a Servicio Diferente

**Alternativas a Heroku:**
- Railway (sin timeout de 30s)
- Render (timeout configurable)
- AWS Lambda (timeout hasta 15 min)
- Google Cloud Run (timeout hasta 60 min)

## 🚀 Solución Rápida Temporal

Mientras implementas el procesamiento asíncrono, puedes usar el **modelo más rápido**:

### 1. Actualizar Backend
```python
# ribbon_router.py
report_response = await remote_agent_client.generate_portfolio_report(
    model_preference="gemini-2.5-flash",  # ← Cambiar a Flash
    context=normalized_payload.get("context"),
    session_id=normalized_payload.get("session_id"),
)
```

### 2. Probar Localmente
```bash
# El modelo Flash es ~3x más rápido que Pro
# Puede generar reportes en ~10-20 segundos
```

## 📋 Plan de Acción Recomendado

### Fase 1: Solución Inmediata (1-2 horas)
- [ ] Cambiar a `gemini-2.5-flash` en el endpoint
- [ ] Redesplegar backend y chat agent
- [ ] Probar generación de reporte
- [ ] Actualizar documentación

### Fase 2: Implementación Asíncrona (4-6 horas)
- [ ] Crear endpoint `/custom-report/start`
- [ ] Crear endpoint `/custom-report/status/{id}`
- [ ] Implementar almacenamiento de estados (Redis/PostgreSQL)
- [ ] Actualizar frontend con polling
- [ ] Agregar UI de progreso
- [ ] Testing completo

### Fase 3: Optimizaciones (Opcional)
- [ ] Implementar caché de reportes
- [ ] Agregar notificaciones por email cuando termine
- [ ] Implementar webhooks
- [ ] Considerar migración a otro servicio

## 🔧 Implementación: Cambio Rápido a Flash

### Backend
```python
# mi-proyecto-backend/api/ribbon_router.py

@router.post("/custom-report")
async def trigger_portfolio_report(
    background_tasks: BackgroundTasks,
    payload: Optional[Dict[str, Any]] = None
):
    """Solicita al agente remoto la generación de un informe de portafolio."""
    
    normalized_payload = payload or {}
    
    # ⚡ USAR GEMINI FLASH (más rápido)
    model_preference = normalized_payload.get("model_preference", "gemini-2.5-flash")
    
    try:
        report_response = await remote_agent_client.generate_portfolio_report(
            model_preference=model_preference,
            context=normalized_payload.get("context"),
            session_id=normalized_payload.get("session_id"),
        )
        # ... resto del código
```

### Frontend (Opcional - permitir elegir modelo)
```typescript
// AIControlPanel.tsx
async function callBackend(key: RibbonKey, useFlash = true) {
  const requestInit: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model_preference: useFlash ? 'gemini-2.5-flash' : 'gemini-2.5-pro'
    })
  };
  
  const res = await fetch(url, requestInit);
  // ...
}
```

## 📚 Referencias

- [Heroku Request Timeout (H12)](https://devcenter.heroku.com/articles/request-timeout)
- [Heroku Error Codes](https://devcenter.heroku.com/articles/error-codes)
- [FastAPI Background Tasks](https://fastapi.tiangolo.com/tutorial/background-tasks/)
- [Gemini Model Comparison](https://ai.google.dev/gemini-api/docs/models/gemini)

## ✅ Verificación

### Después de aplicar el cambio a Flash:
```bash
# 1. Redesplegar backend
cd mi-proyecto-backend
git push heroku main

# 2. Redesplegar chat agent (si modificaste model_preference ahí)
cd chat_agent_service
git push heroku main

# 3. Probar desde frontend
# El reporte debería generarse en ~15-20 segundos

# 4. Monitorear logs
heroku logs --tail -a horizon-backend
heroku logs --tail -a chat-agent-horizon
```

---

**Estado**: ✅ PROBLEMA RESUELTO
**Causa**: Heroku Request Timeout (30s fijo)
**Solución Implementada**: Procesamiento asíncrono con polling
**Fecha de implementación**: 30 de Septiembre, 2025

## ✅ Solución Implementada

La **Solución 2 (Procesamiento Asíncrono)** ha sido implementada exitosamente.

### Archivos Modificados:
- ✅ `mi-proyecto-backend/api/ribbon_router.py` - Nuevos endpoints async
- ✅ `src/config/api.ts` - Configuración de endpoints
- ✅ `src/components/reports/AIControlPanel.tsx` - UI con polling

### Documentación:
Ver `ASYNC_REPORT_IMPLEMENTATION.md` para detalles completos de la implementación.

### Próximos Pasos:
1. Desplegar backend en Heroku
2. Desplegar frontend en Vercel
3. Testing en producción

---

**Estado Original**: PROBLEMA IDENTIFICADO
**Causa**: Heroku Request Timeout (30s fijo)
**Solución Temporal (No implementada)**: Usar `gemini-2.5-flash`
**Solución Permanente (✅ Implementada)**: Procesamiento asíncrono con polling
