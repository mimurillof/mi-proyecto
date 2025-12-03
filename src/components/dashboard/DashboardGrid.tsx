import React, { useState } from 'react';
import UpperLeftContainer from './containers/UpperLeftContainer';
import UpperRightContainer from './containers/UpperRightContainer';
import CentralContainer from './containers/CentralContainer';
import LowerLeftContainer from './containers/LowerLeftContainer';
import LowerRightContainer from './containers/LowerRightContainer';
import AddAssetModal from '../portfolio/AddAssetModal';
import ModifyAssetsModal from '../portfolio/ModifyAssetsModal';

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
  
  // Estados para los modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  // Función para seleccionar un activo
  const handleStockSelect = (stock: StockData) => {
    setSelectedStock(stock);
  };

  // Función para volver al view general del portafolio
  const handlePortfolioView = () => {
    setSelectedStock(null);
  };

  // Función para refrescar datos del portafolio después de modificar activos
  const handleAssetsChanged = () => {
    // Aquí podrías agregar lógica para refrescar los datos del dashboard
    // Por ejemplo, disparar un evento o actualizar el estado global
    console.log('✅ Activos modificados - refrescando dashboard');
    // Forzar recarga de componentes si es necesario
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
            <button 
              onClick={() => setIsModifyModalOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modificar
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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

      {/* Modales */}
      <AddAssetModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAssetAdded={handleAssetsChanged}
      />
      
      <ModifyAssetsModal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        onAssetsModified={handleAssetsChanged}
      />
    </>
  );
};

export default DashboardGrid;
