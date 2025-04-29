import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import InvestmentMetricsCarousel from '../metrics/InvestmentMetricsCarousel'; // Importar el nuevo componente

const ReportWidget4: React.FC = () => {
  return (
    // Restaurar clases flexibles y añadir padding interno para el carrusel
    // Eliminar tamaño fijo y shrink-0
    <ReportWidgetBase widgetNumber={4} className="flex-1 min-h-40 p-4 flex items-center justify-center"> 
      <InvestmentMetricsCarousel />
    </ReportWidgetBase>
  );
};

export default ReportWidget4;
