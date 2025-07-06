#!/usr/bin/env python3
"""
Script para probar upload de documentos al agente
"""

import requests

BASE_URL = "http://localhost:8000/api/ai"

def test_document_upload():
    """Probar upload de documento"""
    print("🧪 Probando upload de documento...")
    
    # Crear un archivo de texto de prueba
    test_content = """
    Reporte Financiero - TechCorp Q2 2025
    
    Ingresos: $50M (crecimiento 25% YoY)
    Gastos: $35M 
    Beneficio neto: $15M
    
    El crecimiento ha sido sólido en el sector tecnológico.
    Las proyecciones para Q3 son optimistas.
    """
    
    with open("test_document.txt", "w", encoding="utf-8") as f:
        f.write(test_content)
    
    # Subir el archivo
    with open("test_document.txt", "rb") as f:
        files = {"file": ("test_document.txt", f, "text/plain")}
        data = {"message": "Analiza este reporte financiero y identifica riesgos y oportunidades"}
        
        response = requests.post(
            f"{BASE_URL}/chat/upload",
            files=files,
            data=data
        )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Modelo usado: {result['model_used']}")
        print(f"Respuesta: {result['response'][:200]}...")
    else:
        print(f"Error: {response.text}")
    
    # Limpiar archivo de prueba
    import os
    if os.path.exists("test_document.txt"):
        os.remove("test_document.txt")

if __name__ == "__main__":
    print("🚀 === Prueba de Upload de Documentos ===\n")
    
    try:
        test_document_upload()
        print("\n✅ Prueba completada!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
