#!/bin/bash
# Script para iniciar el proyecto completo

echo "🚀 Iniciando Financial AI Platform..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

echo "✅ Node.js versión: $(node --version)"
echo ""

# Nota: Backend movido a repositorio separado
echo "ℹ️  El backend ahora está en un repositorio separado en:"
echo "   C:\\Users\\mikia\\mi-proyecto-backend"

# Instalar dependencias del frontend si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
    echo ""
fi

echo "🎯 Para iniciar el proyecto completo:"
echo ""
echo "Terminal 1 (Backend - en repositorio separado):"
echo "cd C:\\Users\\mikia\\mi-proyecto-backend"
echo "venv\\Scripts\\activate  # Windows"
echo "# source venv/bin/activate  # macOS/Linux"
echo "pip install -r requirements.txt"
echo "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "Terminal 2 (Frontend - este repositorio):"
echo "npm run dev"
echo ""
echo "🌐 URLs:"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000/docs"
echo ""
echo "💡 Configura las API keys en C:\\Users\\mikia\\mi-proyecto-backend\\.env"
