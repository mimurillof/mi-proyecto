# Integración de la Cinta (Ribbon) con el Backend y App Remota

Este documento explica dónde están los puntos de enlace del frontend y backend para los 5 botones del Ribbon y cómo adaptar la integración cuando el proveedor que genera el texto sea una app remota.

## Resumen de Flujo

1) Frontend (`RibbonActions`) hace una llamada HTTP al backend por cada botón.
2) Backend (`ribbon_router`) retorna un JSON con `title` y `message` (placeholder de prueba).
3) Frontend muestra el `message` en un modal moderno. Excepción: “Reporte Personalizado” navega a la sección de Reportes y muestra la vista AI.

## Frontend

- Componente de la cinta: `src/components/reports/AIControlPanel.tsx`
  - Mapea cada botón a un endpoint backend:
    - Resumen: `/api/ribbon/summary`
    - Rendimiento: `/api/ribbon/performance`
    - Proyecciones: `/api/ribbon/forecast`
    - Alertas: `/api/ribbon/alerts`
    - Reporte personalizado: `/api/ribbon/custom-report`
  - Muestra un modal con el contenido devuelto por el backend.
  - Los botones están ubicados en la sección **Reportes → Reporte AI** en el "Panel de Control AI".

- Modal reutilizable: `src/components/Modal.tsx`
  - Ventana emergente estética, dentro de la SPA (no alert del navegador).

- Página de Reportes: `src/pages/ReportsPage.tsx`
  - Al montarse, si `sessionStorage.openAIReport === '1'`, activa la pestaña `AI` y limpia la marca.

- Vista AI para el reporte: `src/components/reports/AIReportView.tsx`
  - Lee `sessionStorage.aiReportId` y muestra un contenedor inicial (demo) donde se insertará el contenido real.

- Navegación desde la app principal: `src/App.tsx`
  - Escucha el evento `navigateToReportsAI` para cambiar a la sección “Reportes”.

- Configuración de endpoints (base url, rutas): `src/config/api.ts`
  - Entradas agregadas:
    - `RIBBON_SUMMARY`, `RIBBON_PERFORMANCE`, `RIBBON_FORECAST`, `RIBBON_ALERTS`, `RIBBON_CUSTOM_REPORT`.

## Backend (FastAPI)

- Router de Ribbon: `mi-proyecto-backend/api/ribbon_router.py`
  - Endpoints de prueba (placeholders) que devuelven JSON simple:
    - `GET /api/ribbon/summary`
    - `GET /api/ribbon/performance`
    - `GET /api/ribbon/forecast`
    - `GET /api/ribbon/alerts`
    - `GET /api/ribbon/custom-report` (retorna también `report_id`)

- Registro del router: `mi-proyecto-backend/main.py`
  - `app.include_router(ribbon_router, tags=["Ribbon Actions"])`

### Dónde integrar la App Remota

Cuando el contenido deba provenir de una app remota, implemente la llamada dentro de cada handler del `ribbon_router.py`. Ejemplo asíncrono con `httpx`:

```python
# mi-proyecto-backend/api/ribbon_router.py
import httpx

REMOTE_BASE_URL = "https://tu-app-remota.com"

@router.get("/summary")
async def get_summary():
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(f"{REMOTE_BASE_URL}/api/summary")
        r.raise_for_status()
        data = r.json()
    # Normalizar a título + mensaje
    return {"title": "Resumen Diario/Semanal", "message": data.get("text", "")}
```

Repita el patrón para `performance`, `forecast`, `alerts` y `custom-report` (en este último, incluya `report_id`/`url` según lo que retorne la app remota). Si la app remota requiere API keys o autenticación, centralice la configuración en `config.py` y use variables de entorno.

### Contrato de Respuesta esperado por el Frontend

- Para 4 botones (no reporte personalizado):
```json
{
  "title": "string",
  "message": "string"
}
```
- Para “Reporte Personalizado”:
```json
{
  "title": "Reporte Personalizado",
  "message": "string",
  "report_id": "string (opcional)",
  "report_url": "string (opcional)"
}
```

## Prueba Rápida (local)

1) Backend
```bash
cd mi-proyecto-backend
python -m uvicorn main:app --reload --port 8000
```
2) Frontend
```bash
npm run dev
```
3) En la sección Reportes → Reporte AI → Panel de Control AI, use los 5 botones:
- Los primeros 4 muestran un modal con texto de prueba.
- "Generar Reporte" también muestra un modal con texto de prueba.

## Personalización y Escalabilidad

- Estilos del modal: editar `src/components/Modal.tsx` (Tailwind).
- Lógica de negocio: ubicar en `ribbon_router.py` o delegar a servicios en `mi-proyecto-backend/services/` para mantener separación de capas.
- URLs/remotos: parametrizar en `config.py` (backend) y `.env`.
- Frontend a producción: actualizar `API_CONFIG.BASE_URL` en `src/config/api.ts`.

## Soporte
- Ver también: `INTEGRACION_COMPLETA.md` para el panorama general de la app.
