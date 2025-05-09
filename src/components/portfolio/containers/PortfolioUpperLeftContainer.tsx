import React from 'react';
import PortfolioSummary from '../ui/PortfolioSummary'; // Asegúrate que la ruta sea correcta

const PortfolioUpperLeftContainer: React.FC = () => {
  return (
    <div className="bg-transparent dark:bg-transparent p-0 rounded shadow h-full"> {/* Ajustado para que el hijo controle su fondo y padding, y ocupe toda la altura */}
      <PortfolioSummary />
    </div>
  );
};

export default PortfolioUpperLeftContainer;
