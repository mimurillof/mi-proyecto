import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import PortfolioChart from '../charts/PortfolioChart'; // Importar el nuevo componente

const ReportWidget3: React.FC = () => {
  return (
    // Reemplazar tamaño fijo por w-full y min-h-[value] o flex-1. Eliminar shrink-0.
    // Ejemplo usando w-full y una altura mínima, permitiendo que crezca si es necesario.
    // Ajusta min-h-[465px] según tus necesidades de diseño.
    <ReportWidgetBase widgetNumber={3} className="w-full min-h-[465px] flex flex-col overflow-hidden">
      {/* El componente PortfolioChart ya está configurado para ser responsivo */}
      <PortfolioChart />
    </ReportWidgetBase>
  );
};

export default ReportWidget3;
