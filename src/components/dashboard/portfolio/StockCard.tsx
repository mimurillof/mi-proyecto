import React from 'react';
import './PortfolioCarousel.css'; // Import shared styles

// Define la interfaz para los datos de las acciones y los logos
interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    units: number;
}

interface StockLogos {
    [key: string]: string;
}

// Logos de las empresas (puedes mover esto a un archivo de configuración o API)
const stockLogos: StockLogos = {
    AAPL: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    TSLA: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png', // URL actualizada para mejor visualización en claro
    MSFT: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', // URL actualizada
    GOOG: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
    AMZN: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
};

interface StockCardProps {
    stock: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
    const isPositive = stock.change > 0;
    // No aplicaremos clases de 'glow' por ahora, nos enfocamos en la estructura y colores base
    const cardClass = "stock-card"; 

    return (
        <div className={cardClass}>
            <div className="stock-price">
                ${stock.price.toFixed(2)}
            </div>
            <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '↑' : '↓'} {Math.abs(stock.change)}%
            </div>
            <div className="stock-info">
                <div className="stock-logo-symbol-container">
                    {stockLogos[stock.symbol] && (
                         <img 
                            src={stockLogos[stock.symbol]} 
                            alt={stock.name} 
                            className="stock-logo" 
                         />
                    )}
                    <span className="stock-symbol">{stock.symbol}</span>
                </div>
                <div className="stock-units">
                    UNITS {stock.units}
                </div>
            </div>
        </div>
    );
}

export default StockCard;
