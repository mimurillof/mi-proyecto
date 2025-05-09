import React from 'react';
import AssetDetailChart from '../ui/AssetDetailChart'; // Asegúrate que la ruta sea correcta

const PortfolioBottomContainer: React.FC = () => {
  return (
    <div className="bg-transparent dark:bg-transparent p-0 rounded shadow flex flex-col flex-grow w-full min-h-0"> {/* Ajustado para responsividad */}
      <AssetDetailChart />
    </div>
  );
};

export default PortfolioBottomContainer;
