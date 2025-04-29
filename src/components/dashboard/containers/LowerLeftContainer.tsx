import React from 'react';
import PortfolioOverview from '../overview/PortfolioOverview'; // Importa el nuevo componente

const LowerLeftContainer: React.FC = () => {
  return (
    // El contenedor base ya tiene estilos de DashboardGrid.tsx
    // Renderizamos la tabla de resumen
    <PortfolioOverview />
  );
};

export default LowerLeftContainer;
