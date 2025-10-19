# ✅ Analizer Router - Autenticación Implementada

**Fecha:** 18 de octubre de 2025  
**Objetivo:** Eliminar rutas hardcodeadas `Graficos/` y agregar autenticación por usuario

---

## 🎯 **PROBLEMA IDENTIFICADO**

### **Errores en Logs:**
```
INFO:httpx:HTTP Request: GET .../Graficos/portfolio_growth.html "HTTP/2 400 Bad Request"
⚠️ Error Supabase para portfolio_growth_interactive.html: {'statusCode': 404, 'error': not_found, 'message': Object not found}
INFO: 127.0.0.1:61676 - "GET /api/analizer/file/portfolio_growth_interactive.html HTTP/1.1" 404 Not Found
```

### **Causa Raíz:**
- **Endpoint `/api/analizer/file/{filename}` usaba ruta hardcodeada:** `f"Graficos/{filename}"`
- **Sin autenticación:** Cualquiera podía acceder a los gráficos
- **Sin aislamiento de usuarios:** Todos compartían la misma carpeta `Graficos/`

---

## ✅ **SOLUCIÓN IMPLEMENTADA**

### **1. Backend: Autenticación con Token en Query String**

#### **auth/dependencies.py - Nueva función**
```python
async def get_current_user_from_query(
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from query parameter (for iframes)"""
    if not token:
        raise HTTPException(status_code=401, detail="Token de autenticación requerido")
    
    email = verify_token(token)
    if email is None:
        raise create_credentials_exception()
    
    user = await user_crud.get_user_by_email(db, email=email)
    if user is None:
        raise create_credentials_exception()
    
    return user
```

**Razón:** Los iframes **NO pueden enviar headers HTTP**, por lo que el token debe ir en la URL.

---

#### **api/analizer_router.py - Endpoint autenticado**

**❌ ANTES:**
```python
@router.get("/file/{filename}")
async def get_file(filename: str):
    # Sin autenticación
    file_path = f"Graficos/{supabase_filename}"  # ❌ Hardcoded
```

**✅ AHORA:**
```python
@router.get("/file/{filename}")
async def get_file(
    filename: str,
    current_user: User = Depends(get_current_user_from_query),  # ✅ Auth obligatoria
):
    user_id = str(current_user.id)
    logger.info("Sirviendo archivo %s para user_id=%s", filename, user_id)
    
    # Construir ruta con user_id
    file_path = f"{user_id}/{supabase_filename}"  # ✅ Por usuario
    
    logger.info("Descargando desde Supabase: %s", file_path)
    response = supabase_storage.client.storage.from_(bucket).download(file_path)
```

**Cambios clave:**
1. ✅ Requiere `current_user` desde query param `?token=xxx`
2. ✅ Extrae `user_id = str(current_user.id)`
3. ✅ Construye ruta: `{user_id}/{filename}` en lugar de `Graficos/{filename}`
4. ✅ Logging con `user_id` para auditoría

---

### **2. Frontend: Token en Query String**

#### **config/api.ts - Nueva función helper**

```typescript
// Función helper para construir URLs autenticadas con token en query string (para iframes)
export const getAuthenticatedUrl = (endpoint: string): string => {
    const token = localStorage.getItem('token');
    const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    if (token) {
        const separator = endpoint.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
    }
    
    return baseUrl;
};
```

**Uso:**
```typescript
// ❌ ANTES
const iframeSrc = getApiUrl('/api/analizer/file/monte_carlo_trajectories.html');

// ✅ AHORA
const iframeSrc = getAuthenticatedUrl('/api/analizer/file/monte_carlo_trajectories.html');
// Resultado: http://localhost:8000/api/analizer/file/monte_carlo_trajectories.html?token=eyJhbGc...
```

---

#### **Componentes actualizados (4 archivos):**

1. ✅ **PredictiveChart.tsx**
   - `getAuthenticatedUrl('/api/analizer/file/monte_carlo_trajectories.html')`

2. ✅ **PerformanceSummary.tsx**
   - `getAuthenticatedUrl('/api/analizer/file/portfolio_growth_interactive.html')`

3. ✅ **InteractiveSimulations.tsx**
   - `getAuthenticatedUrl('/api/analizer/file/efficient_frontier_interactive.html')`

4. ✅ **DetailedAnalysis.tsx**
   - `getAuthenticatedUrl('/api/analizer/file/msr_portfolio_treemap_original.html')`

---

## 📊 **ESTRUCTURA DE RUTAS**

### **Antes (Compartido)**
```
portfolio-files/
└── Graficos/
    ├── portfolio_growth.html  ← Todos los usuarios
    ├── monte_carlo_simulation.html
    └── efficient_frontier.html
```

### **Después (Por Usuario)**
```
portfolio-files/
├── 1/  ← Usuario ID 1
│   ├── portfolio_growth.html
│   ├── monte_carlo_simulation.html
│   └── efficient_frontier.html
├── 2/  ← Usuario ID 2
│   ├── portfolio_growth.html
│   └── ...
```

---

## 🧪 **TESTING REQUERIDO**

1. **Subir archivos a Supabase:**
   ```
   portfolio-files/
   ├── 1/portfolio_growth.html
   ├── 1/monte_carlo_simulation.html
   ├── 1/efficient_frontier.html
   └── 1/msr_treemap.html
   ```

2. **Verificar autenticación:**
   ```bash
   # ❌ Sin token → 401 Unauthorized
   curl http://localhost:8000/api/analizer/file/portfolio_growth.html
   
   # ✅ Con token → 200 OK
   curl "http://localhost:8000/api/analizer/file/portfolio_growth.html?token=<JWT_TOKEN>"
   ```

3. **Verificar aislamiento:**
   - Usuario 1 solo ve archivos de `portfolio-files/1/`
   - Usuario 2 solo ve archivos de `portfolio-files/2/`

---

## ✅ **RESULTADO ESPERADO**

### **Logs ANTES (Errores):**
```
⚠️ Error Supabase para portfolio_growth_interactive.html: {'statusCode': 404, 'error': not_found}
INFO: "GET /api/analizer/file/portfolio_growth_interactive.html HTTP/1.1" 404 Not Found
```

### **Logs DESPUÉS (Éxito):**
```
INFO: Sirviendo archivo portfolio_growth_interactive.html para user_id=1
INFO: Descargando desde Supabase: 1/portfolio_growth.html
INFO: ✅ Sirviendo portfolio_growth_interactive.html desde Supabase Storage para user_id=1
INFO: "GET /api/analizer/file/portfolio_growth_interactive.html?token=xxx HTTP/1.1" 200 OK
```

---

## 📚 **ARCHIVOS MODIFICADOS**

### **Backend:**
1. ✅ `auth/dependencies.py` - Nueva función `get_current_user_from_query()`
2. ✅ `api/analizer_router.py` - Autenticación + rutas dinámicas con `user_id`

### **Frontend:**
3. ✅ `src/config/api.ts` - Nueva función `getAuthenticatedUrl()`
4. ✅ `src/components/reports/PredictiveChart.tsx`
5. ✅ `src/components/reports/PerformanceSummary.tsx`
6. ✅ `src/components/reports/InteractiveSimulations.tsx`
7. ✅ `src/components/reports/DetailedAnalysis.tsx`

**Total:** 7 archivos modificados

---

## 🎉 **CONCLUSIÓN**

- ✅ **Autenticación implementada:** Solo usuarios autenticados pueden acceder
- ✅ **Rutas dinámicas:** `{user_id}/` en lugar de `Graficos/`
- ✅ **Aislamiento de datos:** Cada usuario ve solo sus archivos
- ✅ **Logging con auditoría:** Todos los accesos registran `user_id`

**Estado:** 🟢 LISTO PARA TESTING

---

**Próximo paso:** Subir archivos HTML de prueba a Supabase y verificar que el iframe carga correctamente con autenticación.
