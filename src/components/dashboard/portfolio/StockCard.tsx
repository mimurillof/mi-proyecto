import React from 'react';
import './PortfolioCarousel.css'; // Import shared styles

export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    units: number;
    logoUrl?: string;
    allocationPercent?: number;
    positionValue?: number;
}

const buildFallbackLogo = (symbol: string): string => {
    const seed = encodeURIComponent(symbol.toUpperCase());
    return `https://api.dicebear.com/7.x/initials/png?seed=${seed}&backgroundColor=0f172a&fontSize=40`;
};

interface StockCardProps {
    stock: StockData;
    onStockSelect: (stock: StockData) => void;
}

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
});

const unitsFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
});

const StockCard: React.FC<StockCardProps> = ({ stock, onStockSelect }) => {
    const isPositive = Number(stock.change) >= 0;
    const logoSrc = stock.logoUrl ?? buildFallbackLogo(stock.symbol);
    const formattedPrice = Number.isFinite(stock.price) ? priceFormatter.format(stock.price) : '—';
    const formattedChange = Number.isFinite(stock.change)
        ? `${isPositive ? '↑' : '↓'} ${Math.abs(stock.change).toFixed(2)}%`
        : '—';
    const formattedUnits = Number.isFinite(stock.units) ? unitsFormatter.format(stock.units) : '0';

    const handleClick = () => onStockSelect(stock);

    return (
        <div className="stock-card" onClick={handleClick}>
            <div className="stock-price">{formattedPrice}</div>
            <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                {formattedChange}
            </div>
            <div className="stock-info">
                <div className="stock-logo-symbol-container">
                    {logoSrc && (
                        <img
                            src={logoSrc}
                            alt={stock.name}
                            className="stock-logo"
                            loading="lazy"
                        />
                    )}
                    <span className="stock-symbol">{stock.symbol}</span>
                </div>
                <div className="stock-units">UNITS {formattedUnits}</div>
            </div>
        </div>
    );
};

export default StockCard;
