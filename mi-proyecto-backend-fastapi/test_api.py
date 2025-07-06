#!/usr/bin/env python3
"""
Script para probar los endpoints del agente de IA integrado en FastAPI
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/ai"

def test_chat_endpoint():
    """Probar el endpoint de chat"""
    print("🧪 Probando endpoint de chat...")
    
    response = requests.post(
        f"{BASE_URL}/chat",
        json={"message": "¿Qué es el P/E ratio?"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_status_endpoint():
    """Probar el endpoint de estado"""
    print("🧪 Probando endpoint de estado...")
    
    response = requests.get(f"{BASE_URL}/status")
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_url_analysis():
    """Probar el análisis de URL"""
    print("🧪 Probando análisis de URL...")
    
    response = requests.post(
        f"{BASE_URL}/analyze-url",
        data={
            "url": "https://finance.yahoo.com/",
            "query": "Analiza esta página financiera"
        }
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_search_news():
    """Probar búsqueda de noticias"""
    print("🧪 Probando búsqueda de noticias...")
    
    response = requests.post(
        f"{BASE_URL}/search-news",
        data={"query": "últimas noticias Tesla precio acciones"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

if __name__ == "__main__":
    print("🚀 === Pruebas de API del Agente Horizon ===\n")
    
    try:
        test_status_endpoint()
        test_chat_endpoint()
        test_search_news()
        test_url_analysis()
        
        print("✅ Todas las pruebas completadas!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor FastAPI")
        print("Asegúrate de que el servidor esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
