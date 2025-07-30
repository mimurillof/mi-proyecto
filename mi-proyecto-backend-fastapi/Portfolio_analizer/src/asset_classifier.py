# src/asset_classifier.py
"""
Clasificador avanzado de activos financieros para análisis de portafolios.

Este módulo proporciona funcionalidades completas para la clasificación automática
de instrumentos financieros utilizando datos de Yahoo Finance. Genera visualizaciones
profesionales incluyendo gráficos de rueda (donut charts) y desgloses detallados.

Funcionalidades principales:
- Clasificación automática por tipo de instrumento (acciones, ETFs, bonos, etc.)
- Mapeo inteligente de categorías y sectores
- Gráficos interactivos con Plotly
- Exportación a múltiples formatos (HTML, PNG)
- Sistema de caché para optimizar consultas
- Control de generaciones diarias

Clases principales:
- AssetClassifier: Clasificador principal con análisis completo

Autor: Portfolio Analyzer Team
Fecha: Julio 2025
Versión: 2.0.0
"""

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from typing import Dict, List, Optional, Tuple, Any
import yfinance as yf
import json
from datetime import datetime
import os
from pathlib import Path
import warnings

# Importar función para guardar gráficos como imágenes
try:
    from .interactive_charts import save_chart_as_image
except ImportError:
    # Fallback para cuando se ejecuta desde fuera del paquete
    import sys
    sys.path.append(os.path.dirname(__file__))
    from interactive_charts import save_chart_as_image

# Suprimir advertencias de yfinance
warnings.filterwarnings("ignore", category=FutureWarning)


class AssetClassifier:
    """Clasificador de activos financieros basado en datos de Yahoo Finance (yfinance)."""
    
    # Mapeo de categorías de activos desde Yahoo Finance quoteType
    QUOTE_TYPE_MAPPING = {
        'EQUITY': 'Renta Variable',
        'ETF': 'ETF',
        'CRYPTOCURRENCY': 'Criptomonedas',
        'FUTURE': 'Futuros',
        'CURRENCY': 'Divisas',
        'INDEX': 'Índices',
        'MUTUALFUND': 'Fondos Mutuos',
        'OPTION': 'Opciones',
        'BOND': 'Renta Fija'
    }
    
    # Mapeo de categorías de activos (mantenido para compatibilidad)
    ASSET_CATEGORIES = {
        'Common Stock': 'Renta Variable',
        'ETF': 'ETF',
        'Crypto': 'Criptomonedas',
        'COMMODITY': 'Materias Primas',
        'Future': 'Futuros',
        'Bond': 'Renta Fija',
        'Index': 'Índices',
        'REIT': 'REITs',
        'Mutual Fund': 'Fondos Mutuos',
        'Preferred Stock': 'Acciones Preferentes'
    }
    
    # Colores para el gráfico de rueda (expandido)
    CATEGORY_COLORS = {
        'Renta Variable': '#1f77b4',
        'ETF': '#ff7f0e',
        'Criptomonedas': '#2ca02c',
        'Materias Primas': '#d62728',
        'Futuros': '#9467bd',
        'Renta Fija': '#8c564b',
        'Índices': '#e377c2',
        'REITs': '#7f7f7f',
        'Fondos Mutuos': '#bcbd22',
        'Acciones Preferentes': '#17becf',
        'Divisas': '#ff6692',
        'Opciones': '#b6e880',
        'Otros': '#aec7e8'
    }
    
    def __init__(self, cache_enabled: bool = True):
        """
        Inicializa el clasificador de activos.
        
        Args:
            cache_enabled (bool): Habilitar caché local para evitar llamadas API repetidas
        """
        self.cache_enabled = cache_enabled
        self.assets_cache = {} if cache_enabled else None
        
    def get_instrument_info(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene información fundamental de un ticker usando Yahoo Finance (yfinance).
        
        Args:
            ticker (str): Ticker del instrumento
            
        Returns:
            Dict: Información del instrumento o None si hay error
        """
        # Verificar caché primero
        if self.cache_enabled and ticker in self.assets_cache:
            return self.assets_cache[ticker]
            
        try:
            # Obtener información del ticker usando yfinance
            asset = yf.Ticker(ticker)
            info = asset.info
            
            if not info or len(info) < 3:  # Info mínima requerida
                return self._classify_ticker_basic(ticker)
            
            # Extraer información relevante
            quote_type = info.get('quoteType', 'UNKNOWN')
            name = info.get('longName', info.get('shortName', ticker))
            sector = info.get('sector', 'N/A')
            industry = info.get('industry', 'N/A')
            country = info.get('country', 'N/A')
            description = info.get('longBusinessSummary', info.get('description', 'N/A'))
            
            # Mapear quoteType a categoría
            category = self.QUOTE_TYPE_MAPPING.get(quote_type, 'Otros')
            
            # Refinamientos específicos
            if quote_type == 'ETF':
                category = self._refine_etf_classification(name, description)
            elif quote_type == 'FUTURE':
                # Los futuros suelen ser de materias primas
                category = 'Materias Primas'
            elif quote_type == 'EQUITY' and sector == 'Real Estate':
                category = 'REITs'
            
            result = {
                'General': {
                    'Type': quote_type,
                    'Name': name,
                    'Code': ticker,
                    'Description': description[:500] if len(description) > 500 else description,
                    'Sector': sector,
                    'Industry': industry,
                    'CountryName': country,
                    'Category': category
                }
            }
            
            # Guardar en caché
            if self.cache_enabled:
                self.assets_cache[ticker] = result
                
            return result
            
        except Exception as e:
            print(f"Error al obtener información para {ticker}: {e}")
            return self._classify_ticker_basic(ticker)
    
    def _refine_etf_classification(self, name: str, description: str) -> str:
        """
        Refina la clasificación de ETFs basada en su nombre y descripción.
        
        Args:
            name (str): Nombre del ETF
            description (str): Descripción del ETF
            
        Returns:
            str: Categoría refinada
        """
        text_to_analyze = (name + " " + description).lower()
        
        # Patrones para reclasificación de ETFs
        if any(keyword in text_to_analyze for keyword in ['bond', 'fixed income', 'treasury', 'debt']):
            return 'Renta Fija'
        elif any(keyword in text_to_analyze for keyword in ['real estate', 'reit', 'property']):
            return 'REITs'
        elif any(keyword in text_to_analyze for keyword in ['commodity', 'gold', 'oil', 'silver', 'copper']):
            return 'Materias Primas'
        elif any(keyword in text_to_analyze for keyword in ['crypto', 'bitcoin', 'ethereum', 'blockchain']):
            return 'Criptomonedas'
        else:
            return 'ETF'
    
    def _classify_ticker_basic(self, ticker: str) -> Dict[str, Any]:
        """
        Clasificación básica basada en patrones del ticker cuando yfinance no funciona.
        
        Args:
            ticker (str): Ticker del instrumento
            
        Returns:
            Dict: Información básica inferida
        """
        ticker_upper = ticker.upper()
        
        # Patrones mejorados para clasificación por ticker
        if any(pattern in ticker_upper for pattern in ['BTC', 'ETH', 'ADA', 'XRP', 'DOGE', '-USD', '-EUR']):
            asset_type = 'CRYPTOCURRENCY'
            category = 'Criptomonedas'
        elif ticker_upper.endswith('=F') or any(commodity in ticker_upper for commodity in ['GC', 'CL', 'NG', 'SI', 'ZC', 'ZS']):
            asset_type = 'FUTURE'
            category = 'Materias Primas'
        elif ticker_upper.endswith('=X'):
            asset_type = 'CURRENCY'
            category = 'Divisas'
        elif ticker_upper.startswith('^') or any(index in ticker_upper for index in ['SPX', 'NDX', 'RUT', 'VIX']):
            asset_type = 'INDEX'
            category = 'Índices'
        elif any(etf_pattern in ticker_upper for etf_pattern in ['SPY', 'QQQ', 'IWM', 'VTI', 'VOO', 'TLT', 'IEF', 'GLD', 'SLV']):
            asset_type = 'ETF'
            category = 'ETF'
        elif any(bond_pattern in ticker_upper for bond_pattern in ['TLT', 'IEF', 'SHY', 'BND', 'AGG']):
            asset_type = 'BOND'
            category = 'Renta Fija'
        else:
            asset_type = 'EQUITY'
            category = 'Renta Variable'
            
        return {
            'General': {
                'Type': asset_type,
                'Name': ticker,
                'Code': ticker,
                'Description': f'Instrumento financiero {ticker} (clasificación básica)',
                'Sector': 'N/A',
                'Industry': 'N/A',
                'CountryName': 'N/A',
                'Category': category
            }
        }
    
    def classify_portfolio_assets(self, tickers: List[str], weights: Dict[str, float]) -> pd.DataFrame:
        """
        Clasifica todos los activos del portafolio y calcula pesos por categoría.
        
        Args:
            tickers (List[str]): Lista de tickers
            weights (Dict[str, float]): Pesos de cada ticker en el portafolio
            
        Returns:
            pd.DataFrame: DataFrame con información clasificada de activos
        """
        portfolio_classification = []
        
        for ticker in tickers:
            print(f"Clasificando: {ticker}")
            info = self.get_instrument_info(ticker)
            
            if info and 'General' in info:
                general_info = info['General']
                asset_type = general_info.get('Type', 'UNKNOWN')
                
                # Usar categoría ya calculada o mapear desde tipo
                category = general_info.get('Category')
                if not category:
                    category = self.QUOTE_TYPE_MAPPING.get(asset_type, 'Otros')
                
                # Refinamiento adicional para ETFs (mantenido para compatibilidad)
                if category == 'ETF':
                    description = general_info.get('Description', '').lower()
                    name = general_info.get('Name', '').lower()
                    category = self._refine_etf_classification(name, description)
                
                asset_details = {
                    'ticker': ticker,
                    'name': general_info.get('Name', ticker),
                    'type': asset_type,
                    'category': category,
                    'weight': weights.get(ticker, 0.0),
                    'sector': general_info.get('Sector', 'N/A'),
                    'industry': general_info.get('Industry', 'N/A'),
                    'country': general_info.get('CountryName', 'N/A'),
                    'description': general_info.get('Description', 'N/A')
                }
            else:
                # Fallback básico
                asset_details = {
                    'ticker': ticker,
                    'name': ticker,
                    'type': 'UNKNOWN',
                    'category': 'Otros',
                    'weight': weights.get(ticker, 0.0),
                    'sector': 'N/A',
                    'industry': 'N/A',
                    'country': 'N/A',
                    'description': 'Información no disponible'
                }
            
            portfolio_classification.append(asset_details)
            
        return pd.DataFrame(portfolio_classification)
    
    def create_donut_chart(self, classification_df: pd.DataFrame, title: str = "Clasificación de Activos del Portafolio") -> go.Figure:
        """
        Crea un gráfico de rueda (donut chart) con la distribución de activos por categoría.
        
        Args:
            classification_df (pd.DataFrame): DataFrame con clasificación de activos
            title (str): Título del gráfico
            
        Returns:
            go.Figure: Gráfico de rueda interactivo
        """
        # Agrupar por categoría y sumar pesos
        category_weights = classification_df.groupby('category')['weight'].sum().reset_index()
        category_weights = category_weights.sort_values('weight', ascending=False)
        
        # Preparar datos para el gráfico
        labels = category_weights['category'].tolist()
        values = category_weights['weight'].tolist()
        colors = [self.CATEGORY_COLORS.get(cat, '#aec7e8') for cat in labels]
        
        # Crear texto personalizado para hover
        hover_text = []
        for i, (cat, weight) in enumerate(zip(labels, values)):
            assets_in_category = classification_df[classification_df['category'] == cat]
            asset_list = ', '.join(assets_in_category['ticker'].tolist())
            hover_text.append(f"<b>{cat}</b><br>Peso: {weight:.1%}<br>Activos: {asset_list}")
        
        # Crear el gráfico de rueda
        fig = go.Figure(data=[go.Pie(
            labels=labels,
            values=values,
            hole=0.4,  # Esto crea el "vacío" en el centro (donut)
            marker=dict(colors=colors, line=dict(color='white', width=2)),
            textinfo='label+percent',
            textposition='outside',
            hovertemplate='%{text}<extra></extra>',
            text=hover_text,
            textfont=dict(size=12),
            showlegend=True
        )])
        
        # Configurar layout
        fig.update_layout(
            title={
                'text': title,
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 18, 'family': 'Arial, sans-serif'}
            },
            font=dict(size=12),
            showlegend=True,
            legend=dict(
                orientation="v",
                yanchor="middle",
                y=0.5,
                xanchor="left",
                x=1.05
            ),
            margin=dict(l=20, r=120, t=60, b=20),
            width=800,
            height=600
        )
        
        # Añadir texto en el centro del donut
        total_assets = len(classification_df)
        total_weight = classification_df['weight'].sum()
        fig.add_annotation(
            text=f"<b>{total_assets}</b><br>Activos<br><span style='font-size:10px'>Total: {total_weight:.1%}</span>",
            x=0.5, y=0.5,
            font_size=16,
            showarrow=False
        )
        
        return fig
    
    def create_detailed_breakdown_chart(self, classification_df: pd.DataFrame) -> go.Figure:
        """
        Crea un gráfico de barras horizontal con desglose detallado por activo.
        
        Args:
            classification_df (pd.DataFrame): DataFrame con clasificación de activos
            
        Returns:
            go.Figure: Gráfico de barras horizontal
        """
        # Ordenar por peso descendente
        df_sorted = classification_df.sort_values('weight', ascending=True)
        
        # Crear colores basados en categoría
        colors = [self.CATEGORY_COLORS.get(cat, '#aec7e8') for cat in df_sorted['category']]
        
        fig = go.Figure(data=[go.Bar(
            y=df_sorted['ticker'],
            x=df_sorted['weight'],
            orientation='h',
            marker=dict(color=colors),
            text=[f"{w:.1%}" for w in df_sorted['weight']],
            textposition='outside',
            hovertemplate='<b>%{y}</b><br>' +
                         'Peso: %{x:.1%}<br>' +
                         'Categoría: %{customdata[0]}<br>' +
                         'Nombre: %{customdata[1]}<br>' +
                         'Sector: %{customdata[2]}<extra></extra>',
            customdata=df_sorted[['category', 'name', 'sector']].values
        )])
        
        fig.update_layout(
            title="Desglose Detallado por Activo",
            xaxis_title="Peso en el Portafolio",
            yaxis_title="Activos",
            xaxis_tickformat='.1%',
            height=max(400, len(df_sorted) * 25),
            margin=dict(l=80, r=80, t=60, b=60)
        )
        
        return fig
    
    def _clean_old_files_same_day(self, output_dir: str, date_str: str) -> None:
        """
        Limpia archivos del mismo día para evitar acumulación.
        
        Args:
            output_dir (str): Directorio de salida
            date_str (str): Fecha en formato YYYYMMDD
        """
        patterns_to_clean = [
            f"clasificacion_activos_{date_str}_*.html",
            f"desglose_activos_{date_str}_*.html",
            f"donut_chart_{date_str}_*.png",
            f"breakdown_chart_{date_str}_*.png"
        ]
        
        for pattern in patterns_to_clean:
            for file_path in Path(output_dir).glob(pattern):
                try:
                    file_path.unlink()
                    print(f"Archivo anterior del día eliminado: {file_path}")
                except Exception as e:
                    print(f"Error al eliminar archivo {file_path}: {e}")

    def save_charts_to_html(self, classification_df: pd.DataFrame, output_dir: str = "outputs") -> Dict[str, str]:
        """
        Guarda los gráficos como archivos HTML interactivos y PNG con control de generaciones diarias.
        Solo permite una versión por día, sobreescribiendo reportes del mismo día.
        
        Args:
            classification_df (pd.DataFrame): DataFrame con clasificación de activos
            output_dir (str): Directorio de salida
            
        Returns:
            Dict[str, str]: Rutas de los archivos generados
        """
        # Crear directorio de salida si no existe
        Path(output_dir).mkdir(exist_ok=True)
        
        # Timestamp para control diario (solo fecha)
        current_date = datetime.now().strftime("%Y%m%d")
        current_time = datetime.now().strftime("%H%M%S")
        
        # Limpiar archivos del mismo día antes de generar nuevos
        self._clean_old_files_same_day(output_dir, current_date)
        
        # Generar gráficos
        donut_fig = self.create_donut_chart(classification_df)
        breakdown_fig = self.create_detailed_breakdown_chart(classification_df)
        
        # Guardar archivos con nomenclatura controlada por día
        files_created = {}
        
        # Gráfico de rueda HTML
        donut_path = os.path.join(output_dir, f"clasificacion_activos_{current_date}_{current_time}.html")
        donut_fig.write_html(donut_path)
        files_created['donut_chart'] = donut_path
        
        # Gráfico de rueda PNG
        donut_png_path = save_chart_as_image(
            donut_fig, 
            f"donut_chart_{current_date}_{current_time}",
            output_dir,
            format="png",
            width=1200,
            height=800
        )
        files_created['donut_chart_png'] = donut_png_path
        
        # Gráfico de rueda como div
        donut_div_path = os.path.join(output_dir, f"clasificacion_activos_{current_date}_{current_time}_div.html")
        donut_div_html = donut_fig.to_html(div_id="donut-chart", include_plotlyjs='cdn')
        with open(donut_div_path, 'w', encoding='utf-8') as f:
            f.write(donut_div_html)
        files_created['donut_chart_div'] = donut_div_path
        
        # Gráfico de desglose HTML
        breakdown_path = os.path.join(output_dir, f"desglose_activos_{current_date}_{current_time}.html")
        breakdown_fig.write_html(breakdown_path)
        files_created['breakdown_chart'] = breakdown_path
        
        # Gráfico de desglose PNG
        breakdown_png_path = save_chart_as_image(
            breakdown_fig, 
            f"breakdown_chart_{current_date}_{current_time}",
            output_dir,
            format="png",
            width=1200,
            height=800
        )
        files_created['breakdown_chart_png'] = breakdown_png_path
        
        # Gráfico de desglose como div
        breakdown_div_path = os.path.join(output_dir, f"desglose_activos_{current_date}_{current_time}_div.html")
        breakdown_div_html = breakdown_fig.to_html(div_id="breakdown-chart", include_plotlyjs='cdn')
        with open(breakdown_div_path, 'w', encoding='utf-8') as f:
            f.write(breakdown_div_html)
        files_created['breakdown_chart_div'] = breakdown_div_path
        
        print(f"✓ Reportes generados para el día {current_date} a las {current_time[:2]}:{current_time[2:4]}:{current_time[4:6]}")
        print(f"✓ Archivos PNG generados: gráfico donut y desglose")
        
        return files_created
    
    def get_reports_history(self, output_dir: str = "outputs") -> pd.DataFrame:
        """
        Obtiene el historial de reportes generados organizados por fecha.
        
        Args:
            output_dir (str): Directorio de salida
            
        Returns:
            pd.DataFrame: DataFrame con historial de reportes
        """
        history_data = []
        
        # Patrones de archivos a buscar
        patterns = [
            "clasificacion_activos_*.html",
            "desglose_activos_*.html"
        ]
        
        for pattern in patterns:
            for file_path in Path(output_dir).glob(pattern):
                try:
                    # Extraer fecha del nombre del archivo
                    filename = file_path.stem
                    parts = filename.split('_')
                    
                    # Buscar la parte que contiene la fecha (formato YYYYMMDD)
                    date_str = None
                    time_str = None
                    
                    for part in parts:
                        if len(part) == 8 and part.isdigit():
                            date_str = part
                        elif len(part) == 6 and part.isdigit():
                            time_str = part
                    
                    if date_str:
                        # Convertir fecha
                        date_obj = datetime.strptime(date_str, "%Y%m%d")
                        
                        # Información del archivo
                        file_stats = file_path.stat()
                        
                        history_data.append({
                            'fecha': date_obj.strftime("%Y-%m-%d"),
                            'hora': f"{time_str[:2]}:{time_str[2:4]}:{time_str[4:6]}" if time_str else "N/A",
                            'tipo_reporte': 'Clasificación' if 'clasificacion' in filename else 'Desglose',
                            'archivo': file_path.name,
                            'ruta_completa': str(file_path),
                            'tamaño_kb': round(file_stats.st_size / 1024, 2),
                            'modificado': datetime.fromtimestamp(file_stats.st_mtime).strftime("%Y-%m-%d %H:%M:%S")
                        })
                        
                except Exception as e:
                    print(f"Error procesando archivo {file_path}: {e}")
        
        if history_data:
            df = pd.DataFrame(history_data)
            return df.sort_values(['fecha', 'hora'], ascending=[False, False])
        else:
            return pd.DataFrame()
    
    def cleanup_old_reports(self, output_dir: str = "outputs", days_to_keep: int = 30) -> Dict[str, int]:
        """
        Limpia reportes antiguos manteniendo solo los últimos N días.
        
        Args:
            output_dir (str): Directorio de salida
            days_to_keep (int): Número de días de reportes a mantener
            
        Returns:
            Dict[str, int]: Estadísticas de limpieza
        """
        cutoff_date = datetime.now() - pd.Timedelta(days=days_to_keep)
        cutoff_date_str = cutoff_date.strftime("%Y%m%d")
        
        patterns = [
            "clasificacion_activos_*.html",
            "desglose_activos_*.html"
        ]
        
        files_deleted = 0
        files_kept = 0
        space_freed = 0
        
        for pattern in patterns:
            for file_path in Path(output_dir).glob(pattern):
                try:
                    # Extraer fecha del nombre del archivo
                    filename = file_path.stem
                    parts = filename.split('_')
                    
                    # Buscar la parte que contiene la fecha (formato YYYYMMDD)
                    date_str = None
                    for part in parts:
                        if len(part) == 8 and part.isdigit():
                            date_str = part
                            break
                    
                    if date_str and date_str < cutoff_date_str:
                        # Archivo antiguo, eliminar
                        file_size = file_path.stat().st_size
                        file_path.unlink()
                        files_deleted += 1
                        space_freed += file_size
                        print(f"Eliminado reporte antiguo: {file_path.name}")
                    else:
                        files_kept += 1
                        
                except Exception as e:
                    print(f"Error procesando archivo {file_path}: {e}")
        
        return {
            'archivos_eliminados': files_deleted,
            'archivos_mantenidos': files_kept,
            'espacio_liberado_kb': round(space_freed / 1024, 2),
            'dias_mantenidos': days_to_keep
        }
    
    def check_daily_reports_exist(self, output_dir: str = "outputs") -> Dict[str, bool]:
        """
        Verifica si ya existen reportes para el día actual.
        
        Args:
            output_dir (str): Directorio de salida
            
        Returns:
            Dict[str, bool]: Estado de existencia de reportes del día
        """
        current_date = datetime.now().strftime("%Y%m%d")
        
        patterns = {
            'clasificacion': f"clasificacion_activos_{current_date}_*.html",
            'desglose': f"desglose_activos_{current_date}_*.html"
        }
        
        reports_status = {}
        
        for report_type, pattern in patterns.items():
            existing_files = list(Path(output_dir).glob(pattern))
            reports_status[report_type] = len(existing_files) > 0
            
            if existing_files:
                latest_file = max(existing_files, key=lambda f: f.stat().st_mtime)
                mod_time = datetime.fromtimestamp(latest_file.stat().st_mtime)
                reports_status[f'{report_type}_last_generated'] = mod_time.strftime("%H:%M:%S")
                reports_status[f'{report_type}_file'] = latest_file.name
        
        return reports_status
    
    def show_daily_reports_status(self, output_dir: str = "outputs") -> None:
        """
        Muestra el estado de los reportes del día actual.
        
        Args:
            output_dir (str): Directorio de salida
        """
        status = self.check_daily_reports_exist(output_dir)
        
        current_date = datetime.now().strftime("%Y-%m-%d")
        print(f"\n📊 Estado de reportes para {current_date}:")
        print("=" * 50)
        
        for report_type in ['clasificacion', 'desglose']:
            if status.get(report_type, False):
                last_time = status.get(f'{report_type}_last_generated', 'N/A')
                filename = status.get(f'{report_type}_file', 'N/A')
                print(f"✅ {report_type.capitalize()}: Generado a las {last_time}")
                print(f"   Archivo: {filename}")
            else:
                print(f"❌ {report_type.capitalize()}: No generado hoy")
        
        print("=" * 50)
        print("💡 Los reportes del mismo día se sobreescriben automáticamente")
    
def classify_and_visualize_portfolio(tickers: List[str], weights: Dict[str, float], 
                                   cache_enabled: bool = True, output_dir: str = "outputs",
                                   cleanup_old_reports: bool = False, days_to_keep: int = 30) -> Tuple[pd.DataFrame, Dict[str, str]]:
    """
    Función de conveniencia para clasificar y visualizar activos de un portafolio usando Yahoo Finance.
    Implementa control de generaciones diarias - solo una versión por día.
    
    Args:
        tickers (List[str]): Lista de tickers
        weights (Dict[str, float]): Pesos de cada ticker
        cache_enabled (bool): Habilitar caché para evitar llamadas API repetidas
        output_dir (str): Directorio de salida para gráficos
        cleanup_old_reports (bool): Limpiar reportes antiguos
        days_to_keep (int): Días de reportes a mantener si se activa la limpieza
        
    Returns:
        Tuple[pd.DataFrame, Dict[str, str]]: DataFrame de clasificación y rutas de archivos
    """
    classifier = AssetClassifier(cache_enabled=cache_enabled)
    
    # Limpiar reportes antiguos si se solicita
    if cleanup_old_reports:
        cleanup_stats = classifier.cleanup_old_reports(output_dir, days_to_keep)
        print(f"✓ Limpieza completada: {cleanup_stats['archivos_eliminados']} archivos eliminados, "
              f"{cleanup_stats['espacio_liberado_kb']} KB liberados")
    
    # Clasificar activos
    print("🔍 Iniciando clasificación de activos...")
    classification_df = classifier.classify_portfolio_assets(tickers, weights)
    
    # Generar y guardar gráficos (con control de generaciones diarias)
    print("📊 Generando gráficos...")
    files_created = classifier.save_charts_to_html(classification_df, output_dir)
    
    return classification_df, files_created


# Ejemplo de uso
if __name__ == "__main__":
    # Ejemplo con portafolio diversificado usando diferentes tipos de tickers
    example_tickers = [
        "AAPL",      # Apple Inc. (Acción)
        "MSFT",      # Microsoft Corp. (Acción)
        "GOOGL",     # Alphabet Inc. (Acción)
        "SPY",       # SPDR S&P 500 ETF (ETF)
        "QQQ",       # Invesco QQQ ETF (ETF)
        "BTC-USD",   # Bitcoin (Criptomoneda)
        "ETH-USD",   # Ethereum (Criptomoneda)
        "GLD",       # SPDR Gold ETF (ETF - Materias Primas)
        "TLT",       # iShares 20+ Year Treasury Bond ETF (ETF - Renta Fija)
        "VNQ",       # Vanguard Real Estate ETF (ETF - REITs)
        "GC=F",      # Gold Futures (Futuro)
        "EURUSD=X",  # EUR/USD (Divisa)
        "^GSPC"      # S&P 500 Index (Índice)
    ]
    
    example_weights = {
        "AAPL": 0.15,
        "MSFT": 0.12,
        "GOOGL": 0.10,
        "SPY": 0.20,
        "QQQ": 0.10,
        "BTC-USD": 0.08,
        "ETH-USD": 0.05,
        "GLD": 0.08,
        "TLT": 0.07,
        "VNQ": 0.03,
        "GC=F": 0.01,
        "EURUSD=X": 0.005,
        "^GSPC": 0.005
    }
    
    print("=== ANÁLISIS DE PORTAFOLIO CON CONTROL DE GENERACIONES ===")
    print(f"Analizando {len(example_tickers)} activos...")
    
    # Mostrar estado actual de reportes
    # classifier_temp = AssetClassifier()
    # classifier_temp.show_daily_reports_status()
    
    # Clasificar y visualizar usando Yahoo Finance (gratuito) con control de generaciones
    classification_df, files = classify_and_visualize_portfolio(
        example_tickers, 
        example_weights, 
        cache_enabled=True,  # Habilitar caché para eficiencia
        cleanup_old_reports=True,  # Limpiar reportes antiguos
        days_to_keep=30  # Mantener reportes de los últimos 30 días
    )
    
    print("\n=== RESULTADOS DE CLASIFICACIÓN ===")
    print(classification_df[['ticker', 'name', 'category', 'weight', 'sector']].to_string(index=False))
    
    # Mostrar resumen por categoría
    print("\n=== RESUMEN POR CATEGORÍA ===")
    category_summary = classification_df.groupby('category').agg({
        'weight': 'sum',
        'ticker': 'count'
    }).round(3)
    category_summary.columns = ['Peso Total', 'Número de Activos']
    category_summary['Peso %'] = (category_summary['Peso Total'] * 100).round(1).astype(str) + '%'
    print(category_summary.to_string())
    
    print(f"\n=== ARCHIVOS GENERADOS ===")
    for key, path in files.items():
        print(f"- {key}: {path}")
    
    # Mostrar historial de reportes
    print("\n=== HISTORIAL DE REPORTES ===")
    classifier = AssetClassifier()
    history_df = classifier.get_reports_history()
    if not history_df.empty:
        print(history_df[['fecha', 'hora', 'tipo_reporte', 'archivo', 'tamaño_kb']].to_string(index=False))
    else:
        print("No se encontraron reportes previos.")
    
    print(f"\nTotal de activos analizados: {len(classification_df)}")
    print(f"Peso total del portafolio: {classification_df['weight'].sum():.1%}")
    print(f"\n💡 Nota: Los reportes del mismo día se sobreescriben automáticamente.")
    print(f"💡 Los reportes de días diferentes se mantienen hasta la limpieza automática.")