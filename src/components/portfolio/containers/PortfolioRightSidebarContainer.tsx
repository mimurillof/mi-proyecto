import React from 'react';
import AlertsNotificationsCenter from '../ui/AlertsNotificationsCenter'; // Asegúrate que la ruta sea correcta

const PortfolioRightSidebarContainer: React.FC = () => {
  return (
    <div className="bg-transparent dark:bg-transparent p-0 rounded shadow flex flex-col flex-grow w-full min-h-0"> {/* Ajustado para responsividad */}
      <AlertsNotificationsCenter />
    </div>
  );
};

export default PortfolioRightSidebarContainer;
