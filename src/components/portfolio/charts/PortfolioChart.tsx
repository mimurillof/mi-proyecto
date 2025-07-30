import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Maximize2 } from 'lucide-react';
import { getChartUrl, fetchHealthCheck } from '../../../services/portfolioService';

interface PortfolioChartProps {
  chartType: 'cumulative_returns' | 'composition_donut' | 'correlation_matrix' | 'drawdown_underwater' | 'breakdown_chart';
  title?: string;
  height?: string;
  className?: string;
}

const chartTitles = {
  cumulative_returns: 'Rendimiento Acumulado',
  composition_donut: 'Composición del Portfolio',
  correlation_matrix: 'Matriz de Correlación',
  drawdown_underwater: 'Análisis de Drawdown',
  breakdown_chart: 'Desglose de Activos'
};

const PortfolioChart: React.FC<PortfolioChartProps> = ({
  chartType,
  title,
  height = '400px',
  className = ''
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartUrl, setChartUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const displayTitle = title || chartTitles[chartType];

  useEffect(() => {
    const initializeChart = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar que hay datos disponibles
        const healthCheck = await fetchHealthCheck();
        
        if (!healthCheck.has_recent_analysis) {
          throw new Error('No hay análisis recientes disponibles');
        }

        // Construir la URL del gráfico
        const url = getChartUrl(chartType);
        setChartUrl(url);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    initializeChart();
  }, [chartType]);

  const handleRefresh = () => {
    // Añadir timestamp para forzar recarga del iframe
    const url = getChartUrl(chartType);
    setChartUrl(`${url}?t=${Date.now()}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Renderizado de loading
  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{displayTitle}</h3>
        </div>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="flex items-center space-x-2 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Cargando gráfico...</span>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{displayTitle}</h3>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Actualizar gráfico"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4" style={{ height }}>
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div className="text-center">
            <p className="text-gray-600 mb-2">Error al cargar el gráfico</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado normal
  return (
    <>
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{displayTitle}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Pantalla completa"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Actualizar gráfico"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-1">
          <iframe
            src={chartUrl}
            title={displayTitle}
            className="w-full border-0 rounded-b-lg"
            style={{ height }}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        </div>
      </div>

      {/* Modal de pantalla completa */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{displayTitle}</h3>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar pantalla completa"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 p-1">
              <iframe
                src={chartUrl}
                title={displayTitle}
                className="w-full h-full border-0 rounded-b-lg"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioChart;
