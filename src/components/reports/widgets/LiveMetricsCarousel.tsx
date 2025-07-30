import React, { useRef, useState, useEffect } from 'react';
import MetricCard, { MetricData } from './MetricCard';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useLiveMetrics, formatPercentage, formatNumber, LiveMetricsResponse } from '../../../services/portfolioService';

interface MetricsCarouselProps {
  title?: string;
  autoRefresh?: boolean;
}

/**
 * Convierte los datos del Portfolio Analyzer al formato esperado por MetricCard
 */
const convertToMetricData = (metrics: LiveMetricsResponse | null): MetricData[] => {
  if (!metrics?.performance_metrics) return [];

  const { performance_metrics, risk_analysis } = metrics;

  return [
    {
      id: 'annualized_return',
      name: 'Retorno Anualizado',
      value: formatPercentage(performance_metrics.annualized_return / 100),
      change: undefined // No tenemos datos históricos para calcular cambio
    },
    {
      id: 'annualized_volatility',
      name: 'Volatilidad (Anualizada)',
      value: formatPercentage(performance_metrics.annualized_volatility / 100),
      change: undefined
    },
    {
      id: 'sharpe_ratio',
      name: 'Sharpe Ratio',
      value: formatNumber(performance_metrics.sharpe_ratio),
      change: undefined
    },
    {
      id: 'max_drawdown',
      name: 'Máxima Reducción',
      value: formatPercentage(performance_metrics.max_drawdown / 100),
      change: undefined
    },
    {
      id: 'sortino_ratio',
      name: 'Sortino Ratio',
      value: formatNumber(performance_metrics.sortino_ratio),
      change: undefined
    },
    {
      id: 'calmar_ratio',
      name: 'Calmar Ratio',
      value: formatNumber(performance_metrics.calmar_ratio),
      change: undefined
    },
    {
      id: 'var_daily',
      name: 'VaR Diario',
      value: formatPercentage(performance_metrics.var_daily / 100),
      change: undefined
    },
    {
      id: 'current_drawdown',
      name: 'Drawdown Actual',
      value: formatPercentage(risk_analysis?.drawdown_analysis?.current_drawdown / 100 || 0),
      change: undefined
    }
  ];
};

const LiveMetricsCarousel: React.FC<MetricsCarouselProps> = ({ 
  title = "Métricas del Portfolio", 
  autoRefresh = true 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Usar el hook de métricas en vivo
  const { metrics, loading, error, refreshMetrics } = useLiveMetrics(autoRefresh);

  // Convertir los datos a formato MetricData
  const metricData = convertToMetricData(metrics);

  const cardWidth = 192 + 16; // Ancho de tarjeta (w-48 = 192px) + gap (gap-4 = 16px)
  const scrollAmount = cardWidth * 3; // Desplazar 3 tarjetas a la vez

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < maxScrollLeft - 1); // -1 para margen de error
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Comprobar al montar y al cambiar tamaño
      checkScrollability(); 
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);

      // Limpiar listeners al desmontar
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [metricData]); // Re-evaluar si las métricas cambian

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      const amount = direction === 'left' ? -scrollAmount : scrollAmount;
      container.scrollTo({
        left: currentScroll + amount,
        behavior: 'smooth',
      });
    }
  };

  // Componente de Loading
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        {title && <h3 className="text-sm font-medium text-gray-600 mb-3 px-1">{title}</h3>}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando métricas...</span>
          </div>
        </div>
      </div>
    );
  }

  // Componente de Error
  if (error) {
    return (
      <div className="flex flex-col h-full">
        {title && <h3 className="text-sm font-medium text-gray-600 mb-3 px-1">{title}</h3>}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="text-sm text-center">Error al cargar métricas</span>
            <button
              onClick={refreshMetrics}
              className="text-xs text-indigo-600 hover:text-indigo-800 underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No hay datos
  if (metricData.length === 0) {
    return (
      <div className="flex flex-col h-full">
        {title && <h3 className="text-sm font-medium text-gray-600 mb-3 px-1">{title}</h3>}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <AlertCircle className="w-8 h-8" />
            <span className="text-sm text-center">No hay datos disponibles</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con título y botón de refresh */}
      <div className="flex items-center justify-between mb-3 px-1">
        {title && <h3 className="text-sm font-medium text-gray-600">{title}</h3>}
        <div className="flex items-center space-x-2">
          {metrics?.timestamp && (
            <span className="text-xs text-gray-400">
              Actualizado: {new Date(metrics.timestamp).toLocaleString()}
            </span>
          )}
          <button
            onClick={refreshMetrics}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Actualizar métricas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center">
        {/* Flecha Izquierda */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 hover:bg-white rounded-full shadow border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity -ml-3`}
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Contenedor Deslizable */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide py-1 px-1 scroll-snap-type-x-mandatory"
        >
          {metricData.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Flecha Derecha */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 hover:bg-white rounded-full shadow border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity -mr-3`}
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default LiveMetricsCarousel;
