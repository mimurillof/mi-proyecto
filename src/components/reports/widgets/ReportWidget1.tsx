import React, { useState } from 'react';
import ReportWidgetBase from './ReportWidgetBase';

const tabs = ['Reporte Financiero', 'Reporte AI'];

const ReportWidget1: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]); // Estado para la pestaña activa

  return (
    // Eliminar altura fija, permitir que el contenido defina la altura. Añadir borde inferior general.
    <ReportWidgetBase widgetNumber={1} className="border-b border-gray-200"> 
      <div className="flex space-x-6 relative px-2"> {/* Contenedor flex para pestañas, padding horizontal */}
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-sm font-medium relative focus:outline-none ${
                isActive
                  ? 'text-blue-600' // Color del texto activo
                  : 'text-gray-500 hover:text-gray-700' // Color del texto inactivo y hover
              }`}
            >
              {tab}
              {/* Indicador de pestaña activa */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" // Línea azul debajo
                  // layoutId="underline" // Descomentar si usas framer-motion para animación
                />
              )}
            </button>
          );
        })}
      </div>
    </ReportWidgetBase>
  );
};

export default ReportWidget1;
