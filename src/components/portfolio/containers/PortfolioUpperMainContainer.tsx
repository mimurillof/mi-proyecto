import React from 'react';
import FinancialPortfolioChart from '../ui/FinancialPortfolioChart'; // Asegúrate que la ruta sea correcta

const PortfolioUpperMainContainer: React.FC = () => {
  return (
    <div 
      className="bg-transparent dark:bg-transparent p-0 flex flex-col flex-grow w-full min-h-0" // Ajustado para responsividad
    >
      <FinancialPortfolioChart />
    </div>
  );
};

export default PortfolioUpperMainContainer;
