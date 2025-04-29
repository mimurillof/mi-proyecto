import React, { useState } from 'react';
import ReportGeneratorModal from './ReportGeneratorModal';
import ActionsFeedback from './ActionsFeedback';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons'; // Icono para generar reporte

const TopRightActions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col justify-between items-center">
      {/* Botón Generar Reporte (más prominente) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full max-w-xs inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-150 ease-in-out mb-4"
      >
        <FontAwesomeIcon icon={faCogs} className="mr-2" />
        Generar Reporte Personalizado
      </button>

      {/* Componente de Acciones y Feedback */}
      <div className="w-full">
        <ActionsFeedback />
      </div>

      {/* Modal (no visible directamente, controlado por estado) */}
      <ReportGeneratorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default TopRightActions;
