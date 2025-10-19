# 🚧 Portfolio Manager - Migración Multiusuario PENDIENTE

## ❌ **PROBLEMA IDENTIFICADO**

El servicio `portfolio_manager_service.py` **NO está adaptado** para la arquitectura multiusuario:

### Rutas Hardcodeadas

```python
# Líneas 55-58 en portfolio_manager_service.py
data_prefix_candidate = getattr(settings, "SUPABASE_PORTFOLIO_DATA_PREFIX", None) or "Informes"
charts_prefix_candidate = getattr(settings, "SUPABASE_PORTFOLIO_CHARTS_PREFIX", None) or (settings.SUPABASE_BASE_PREFIX or "Graficos")
```

Esto resulta en rutas como:
- ❌ `Informes/portfolio_data.json`
- ❌ `Graficos/portfolio_chart.html`

En lugar de:
- ✅ `{user_id}/portfolio_data.json`
- ✅ `{user_id}/portfolio_chart.html`

### Arquitectura Singleton

El servicio usa un patrón **Singleton** (`portfolio_runtime`) que mantiene un solo estado en memoria:

```python
# Línea 11 en portfolio_manager_router.py
from services.portfolio_manager_service import portfolio_runtime
```

Esto significa que:
- ❌ Todos los usuarios comparten el mismo caché
- ❌ No hay aislamiento de datos por usuario
- ❌ Los endpoints no reciben `user_id`

---

## 🔧 **SOLUCIÓN REQUERIDA**

### Opción 1: Refactorización Completa (RECOMENDADA - 2-3 horas)

#### 1. Modificar `PortfolioManagerClient.__init__()`

```python
class PortfolioManagerClient:
    """Cliente que entrega datos del Portfolio Manager leyendo el JSON en disco."""

    def __init__(self, user_id: str) -> None:  # ✅ Agregar user_id
        self._user_id = user_id
        self._enabled = settings.PORTFOLIO_MANAGER_ENABLED
        # ...
        
        # ✅ Eliminar prefijos hardcodeados
        # self._supabase_data_prefix = "Informes"  # ❌ ELIMINAR
        # self._supabase_charts_prefix = "Graficos"  # ❌ ELIMINAR
```

#### 2. Actualizar `_build_supabase_path()`

```python
def _build_supabase_path(self, filename: str) -> str:
    """Construye la ruta de Supabase usando user_id."""
    return f"{self._user_id}/{filename}"
```

#### 3. Actualizar métodos que usan Supabase

```python
async def _load_from_supabase(self) -> Optional[Dict[str, Any]]:
    """Carga datos desde Supabase para el usuario específico."""
    if not self._supabase_enabled or not self._supabase_service:
        return None
    
    # ✅ Nueva ruta con user_id
    dashboard_path = f"{self._user_id}/portfolio_data.json"
    
    try:
        content = await self._supabase_service.read_report_json(self._user_id, "portfolio_data.json")
        # ...
```

#### 4. Convertir Singleton a Factory Pattern

```python
# En portfolio_manager_service.py

# ❌ ELIMINAR
# portfolio_runtime = PortfolioManagerClient()

# ✅ AGREGAR
def get_portfolio_manager_client(user_id: str) -> PortfolioManagerClient:
    """Factory para crear cliente por usuario."""
    return PortfolioManagerClient(user_id)
```

#### 5. Actualizar Router con Autenticación

```python
# En portfolio_manager_router.py
from auth.dependencies import get_current_user
from db_models.models import User
from services.portfolio_manager_service import get_portfolio_manager_client

@router.get("/report")
async def get_portfolio_report(
    current_user: User = Depends(get_current_user),  # ✅ Autenticación
    period: Optional[str] = Query(None),
    refresh: bool = Query(False),
):
    """Devuelve el reporte del portafolio del usuario autenticado."""
    user_id = str(current_user.id)
    client = get_portfolio_manager_client(user_id)  # ✅ Cliente por usuario
    
    data = await client.get_report(period=period, force_refresh=refresh)
    # ...
```

#### 6. Actualizar TODOS los endpoints del router

- ✅ `/api/portfolio-manager/report`
- ✅ `/api/portfolio-manager/summary`
- ✅ `/api/portfolio-manager/market`
- ✅ `/api/portfolio-manager/charts/{chart_name}`
- ✅ `/api/portfolio-manager/watch`

### Opción 2: Bypass Temporal (NO RECOMENDADO - Solo para testing)

Eliminar temporalmente la autenticación de los endpoints que ya tienen `Depends(get_current_user)` para que la aplicación funcione con datos compartidos.

**⚠️ ADVERTENCIA:** Esto NO es seguro ni escalable. Solo usar para desarrollo/testing local.

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### Backend
- [ ] Modificar `PortfolioManagerClient.__init__()` para aceptar `user_id`
- [ ] Eliminar `_supabase_data_prefix` y `_supabase_charts_prefix`
- [ ] Actualizar `_build_supabase_path()` para usar `{user_id}/`
- [ ] Actualizar `_load_from_supabase()` para usar nuevas rutas
- [ ] Actualizar `get_chart()` para buscar en `{user_id}/`
- [ ] Actualizar `_list_asset_files()` para buscar en `{user_id}/assets/`
- [ ] Convertir singleton `portfolio_runtime` a factory pattern
- [ ] Actualizar router con `Depends(get_current_user)`
- [ ] Actualizar TODOS los endpoints para pasar `user_id` al cliente

### Testing
- [ ] Crear 2 usuarios de prueba
- [ ] Subir `portfolio_data.json` a `portfolio-files/1/`
- [ ] Subir `portfolio_data.json` a `portfolio-files/2/`
- [ ] Verificar que cada usuario ve sus propios datos
- [ ] Verificar que Usuario 1 NO puede acceder a datos de Usuario 2

---

## 🚀 **PRÓXIMOS PASOS**

1. **Inmediato (para que funcione ahora):**
   - ✅ Frontend ya está actualizado con autenticación
   - ⏳ Crear usuarios de prueba en la base de datos
   - ⏳ Subir archivos de muestra a `portfolio-files/{user_id}/`
   
2. **Siguiente Sprint:**
   - Implementar Opción 1 completa (2-3 horas)
   - Testing exhaustivo de aislamiento de datos
   - Configurar RLS en Supabase Storage

---

## 📊 **IMPACTO**

### Endpoints Afectados (requieren refactorización):
- `/api/portfolio-manager/report`
- `/api/portfolio-manager/summary`
- `/api/portfolio-manager/market`
- `/api/portfolio-manager/charts/{chart_name}`
- `/api/portfolio-manager/watch`

### Endpoints NO Afectados (ya multiusuario):
- ✅ `/api/home/dashboard`
- ✅ `/api/portfolio/live-metrics`
- ✅ `/api/portfolio/charts/{chart_name}`
- ✅ `/api/portfolio/signed-url/{filename}`

---

## 💡 **ALTERNATIVA RÁPIDA: DESHABILITAR PORTFOLIO MANAGER**

Si el Portfolio Manager NO es crítico ahora, puedes deshabilitarlo temporalmente:

```python
# En .env
PORTFOLIO_MANAGER_ENABLED=False
```

Esto hará que los endpoints retornen:
```json
{
  "enabled": false,
  "message": "El servicio de Portfolio Manager está deshabilitado"
}
```

Y la aplicación funcionará sin errores 503, solo mostrando que el servicio está deshabilitado.

---

**Fecha de creación:** 18 de octubre de 2025  
**Estado:** 🔴 PENDIENTE  
**Prioridad:** ALTA (si Portfolio Manager es crítico) / MEDIA (si no es esencial)
