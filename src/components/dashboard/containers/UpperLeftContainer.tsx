import React from 'react';
import TotalHoldingCard from '../holding/TotalHoldingCard'; // Importa el nuevo componente

const UpperLeftContainer: React.FC = () => {
  // Datos de ejemplo para la tarjeta
  const holdingData = {
    total: "12,304.11",
    percentageChange: "3.65",
    absoluteChange: "5.30",
    isPositive: true,
    timePeriod: "6M"
  };

  return (
    // El contenedor base ya tiene estilos de DashboardGrid.tsx
    // Renderizamos la tarjeta pasando los datos
    <TotalHoldingCard {...holdingData} />
  );
};

export default UpperLeftContainer;
