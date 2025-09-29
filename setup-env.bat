@echo off
REM Script de setup de variables de entorno para desarrollo local (Windows)
REM Este script crea el archivo .env.development si no existe

echo 🔧 Setup de Variables de Entorno - Mi Proyecto Frontend
echo.

REM Verificar si .env.development ya existe
if exist .env.development (
    echo ⚠️  El archivo .env.development ya existe.
    set /p overwrite="¿Deseas sobrescribirlo? (s/n): "
    if /i not "%overwrite%"=="s" (
        echo ❌ Setup cancelado.
        exit /b 0
    )
)

REM Crear .env.development
(
echo # Variables de entorno para desarrollo local
echo # Este archivo se usa automáticamente cuando ejecutas: npm run dev
echo.
echo # URL del backend en desarrollo ^(localhost^)
echo VITE_API_URL=http://localhost:8000
echo.
echo # Si quieres probar contra Heroku en desarrollo, descomenta la siguiente línea:
echo # VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
) > .env.development

echo ✅ Archivo .env.development creado exitosamente!
echo.
echo 📝 Contenido:
type .env.development
echo.
echo 💡 Para probar contra el backend de Heroku en desarrollo:
echo    Edita .env.development y cambia VITE_API_URL a:
echo    https://horizon-backend-316b23e32b8b.herokuapp.com
echo.
echo 🚀 Siguiente paso: npm install ^&^& npm run dev
pause
