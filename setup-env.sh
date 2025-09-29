#!/bin/bash

# Script de setup de variables de entorno para desarrollo local
# Este script crea el archivo .env.development si no existe

echo "🔧 Setup de Variables de Entorno - Mi Proyecto Frontend"
echo ""

# Verificar si .env.development ya existe
if [ -f ".env.development" ]; then
    echo "⚠️  El archivo .env.development ya existe."
    read -p "¿Deseas sobrescribirlo? (s/n): " overwrite
    if [ "$overwrite" != "s" ] && [ "$overwrite" != "S" ]; then
        echo "❌ Setup cancelado."
        exit 0
    fi
fi

# Crear .env.development
cat > .env.development << 'EOF'
# Variables de entorno para desarrollo local
# Este archivo se usa automáticamente cuando ejecutas: npm run dev

# URL del backend en desarrollo (localhost)
VITE_API_URL=http://localhost:8000

# Si quieres probar contra Heroku en desarrollo, descomenta la siguiente línea:
# VITE_API_URL=https://horizon-backend-316b23e32b8b.herokuapp.com
EOF

echo "✅ Archivo .env.development creado exitosamente!"
echo ""
echo "📝 Contenido:"
cat .env.development
echo ""
echo "💡 Para probar contra el backend de Heroku en desarrollo:"
echo "   Edita .env.development y cambia VITE_API_URL a:"
echo "   https://horizon-backend-316b23e32b8b.herokuapp.com"
echo ""
echo "🚀 Siguiente paso: npm install && npm run dev"
