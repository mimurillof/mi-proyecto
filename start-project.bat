@echo off
REM Script para iniciar el proyecto frontend

echo 🚀 Iniciando Financial AI Platform Frontend...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ primero.
    pause
    exit /b 1
)

echo ✅ Node.js versión:
node --version
echo.

echo ⚠️  IMPORTANTE: Este frontend requiere que el backend esté corriendo
echo 📋 Backend repositorio: mi-proyecto-backend  
echo 🌐 Backend URL esperada: http://localhost:8000
echo.

echo 🔍 Verificando conexión con backend...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% EQU 0 (
    echo ✅ Backend conectado correctamente
) else (
    echo ❌ Backend no detectado en http://localhost:8000
    echo � Por favor inicia el backend primero:
    echo    1. Navega al repositorio: mi-proyecto-backend
    echo    2. Ejecuta: start-backend.bat
    echo    3. Espera a que esté corriendo en puerto 8000
    echo    4. Luego ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

REM Instalar dependencias del frontend si es necesario
if not exist "node_modules" (
    echo 📦 Instalando dependencias del frontend...
    npm install
    echo.
)

echo 🎯 Iniciando servidor de desarrollo...
echo � Frontend estará disponible en: http://localhost:5173+
echo 📚 Backend API docs: http://localhost:8000/docs
echo.

npm run dev

pause
