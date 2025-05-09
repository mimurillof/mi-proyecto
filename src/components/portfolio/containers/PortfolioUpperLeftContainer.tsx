import React from 'react';
import PortfolioSummary from '../ui/PortfolioSummary'; // Asegúrate que la ruta sea correcta

const PortfolioUpperLeftContainer: React.FC = () => {
  return (
    <div className="bg-transparent dark:bg-transparent p-0 rounded shadow flex flex-col flex-grow w-full min-h-0"> {/* Ajustado para responsividad */}
      <PortfolioSummary />
    </div>
  );
};

export default PortfolioUpperLeftContainer;
