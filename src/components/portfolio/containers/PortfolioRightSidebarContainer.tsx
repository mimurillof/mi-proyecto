import React from 'react';
import AlertsNotificationsCenter from '../ui/AlertsNotificationsCenter'; // Asegúrate que la ruta sea correcta

const PortfolioRightSidebarContainer: React.FC = () => {
  return (
    <div className="bg-transparent dark:bg-transparent p-0 rounded shadow h-full"> {/* Ajustado para que el hijo controle su fondo/padding y ocupe toda la altura */}
      <AlertsNotificationsCenter />
    </div>
  );
};

export default PortfolioRightSidebarContainer;
