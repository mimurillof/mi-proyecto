import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import LivePortfolioCompositionChart from '../charts/LivePortfolioCompositionChart'; // Importar el nuevo componente dinámico

const ReportWidget6: React.FC = () => {
  return (
    // Eliminar clases de ancho y alto fijos (w-[600px], h-[500px]) y shrink-0.
    <ReportWidgetBase widgetNumber={6} className="flex flex-col overflow-hidden"> {/* Mantener flex para que el gráfico interno se ajuste */}
      <LivePortfolioCompositionChart />
    </ReportWidgetBase>
  );
};

export default ReportWidget6;
