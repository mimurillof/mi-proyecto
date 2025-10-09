import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
import { Activity } from 'lucide-react';
import { fetchPortfolioReport, pollPortfolioUpdates } from '../../../services/portfolioManagerService';
import type { PortfolioAsset, PortfolioReport } from '../../../services/portfolioManagerService';
import './PortfolioOverview.css';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// --- Tipos ---
interface StockData {
  symbol: string;
  name: string;
  logo_url: string | null;
  lastPrice: number;
  change: number;
  marketCap: number | null;
  volume: number | null;
  trendData: number[];
}

// --- Funciones auxiliares ---

/**
 * Formatea números grandes (market cap, volumen) en formato legible (ej: 3.82T, 49.16M)
 */
const formatLargeNumber = (num: number | null): string => {
  if (num === null || num === undefined) return 'N/A';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  } else if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  return num.toFixed(2);
};

/**
 * Convierte los datos del Portfolio Manager al formato del componente
 */
const convertAssetToStockData = (
  asset: PortfolioAsset,
  weeklyPerformanceMap?: Map<string, number[]>
): StockData => {
  let trendData: number[] = [];

  if (Array.isArray(asset.weekly_performance) && asset.weekly_performance.length > 0) {
    trendData = asset.weekly_performance;
  } else if (weeklyPerformanceMap?.has(asset.symbol)) {
    trendData = weeklyPerformanceMap.get(asset.symbol) ?? [];
  }

  return {
    symbol: asset.symbol,
    name: asset.name || asset.symbol,
    logo_url: asset.logo_url || null,
    lastPrice: asset.current_price || 0,
    change: asset.change_percent || 0,
    marketCap: asset.market_cap || null,
    volume: asset.volume || null,
    trendData,
  };
};


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
  const [filter, setFilter] = useState('All');
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forcedRefreshRef = useRef(false);
  const lastFileTimestampRef = useRef<string | null>(null);
  const isPollingActiveRef = useRef(true);

  const convertReportToStocks = useCallback((report?: PortfolioReport | null): StockData[] => {
    if (!report || !Array.isArray(report.assets)) {
      return [];
    }

    const fallbackMap = new Map<string, number[]>();

    type SeriesHolder = { symbol?: string; weekly_performance?: number[] | null };

    const mergeWeeklyFromList = (items?: Array<SeriesHolder | null | undefined>) => {
      if (!Array.isArray(items)) {
        return;
      }

      items.forEach((item) => {
        if (!item?.symbol || !Array.isArray(item.weekly_performance)) {
          return;
        }
        if (!fallbackMap.has(item.symbol)) {
          fallbackMap.set(item.symbol, item.weekly_performance);
        }
      });
    };

    mergeWeeklyFromList(report.assets as Array<SeriesHolder>);
    mergeWeeklyFromList(report.allocation as Array<SeriesHolder>);
    mergeWeeklyFromList(report.gainers as Array<SeriesHolder>);
    mergeWeeklyFromList(report.losers as Array<SeriesHolder>);

    const marketOverview = report.market_overview as
      | {
          all?: Array<SeriesHolder>;
          gainers?: Array<SeriesHolder>;
          losers?: Array<SeriesHolder>;
          most_viewed?: Array<SeriesHolder>;
        }
      | undefined;

    mergeWeeklyFromList(marketOverview?.all);
    mergeWeeklyFromList(marketOverview?.gainers);
    mergeWeeklyFromList(marketOverview?.losers);
    mergeWeeklyFromList(marketOverview?.most_viewed);

    return report.assets.map((asset) => convertAssetToStockData(asset, fallbackMap));
  }, []);

  // Cargar datos del Portfolio Manager
  const loadPortfolioData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await fetchPortfolioReport({ period: '6mo', force: forceRefresh });
      
      if (response.enabled === false) {
        setError(response.message || 'El servicio del Portfolio Manager está deshabilitado.');
        setStocks([]);
        return;
      }
      
      if (response.data && response.data.assets) {
        const convertedStocks = convertReportToStocks(response.data);
        const hasMissingSparklines = convertedStocks.some((stock) => stock.trendData.length === 0);

        if (hasMissingSparklines && !forceRefresh && !forcedRefreshRef.current) {
          forcedRefreshRef.current = true;
          await loadPortfolioData(true);
          return;
        }

        setStocks(convertedStocks);
        if (response.data.generated_at) {
          lastFileTimestampRef.current = response.data.generated_at;
        } else if (response.last_refresh) {
          lastFileTimestampRef.current = response.last_refresh;
        }
      } else {
        setError('No se pudieron cargar los datos del portafolio.');
        setStocks([]);
      }
    } catch (err) {
      console.error('Error al cargar datos del portafolio:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar el portafolio.');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [convertReportToStocks]);

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  const applyWatchReport = useCallback(
    (report: PortfolioReport | null | undefined, metadata?: { generated_at?: string | null; file_timestamp?: string | null; last_refresh?: string | null }) => {
      if (!report) {
        return;
      }

      const convertedStocks = convertReportToStocks(report);
      if (convertedStocks.length === 0) {
        return;
      }

      setStocks(convertedStocks);

      if (metadata?.generated_at) {
        setLastUpdatedIso(metadata.generated_at);
        lastFileTimestampRef.current = metadata.generated_at;
      } else if (metadata?.file_timestamp) {
        setLastUpdatedIso(metadata.file_timestamp);
        lastFileTimestampRef.current = metadata.file_timestamp;
      } else if (metadata?.last_refresh) {
        setLastUpdatedIso(metadata.last_refresh);
        lastFileTimestampRef.current = metadata.last_refresh;
      }
    },
    [convertReportToStocks]
  );

  useEffect(() => {
    const POLL_INTERVAL_MS = 15000;
    isPollingActiveRef.current = true;

    const intervalId = window.setInterval(async () => {
      if (!isPollingActiveRef.current || document.hidden) {
        return;
      }

      try {
        const payload = await pollPortfolioUpdates({
          since: lastFileTimestampRef.current ?? undefined,
          includeReport: true,
          includeSummary: false,
          includeMarket: false,
        });

        if (!payload.updated) {
          return;
        }

        applyWatchReport(payload.report ?? null, {
          generated_at: payload.generated_at ?? undefined,
          file_timestamp: payload.file_timestamp ?? undefined,
          last_refresh: payload.last_refresh ?? undefined,
        });
      } catch (err) {
        console.warn('Sondeo del portafolio falló:', err);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      isPollingActiveRef.current = false;
      window.clearInterval(intervalId);
    };
  }, [applyWatchReport]);

  const handleFilterChange = (newFilter: string) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredStocks = useMemo(() => {
    switch (filter) {
      case 'Gainers':
        return stocks.filter(stock => stock.change > 0);
      case 'Losers':
        return stocks.filter(stock => stock.change < 0);
      case 'All':
      default:
        return stocks;
    }
  }, [filter, stocks]);

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="portfolio-overview-container">
        <div className="overview-header-row">
          <h2 className="overview-title">Resumen de cartera</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando datos del portafolio...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay alguno
  if (error) {
    return (
      <div className="portfolio-overview-container">
        <div className="overview-header-row">
          <h2 className="overview-title">Resumen de cartera</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay datos
  if (stocks.length === 0) {
    return (
      <div className="portfolio-overview-container">
        <div className="overview-header-row">
          <h2 className="overview-title">Resumen de cartera</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No hay activos en el portafolio.</p>
        </div>
      </div>
    );
  }

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
              
              return (
                <tr key={stock.symbol}>
                  <td>
                    <div className="stock-cell">
                      {stock.logo_url ? (
                        <img 
                          src={stock.logo_url} 
                          alt={`${stock.symbol} logo`} 
                          className="stock-icon"
                          style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                          onError={(e) => {
                            // Fallback a icono genérico si la imagen falla
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Activity className="stock-icon" size={20} />
                      )}
                      {stock.symbol}
                    </div>
                  </td>
                  <td align="right">${stock.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td align="right" className={isPositive ? 'change-cell-positive' : 'change-cell-negative'}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                  </td>
                  <td align="right">{formatLargeNumber(stock.marketCap)}</td>
                  <td align="right">{formatLargeNumber(stock.volume)}</td>
                  <td align="center">
                    {stock.trendData.length > 0 ? (
                    <MiniLineChart data={stock.trendData} isPositive={isPositive} />
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
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
