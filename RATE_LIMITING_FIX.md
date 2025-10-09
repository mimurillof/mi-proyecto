# ✅ Solución a Rate Limiting y Optimización del Sistema

## 🎯 Problemas Resueltos

### 1. ❌ FutureWarning de Pandas
**Problema**: `Passing literal html to 'read_html' is deprecated`

**Solución**: Se corrigió usando `StringIO`:
```python
from io import StringIO
tables = pd.read_html(StringIO(response.text))
```

### 2. ❌ Rate Limiting de Yahoo Finance
**Problema**: Demasiadas peticiones simultáneas causaban errores `Too Many Requests`

**Soluciones aplicadas**:
- ✅ Cache de 15 minutos para market movers
- ✅ Delays entre peticiones (0.2-0.5 segundos)
- ✅ Reducción de llamadas duplicadas a yfinance
- ✅ Cache mejorado en `get_stock_info` y `get_weekly_performance`

### 3. ❌ Lógica de Actualización Incorrecta
**Problema**: El backend hacía demasiadas llamadas al Portfolio Manager

**Solución**: Sistema de actualización controlada cada 15 minutos

## 📋 Nueva Arquitectura

### Flujo de Datos

```
┌─────────────────┐
│   Frontend      │
│  (React/Vite)   │
└────────┬────────┘
         │ GET /api/portfolio-manager/market
         │ GET /api/portfolio-manager/report
         ▼
┌─────────────────────────┐
│  Backend (FastAPI)       │
│  Puerto: 8000           │
│  - Cache: 15 min        │
│  - Lee: portfolio_data.json │
└────────┬────────────────┘
         │ POST /process/user_id (cada 15 min)
         │ GET /market
         │ GET /report
         ▼
┌──────────────────────────────┐
│ Portfolio Manager Service     │
│ Puerto: 9000                  │
│ - Web Scraping (Yahoo)        │
│ - yfinance API                │
│ - Generación de JSON          │
│ - Cache de market movers: 15 min │
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│  portfolio_data.json          │
│  - Datos persistidos          │
│  - Market overview            │
│  - Portfolio summary          │
└──────────────────────────────┘
```

## 🚀 Cómo Usar el Sistema

### 1. Iniciar Portfolio Manager Service (Puerto 9000)

**Windows**:
```bash
cd "Portfolio manager"
start_service.bat
```

**Linux/Mac**:
```bash
cd "Portfolio manager"
chmod +x start_service.sh
./start_service.sh
```

**Manual**:
```bash
cd "Portfolio manager"
python -m uvicorn api_service:app --host 0.0.0.0 --port 9000 --reload
```

### 2. Iniciar Backend (Puerto 8000)

```bash
cd mi-proyecto-backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Iniciar Frontend (Puerto 5173)

```bash
npm run dev
```

## ⏱️ Sistema de Actualización

### Primera Carga de la Página

1. Frontend carga → Llama a `/api/portfolio-manager/market`
2. Backend verifica cache:
   - **Si NO hay cache** O **pasaron > 15 min**: Llama a Portfolio Manager Service
   - **Si hay cache reciente** (<15 min): Devuelve datos cacheados
3. Portfolio Manager Service:
   - Ejecuta `generate_full_report()`
   - Hace web scraping (con delays)
   - Obtiene datos de yfinance (con cache)
   - Guarda `portfolio_data.json`
   - Devuelve datos al Backend
4. Backend cachea la respuesta por 15 minutos
5. Frontend muestra los datos

### Actualizaciones Posteriores

- **Intervalo**: 15 minutos (solo durante horario de mercado)
- **Trigger**: Primera petición después de que expire el cache
- **Cache**: Backend mantiene datos por 15 minutos
- **Scraping**: Yahoo Finance con cache de 15 minutos

## 📊 Variables de Entorno

### Backend (`.env`)

```env
# Portfolio Manager Service
PORTFOLIO_MANAGER_ENABLED=true
PORTFOLIO_MANAGER_SERVICE_URL=http://localhost:9000
PORTFOLIO_MANAGER_TIMEOUT=60
PORTFOLIO_MANAGER_REFRESH_MINUTES=15  # Forzado a 15 min en el código
PORTFOLIO_MANAGER_DEFAULT_PERIOD=6mo
PORTFOLIO_MANAGER_DEFAULT_USER_ID=default
```

## 🔧 Optimizaciones Implementadas

### 1. Cache en DataFetcher
```python
# Cache de 15 minutos para market movers
self._market_movers_cache_time = datetime.utcnow()

# Cache en get_stock_info
cache_key = f"stock_info_{symbol}"
if cache_key in self.cache:
    return self.cache[cache_key]
```

### 2. Delays para Evitar Rate Limiting
```python
# En watchlist
if idx > 0:
    time.sleep(0.3)

# En market movers
if idx > 0:
    time.sleep(0.2)

# En scraping
time.sleep(0.5)
```

### 3. Límite de Elementos Procesados
```python
# Solo top_n elementos para reducir llamadas
for idx, (_, row) in enumerate(table.head(top_n).iterrows()):
    # Procesar solo top_n (default: 10)
```

## 📁 Archivos Modificados

### Portfolio Manager
1. **`data_fetcher.py`**
   - ✅ Corregido FutureWarning con StringIO
   - ✅ Agregado delay en `get_market_movers`
   - ✅ Cache mejorado en `get_stock_info`
   - ✅ Importado `time`

2. **`portfolio_calculator.py`**
   - ✅ Delays progresivos en watchlist
   - ✅ Delays en market movers
   - ✅ Importado `time`

3. **`api_service.py`** (NUEVO)
   - ✅ FastAPI service en puerto 9000
   - ✅ Endpoints: `/process`, `/market`, `/summary`, `/report`, `/charts`

4. **`start_service.bat`** y **`start_service.sh`** (NUEVO)
   - ✅ Scripts para iniciar el servicio

### Backend
5. **`services/portfolio_manager_service.py`**
   - ✅ Intervalo forzado a 15 minutos
   - ✅ Captura del flag `persisted`
   - ✅ Logging mejorado

## 🧪 Pruebas

### Probar el Portfolio Manager Service

```bash
# 1. Iniciar el servicio
cd "Portfolio manager"
python -m uvicorn api_service:app --host 0.0.0.0 --port 9000

# 2. Health check
curl http://localhost:9000/health

# 3. Generar reporte
curl -X POST http://localhost:9000/process/default?period=6mo

# 4. Obtener market overview
curl http://localhost:9000/market

# 5. Obtener gráfico
curl http://localhost:9000/charts/portfolio
```

### Probar el Backend

```bash
# Con Portfolio Manager Service corriendo
curl http://localhost:8000/api/portfolio-manager/market
curl http://localhost:8000/api/portfolio-manager/report?period=6mo
```

## ⚙️ Configuración Recomendada

### Para Desarrollo
- **Cache**: 15 minutos
- **Top N movers**: 10 (configurable en `top_n`)
- **Delays**: 0.2-0.5 segundos entre peticiones
- **Timeout**: 60 segundos

### Para Producción
- **Cache**: 15 minutos (horario de mercado)
- **Top N movers**: 5-10
- **Delays**: 0.5-1 segundo (más conservador)
- **Timeout**: 90 segundos
- **Monitoring**: Logs de rate limiting

## 📈 Mejoras Futuras (Opcional)

1. **Redis Cache**: Usar Redis en lugar de cache en memoria
2. **Scheduler**: Usar APScheduler para updates programados
3. **WebSockets**: Push updates en tiempo real al frontend
4. **Rate Limiter**: Implementar rate limiter en el servicio
5. **Health Checks**: Monitoring automático del servicio

## ⚠️ Notas Importantes

1. **Horario de Mercado**: El sistema se actualiza cada 15 minutos solo cuando hay peticiones
2. **Rate Limiting**: Los delays son críticos - NO reducir
3. **Cache**: Los 15 minutos de cache son obligatorios para evitar bloqueos
4. **Scraping**: Yahoo Finance puede cambiar su estructura HTML - monitorear errores
5. **yfinance**: Tiene sus propios límites - el cache ayuda a evitarlos

---

**Última actualización**: 2025-10-06  
**Estado**: ✅ Optimizado y funcionando

