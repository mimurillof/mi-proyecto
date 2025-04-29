import React from 'react';
import PortfolioPerformanceChart from '../charts/PortfolioPerformanceChart';

const CentralContainer: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <PortfolioPerformanceChart />
    </div>
  );
};

export default CentralContainer;
