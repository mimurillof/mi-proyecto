import React from 'react';
import PortfolioPerformanceChart from '../charts/PortfolioPerformanceChart';

// Interfaz para los datos de activos
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  units: number;
}

interface CentralContainerProps {
  selectedStock: StockData | null;
}

const CentralContainer: React.FC<CentralContainerProps> = ({ selectedStock }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <PortfolioPerformanceChart selectedStock={selectedStock} />
    </div>
  );
};

export default CentralContainer;
