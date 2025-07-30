import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import CorrelationAnalysis from '../analysis/CorrelationAndDrawdownAnalysis'; // Importar el componente de correlación

const ReportWidget5: React.FC = () => {
  return (
    // Ajustado className para permitir que el contenido se ajuste completamente con altura mínima
    <ReportWidgetBase widgetNumber={5} className="h-full flex flex-col min-h-[400px]"> 
      {/* Renderiza el componente de análisis de correlación */}
      <CorrelationAnalysis />
    </ReportWidgetBase>
  );
};

export default ReportWidget5;
