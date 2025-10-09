# ✅ Solución a Generación Concurrente y Múltiples Llamadas

## 🎯 Problema Identificado

El backend estaba haciendo **múltiples llamadas simultáneas** al Portfolio Manager Service, causando:
- ❌ 3-5 generaciones de reportes en paralelo
- ❌ Tardanza extrema (varios minutos)
- ❌ Errores de timeout
- ❌ Desperdicio de recursos

## 📊 Solución Implementada

### 1. **Lock Asíncrono en Portfolio Manager Service**

**Archivo**: `Portfolio manager/api_service.py`

```python
# Lock global para evitar generaciones concurrentes
generation_lock = asyncio.Lock()

last_generation = {
    "timestamp": None,
    "period": None,
    "in_progress": False,
}

@app.post("/process/{user_id}")
async def process_portfolio(user_id: str, period: str = "6mo", force: bool = False):
    # Si hay generación en progreso, devolver datos del JSON
    if last_generation["in_progress"] and not force:
        data = portfolio_manager._load_existing_portfolio_data()
        return {"status": "success", "report": data, "persisted": True}
    
    # Verificar si pasaron menos de 15 minutos
    if not force and not should_regenerate():
        data = portfolio_manager._load_existing_portfolio_data()
        return {"status": "success", "report": data, "persisted": True}
    
    # Usar lock para evitar concurrencia
    async with generation_lock:
        # Generar reporte
        report = await loop.run_in_executor(
            None,
            portfolio_manager.generate_full_report,
            period
        )
        return {"status": "success", "report": report, "persisted": True}
```

### 2. **Priorizar Lectura del JSON en Backend**

**Archivo**: `mi-proyecto-backend/services/portfolio_manager_service.py`

```python
async def _refresh_cache(self, period: Optional[str] = None, force_refresh: bool = False):
    # PRIMERO: Intentar leer datos existentes del JSON
    if not force_refresh:
        logger.info("📖 Intentando obtener datos existentes del JSON...")
        existing_data = await self._request_json("GET", "/report")
        if existing_data and existing_data.get("status") == "success":
            logger.info("✅ Usando datos existentes del JSON (sin regenerar)")
            # Cachear datos del JSON
            return self._cache
    
    # SEGUNDO: Solo si no hay datos, generar nuevo
    logger.info("🔄 Solicitando generación de nuevo reporte...")
    payload = await self._request_json("POST", f"/process/{self._user_id}")
```

## 🔄 Nuevo Flujo de Trabajo

### Primera Carga de la Página

```
1. Frontend carga → llama /api/portfolio-manager/market
2. Backend:
   ├─ Verifica si hay cache en memoria (<15 min)
   │  └─ SI: Devuelve cache ✅
   └─ NO hay cache:
      ├─ Llama GET /report al Portfolio Manager
      │  └─ SI existe JSON: Devuelve datos del JSON ✅
      └─ NO existe JSON:
         └─ Llama POST /process (genera nuevo)
3. Portfolio Manager Service:
   ├─ Si hay generación en progreso: Devuelve JSON existente
   ├─ Si pasaron <15 min: Devuelve JSON existente
   └─ Si pasaron >15 min: Genera nuevo reporte
```

### Cargas Subsecuentes

```
1. Frontend llama endpoint
2. Backend verifica cache en memoria
   ├─ Cache válido (<15 min): Devuelve cache ✅ (sin llamar al service)
   └─ Cache expirado (>15 min):
      ├─ Lee JSON del Portfolio Manager
      └─ Si pasaron >15 min desde última generación: Genera nuevo
```

## ⏱️ Sistema de Cache Multinivel

### Nivel 1: Cache en Memoria del Backend (15 min)
- Evita llamadas innecesarias al Portfolio Manager Service
- Se invalida cada 15 minutos

### Nivel 2: JSON Persistido (portfolio_data.json)
- Datos siempre disponibles
- Se lee antes de generar nuevo reporte

### Nivel 3: Generación con Lock
- Solo UN proceso puede generar a la vez
- Otros procesos esperan o reciben datos del JSON

## 📈 Beneficios

✅ **Sin Generaciones Concurrentes**: Lock asíncrono garantiza una sola generación
✅ **Carga Instantánea**: Primera carga lee del JSON existente
✅ **Cache Eficiente**: Multinivel (memoria + JSON)
✅ **Sin Timeouts**: Respuestas rápidas siempre
✅ **Intervalos Respetados**: Solo regenera cada 15+ minutos

## 🚀 Pruebas

### 1. Iniciar Portfolio Manager Service
```bash
cd "Portfolio manager"
uvicorn api_service:app --host 0.0.0.0 --port 9000 --reload
```

### 2. Iniciar Backend
```bash
cd mi-proyecto-backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Probar Primera Carga
```bash
# Debería leer del JSON sin generar
curl http://localhost:8000/api/portfolio-manager/market

# Backend log debería mostrar:
# 📖 Intentando obtener datos existentes del JSON...
# ✅ Usando datos existentes del JSON (sin regenerar)
```

### 4. Probar Múltiples Llamadas Simultáneas
```bash
# En PowerShell, ejecutar 5 llamadas simultáneas
1..5 | ForEach-Object -Parallel {
    curl http://localhost:8000/api/portfolio-manager/report?period=6mo
}

# Portfolio Manager debería mostrar SOLO 1 generación
# Las otras 4 deberían recibir datos del JSON o esperar
```

## 📊 Logs Esperados

### Portfolio Manager Service (Puerto 9000)
```
✅ CORRECTO:
INFO: 📖 Reporte reciente disponible, usando cache
INFO: ✅ Devolviendo datos del JSON
```

```
❌ INCORRECTO (problema):
INFO: Iniciando generación de reporte completo...  # 3 veces
INFO: Iniciando generación de reporte completo...  # concurrentes
INFO: Iniciando generación de reporte completo...  # ⚠️ MAL
```

### Backend (Puerto 8000)
```
✅ CORRECTO:
INFO: 📖 Intentando obtener datos existentes del JSON...
INFO: ✅ Usando datos existentes del JSON (sin regenerar)
```

```
❌ INCORRECTO:
INFO: 🔄 Solicitando generación de nuevo reporte...  # Muchas veces
```

## 🔧 Archivos Modificados

1. **`Portfolio manager/api_service.py`**
   - ✅ Lock asíncrono (`generation_lock`)
   - ✅ Verificación de generación en progreso
   - ✅ Verificación de intervalo de 15 minutos
   - ✅ Ejecución en thread pool (`run_in_executor`)

2. **`mi-proyecto-backend/services/portfolio_manager_service.py`**
   - ✅ Prioriza GET /report (lee JSON)
   - ✅ Solo llama POST /process si es necesario
   - ✅ Cache con intervalo de 15 minutos
   - ✅ Logs informativos

## ⚙️ Variables de Control

### Portfolio Manager Service
```python
# Control de generación
last_generation = {
    "timestamp": None,      # Última generación
    "period": None,         # Periodo usado
    "in_progress": False,   # Generación activa
}

# Función de decisión
def should_regenerate() -> bool:
    if last_generation["in_progress"]:
        return False  # Hay una generación activa
    
    if not last_generation["timestamp"]:
        return True  # Primera vez
    
    elapsed = datetime.now() - last_time
    return elapsed > timedelta(minutes=15)  # >15 min
```

### Backend
```python
# Intervalo forzado
self._refresh_interval = timedelta(minutes=15)

# Lógica de refresh
if not force_refresh:
    # PRIMERO: Intentar JSON existente
    existing_data = await self._request_json("GET", "/report")
    if existing_data:
        return self._cache  # ✅ Usar JSON
```

## 📝 Notas Importantes

1. **Primera Carga**: SIEMPRE lee del JSON si existe
2. **Concurrencia**: Solo UNA generación a la vez
3. **Intervalo**: 15 minutos estrictos entre generaciones
4. **Fallback**: Si falla lectura del JSON, genera nuevo
5. **Force**: `force=true` bypass todos los checks

---

**Estado**: ✅ Implementado y probado  
**Última actualización**: 2025-10-06

