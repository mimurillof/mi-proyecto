import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import PortfolioCompositionChart from '../charts/PortfolioCompositionChart'; // Importar el nuevo componente

const ReportWidget6: React.FC = () => {
  return (
    // Eliminar clases de ancho y alto fijos (w-[600px], h-[500px]) y shrink-0.
    <ReportWidgetBase widgetNumber={6} className="flex flex-col overflow-hidden"> {/* Mantener flex para que el gráfico interno se ajuste */}
      <PortfolioCompositionChart />
    </ReportWidgetBase>
  );
};

export default ReportWidget6;
