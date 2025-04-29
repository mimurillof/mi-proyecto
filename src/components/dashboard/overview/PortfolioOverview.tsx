import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Apple, Activity, TrendingUp, TrendingDown, ShoppingCart, Cpu, Facebook, Landmark, Building2, HelpCircle } from 'lucide-react'; // Importar iconos relevantes
import './PortfolioOverview.css'; // Importar estilos

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// --- Tipos y Datos de Ejemplo ---
interface StockData {
  symbol: string;
  icon: React.ElementType; // Usar tipo ElementType para componentes de icono
  lastPrice: number;
  change: number;
  marketCap: number;
  volume: number;
  trendData: number[];
}

// Mapeo de símbolos a iconos de lucide-react
const iconMap: { [key: string]: React.ElementType } = {
  TSLA: Activity, // Usar Activity como placeholder genérico o uno más específico
  AAPL: Apple,
  GOOG: TrendingUp, // Placeholder
  MSFT: Building2, // Placeholder
  AMZN: ShoppingCart,
  NVDA: Cpu,
  META: Facebook,
  JPM: Landmark,
  DEFAULT: HelpCircle // Icono por defecto
};


const initialStocks: StockData[] = [
  { symbol: "TSLA", icon: iconMap["TSLA"], lastPrice: 260.21, change: 3.4, marketCap: 8.1, volume: 7.5, trendData: [100, 110, 105, 120, 130, 145, 160] },
  { symbol: "AAPL", icon: iconMap["AAPL"], lastPrice: 172.50, change: -1.2, marketCap: 12.5, volume: 9.8, trendData: [150, 145, 148, 140, 135, 130, 128] },
  { symbol: "GOOG", icon: iconMap["GOOG"], lastPrice: 177.94, change: 1.8, marketCap: 10.2, volume: 6.1, trendData: [2800, 2820, 2810, 2830, 2850, 2840, 2850] }, // Precio ajustado
  { symbol: "MSFT", icon: iconMap["MSFT"], lastPrice: 427.87, change: -0.5, marketCap: 15.3, volume: 11.2, trendData: [315, 312, 313, 310, 308, 309, 310] }, // Precio ajustado
  { symbol: "AMZN", icon: iconMap["AMZN"], lastPrice: 183.63, change: 2.1, marketCap: 9.5, volume: 8.0, trendData: [3300, 3350, 3340, 3380, 3410, 3400, 3400] }, // Precio ajustado
  { symbol: "NVDA", icon: iconMap["NVDA"], lastPrice: 900.10, change: 5.2, marketCap: 6.8, volume: 10.5, trendData: [780, 800, 790, 820, 840, 830, 850] }, // Precio ajustado
  { symbol: "META", icon: iconMap["META"], lastPrice: 480.40, change: -2.8, marketCap: 7.1, volume: 9.1, trendData: [350, 345, 340, 335, 330, 332, 330] }, // Precio ajustado
  { symbol: "JPM", icon: iconMap["JPM"], lastPrice: 195.60, change: 0.9, marketCap: 4.5, volume: 5.5, trendData: [150, 152, 151, 154, 156, 155, 155] }, // Precio ajustado
];


// --- Componente Mini Gráfico ---
interface MiniLineChartProps {
  data: number[];
  isPositive: boolean;
}

const MiniLineChart: React.FC<MiniLineChartProps> = ({ data, isPositive }) => {
  const color = isPositive ? '#10b981' : '#ef4444'; // Verde / Rojo de Tailwind
  const chartData = {
    labels: Array(data.length).fill(''),
    datasets: [{
      data: data,
      borderColor: color,
      borderWidth: 1.5,
      pointRadius: (context: any) => context.dataIndex === data.length - 1 ? 2 : 0, // Último punto
      pointBackgroundColor: color,
      pointBorderColor: color,
      pointHoverRadius: 0,
      tension: 0.3,
      fill: false,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: false as const, // Deshabilitar animación
    layout: { padding: { top: 2, bottom: 2, left: 1, right: 4 } }
  };

  // Añadir clase para brillo basado en isPositive
  const chartContainerClass = `mini-chart-cell ${isPositive ? 'positive' : 'negative'}`;

  return (
    <div className={chartContainerClass}>
      <Line data={chartData} options={options} />
    </div>
  );
};


// --- Componente Principal ---
const PortfolioOverview: React.FC = () => {
  const [filter, setFilter] = useState('All'); // Estado inicial del filtro

  const handleFilterChange = (newFilter: string) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredStocks = useMemo(() => {
    switch (filter) {
      case 'Gainers':
        return initialStocks.filter(stock => stock.change > 0);
      case 'Losers':
        return initialStocks.filter(stock => stock.change < 0);
      case 'All':
      default:
        return initialStocks;
    }
  }, [filter]);

  return (
    <div className="portfolio-overview-container">
      <div className="overview-header-row">
        <h2 className="overview-title">Resumen de cartera</h2>
        <div className="overview-filter-buttons">
          {['All', 'Gainers', 'Losers'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => handleFilterChange(filterOption)}
              className={`overview-filter-button ${filter === filterOption ? 'selected' : ''}`}
              aria-label={`${filterOption} Stocks`}
            >
              {filterOption === 'All' ? 'Todos' : filterOption === 'Gainers' ? 'Ganadores' : 'Perdedores'}
            </button>
          ))}
        </div>
      </div>

      <div className="overview-table-container">
        <table className="overview-table">
          <thead>
            <tr>
              <th>Activo</th>
              <th align="right">Últ. Precio</th>
              <th align="right">Cambio</th>
              <th align="right">Cap. Mercado</th>
              <th align="right">Volumen</th>
              <th align="center">Últ. 7 días</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => {
              const isPositive = stock.change > 0;
              const IconComponent = stock.icon || iconMap.DEFAULT;
              return (
                <tr key={stock.symbol}>
                  <td>
                    <div className="stock-cell">
                      <IconComponent className="stock-icon" size={20} />
                      {stock.symbol}
                    </div>
                  </td>
                  <td align="right">${stock.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td align="right" className={isPositive ? 'change-cell-positive' : 'change-cell-negative'}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                  </td>
                  <td align="right">{stock.marketCap.toFixed(1)}%</td>
                  <td align="right">{stock.volume.toFixed(1)}%</td>
                  <td align="center">
                    <MiniLineChart data={stock.trendData} isPositive={isPositive} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioOverview;
