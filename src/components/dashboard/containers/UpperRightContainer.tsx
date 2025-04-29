import React from 'react';
import PortfolioCarousel from '../portfolio/PortfolioCarousel'; // Importa el nuevo componente

const UpperRightContainer: React.FC = () => {
  return (
    // El contenedor ya tiene estilos base de App.tsx/DashboardGrid.tsx
    // Simplemente renderizamos el carrusel dentro.
    // El CSS del carrusel se encargará del layout interno.
    <PortfolioCarousel />
  );
};

export default UpperRightContainer;
