import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import LivePortfolioCompositionChart from '../charts/LivePortfolioCompositionChart'; // Importar el nuevo componente dinámico

const ReportWidget6: React.FC = () => {
  return (
    // Aumentar altura mínima para que el donut se vea más grande y equilibrado con el Widget 5
    <ReportWidgetBase widgetNumber={6} className="flex flex-col overflow-hidden min-h-[550px]"> 
      <LivePortfolioCompositionChart />
    </ReportWidgetBase>
  );
};

export default ReportWidget6;
