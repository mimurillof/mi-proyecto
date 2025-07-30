"""
Router para la integración con Portfolio Analyzer
Proporciona endpoints para servir métricas y gráficos generados por el analizador
"""

import os
import json
import glob
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Configuración del directorio de outputs del Portfolio Analyzer
PORTFOLIO_OUTPUTS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), 
    "Portfolio_analizer", 
    "outputs"
)

def get_latest_json_file() -> Optional[str]:
    """
    Encuentra el archivo JSON más reciente en el directorio de outputs
    """
    try:
        json_pattern = os.path.join(PORTFOLIO_OUTPUTS_DIR, "api_response_*.json")
        json_files = glob.glob(json_pattern)
        
        if not json_files:
            logger.warning(f"No se encontraron archivos JSON en {PORTFOLIO_OUTPUTS_DIR}")
            return None
            
        # Ordenar por fecha de modificación (más reciente primero)
        latest_file = max(json_files, key=os.path.getmtime)
        logger.info(f"Archivo JSON más reciente: {latest_file}")
        return latest_file
        
    except Exception as e:
        logger.error(f"Error al buscar archivos JSON: {str(e)}")
        return None

def get_latest_html_file(chart_type: str) -> Optional[str]:
    """
    Encuentra el archivo HTML más reciente para un tipo de gráfico específico
    
    Args:
        chart_type: Tipo de gráfico ('cumulative_returns', 'composition_donut', etc.)
    """
    try:
        # Mapeo de nombres de gráficos a patrones de archivo
        chart_patterns = {
            'cumulative_returns': 'rendimiento_acumulado_interactivo_*.html',
            'composition_donut': 'donut_chart_interactivo_*.html',
            'correlation_matrix': 'matriz_correlacion_interactiva_*.html',
            'drawdown_underwater': 'drawdown_underwater_interactivo_*.html',
            'breakdown_chart': 'breakdown_chart_interactivo_*.html'
        }
        
        if chart_type not in chart_patterns:
            logger.warning(f"Tipo de gráfico no reconocido: {chart_type}")
            return None
            
        html_pattern = os.path.join(PORTFOLIO_OUTPUTS_DIR, chart_patterns[chart_type])
        html_files = glob.glob(html_pattern)
        
        if not html_files:
            logger.warning(f"No se encontraron archivos HTML para {chart_type}")
            return None
            
        # Ordenar por fecha de modificación (más reciente primero)
        latest_file = max(html_files, key=os.path.getmtime)
        logger.info(f"Archivo HTML más reciente para {chart_type}: {latest_file}")
        return latest_file
        
    except Exception as e:
        logger.error(f"Error al buscar archivos HTML para {chart_type}: {str(e)}")
        return None

@router.get("/api/portfolio/live-metrics")
async def get_live_metrics():
    """
    Endpoint para obtener las métricas en vivo del portfolio
    Retorna performance_metrics y risk_analysis del archivo JSON más reciente
    """
    try:
        latest_json = get_latest_json_file()
        
        if not latest_json:
            raise HTTPException(
                status_code=404, 
                detail="No se encontraron archivos de análisis de portfolio"
            )
        
        with open(latest_json, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Extraer las secciones requeridas según el mapeo del TODO.md
        response_data = {
            "timestamp": data.get("timestamp"),
            "analysis_period": data.get("analysis_period"),
            "portfolio_composition": data.get("portfolio_composition"),
            "performance_metrics": data.get("performance_metrics", {}),
            "risk_analysis": data.get("risk_analysis", {}),
            "correlations": data.get("correlations", {})
        }
        
        logger.info("Métricas en vivo servidas exitosamente")
        return response_data
        
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Archivo de métricas no encontrado"
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Error al decodificar el archivo de métricas"
        )
    except Exception as e:
        logger.error(f"Error al obtener métricas en vivo: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/api/portfolio/charts/{chart_name}")
async def get_portfolio_chart(chart_name: str):
    """
    Endpoint para servir los gráficos HTML generados por el Portfolio Analyzer
    
    Args:
        chart_name: Nombre del gráfico ('cumulative_returns', 'composition_donut', etc.)
    """
    try:
        latest_html = get_latest_html_file(chart_name)
        
        if not latest_html:
            raise HTTPException(
                status_code=404,
                detail=f"Gráfico '{chart_name}' no encontrado"
            )
        
        if not os.path.exists(latest_html):
            raise HTTPException(
                status_code=404,
                detail=f"Archivo de gráfico no existe: {latest_html}"
            )
        
        logger.info(f"Sirviendo gráfico: {chart_name} desde {latest_html}")
        
        # Leer el contenido HTML y servirlo directamente
        with open(latest_html, 'r', encoding='utf-8') as file:
            html_content = file.read()
        
        return HTMLResponse(content=html_content)
        
    except Exception as e:
        logger.error(f"Error al servir gráfico {chart_name}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al servir gráfico: {str(e)}"
        )

@router.get("/api/portfolio/latest-analysis-timestamp")
async def get_latest_analysis_timestamp():
    """
    Endpoint de control para obtener el timestamp del último análisis
    Utilizado por el frontend para detectar actualizaciones automáticas
    """
    try:
        latest_json = get_latest_json_file()
        
        if not latest_json:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron archivos de análisis"
            )
        
        # Obtener la fecha de modificación del archivo
        modification_time = os.path.getmtime(latest_json)
        timestamp = datetime.fromtimestamp(modification_time)
        
        # Leer también el timestamp interno del JSON para mayor precisión
        with open(latest_json, 'r', encoding='utf-8') as file:
            data = json.load(file)
            internal_timestamp = data.get("timestamp")
        
        response_data = {
            "file_modification_time": timestamp.isoformat(),
            "internal_timestamp": internal_timestamp,
            "file_path": os.path.basename(latest_json)
        }
        
        logger.info(f"Timestamp del último análisis: {timestamp}")
        return response_data
        
    except Exception as e:
        logger.error(f"Error al obtener timestamp: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener timestamp: {str(e)}"
        )

@router.get("/api/portfolio/health")
async def portfolio_health_check():
    """
    Endpoint de salud para verificar la disponibilidad del Portfolio Analyzer
    """
    try:
        outputs_dir_exists = os.path.exists(PORTFOLIO_OUTPUTS_DIR)
        latest_json = get_latest_json_file()
        has_recent_data = latest_json is not None
        
        if has_recent_data:
            file_age_seconds = datetime.now().timestamp() - os.path.getmtime(latest_json)
            file_age_hours = file_age_seconds / 3600
        else:
            file_age_hours = None
        
        return {
            "status": "healthy" if outputs_dir_exists and has_recent_data else "warning",
            "outputs_directory_exists": outputs_dir_exists,
            "outputs_directory_path": PORTFOLIO_OUTPUTS_DIR,
            "has_recent_analysis": has_recent_data,
            "latest_file_age_hours": file_age_hours,
            "available_charts": [
                'cumulative_returns',
                'composition_donut', 
                'correlation_matrix',
                'drawdown_underwater',
                'breakdown_chart'
            ]
        }
        
    except Exception as e:
        logger.error(f"Error en health check: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }
