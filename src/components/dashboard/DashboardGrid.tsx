import React from 'react';
import UpperLeftContainer from './containers/UpperLeftContainer';
import UpperRightContainer from './containers/UpperRightContainer';
import CentralContainer from './containers/CentralContainer';
import LowerLeftContainer from './containers/LowerLeftContainer';
import LowerRightContainer from './containers/LowerRightContainer';

/**
 * Componente principal que organiza la grid del dashboard
 * según el layout proporcionado en la imagen de referencia
 */
const DashboardGrid: React.FC = () => {
  return (
    <>
      {/* Fila superior - 2 contenedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UpperLeftContainer />
        <UpperRightContainer />
      </div>
      
      {/* Contenedor central - ocupa todo el ancho */}
      <div className="w-full mb-4">
        <CentralContainer />
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
