import React from 'react';

const AIControlPanel: React.FC = () => {
  // Función simple para simular la selección en la preview
  const handleSelection = (optionId: string) => {
    alert(`Opción seleccionada: ${optionId}`);
    // En una aplicación real, aquí se llamaría a la función
    // que maneja la lógica de mostrar el reporte correspondiente.
  };

  return (
    // Contenedor principal adaptado para tema claro y dimensiones
    <div className="w-full h-full bg-white p-4 rounded-lg flex items-center justify-center">
      <div className="flex flex-wrap gap-4 justify-center">

        {/* Opción 1: Resumen Diario/Semanal */}
        <div
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]" // Ajuste de tamaño mínimo y altura
          onClick={() => handleSelection('summary')}
        >
          {/* Icono Placeholder */}
          <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Resumen Diario/Semanal</span>
        </div>

        {/* Opción 2: Análisis de Rendimiento */}
        <div
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
          onClick={() => handleSelection('performance')}
        >
          {/* Icono Placeholder */}
          <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Análisis Rendimiento</span>
        </div>

        {/* Opción 3: Proyecciones Futuras */}
        <div
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
          onClick={() => handleSelection('projections')}
        >
          {/* Icono Placeholder */}
          <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Proyecciones Futuras</span>
        </div>

        {/* Opción 4: Alertas y Oportunidades */}
        <div
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
          onClick={() => handleSelection('alerts')}
        >
          {/* Icono Placeholder */}
          <svg className="w-8 h-8 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Alertas y Oportunidades</span>
        </div>

        {/* Opción 5: Generar Reporte Personalizado */}
        <div
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
          onClick={() => handleSelection('custom_report')}
        >
          {/* Icono Placeholder */}
          <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Reporte Personalizado</span>
        </div>

        {/* Añadir más opciones aquí si es necesario */}

      </div>
    </div>
  );
};

export default AIControlPanel;
