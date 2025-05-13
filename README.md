# Página Web SENA

## Descripción

Este es un proyecto en desarrollo como parte del programa de **Análisis y Desarrollo de Software** del SENA. El objetivo principal es crear un dashboard interactivo para visualización y análisis de datos financieros, con capacidades de inteligencia artificial para predicción de tendencias, detección de anomalías y simulación de escenarios de inversión.

La plataforma integra visualizaciones avanzadas de datos de inversiones, portafolios y mercados financieros, junto con herramientas analíticas impulsadas por IA para ayudar en la toma de decisiones de inversión.

Actualmente, el proyecto se encuentra en sus fases iniciales de desarrollo.

## Autor

* **Nombre:** Miguel Angel Murillo Frias
* **Ficha:** 2957794

## Estado del Proyecto

* **🚧 En Desarrollo 🚧**
* Este proyecto está incompleto y se encuentra activamente en desarrollo. Las funcionalidades pueden cambiar y aún no está listo para producción.

## Tecnologías Utilizadas

* **Frontend:** React 18, TypeScript
* **Visualización de Datos:** Chart.js, React-Chartjs-2, Plotly.js
* **UI/UX:** Material UI, FontAwesome, TailwindCSS
* **Herramientas de Desarrollo:** Vite, ESLint
* **Estilos:** CSS Modules, TailwindCSS
* **Gestor de Paquetes:** npm

## Estructura del Proyecto

El proyecto tiene una estructura modular organizada por funcionalidades:
* **Dashboard:** Visualización principal con gráficos de rendimiento y resumen de cartera
* **Reportes:** Análisis detallados con capacidades de IA, incluyendo nuevos widgets de reporte.
* **Agente IA:** Página dedicada con funcionalidad de chat para asistencia inteligente.
* **Portafolio:** Gestión y visualización de activos financieros, con diseño y gráficos interactivos mejorados.
* **Mercado:** Información y análisis de mercados financieros con widgets de TradingView (gráficos, timelines, mapas de calor).
* **Gestión de Usuario:** Páginas de perfil y configuración de cuenta, centro de notificaciones.

## Requisitos previos
- Node.js (versión recomendada: 18.x o superior)
- npm (viene incluido con Node.js)

## Instrucciones de instalación

1. Clona o descarga este repositorio en tu equipo local

2. Abre una terminal en la carpeta del proyecto (`mi-proyecto`)

3. Instala todas las dependencias ejecutando:
```bash
npm install
```

Este comando instalará todas las siguientes dependencias:

### Dependencias principales:
- @emotion/react v11.14.0
- @emotion/styled v11.14.0
- @fortawesome/fontawesome-svg-core v6.7.2
- @fortawesome/free-solid-svg-icons v6.7.2
- @fortawesome/react-fontawesome v0.2.2
- @mui/icons-material v7.0.2
- @mui/material v7.0.2
- chart.js v4.4.9
- chartjs-adapter-date-fns v3.0.0
- chartjs-plugin-zoom v2.2.0
- date-fns v2.30.0
- gridstack v12.0.0
- hammerjs v2.0.8
- lucide-react v0.344.0
- plotly.js v3.0.1
- react v18.3.1
- react-chartjs-2 v5.3.0
- react-dom v18.3.1
- react-plotly.js v2.6.0
- tabulator-tables v6.3.1

### Dependencias de desarrollo:
- @eslint/js v9.9.1
- @types/react v18.3.5
- @types/react-dom v18.3.0
- @types/tabulator-tables v6.2.6
- @vitejs/plugin-react v4.3.1
- autoprefixer v10.4.16
- eslint v9.9.1
- eslint-plugin-react-hooks v5.1.0-rc.0
- eslint-plugin-react-refresh v0.4.11
- globals v15.9.0
- postcss v8.4.31
- tailwindcss v3.3.5
- typescript v5.5.3
- typescript-eslint v8.3.0
- vite v5.4.2

## Ejecución del proyecto

Para iniciar el servidor de desarrollo, ejecuta:
```bash
npm run dev
```

Para compilar el proyecto para producción:
```bash
npm run build
```

Para previsualizar la versión de producción:
```bash
npm run preview
```

## Notas adicionales
- La carpeta `node_modules` ha sido excluida intencionalmente debido a su tamaño. Se recreará automáticamente al ejecutar `npm install`.
- Si encuentras algún problema durante la instalación o ejecución, asegúrate de tener instaladas las versiones correctas de Node.js y npm.

## Funcionalidades Implementadas y Previstas

### Dashboard
* [x] Visualización de rendimiento de portafolio
* [x] Resumen de holdings totales
* [x] Vista general del portafolio
* [ ] Dashboard completamente interactivo y personalizable (mejoras continuas)

### Reportes con IA
* [x] Panel de control de IA
* [x] Resumen de rendimiento
* [x] Métricas avanzadas
* [x] Gráficos predictivos
* [x] Detección de anomalías
* [x] Análisis detallado
* [x] Simulaciones interactivas
* [x] Adición de nuevos widgets de reporte
* [x] Página de Agente IA con funcionalidad de chat
* [ ] Generación automática de informes

### Portafolio
* [x] Carrusel de portafolio
* [x] Tarjetas de acciones
* [x] Mejoras en diseño y visualización del portafolio (gráficos interactivos, resumen mejorado, nuevos componentes de interfaz)
* [ ] Herramientas de rebalanceo
* [ ] Análisis de diversificación

### Mercado
* [x] Visualización de datos de mercado en tiempo real (con widgets de TradingView: gráfico avanzado, timeline, mapa de calor crypto)
* [x] Análisis de tendencias de mercado (facilitado por widgets de TradingView)
* [x] Centro de notificaciones y alertas (incluye alertas de mercado)

### Características técnicas
* [x] Página de perfil de usuario con datos y diseño mejorado
* [x] Página de configuración de cuenta con funcionalidad y mejoras de interfaz
* [x] Implementación de rutas de usuario y configuración de base de datos para gestión de perfiles y notificaciones
* [x] Almacenamiento de datos de usuario (con configuración de base de datos)
* [x] Implementación de base de datos para formularios
* [x] Autenticación de usuarios (base implementada con gestión de perfiles)
* [ ] API para datos financieros (propia)
* [x] Mejoras en la responsividad del diseño y estructura del código

## Capturas de Pantalla

*(Se agregarán cuando el proyecto esté más avanzado)*

## Contribuciones

Por el momento, al ser un proyecto académico individual, no se buscan contribuciones externas.

## Licencia

Este proyecto es parte de un trabajo académico del SENA y su uso está restringido a fines educativos.

---

*Este README se irá actualizando a medida que el proyecto avance.*
