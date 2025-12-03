import React from 'react';
import { useAdvancedMetrics } from '../../services/portfolioService';

// Componente de skeleton para carga
const MetricSkeleton: React.FC = () => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32"></div>
    <div className="text-right">
      <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
      <div className="h-3 bg-gray-100 rounded w-24"></div>
    </div>
  </div>
);

// Componente para mostrar errores
const MetricError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-sm text-gray-500 mb-2">No se pudieron cargar las métricas</p>
    <button 
      onClick={onRetry}
      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
    >
      Reintentar
    </button>
  </div>
);

const AdvancedMetrics: React.FC = () => {
  const { metrics, loading, error, refreshMetrics } = useAdvancedMetrics();

  // Formatear valor con signo si es positivo
  const formatWithSign = (value: number, unit: string = ''): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value}${unit}`;
  };

  // Formatear porcentaje
  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  if (error) {
    return (
      <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Métricas Avanzadas</h2>
        <MetricError onRetry={refreshMetrics} />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Métricas Avanzadas</h2>

      <div className="space-y-3 overflow-y-auto flex-grow pr-2">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : metrics ? (
          <>
            {/* Métrica 1: Tracking Error */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-medium text-gray-700">{metrics.tracking_error.label}</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercent(metrics.tracking_error.value)}
                </span>
                <p className="text-xs text-gray-500">
                  vs Benchmark: {formatPercent(metrics.tracking_error.benchmark)}
                </p>
              </div>
            </div>

            {/* Métrica 2: CVaR (95%) */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-medium text-gray-700">
                {metrics.cvar_95.label} ({metrics.cvar_95.period})
              </span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercent(metrics.cvar_95.value)}
                </span>
              </div>
            </div>

            {/* Métrica 3: Ratio de Sharpe */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-medium text-gray-700">{metrics.sharpe_ratio.label}</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {metrics.sharpe_ratio.value.toFixed(2)}
                </span>
                <p className="text-xs text-gray-500">
                  vs Grupo Pares: {metrics.sharpe_ratio.peer_group.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Métrica 4: Correlación con MSCI World */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-medium text-gray-700">{metrics.correlation_msci.label}</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {metrics.correlation_msci.value.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Métrica 5: Exposición Factor 'Value' */}
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm font-medium text-gray-700">{metrics.value_factor_exposure.label}</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {formatWithSign(metrics.value_factor_exposure.value)}
                </span>
                <p className="text-xs text-gray-500">
                  (Desv. Benchmark: {formatWithSign(metrics.value_factor_exposure.benchmark_deviation)})
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AdvancedMetrics;
