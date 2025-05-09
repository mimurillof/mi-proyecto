import React from 'react';
import FinancialPortfolioChart from '../ui/FinancialPortfolioChart'; // Asegúrate que la ruta sea correcta

const PortfolioUpperMainContainer: React.FC = () => {
  return (
    <div 
      className="bg-transparent dark:bg-transparent p-0 flex flex-col" // Ajustado para que el contenedor hijo maneje el fondo y padding
      style={{ width: '759px', height: '538px' }} // Dimensiones del HTML original
    >
      <FinancialPortfolioChart />
    </div>
  );
};

export default PortfolioUpperMainContainer;
