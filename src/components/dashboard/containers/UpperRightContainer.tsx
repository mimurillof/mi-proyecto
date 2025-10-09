import React from 'react';
import PortfolioCarousel from '../portfolio/PortfolioCarousel'; // Importa el nuevo componente
import { StockData } from '../portfolio/StockCard';

interface UpperRightContainerProps {
  onStockSelect: (stock: StockData) => void;
  onPortfolioView: () => void;
}

const UpperRightContainer: React.FC<UpperRightContainerProps> = ({ 
  onStockSelect, 
  onPortfolioView 
}) => {
  return (
    // El contenedor ya tiene estilos base de App.tsx/DashboardGrid.tsx
    // Simplemente renderizamos el carrusel dentro.
    // El CSS del carrusel se encargará del layout interno.
    <PortfolioCarousel 
      onStockSelect={onStockSelect}
      onPortfolioView={onPortfolioView}
    />
  );
};

export default UpperRightContainer;
