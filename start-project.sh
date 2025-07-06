#!/bin/bash
# Script para iniciar el proyecto completo

echo "🚀 Iniciando Financial AI Platform..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar si Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python no está instalado. Por favor instala Python 3.11+ primero."
    exit 1
fi

echo "✅ Node.js versión: $(node --version)"
echo "✅ Python versión: $(python --version)"
echo ""

# Verificar archivo .env en backend
if [ ! -f "mi-proyecto-backend-fastapi/.env" ]; then
    echo "⚠️  Archivo .env no encontrado en el backend."
    echo "📋 Copiando .env.example..."
    cp mi-proyecto-backend-fastapi/.env.example mi-proyecto-backend-fastapi/.env
    echo "✏️  Por favor edita mi-proyecto-backend-fastapi/.env con tus API keys"
    echo ""
fi

# Instalar dependencias del frontend si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
    echo ""
fi

# Verificar entorno virtual del backend
if [ ! -d "mi-proyecto-backend-fastapi/venv" ]; then
    echo "🐍 Creando entorno virtual de Python..."
    cd mi-proyecto-backend-fastapi
    python -m venv venv
    cd ..
    echo ""
fi

echo "🎯 Para iniciar el proyecto:"
echo ""
echo "Terminal 1 (Backend):"
echo "cd mi-proyecto-backend-fastapi"
echo "venv\\Scripts\\activate  # Windows"
echo "# source venv/bin/activate  # macOS/Linux"
echo "pip install -r requirements.txt"
echo "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "Terminal 2 (Frontend):"
echo "npm run dev"
echo ""
echo "🌐 URLs:"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000/docs"
echo ""
echo "💡 Asegúrate de configurar tus API keys en mi-proyecto-backend-fastapi/.env"
