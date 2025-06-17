---

**Documento Técnico: Guía de Planificación y Desarrollo de un *Backend* con FastAPI para Aplicación de IA y Finanzas**

**Fecha:** 04 de junio de 2025
**Autor:** Gemini (asistente IA)
**Contexto del Desarrollador:** Miguel Angel Murillo, estudiante de Ciencia de Datos e Ingeniería Industrial, con conocimientos en Python, análisis y desarrollo de software, estadística y juegos de estrategia. Reside en Bogotá, Colombia.

---

**1. Introducción y Objetivo General**

El presente documento detalla una guía estructurada para la construcción de un *backend* robusto y escalable utilizando FastAPI, el cual servirá como el corazón de su aplicación web financiera y de inteligencia artificial. El objetivo principal es migrar la lógica de servidor actual (Node.js/Express) y expandir las capacidades de IA, asegurando una integración fluida con el *frontend* existente (React/TypeScript). Se adoptará un enfoque modular y por capas, similar a los principios de "Vibe Planning" para garantizar la claridad, mantenibilidad y eficiencia del desarrollo.

---

**2. Arquitectura General de la Solución**

La arquitectura propuesta mantendrá una clara separación de preocupaciones entre el *frontend* y el *backend*, comunicándose a través de APIs RESTful.

* **Frontend (React/TypeScript):** Su aplicación actual, responsable de la interfaz de usuario, la experiencia de usuario y la orquestación de las llamadas a la API.
* **Backend (FastAPI/Python):** El nuevo componente a construir. Será responsable de la lógica de negocio, la interacción con la base de datos, la ejecución de modelos de IA y la exposición de las APIs.
* **Base de Datos (PostgreSQL):** Almacenamiento persistente de datos de usuarios, perfiles, configuraciones, y potencialmente datos históricos para los modelos de IA.

---

**3. Flujo de Trabajo y Planificación (Fase de "Backend Planning")**

Esta fase se centra en la preparación exhaustiva del *backend*, definiendo sus componentes, funcionalidades y un plan de acción detallado antes de la codificación.

**3.1. Paso #1: Definición de la Estructura y Componentes del *Backend***

* **Objetivo:** Establecer la visión de alto nivel del *backend*, identificando sus módulos principales y la funcionalidad que cada uno proveerá.
* **Contexto a considerar:**
    * **QUÉ:** Un *backend* para una plataforma de gestión financiera con IA.
    * **PARA QUIÉN:** Usuarios de la aplicación *frontend* (inversores, analistas, usuarios generales).
    * **POR QUÉ:** Procesar datos financieros, ejecutar modelos de IA (predicción, anomalías, agentes conversacionales), gestionar perfiles de usuario y configuraciones, y proveer una API de alto rendimiento.
    * **CÓMO:** Utilizando FastAPI para la API, Python para la lógica de IA y un ORM asíncrono para la base de datos PostgreSQL.
* **Aspectos a Definir:**
    * **Módulos Core:** Autenticación, gestión de usuarios/perfiles, gestión de datos financieros, módulo de IA.
    * **Interacciones Clave:** Cómo el *frontend* se comunicará con cada módulo.
    * **Consideraciones de Escalabilidad:** Planificar el uso de asincronía y carga eficiente de modelos.

**3.2. Paso #2: Especificaciones Detalladas del *Backend***

* **Objetivo:** Desglosar cada funcionalidad del *backend* en especificaciones técnicas concretas, definiendo los *endpoints*, modelos de datos y lógica asociada.
* **Regla Importante:** *NO ESCRIBIR CÓDIGO EN ESTA FASE, A MENOS QUE SEA PSEUDOCÓDIGO PARA ESCLARECER UNA LÓGICA COMPLEJA.*
* **Detalles a especificar para cada funcionalidad:**
    * **Nombre de la Funcionalidad:** Ej. "Gestión de Perfil de Usuario", "Inferencia de Modelo de Predicción", "Interacción con Agente de Chat AI".
    * **Descripción Detallada:** Qué hace la funcionalidad desde la perspectiva del *backend*.
    * **Endpoints de API (`/api/...`):**
        * **Método HTTP:** `GET`, `POST`, `PUT`, `DELETE`.
        * **Ruta (URL):** Ej. `/users/{user_id}/profile`, `/ai/predict_asset_value`.
        * **Parámetros de Ruta/Consulta:** (Si aplica).
        * **Modelos de Entrada (Pydantic Request Body):** Definición exacta de la estructura de datos que se espera en la solicitud.
        * **Modelos de Salida (Pydantic Response Model):** Definición exacta de la estructura de datos que se devolverá.
        * **Lógica de Negocio:** Pasos lógicos que el *backend* seguirá para procesar la solicitud.
        * **Interacción con Base de Datos:** Qué tablas se consultan/modifican, qué datos se requieren.
        * **Interacción con Agentes/Modelos de IA:** Qué modelo se invoca, qué entradas se le pasan, qué salida se espera.
        * **Códigos de Estado HTTP:** Respuestas esperadas (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error).
    * **Modelos de Datos (Pydantic):** Definiciones detalladas para cada tipo de dato de entrada y salida, asegurando la validación automática.
    * **Módulos de Base de Datos:** Qué tablas del `Perfil_setting.sql` se usarán y cómo se mapearán a modelos de ORM.
    * **Módulos de IA:** Qué modelos/agentes de IA se cargarán y cómo se integrarán.

**3.3. Paso #3: Plan de Acción Detallado para la Implementación**

* **Objetivo:** Crear una lista de tareas granular y secuencial para la implementación del *backend*, asignando archivos y operaciones específicas. Este será su "roadmap" de codificación.
* **Formato:** Para cada Tarea N y Subtarea N+1:
    * **Nombre:** Descriptivo y conciso (ej. "Configurar entorno FastAPI", "Implementar GET perfil de usuario").
    * **Explicación Técnica:** Breve descripción de la tarea y su propósito.
    * **Ruta Relativa del Archivo Modificado:** Especificar dónde se realizará el cambio (ej. `src/main.py`, `api/user_routes.py`, `database.py`).
    * **Operación:** `Crear`, `Actualizar`, `Eliminar`.
    * **Dependencias:** Si una tarea depende de otra.
    * **Comentarios Críticos:** Notas importantes para el desarrollador (ej. "recordar manejo de errores", "añadir autenticación más tarde").

---

**4. Estructura Sugerida de la Carpeta del *Backend* (`mi-proyecto-backend-fastapi/`)**

La organización de su *backend* debería reflejar la separación lógica y funcional de sus componentes.

```
mi-proyecto-backend-fastapi/
├── .venv/                 # Entorno virtual de Python (excluir de Git)
├── main.py                # Punto de entrada principal de la aplicación FastAPI.
                           # Aquí se instancia la app, se incluyen routers y se configuran CORS.
├── requirements.txt       # Listado de todas las librerías de Python necesarias (FastAPI, Uvicorn,
                           # SQLAlchemy, google-adk, etc.).
├── Dockerfile             # Instrucciones para construir la imagen Docker de su backend.
├── docker-compose.yml     # (Opcional, pero recomendado) Para orquestar FastAPI y PostgreSQL juntos en desarrollo/producción.
├── config.py              # Configuraciones de la aplicación (variables de entorno, ajustes de DB).
├── database.py            # Módulo para la configuración de la conexión a la base de datos (Pool de PostgreSQL)
                           # y definición de modelos de ORM (ej., SQLAlchemy/SQLModel).
├── auth/                  # Módulo para la autenticación y autorización (JWT).
│   ├── security.py        # Funciones para hashing de contraseñas, creación/validación de tokens.
│   └── dependencies.py    # Dependencias de FastAPI para protección de rutas.
├── models/                # Definiciones de modelos de datos usando Pydantic.
│   ├── user.py            # Esquemas Pydantic para UserCreate, UserResponse, UserProfile, etc.
│   ├── financial.py       # Esquemas para datos financieros (ej. Asset, Transaction, Portfolio).
│   └── notification.py    # Esquemas para la configuración de notificaciones.
├── crud/                  # Capa de operaciones CRUD (Create, Read, Update, Delete) con la base de datos.
│   ├── user.py            # Funciones para interactuar con tablas de usuarios y perfiles.
│   ├── notification.py    # Funciones para interactuar con la tabla de notificaciones.
│   └── ...
├── services/              # Lógica de negocio más compleja que no es directamente un CRUD.
│   ├── financial_service.py # Lógica para calcular métricas de portafolio, etc.
│   └── ...
├── adk_agents/            # Lógica de los agentes de IA usando Google Agent Development Kit.
│   ├── __init__.py
│   ├── main_agent.py      # Punto de entrada principal para la orquestación de agentes.
│   └── tools/             # Herramientas especializadas para los agentes.
│       ├── __init__.py
│       └── financial_tools.py
├── api/                   # Rutas (routers) de FastAPI, agrupadas por funcionalidad.
│   ├── __init__.py        # Para que Python lo reconozca como un paquete.
│   ├── auth_router.py     # Rutas para /api/auth/login, /api/auth/register.
│   ├── user_router.py     # Rutas para /api/users/{user_id}/profile, /api/users/{user_id}/notifications.
│   ├── ai_router.py       # Rutas para /api/ai/chat, /api/ai/predict, /api/ai/anomaly.
│   └── ...
├── tests/                 # Pruebas unitarias y de integración para el backend.
└── README.md              # Documentación específica del backend.
```

---

**5. Conexión del *Frontend* con el *Backend* (FastAPI)**

* **URL Base de la API:** Modifique las llamadas `fetch` o `axios` en su aplicación React (ej. en `src/pages/AccountSettingsPage/AccountSettingsPage.tsx`) para apuntar a la URL de su *backend* de FastAPI.
    * **En Desarrollo:** `http://localhost:8000/api` (asumiendo que FastAPI corre en el puerto 8000 y sus rutas están bajo `/api/`).
    * **En Producción:** La URL pública donde se despliegue su *backend*.
* **CORS (Cross-Origin Resource Sharing):** Implemente el middleware CORS en su aplicación FastAPI para permitir solicitudes desde el dominio de su *frontend*.

    ```python
    # En main.py de FastAPI
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware

    app = FastAPI()

    # Configuración de CORS
    origins = [
        "http://localhost:5173",  # Dominio de su frontend en desarrollo
        "http://localhost:3000",  # Si usa otro puerto o Vite dev server por defecto
        # "https://su-dominio-frontend.com", # Dominio de su frontend en producción
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"], # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"], # Permitir todos los headers
    )

    # ... incluya sus routers aquí
    # app.include_router(user_router, prefix="/api/users", tags=["users"])
    # app.include_router(ai_router, prefix="/api/ai", tags=["ai"])
    ```

---

**6. Empaquetado y Despliegue**

* **Dockerización del *Backend***:
    * Cree el `Dockerfile` en `mi-proyecto-backend-fastapi/` para encapsular su aplicación FastAPI junto con todas sus dependencias de Python y modelos de IA.
    * Ejemplo de `Dockerfile` simplificado:

        ```dockerfile
        # Usa una imagen base de Python oficial (ej. Python 3.10 o 3.11)
        FROM python:3.10-slim-buster

        # Establece el directorio de trabajo dentro del contenedor
        WORKDIR /app

        # Copia el archivo de dependencias y las instala
        COPY requirements.txt .
        RUN pip install --no-cache-dir -r requirements.txt

        # Copia todo el código de la aplicación
        COPY . .

        # Si tiene modelos grandes, puede descargarlos aquí o montarlos como volumen
        # RUN python scripts/download_models.py # Ejemplo

        # Expone el puerto en el que Uvicorn va a correr
        EXPOSE 8000

        # Comando para ejecutar la aplicación con Uvicorn (servidor ASGI)
        # --host 0.0.0.0 es necesario para que sea accesible desde fuera del contenedor
        CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
        ```

* **Despliegue de Base de Datos:** Continúe utilizando PostgreSQL. En producción, considere un servicio de base de datos gestionado (AWS RDS, Google Cloud SQL) para mayor fiabilidad y mantenimiento.
* **Orquestación con Docker Compose (para desarrollo local):**

    ```yaml
    # docker-compose.yml en la raíz de su "monorepo" de desarrollo (si mantiene frontend y backend en la misma raíz)
    version: '3.8'

    services:
      frontend:
        build: ./mi-proyecto          # Ruta a su carpeta de frontend (React)
        ports:
          - "5173:5173"               # O el puerto que use Vite
        volumes:
          - ./mi-proyecto:/app        # Montar el código para hot-reloading
          - /app/node_modules         # Excluir node_modules del montaje
        environment:
          - VITE_API_URL=http://backend:8000/api # Variable de entorno para apuntar al backend

      backend:
        build: ./mi-proyecto-backend-fastapi  # Ruta a su nueva carpeta de backend (FastAPI)
        ports:
          - "8000:8000"
        volumes:
          - ./mi-proyecto-backend-fastapi:/app # Montar el código para hot-reloading
        environment:
          - DATABASE_URL=postgresql://user:password@db:5432/mydatabase # Variables de DB
          # Otras variables de entorno para APIs de IA, etc.
        depends_on:
          - db

      db:
        image: postgres:15-alpine     # Versión ligera de PostgreSQL
        volumes:
          - pg_data:/var/lib/postgresql/data # Persistir datos
          - ./Perfil_setting.sql:/docker-entrypoint-initdb.d/init.sql # Ejecutar el script SQL al inicio
        environment:
          - POSTGRES_DB=mydatabase
          - POSTGRES_USER=user
          - POSTGRES_PASSWORD=password
        ports:
          - "5432:5432" # Solo si desea acceder directamente a la DB desde fuera de Docker

    volumes:
      pg_data: # Volumen para persistir los datos de PostgreSQL
    ```

    Para levantar todo el stack en desarrollo: `docker-compose up --build`.

* **Despliegue en Producción:**
    * Para el *frontend*: `npm run build` y sirva la carpeta `dist` con Nginx o un servicio de *hosting* estático.
    * Para el *backend*: Despliegue la imagen Docker de FastAPI en un servicio de contenedores (ej. Google Cloud Run, AWS ECS/Fargate, Azure Container Apps) o en un VPS con Nginx como proxy inverso. Nginx configuraría la redirección de `/api/*` a su servicio FastAPI.

---

**7. Consideraciones Finales**

* **Seguridad:** Asegure que todas las comunicaciones entre *frontend* y *backend* usen HTTPS en producción. Implemente autenticación y autorización robustas (JWT es un estándar con FastAPI). Valide y sanee siempre todas las entradas del usuario.
* **Manejo de Errores:** Implemente un manejo de errores consistente en FastAPI, devolviendo mensajes claros y códigos de estado HTTP apropiados.
* **Pruebas:** Escriba pruebas unitarias e de integración para su *backend* de FastAPI.
* **Documentación:** La autogeneración de documentación de la API por parte de FastAPI (Swagger UI/ReDoc) es una gran ventaja; úsela para mantener su API bien documentada.
* **Optimización de IA:** Monitoree el rendimiento de sus modelos de IA. Considere técnicas de optimización como cuantificación o *inference servers* dedicados (ej. Triton Inference Server) si la latencia se vuelve un problema significativo con modelos muy grandes o alto tráfico.

Este plan de acción proporciona una base sólida para que usted, Miguel Angel, construya un *backend* de FastAPI poderoso para su proyecto. ¡Mucho éxito en su implementación!

---

**8. Plan de Desarrollo y Lista de Chequeo**

Esta sección sirve como una hoja de ruta para la implementación del *backend*. Las tareas marcadas con `[x]` ya han sido completadas durante la configuración inicial.

**Fase 1: Configuración Inicial y Estructura Base ✅**
- [x] Crear estructura de directorios para el backend
- [x] Configurar entorno virtual y dependencias
- [x] Implementar configuración básica de FastAPI
- [x] Configurar conexión a base de datos
- [x] Implementar modelos base
- [x] Configurar Docker y docker-compose

**Fase 2: Autenticación y Gestión de Usuarios ✅**
- [x] Implementar sistema de autenticación JWT
- [x] Crear modelos de usuario
- [x] Implementar endpoints de autenticación
- [x] Configurar middleware de seguridad
- [x] Implementar gestión de usuarios (CRUD)
- [x] Configurar roles y permisos básicos

**Fase 3: Integración con Google ADK**
- [ ] Configurar Google ADK
- [ ] Implementar agentes de IA
- [ ] Integrar con el backend
- [ ] Configurar endpoints para agentes
- [ ] Implementar manejo de errores
- [ ] Documentar API de agentes

**Fase 4: Desarrollo de Funcionalidades Core**
- [ ] Implementar análisis financiero
- [ ] Desarrollar sistema de reportes
- [ ] Implementar dashboard
- [ ] Configurar notificaciones
- [ ] Implementar exportación de datos
- [ ] Desarrollar sistema de alertas

**Fase 5: Testing y Optimización**
- [ ] Implementar tests unitarios
- [ ] Implementar tests de integración
- [ ] Optimizar rendimiento
- [ ] Implementar logging
- [ ] Configurar monitoreo
- [ ] Realizar pruebas de carga

**Fase 6: Documentación y Despliegue**
- [ ] Documentar API
- [ ] Crear guías de usuario
- [ ] Preparar ambiente de producción
- [ ] Configurar CI/CD
- [ ] Realizar despliegue
- [ ] Monitoreo post-despliegue