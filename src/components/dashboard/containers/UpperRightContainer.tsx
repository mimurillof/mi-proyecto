import React from 'react';
import PortfolioCarousel from '../portfolio/PortfolioCarousel'; // Importa el nuevo componente

// Interfaz para los datos de activos
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  units: number;
}

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
