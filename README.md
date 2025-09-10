# 🚀 Mi Proyecto Frontend - Financial AI Platform

Una plataforma frontend moderna para análisis financiero con IA, desarrollada con React + TypeScript. Este proyecto se conecta con un backend FastAPI independiente para proporcionar funcionalidades avanzadas de análisis financiero.

## 🌟 Características Principales

- **🤖 Interfaz para Agente IA**: Comunicación con Horizon v3.0 
- **📊 Dashboard Interactivo**: Visualización de datos financieros en tiempo real
- **💬 Chat Interface**: Interfaz para el chat con agente de IA
- **📈 Análisis de Mercado**: Visualización de noticias, predicciones y tendencias
- **📄 Vista de Documentos**: Interfaz para análisis de reportes financieros
- **🔍 Componentes de Búsqueda**: Interfaz para información financiera en tiempo real

## 🏗️ Arquitectura

```
┌─────────────────┐    REST API     ┌──────────────────┐
│   React Client  │ ←─────────────→ │  FastAPI Backend │
│  (Port 5173+)   │                 │   (Port 8000)    │
│                 │                 │  (Repo separado) │
└─────────────────┘                 └──────────────────┘
```

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 18+
- Backend FastAPI corriendo (repositorio separado)

### Configuración del Frontend
```bash
git clone [tu-repo-frontend]
cd mi-proyecto
npm install
npm run dev
```

### Backend Requerido
El frontend requiere que el backend FastAPI esté corriendo. El backend está en un repositorio separado:
- Repositorio Backend: `mi-proyecto-backend`
- Puerto por defecto: `http://localhost:8000`
- Documentación API: `http://localhost:8000/docs`

### 3. Acceso a la Aplicación
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **Chat AI**: Navegar a la sección "AI Agent" en la aplicación

## 📡 API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ai/chat` | POST | Chat con el agente IA |
| `/api/ai/chat/upload` | POST | Chat con análisis de archivos |
| `/api/ai/search-news` | POST | Búsqueda de noticias financieras |
| `/api/ai/analyze-url` | POST | Análisis de sitios web |
| `/api/ai/status` | GET | Estado del agente |
| `/api/ai/health` | GET | Health check del sistema |

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** como build tool
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Chart.js** para gráficos
- **Date-fns** para manejo de fechas

### Backend (Repositorio Separado)
- **FastAPI** framework asíncrono
- **SQLAlchemy 2.0** ORM
- **Pydantic** validación de datos
- **Google Gemini** modelos de IA

### Agente IA (En Backend)
- **Horizon v3.0** agente financiero
- **Google Search** herramientas de búsqueda
- **Web Scraping** análisis de URLs
- **Document Processing** análisis de archivos

## 📁 Estructura del Proyecto Frontend

```
mi-proyecto/
├── src/                          # Frontend React
│   ├── components/              # Componentes reutilizables
│   │   ├── dashboard/          # Componentes del dashboard
│   │   ├── market/             # Componentes de mercado
│   │   └── reports/            # Componentes de reportes
│   ├── pages/                   # Páginas principales
│   │   ├── AIAgentPage.tsx     # Página del chat IA
│   │   ├── MarketPage.tsx      # Página de mercado
│   │   └── ReportsPage.tsx     # Página de reportes
│   ├── services/               # Servicios para API calls
│   ├── config/                 # Configuración
│   │   └── api.ts             # Config de endpoints
│   └── data/                  # Datos mock y constantes
├── public/                     # Archivos estáticos
└── README.md                 # Este archivo
```

## 🔗 Repositorios Relacionados

- **Frontend**: `mi-proyecto` (este repositorio)
- **Backend**: `mi-proyecto-backend` (repositorio separado)

## 🤖 Capacidades del Agente Horizon

- **Análisis Financiero**: Ratios, métricas y evaluación de activos
- **Noticias de Mercado**: Búsqueda y análisis de información actualizada
- **Procesamiento de Documentos**: Análisis de reportes y archivos financieros
- **Predicciones**: Modelos de forecasting y análisis predictivo
- **Educación Financiera**: Explicación de conceptos y términos

## 🔐 Variables de Entorno

Crear archivo `.env` en `mi-proyecto-backend-fastapi/`:

```env
GOOGLE_API_KEY=tu_api_key_de_gemini
SERPER_API_KEY=tu_api_key_de_serper  
DATABASE_URL=sqlite:///./financial_agent.db
SECRET_KEY=tu_secret_key_jwt
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## 🧪 Testing

El sistema incluye una suite completa de tests de integración que verifica:
- Conectividad backend-frontend
- Funcionalidad de endpoints
- Configuración CORS
- Respuestas del agente IA

## 🚀 Deployment

### Desarrollo
```bash
# Terminal 1: Backend
cd mi-proyecto-backend-fastapi
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend  
cd mi-proyecto
npm run dev
```

### Producción
- Frontend: Build con `npm run build` y servir con nginx/Apache
- Backend: Deploy con Docker o directamente con gunicorn/uvicorn
- Base de datos: Migrar de SQLite a PostgreSQL para producción

## 📚 Documentación Adicional

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **Integración Completa**: Ver `INTEGRACION_COMPLETA.md`

## 👨‍💻 Información del Desarrollador

- **Autor**: Miguel Angel Murillo Frias
- **Programa**: Análisis y Desarrollo de Software - SENA
- **Ficha**: 2957794

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes preguntas o problemas:
1. Revisa la documentación de API en `/docs`
2. Verifica que ambos servicios estén ejecutándose
3. Confirma las variables de entorno en `.env`

---

**Desarrollado con ❤️ utilizando React, FastAPI y Google Gemini**
