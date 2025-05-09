import React from 'react';
import PortfolioUpperLeftContainer from './containers/PortfolioUpperLeftContainer';
import PortfolioUpperMainContainer from './containers/PortfolioUpperMainContainer';
import PortfolioRightSidebarContainer from './containers/PortfolioRightSidebarContainer';
import PortfolioBottomContainer from './containers/PortfolioBottomContainer';

const PortfolioLayout: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-12 grid-rows-auto gap-4 h-screen">
      {/* Fila Superior */}
      <div className="col-span-12 md:col-span-3 row-span-1">
        <PortfolioUpperLeftContainer />
      </div>
      {/* Columna Central - Contiene UpperMain y Bottom apilados verticalmente */}
      <div className="col-span-12 md:col-span-6 row-span-2 flex flex-col gap-4">
        <PortfolioUpperMainContainer />
        <PortfolioBottomContainer />
      </div>
      <div className="col-span-12 md:col-span-3 row-span-2">
        <PortfolioRightSidebarContainer />
      </div>
      
      {/* Fila Inferior */}
      {/* Espacio vacío opcional debajo de PortfolioUpperLeftContainer si se desea mantener la estructura de 12 columnas explícitamente */}
      {/* <div className="hidden md:block md:col-span-3"></div> */}
      
      {/* PortfolioBottomContainer ahora está agrupado arriba, por lo que esta celda se elimina */}
      {/* <div className="col-span-12 md:col-start-4 md:col-span-6 row-span-1">
        <PortfolioBottomContainer />
      </div> */}
      {/* PortfolioRightSidebarContainer ya ocupa su espacio en esta "fila" visualmente debido a row-span-2 */}
    </div>
  );
};

export default PortfolioLayout;
