import React from 'react';

const AnomalyDetection: React.FC = () => {
  return (
    // Contenedor principal adaptado para tema claro y dimensiones del contenedor padre
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 text-left">Detección de Anomalías y Oportunidades (IA)</h2>

      {/* Contenedor de Detecciones con scroll vertical */}
      <div className="space-y-3 overflow-y-auto flex-grow pr-2"> {/* Añadido flex-grow y padding derecho para scrollbar */}

        {/* Ejemplo: Anomalía */}
        <div className="flex items-start p-3 border rounded-md border-l-4 border-red-500 bg-red-50">
          <span className="text-red-600 mr-3 text-xl">⚠️</span> {/* Icono Indicador */}
          <div>
            <p className="font-medium text-red-800 text-sm text-left">Anomalía Detectada</p>
            <p className="text-xs text-gray-700 text-left">Volatilidad de 'AAPL' aumentó un 35% inesperadamente en las últimas 24h.</p>
          </div>
        </div>

        {/* Ejemplo: Oportunidad */}
        <div className="flex items-start p-3 border rounded-md border-l-4 border-green-500 bg-green-50">
          <span className="text-green-600 mr-3 text-xl">💡</span> {/* Icono Indicador */}
          <div>
            <p className="font-medium text-green-800 text-sm text-left">Oportunidad Potencial</p>
            <p className="text-xs text-gray-700 text-left">Patrón alcista identificado en 'MSFT' con probabilidad del 70%.</p>
          </div>
        </div>

        {/* Ejemplo: Alerta Informativa/Warning */}
        <div className="flex items-start p-3 border rounded-md border-l-4 border-amber-500 bg-amber-50">
          <span className="text-amber-600 mr-3 text-xl">ℹ️</span> {/* Icono Indicador */}
          <div>
            <p className="font-medium text-amber-800 text-sm text-left">Alerta</p>
            <p className="text-xs text-gray-700 text-left">El volumen de negociación de 'GOOGL' es inusualmente bajo hoy.</p>
          </div>
        </div>

        {/* Ejemplo: Otra Anomalía (sin icono, solo color) */}
        <div className="p-3 border rounded-md border-l-4 border-red-500 bg-red-50">
          <div>
            <p className="font-medium text-red-800 text-sm text-left">Anomalía: Correlación Rota</p>
            <p className="text-xs text-gray-700 text-left">La correlación histórica entre 'XOM' y el precio del petróleo se ha desviado significativamente.</p>
          </div>
        </div>

        {/* Ejemplo: Otra Oportunidad (sin icono, solo color) */}
        <div className="p-3 border rounded-md border-l-4 border-green-500 bg-green-50">
          <div>
            <p className="font-medium text-green-800 text-sm text-left">Oportunidad: Divergencia RSI</p>
            <p className="text-xs text-gray-700 text-left">Se detectó una divergencia alcista en el RSI para 'NVDA'.</p>
          </div>
        </div>

        {/* Añadir más detecciones aquí si es necesario */}

      </div>
    </div>
  );
};

export default AnomalyDetection;
