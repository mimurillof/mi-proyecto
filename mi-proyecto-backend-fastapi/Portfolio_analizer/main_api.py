# main_api.py
"""
API principal FastAPI para el Portfolio Analyzer.

Esta API REST proporciona endpoints completos para el análisis de portafolios de inversión,
incluyendo análisis personalizado, reportes automáticos, optimización de portafolios,
clasificación de activos y visualizaciones interactivas.

Endpoints principales:
- /analyze: Análisis completo de portafolio personalizado
- /diversified-analysis: Análisis de portafolio diversificado automático
- /asset-classification: Clasificación y visualización de activos
- /health: Estado de la API

Tecnologías utilizadas:
- FastAPI: Framework web moderno y rápido
- Pydantic: Validación de datos
- CORS: Soporte para aplicaciones web

Autor: Portfolio Analyzer Team
Fecha: Julio 2025
Versión: 2.0.0
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
import os
from pathlib import Path
from datetime import datetime, timedelta

# Importar módulos del proyecto
from src.portfolio_metrics import generate_complete_analysis, calculate_portfolio_returns
from src.data_manager import fetch_portfolio_data, calculate_returns, get_current_asset_info
from src.api_responses import format_for_fastapi
from src.asset_classifier import AssetClassifier, classify_and_visualize_portfolio
from nuevo_portafolio_webapp import get_diversified_portfolio_config, analyze_diversified_portfolio_for_webapp

# TODO: Importar dependencias de base de datos cuando estén implementadas
# from database.config import get_database_connection
# from database.models import User, Portfolio, AnalysisResult

app = FastAPI(
    title="Portfolio Analyzer API",
    description="API para análisis de portafolios de inversión con métricas avanzadas y optimización",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== MODELOS PYDANTIC PARA VALIDACIÓN =====

class PortfolioAnalysisRequest(BaseModel):
    """Modelo para solicitud de análisis de portafolio personalizado"""
    tickers: List[str]
    weights: Dict[str, float]
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    risk_free_rate: Optional[float] = 0.04
    generate_charts: Optional[bool] = True

class UserPortfolioConfig(BaseModel):
    """Modelo para configuración de portafolio de usuario (futuro: desde BD)"""
    user_id: int
    portfolio_name: str
    tickers: List[str]
    weights: Dict[str, float]
    risk_tolerance: str  # "conservative", "moderate", "aggressive"
    investment_horizon: int  # días

class AssetClassificationRequest(BaseModel):
    """Modelo para solicitud de clasificación de activos"""
    tickers: List[str]
    weights: Dict[str, float]
    api_key: Optional[str] = None
    include_charts: Optional[bool] = True
    
# TODO: Modelos para base de datos
# class DatabaseUser(BaseModel):
#     user_id: int
#     email: str
#     portfolio_configs: List[UserPortfolioConfig]

@app.get("/asset/{ticker}/current-info")
async def get_asset_info(ticker: str):
    """
    Obtiene información completa y actualizada de un activo específico.
    
    Devuelve datos en tiempo real incluyendo precio, capitalización de mercado,
    volumen, ratios financieros y información fundamental básica.
    """
    asset_info = get_current_asset_info(ticker)
    if asset_info.get("error"):
        raise HTTPException(status_code=404, detail=asset_info["error"])
    return JSONResponse(content=asset_info)

# ===== ENDPOINTS PRINCIPALES =====

@app.get("/")
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "Portfolio Analyzer API",
        "version": "2.0.0",
        "status": "active",
        "documentation": "/docs",
        "endpoints": {
            "analyze_default": "/api/portfolio/analyze",
            "analyze_custom": "/api/portfolio/analyze/custom",
            "classify_assets": "/api/portfolio/classify",
            "classify_example": "/api/portfolio/classify/example",
            "get_config": "/api/portfolio/config",
            "health_check": "/api/health",
            "charts": "/api/files/charts/",
            "interactive_charts": "/api/files/charts/interactive/",
            "reports": "/api/files/reports/"
        }
    }

@app.get("/api/health")
async def health_check():
    """Verificación de salud de la API"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "data_acquisition": "operational",
            "portfolio_analysis": "operational",
            "chart_generation": "operational"
            # TODO: Agregar verificación de base de datos
            # "database": "operational" if database.is_connected() else "down"
        }
    }

@app.get("/api/portfolio/analyze")
async def analyze_default_portfolio():
    """
    Analiza el portafolio diversificado por defecto
    Retorna análisis completo en formato JSON optimizado para frontend
    """
    try:
        print("🚀 Iniciando análisis del portafolio por defecto...")
        
        # Ejecutar análisis del portafolio diversificado
        results = analyze_diversified_portfolio_for_webapp()
        
        if results["success"]:
            return JSONResponse(
                content={
                    "status": "success",
                    "message": "Análisis completado exitosamente",
                    "data": results["api_response"],
                    "generated_files": list(results["output_files"].keys()),
                    "analysis_timestamp": datetime.now().isoformat()
                },
                status_code=200
            )
        else:
            raise HTTPException(
                status_code=500, 
                detail=f"Error en el análisis: {results.get('error', 'Error desconocido')}"
            )
            
    except Exception as e:
        print(f"❌ Error en endpoint de análisis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/portfolio/analyze/custom")
async def analyze_custom_portfolio(request: PortfolioAnalysisRequest):
    """
    Analiza un portafolio personalizado con parámetros específicos del usuario
    """
    try:
        print(f"🔧 Analizando portafolio personalizado: {request.tickers}")
        
        # Validar pesos
        total_weight = sum(request.weights.values())
        if abs(total_weight - 1.0) > 0.01:
            raise HTTPException(
                status_code=400, 
                detail=f"Los pesos deben sumar 1.0, suma actual: {total_weight:.4f}"
            )
        
        # Validar que todos los tickers tengan pesos
        missing_weights = set(request.tickers) - set(request.weights.keys())
        if missing_weights:
            raise HTTPException(
                status_code=400,
                detail=f"Faltan pesos para los siguientes tickers: {list(missing_weights)}"
            )
        
        # Configurar fechas
        end_date = request.end_date or datetime.now().strftime('%Y-%m-%d')
        start_date = request.start_date or (datetime.now() - timedelta(days=730)).strftime('%Y-%m-%d')
        
        # Descargar datos
        print(f"📊 Descargando datos del {start_date} al {end_date}...")
        asset_data = fetch_portfolio_data(
            tickers=request.tickers,
            start_date=start_date,
            end_date=end_date
        )
        
        if asset_data.empty:
            raise HTTPException(
                status_code=404,
                detail="No se pudieron obtener datos para los tickers especificados"
            )
        
        # Calcular retornos
        asset_returns = calculate_returns(asset_data)
        
        # Calcular retornos del portafolio
        weights_array = [request.weights[ticker] for ticker in request.tickers]
        portfolio_returns = calculate_portfolio_returns(asset_returns, weights_array)
        
        # Ejecutar análisis completo
        output_files = generate_complete_analysis(
            portfolio_returns=portfolio_returns,
            asset_returns=asset_returns,
            portfolio_weights=request.weights,
            risk_free_rate=request.risk_free_rate,
            output_dir="outputs",
            generate_api_response=True
        )
        
        # Generar respuesta para API
        from src.portfolio_metrics import generate_performance_summary, find_optimal_portfolios
        
        performance_metrics = generate_performance_summary(portfolio_returns, request.risk_free_rate)
        optimal_portfolios = find_optimal_portfolios(asset_returns, request.risk_free_rate)
        
        api_response = format_for_fastapi(
            portfolio_returns=portfolio_returns,
            asset_returns=asset_returns,
            portfolio_weights=request.weights,
            metrics=performance_metrics,
            optimized_portfolios=optimal_portfolios,
            output_dir="outputs"
        )
        
        return JSONResponse(
            content={
                "status": "success",
                "message": "Análisis personalizado completado",
                "request_parameters": request.dict(),
                "data": api_response,
                "generated_files": list(output_files.keys()),
                "analysis_timestamp": datetime.now().isoformat()
            },
            status_code=200
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en análisis personalizado: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/portfolio/config")
async def get_portfolio_config():
    """
    Obtiene la configuración del portafolio por defecto
    """
    try:
        config = get_diversified_portfolio_config()
        return JSONResponse(
            content={
                "status": "success",
                "config": config,
                "description": "Configuración del portafolio diversificado por defecto",
                "last_updated": datetime.now().isoformat()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== ENDPOINTS PARA ARCHIVOS GENERADOS =====

@app.get("/api/files/charts/{filename}")
async def get_chart_file(filename: str):
    """
    Endpoint para servir archivos de gráficos generados
    """
    file_path = Path("outputs") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    if not filename.endswith(('.png', '.jpg', '.jpeg', '.svg')):
        raise HTTPException(status_code=400, detail="Tipo de archivo no permitido")
    
    return FileResponse(
        path=file_path,
        media_type='image/png',
        filename=filename
    )

@app.get("/api/files/reports/{filename}")
async def get_report_file(filename: str):
    """
    Endpoint para servir reportes en Markdown
    """
    file_path = Path("outputs") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    if not filename.endswith('.md'):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos Markdown")
    
    return FileResponse(
        path=file_path,
        media_type='text/markdown',
        filename=filename
    )

# ===== ENDPOINTS PARA CLASIFICACIÓN DE ACTIVOS =====

@app.post("/api/portfolio/classify")
async def classify_portfolio_assets(request: AssetClassificationRequest):
    """
    Clasifica los activos del portafolio por tipo y genera gráficos de rueda.
    
    Returns:
        JSONResponse: Clasificación de activos y rutas de gráficos generados
    """
    try:
        print(f"🔍 Iniciando clasificación de activos: {request.tickers}")
        
        # Validar que los pesos sumen 1
        total_weight = sum(request.weights.values())
        if abs(total_weight - 1.0) > 0.01:
            raise HTTPException(
                status_code=400, 
                detail=f"Los pesos deben sumar 1.0, suma actual: {total_weight:.3f}"
            )
        
        # Validar que todos los tickers tengan peso
        missing_weights = [ticker for ticker in request.tickers if ticker not in request.weights]
        if missing_weights:
            raise HTTPException(
                status_code=400,
                detail=f"Faltan pesos para los tickers: {missing_weights}"
            )
        
        # Realizar clasificación
        classifier = AssetClassifier(api_key=request.api_key)
        classification_df = classifier.classify_portfolio_assets(request.tickers, request.weights)
        
        response_data = {
            "classification": classification_df.to_dict('records'),
            "summary": {
                "total_assets": len(classification_df),
                "categories": classification_df.groupby('category')['weight'].sum().to_dict(),
                "top_category": classification_df.groupby('category')['weight'].sum().idxmax(),
                "most_weighted_asset": classification_df.loc[classification_df['weight'].idxmax(), 'ticker']
            }
        }
        
        # Generar gráficos si se solicita
        if request.include_charts:
            print("📊 Generando gráficos de clasificación...")
            files_created = classifier.save_charts_to_html(classification_df, "outputs")
            response_data["charts"] = {
                "donut_chart": files_created.get('donut_chart'),
                "donut_chart_div": files_created.get('donut_chart_div'),
                "breakdown_chart": files_created.get('breakdown_chart'),
                "breakdown_chart_div": files_created.get('breakdown_chart_div')
            }
            print(f"✅ Gráficos generados: {list(files_created.keys())}")
        
        return JSONResponse(
            content={
                "status": "success",
                "message": "Clasificación de activos completada",
                "data": response_data,
                "timestamp": datetime.now().isoformat()
            },
            status_code=200
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en clasificación de activos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/portfolio/classify/example")
async def get_classification_example():
    """
    Obtiene un ejemplo de clasificación de activos con un portafolio diversificado.
    
    Returns:
        JSONResponse: Ejemplo de clasificación sin generar gráficos
    """
    try:
        # Portafolio de ejemplo diversificado
        example_request = AssetClassificationRequest(
            tickers=["AAPL", "MSFT", "SPY", "BTC-USD", "GLD", "TLT", "VNQ", "AMZN"],
            weights={
                "AAPL": 0.15,    # Tech individual
                "MSFT": 0.10,    # Tech individual  
                "AMZN": 0.10,    # Tech individual
                "SPY": 0.25,     # ETF S&P 500
                "BTC-USD": 0.05, # Criptomoneda
                "GLD": 0.10,     # ETF Oro
                "TLT": 0.15,     # ETF Bonos largo plazo
                "VNQ": 0.10      # ETF Real Estate
            },
            api_key=None,  # Usar clasificación básica
            include_charts=False
        )
        
        # Realizar clasificación
        classifier = AssetClassifier()
        classification_df = classifier.classify_portfolio_assets(
            example_request.tickers, 
            example_request.weights
        )
        
        return JSONResponse(
            content={
                "status": "success",
                "message": "Ejemplo de clasificación de activos",
                "data": {
                    "classification": classification_df.to_dict('records'),
                    "summary": {
                        "total_assets": len(classification_df),
                        "categories": classification_df.groupby('category')['weight'].sum().to_dict()
                    }
                },
                "note": "Este es un ejemplo. Usa POST /api/portfolio/classify para tu portafolio personalizado.",
                "timestamp": datetime.now().isoformat()
            }
        )
        
    except Exception as e:
        print(f"❌ Error en ejemplo de clasificación: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files/charts/interactive/{filename}")
async def get_interactive_chart(filename: str):
    """
    Sirve archivos HTML interactivos de gráficos (incluye donut charts).
    """
    file_path = Path("outputs") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    if not filename.endswith('.html'):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos HTML")
    
    return FileResponse(
        path=file_path,
        media_type='text/html',
        filename=filename
    )

# ===== ENDPOINTS FUTUROS PARA BASE DE DATOS =====

# TODO: Implementar cuando la base de datos esté configurada
# @app.get("/api/users/{user_id}/portfolios")
# async def get_user_portfolios(user_id: int, db = Depends(get_database_connection)):
#     """
#     Obtiene todos los portafolios de un usuario específico
#     """
#     try:
#         portfolios = db.query(Portfolio).filter(Portfolio.user_id == user_id).all()
#         return {"user_id": user_id, "portfolios": portfolios}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/api/users/{user_id}/portfolios")
# async def create_user_portfolio(user_id: int, portfolio: UserPortfolioConfig, 
#                               db = Depends(get_database_connection)):
#     """
#     Crea un nuevo portafolio para un usuario
#     """
#     try:
#         new_portfolio = Portfolio(**portfolio.dict(), user_id=user_id)
#         db.add(new_portfolio)
#         db.commit()
#         return {"message": "Portafolio creado exitosamente", "portfolio_id": new_portfolio.id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/api/users/{user_id}/portfolios/{portfolio_id}/analyze")
# async def analyze_user_portfolio(user_id: int, portfolio_id: int, 
#                                db = Depends(get_database_connection)):
#     """
#     Analiza un portafolio específico de un usuario
#     """
#     try:
#         portfolio = db.query(Portfolio).filter(
#             Portfolio.user_id == user_id, 
#             Portfolio.id == portfolio_id
#         ).first()
#         
#         if not portfolio:
#             raise HTTPException(status_code=404, detail="Portafolio no encontrado")
#         
#         # Ejecutar análisis usando la configuración del usuario
#         # ... lógica de análisis ...
#         
#         return {"user_id": user_id, "portfolio_id": portfolio_id, "analysis": "..."}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# ===== MANEJO DE ERRORES =====

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "status": "error",
            "message": "Recurso no encontrado",
            "detail": str(exc.detail) if hasattr(exc, 'detail') else "Not found"
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error", 
            "message": "Error interno del servidor",
            "detail": str(exc.detail) if hasattr(exc, 'detail') else "Internal server error"
        }
    )

# ===== FUNCIONES DE INICIO =====

def create_directories():
    """Crea directorios necesarios si no existen"""
    Path("outputs").mkdir(exist_ok=True)
    print("📁 Directorios de salida verificados")

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Iniciando Portfolio Analyzer API...")
    create_directories()
    
    # Ejecutar servidor de desarrollo
    uvicorn.run(
        "main_api:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
    
    print("📖 Documentación disponible en: http://127.0.0.1:8000/docs")
    print("🔄 API disponible en: http://127.0.0.1:8000")
