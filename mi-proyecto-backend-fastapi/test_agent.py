#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de prueba para el agente financiero Horizon v3.0
"""

import asyncio
import sys
import os
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.insert(0, str(Path(__file__).parent))

from chat_agent import HorizonAgent, ChatRequest


async def test_agent():
    """Pruebas del agente financiero"""
    print("🧪 === Pruebas del Agente Horizon v3.0 ===\n")
    
    try:
        # Inicializar agente
        agent = HorizonAgent()
        print("✅ Agente inicializado correctamente\n")
        
        # Obtener estado del agente
        status = agent.get_agent_status()
        print(f"📊 Estado del agente: {status}\n")
        
        # Prueba 1: Consulta simple
        print("🔬 Prueba 1: Consulta financiera simple")
        request1 = ChatRequest(
            message="¿Qué es el P/E ratio y cómo se calcula?"
        )
        response1 = await agent.process_chat(request1)
        print(f"Modelo usado: {response1.model_used}")
        print(f"Herramientas: {response1.tools_used}")
        print(f"Respuesta: {response1.response[:200]}...")
        print("✅ Prueba 1 completada\n")
        
        # Prueba 2: Búsqueda de noticias
        print("🔬 Prueba 2: Búsqueda de noticias")
        request2 = ChatRequest(
            message="¿Cuáles son las últimas noticias sobre Tesla y su precio de acción?"
        )
        response2 = await agent.process_chat(request2)
        print(f"Modelo usado: {response2.model_used}")
        print(f"Herramientas: {response2.tools_used}")
        print(f"Respuesta: {response2.response[:200]}...")
        print("✅ Prueba 2 completada\n")
        
        # Prueba 3: Análisis con URL
        print("🔬 Prueba 3: Análisis de URL")
        request3 = ChatRequest(
            message="Analiza la información financiera de esta página web",
            url="https://finance.yahoo.com"
        )
        response3 = await agent.process_chat(request3)
        print(f"Modelo usado: {response3.model_used}")
        print(f"Herramientas: {response3.tools_used}")
        print(f"URLs procesadas: {response3.urls_processed}")
        print(f"Respuesta: {response3.response[:200]}...")
        print("✅ Prueba 3 completada\n")
        
        # Prueba 4: Análisis con documento
        print("🔬 Prueba 4: Análisis de documento")
        sample_financial_data = """
        Reporte Financiero Q3 2024
        
        Ingresos: $50,000,000
        Gastos: $35,000,000
        Utilidad Neta: $15,000,000
        Margen de Utilidad: 30%
        
        Métricas Clave:
        - ROE: 15%
        - Deuda/Capital: 0.4
        - Crecimiento YoY: 12%
        """
        
        request4 = ChatRequest(
            message="Analiza este reporte financiero y proporciona insights clave",
            file_content=sample_financial_data,
            file_type="text/plain"
        )
        response4 = await agent.process_chat(request4)
        print(f"Modelo usado: {response4.model_used}")
        print(f"Respuesta: {response4.response[:300]}...")
        print("✅ Prueba 4 completada\n")
        
        print("🎉 Todas las pruebas completadas exitosamente!")
        
    except Exception as e:
        print(f"❌ Error durante las pruebas: {e}")
        import traceback
        traceback.print_exc()


async def interactive_chat():
    """Chat interactivo con el agente"""
    print("💬 === Chat Interactivo con Horizon v3.0 ===\n")
    print("Escribe 'salir' para terminar")
    print("Escribe 'status' para ver el estado del agente")
    print("=" * 50)
    
    try:
        agent = HorizonAgent()
        session_id = agent.create_session()
        print(f"📋 Sesión creada: {session_id}\n")
        
        while True:
            user_input = input("💬 Tu consulta: ").strip()
            
            if user_input.lower() in ['salir', 'exit', 'quit']:
                print("\n👋 ¡Gracias por usar Horizon!")
                break
                
            if user_input.lower() == 'status':
                status = agent.get_agent_status()
                print(f"📊 Estado: {status}")
                continue
                
            if not user_input:
                print("⚠️ Ingresa una consulta válida")
                continue
            
            try:
                request = ChatRequest(
                    message=user_input,
                    session_id=session_id
                )
                
                print("🤖 Procesando...")
                response = await agent.process_chat(request)
                
                print(f"\n🎯 Respuesta ({response.model_used}):")
                print("-" * 40)
                print(response.response)
                
                if response.tools_used:
                    print(f"\n🔧 Herramientas usadas: {', '.join(response.tools_used)}")
                
                if response.urls_processed:
                    print(f"🔗 URLs procesadas: {len(response.urls_processed)}")
                
                if response.token_usage:
                    print(f"📊 Tokens: {response.token_usage}")
                
                print("\n" + "=" * 50)
                
            except Exception as e:
                print(f"❌ Error: {e}")
    
    except Exception as e:
        print(f"❌ Error inicializando chat: {e}")


def main():
    """Función principal"""
    if len(sys.argv) > 1:
        if sys.argv[1] == 'test':
            asyncio.run(test_agent())
        elif sys.argv[1] == 'chat':
            asyncio.run(interactive_chat())
        else:
            print("Uso: python test_agent.py [test|chat]")
    else:
        print("Selecciona una opción:")
        print("1. Ejecutar pruebas")
        print("2. Chat interactivo")
        choice = input("Opción (1 o 2): ").strip()
        
        if choice == '1':
            asyncio.run(test_agent())
        elif choice == '2':
            asyncio.run(interactive_chat())
        else:
            print("Opción no válida")


if __name__ == "__main__":
    main()
