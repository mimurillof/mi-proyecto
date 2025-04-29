import React from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react'; // Importar iconos de lucide-react
import './TotalHoldingCard.css'; // Importar estilos

interface TotalHoldingCardProps {
  total: string;
  percentageChange: string;
  absoluteChange: string;
  isPositive?: boolean;
  timePeriod?: string; // Ej: "6M", "1Y"
}

const TotalHoldingCard: React.FC<TotalHoldingCardProps> = ({
  total,
  percentageChange,
  absoluteChange,
  isPositive = true,
  timePeriod = "6M" // Valor por defecto
}) => {
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'; // Clases de Tailwind para color

  return (
    <div className="total-holding-card-container">
      <div className="holding-header-row">
        <span className="holding-title">Total Holding</span>
        <div className="holding-header-buttons">
          <button className="holding-time-button">{timePeriod}</button>
          <button className="holding-dropdown-button">
            <ChevronDown size={18} /> {/* Icono lucide */}
          </button>
        </div>
      </div>
      <div className="holding-total-amount">${total}</div>
      <div className="holding-return-info">
        <span>Return</span>
        {/* Icono CheckCircle siempre verde */}
        <CheckCircle size={16} className="holding-check-icon text-green-600" />
        <span className={`holding-return-percentage ${changeColor}`}>
          {isPositive ? '+' : '-'}{percentageChange}%
        </span>
        <span className="holding-return-absolute">
          (${absoluteChange})
        </span>
      </div>
    </div>
  );
};

export default TotalHoldingCard;
