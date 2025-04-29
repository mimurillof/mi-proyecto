import React from 'react';

const AdvancedMetrics: React.FC = () => {
  return (
    // Contenedor principal adaptado para tema claro y dimensiones del contenedor padre
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Métricas Avanzadas</h2>

      {/* Contenedor para las métricas con scroll si es necesario */}
      <div className="space-y-3 overflow-y-auto flex-grow pr-2"> {/* Añadido flex-grow y padding derecho para scrollbar */}
        {/* Métrica 1: Tracking Error */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-sm font-medium text-gray-700">Tracking Error</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">1.85%</span>
            <p className="text-xs text-gray-500">vs Benchmark: 1.50%</p>
          </div>
        </div>

        {/* Métrica 2: CVaR (95%) */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-sm font-medium text-gray-700">CVaR (95%, 1 mes)</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">-4.20%</span>
          </div>
        </div>

        {/* Métrica 3: Ratio de Sharpe */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-sm font-medium text-gray-700">Ratio de Sharpe</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">0.75</span>
            <p className="text-xs text-gray-500">vs Grupo Pares: 0.68</p>
          </div>
        </div>

        {/* Métrica 4: Correlación con MSCI World */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-sm font-medium text-gray-700">Correlación (MSCI World)</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">0.88</span>
          </div>
        </div>

        {/* Métrica 5: Exposición Factor 'Value' */}
        <div className="flex justify-between items-center pb-2"> {/* Último elemento sin border-b */}
          <span className="text-sm font-medium text-gray-700">Exposición Factor 'Value'</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">+0.15</span>
            <p className="text-xs text-gray-500">(Desviación vs Benchmark)</p>
          </div>
        </div>

         {/* Añadir más métricas aquí si es necesario, seguirán el patrón */}

      </div>
    </div>
  );
};

export default AdvancedMetrics;
