import React, { useState } from 'react';
import ReportsGrid from '../components/reports/ReportsGrid';
import AIReportView from '../components/reports/AIReportView'; // Asegúrate de crear este componente

type ActiveReportView = 'financiero' | 'ai';

const ReportsPage: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveReportView>('financiero');

  return (
    <div className="flex flex-col h-full">
      {/* Pestañas de selección de vista */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activeView === 'financiero' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveView('financiero')}
        >
          Reporte Financiero
        </button>
        <button
          className={`py-2 px-4 ${activeView === 'ai' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveView('ai')}
        >
          Reporte AI
        </button>
      </div>

      {/* Contenido condicional basado en la pestaña activa */}
      <div className="flex-grow"> {/* flex-grow para que ocupe el espacio restante */}
        {activeView === 'financiero' && <ReportsGrid />}
        {activeView === 'ai' && <AIReportView />}
      </div>
    </div>
  );
};

export default ReportsPage;
