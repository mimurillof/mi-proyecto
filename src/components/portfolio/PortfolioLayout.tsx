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
      <div className="col-span-12 md:col-span-6 row-span-1">
        <PortfolioUpperMainContainer />
      </div>
      <div className="col-span-12 md:col-span-3 row-span-2">
        <PortfolioRightSidebarContainer />
      </div>
      
      {/* Fila Inferior */}
      <div className="col-span-12 md:col-span-9 row-span-1">
        <PortfolioBottomContainer />
      </div>
    </div>
  );
};

export default PortfolioLayout;
