import React from 'react';
import TradingViewHeatmapWidget from '../components/market/TradingViewHeatmapWidget';
import TradingViewCryptoHeatmapWidget from '../components/market/TradingViewCryptoHeatmapWidget';
import TradingViewTimelineWidget from '../components/market/TradingViewTimelineWidget';
import TradingViewAdvancedChartWidget from '../components/market/TradingViewAdvancedChartWidget'; // <-- Importar el nuevo widget

const MarketPage: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col text-gray-800">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Fila Superior */}
        <div className="md:col-span-3 bg-gray-200 rounded-lg shadow p-0 flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[503px] overflow-hidden">
          {/* Contenedor Superior Izquierdo (aprox. 800x503) */}
          <TradingViewHeatmapWidget />
        </div>
        <div className="md:col-span-2 bg-gray-200 rounded-lg shadow p-0 flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[503px] overflow-hidden">
          {/* Contenedor Superior Derecho (aprox. 625x503) */}
          <TradingViewCryptoHeatmapWidget />
        </div>
        
        {/* Fila Inferior */}
        <div className="md:col-span-3 bg-gray-200 rounded-lg shadow p-0 flex items-center justify-center min-h-[250px] md:min-h-[350px] lg:min-h-[443px] overflow-hidden">
          {/* Contenedor Inferior Izquierdo (aprox. 921x443) */}
          <TradingViewAdvancedChartWidget />
        </div>
        <div className="md:col-span-2 bg-gray-200 rounded-lg shadow p-0 flex flex-col items-center justify-center text-center min-h-[250px] md:min-h-[350px] lg:min-h-[443px] overflow-hidden">
          {/* Contenedor Inferior Derecho (aprox. 500x443) */}
          <TradingViewTimelineWidget />
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
