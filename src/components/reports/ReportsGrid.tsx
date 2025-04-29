import React from 'react';

// Importar los componentes de widget individuales
import ReportWidget2 from './widgets/ReportWidget2';
import ReportWidget3 from './widgets/ReportWidget3';
import ReportWidget4 from './widgets/ReportWidget4';
import ReportWidget5 from './widgets/ReportWidget5';
import ReportWidget6 from './widgets/ReportWidget6';

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

      {/* Sección Inferior: Widgets 6 (izquierda) y 5 (derecha) */}
      <div className="flex flex-row gap-2"> {/* Reducido el gap de 4 a 2 para acercar los widgets */}
        {/* Columna Izquierda (Widget 6) - Reducido aún más, de 5/12 a 4/12 */}
        <div className="w-4/12"> 
          <ReportWidget6 />
        </div>
        {/* Columna Derecha (Widget 5) - Aumentado de 7/12 a 8/12 */}
        <div className="w-8/12"> 
          <ReportWidget5 />
        </div>
      </div>

    </div>
  );
};

export default ReportsGrid;
