# Plan de Implementación Multiusuario

## Resumen Ejecutivo
Transformar el backend de monousuario a multiusuario, donde cada usuario tiene su propia carpeta en Supabase Storage: `portfolio-files/{user_id}/`

## Cambios en la Arquitectura

### 1. Estructura en Supabase Storage
**Antes:**
```
portfolio-files/
├── Graficos/
│   ├── api_response_B.json
│   └── *.html
└── Informes/
    └── estructura_informe.json
```

**Después:**
```
portfolio-files/
├── {user_id_1}/
│   ├── api_response_B.json
│   ├── estructura_informe.json
│   └── *.html (gráficos)
└── {user_id_2}/
    ├── api_response_B.json
    ├── estructura_informe.json
    └── *.html (gráficos)
```

## Archivos a Modificar

### Backend

#### 1. `services/supabase_storage.py`
**Cambios requeridos:**
- ✅ Eliminar `base_prefix` y `base_prefix_reports` del `__init__`
- ✅ Añadir método `get_user_base_path(user_id)` 
- ✅ Actualizar `get_metrics_file_path(user_id, filename)`
- ✅ Actualizar `get_report_file_path(user_id, filename)`
- ✅ Actualizar `save_portfolio_report_json(user_id, datos_informe)`
- ✅ Actualizar `read_report_json(user_id, filename)`
- ⏳ Actualizar `read_metrics_json(user_id, filename)`
- ⏳ Actualizar `create_signed_url(user_id, filename, expires_in)`
- ⏳ Actualizar `read_html_chart(user_id, chart_name)`
- ⏳ Actualizar `create_chart_signed_url(user_id, chart_name, expires_in)`
- ⏳ Actualizar `list_chart_files(user_id)`
- ⏳ Actualizar `get_file_info(user_id, filename)`
- ⏳ Actualizar `list_metrics_files(user_id)`
- ⏳ Actualizar `health_check(user_id)` (opcional)
- ⏳ Actualizar `guardar_json_en_supabase(user_id, datos_informe, config)`

#### 2. `services/home_data_service.py`
**Cambios requeridos:**
- Añadir parámetro `user_id` a `get_home_dashboard_data(user_id)`
- Pasar `user_id` a `get_supabase_storage()` o métodos del servicio

#### 3. `services/portfolio_manager_service.py`
**Cambios requeridos:**
- Añadir parámetro `user_id` a todos los métodos que acceden a Storage
- Actualizar `_load_from_supabase()` para usar `user_id`
- Actualizar `_load_from_disk()` si es necesario

#### 4. `api/home_router.py`
**Cambios requeridos:**
- Importar `get_current_user` de `auth/dependencies.py`
- Inyectar `current_user: User = Depends(get_current_user)` en endpoint
- Pasar `user.id` o `user.email` a `get_home_dashboard_data()`

#### 5. `api/portfolio_router.py`
**Cambios requeridos:**
- Inyectar `current_user` en todos los endpoints que usan Storage
- Pasar `user_id` a los servicios

#### 6. `api/portfolio_manager_router.py`
**Cambios requeridos:**
- Inyectar `current_user` en endpoints
- Pasar `user_id` al cliente de Portfolio Manager

### Frontend

#### 1. `src/services/homeService.ts`
**Cambios requeridos:**
- Añadir token de autenticación en headers de `fetch()`
- Ejemplo:
```typescript
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

#### 2. `src/services/portfolioService.ts`
**Cambios similares:**
- Incluir token en todos los requests

#### 3. `src/config/api.ts`
**Opcional:**
- Crear helper para construir headers con auth

## Estrategia de Implementación

### Fase 1: Modificación del Core (Supabase Storage Service) ✅
1. Actualizar `SupabaseStorageService` para soportar `user_id`
2. Mantener compatibilidad temporal con métodos legacy

### Fase 2: Actualización de Servicios ⏳
1. Modificar `home_data_service.py`
2. Modificar `portfolio_manager_service.py`
3. Actualizar otros servicios dependientes

### Fase 3: Actualización de Routers ⏳
1. Inyectar autenticación en routers
2. Propagar `user_id` a servicios

### Fase 4: Actualización del Frontend ⏳
1. Incluir token en headers de API calls
2. Manejar errores de autenticación

### Fase 5: Testing y Rollout
1. Crear usuario de prueba en Supabase
2. Subir archivos de test a `portfolio-files/{test_user_id}/`
3. Verificar que cada usuario ve solo sus datos
4. Migrar datos existentes (si aplicable)

## Consideraciones de Seguridad

1. **RLS en Supabase**: Configurar políticas de Row Level Security para que usuarios solo accedan a sus carpetas
2. **Validación de user_id**: Asegurar que el `user_id` viene siempre del token JWT, no del request body
3. **Path Traversal**: Validar que `user_id` no contenga caracteres maliciosos (`../`, etc.)

## Notas de Migración

Si existen datos de un usuario "genérico":
1. Crear carpeta para usuario por defecto
2. Mover archivos existentes a esa carpeta
3. Actualizar configuración para apuntar al nuevo usuario

## Testing Checklist

- [ ] Usuario A puede ver sus datos
- [ ] Usuario A NO puede ver datos de Usuario B
- [ ] Usuario sin autenticar recibe 401
- [ ] Token expirado recibe 401
- [ ] Frontend maneja correctamente errores de auth
- [ ] Archivos se crean en carpeta correcta del usuario
- [ ] URLs firmadas son específicas por usuario
