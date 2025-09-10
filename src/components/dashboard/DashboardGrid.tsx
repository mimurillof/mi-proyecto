import React, { useState } from 'react';
import UpperLeftContainer from './containers/UpperLeftContainer';
import UpperRightContainer from './containers/UpperRightContainer';
import CentralContainer from './containers/CentralContainer';
import LowerLeftContainer from './containers/LowerLeftContainer';
import LowerRightContainer from './containers/LowerRightContainer';

// Definir la interfaz para los datos de activos
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  units: number;
}

/**
 * Componente principal que organiza la grid del dashboard
 * según el layout proporcionado en la imagen de referencia
 */
const DashboardGrid: React.FC = () => {
  // Estado para el activo seleccionado
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

  // Función para seleccionar un activo
  const handleStockSelect = (stock: StockData) => {
    setSelectedStock(stock);
  };

  // Función para volver al view general del portafolio
  const handlePortfolioView = () => {
    setSelectedStock(null);
  };
  return (
    <>
      {/* Fila superior - 3 contenedores: Total Holding (1/4), Mi Portafolio (2/4), Botones (1/4) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="col-span-1">
          <UpperLeftContainer />
        </div>
        <div className="col-span-2">
          <UpperRightContainer 
            onStockSelect={handleStockSelect}
            onPortfolioView={handlePortfolioView}
          />
        </div>
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-center gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              Crear Portafolio Nuevo
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Modificar
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Añadir
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenedor central - ocupa todo el ancho */}
      <div className="w-full mb-4">
        <CentralContainer selectedStock={selectedStock} />
      </div>
      
      {/* Fila inferior - 2 contenedores con distintos anchos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <LowerLeftContainer />
        </div>
        <div className="col-span-1">
          <LowerRightContainer />
        </div>
      </div>
    </>
  );
};

export default DashboardGrid;
