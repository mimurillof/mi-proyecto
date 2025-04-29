import React from 'react';
import ReportWidgetBase from './ReportWidgetBase';
import AssetDetailTable from '../AssetDetailTable'; // Importa el nuevo componente

const ReportWidget5: React.FC = () => {
  return (
    // Ajustado className: eliminado flex/justify-center, mb-0 se mantiene. La altura puede necesitar ajuste.
    <ReportWidgetBase widgetNumber={5} className="h-auto mb-0"> {/* Cambiado h-[500px] a h-auto para que se ajuste al contenido */}
      {/* Renderiza el componente de la tabla de detalles de activos */}
      <AssetDetailTable />
    </ReportWidgetBase>
  );
};

export default ReportWidget5;
