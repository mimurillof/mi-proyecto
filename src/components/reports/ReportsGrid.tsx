import React from 'react';

// Importar los componentes de widget individuales
import ReportWidget2 from './widgets/ReportWidget2';
import ReportWidget3 from './widgets/ReportWidget3';
import ReportWidget4 from './widgets/ReportWidget4';
import ReportWidget5 from './widgets/ReportWidget5';
import ReportWidget6 from './widgets/ReportWidget6';
import ReportWidget7 from './widgets/ReportWidget7';

const ReportsGrid: React.FC = () => {
  return (
    // Contenedor principal: flex vertical, ocupa altura, añade gap entre secciones
    <div className="flex flex-col h-full gap-4"> 
      
      {/* Sección Media: Widgets 4, 3 (izquierda) y 2 (derecha) */}
      <div className="flex flex-row flex-1 gap-4 min-h-0"> {/* flex-1 para crecer, min-h-0 para scroll interno si es necesario */}
        {/* Columna Izquierda (Widgets 4 y 3) */}
        <div className="flex flex-col w-7/12 gap-4"> {/* Ancho aproximado 7/12 */}
          <ReportWidget4 />
          <ReportWidget3 />
        </div>
        {/* Columna Derecha (Widget 2) */}
        <div className="w-5/12"> {/* Ancho aproximado 5/12 */}
          <ReportWidget2 />
        </div>
      </div>

      {/* Sección Inferior: 3 widgets independientes - Donut, Correlación, Drawdown */}
      <div className="flex flex-row gap-4 min-h-[500px]"> 
        {/* Widget 6 - Composición del Portfolio (Donut cuadrado) */}
        <div className="w-4/12"> 
          <ReportWidget6 />
        </div>
        {/* Widget 5 - Matriz de Correlación */}
        <div className="w-4/12"> 
          <ReportWidget5 />
        </div>
        {/* Widget 7 - Análisis de Drawdown (nuevo widget) */}
        <div className="w-4/12"> 
          <ReportWidget7 />
        </div>
      </div>

    </div>
  );
};

export default ReportsGrid;
