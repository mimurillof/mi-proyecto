import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import AnalystSummary from '../summaries/AnalystSummary'; // Importar el nuevo componente

const ReportWidget2: React.FC = () => {
  return (
    // Añadir flex y flex-col para que h-full funcione correctamente con el contenido flex del hijo
    <ReportWidgetBase widgetNumber={2} className="h-full flex flex-col">
      <AnalystSummary />
    </ReportWidgetBase>
  );
};

export default ReportWidget2;
