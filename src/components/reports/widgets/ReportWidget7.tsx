import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import DrawdownAnalysis from '../analysis/DrawdownAnalysis'; // Importar el nuevo componente

const ReportWidget7: React.FC = () => {
  return (
    // Widget independiente para análisis de drawdown
    <ReportWidgetBase widgetNumber={7} className="h-full flex flex-col min-h-[450px]"> 
      <DrawdownAnalysis />
    </ReportWidgetBase>
  );
};

export default ReportWidget7;
