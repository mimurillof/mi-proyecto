import React from 'react';
import LiveMetricsCarousel from '../reports/widgets/LiveMetricsCarousel';
import PortfolioChart from '../portfolio/charts/PortfolioChart';

const PortfolioDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Portfolio
          </h1>
          <p className="text-gray-600">
            Análisis en tiempo real con datos del Portfolio Analyzer
          </p>
        </div>

        {/* Métricas KPI */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <LiveMetricsCarousel 
            title="Métricas Clave del Portfolio" 
            autoRefresh={true}
          />
        </div>

        {/* Gráficos principales en grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rendimiento Acumulado */}
          <PortfolioChart
            chartType="cumulative_returns"
            height="500px"
            className="col-span-1"
          />

          {/* Composición del Portfolio */}
          <PortfolioChart
            chartType="composition_donut"
            height="500px"
            className="col-span-1"
          />
        </div>

        {/* Análisis de Riesgo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matriz de Correlación */}
          <PortfolioChart
            chartType="correlation_matrix"
            height="400px"
            className="col-span-1"
          />

          {/* Análisis de Drawdown */}
          <PortfolioChart
            chartType="drawdown_underwater"
            height="400px"
            className="col-span-1"
          />
        </div>

        {/* Gráfico adicional de ancho completo */}
        <div className="w-full">
          <PortfolioChart
            chartType="breakdown_chart"
            height="400px"
            className="w-full"
          />
        </div>

        {/* Footer con información del sistema */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Portfolio Analyzer integrado con FastAPI + React</span>
            <span>Actualización automática cada 30 segundos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
