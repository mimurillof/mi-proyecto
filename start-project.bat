@echo off
REM Script para iniciar el proyecto completo en Windows

echo 🚀 Iniciando Financial AI Platform...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ primero.
    pause
    exit /b 1
)

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no está instalado. Por favor instala Python 3.11+ primero.
    pause
    exit /b 1
)

echo ✅ Node.js versión:
node --version
echo ✅ Python versión:
python --version
echo.

REM Verificar archivo .env en backend
if not exist "mi-proyecto-backend-fastapi\.env" (
    echo ⚠️  Archivo .env no encontrado en el backend.
    echo 📋 Copiando .env.example...
    copy "mi-proyecto-backend-fastapi\.env.example" "mi-proyecto-backend-fastapi\.env"
    echo ✏️  Por favor edita mi-proyecto-backend-fastapi\.env con tus API keys
    echo.
)

REM Instalar dependencias del frontend si es necesario
if not exist "node_modules" (
    echo 📦 Instalando dependencias del frontend...
    npm install
    echo.
)

REM Verificar entorno virtual del backend
if not exist "mi-proyecto-backend-fastapi\venv" (
    echo 🐍 Creando entorno virtual de Python...
    cd mi-proyecto-backend-fastapi
    python -m venv venv
    cd ..
    echo.
)

echo 🎯 Para iniciar el proyecto:
echo.
echo Terminal 1 (Backend):
echo cd mi-proyecto-backend-fastapi
echo venv\Scripts\activate
echo pip install -r requirements.txt
echo python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo.
echo Terminal 2 (Frontend):
echo npm run dev
echo.
echo 🌐 URLs:
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000/docs
echo.
echo 💡 Asegúrate de configurar tus API keys en mi-proyecto-backend-fastapi\.env
echo.
pause
