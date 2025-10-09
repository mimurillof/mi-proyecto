import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchPortfolioChartHtml } from '../../../services/portfolioManagerService';

type TimeframeType = '1D' | '1W' | '1M' | '6M' | '1Y';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  units: number;
}

interface PortfolioPerformanceChartProps {
  selectedStock: StockData | null;
}

const enhanceChartHtml = (html: string): string => {
  if (!html) {
    return html;
  }

  const responsiveStyles = `
    <style>
      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: transparent;
        width: 100%;
        height: 100%;
      }

      .plot-container.plotly, .js-plotly-plot, .main-svg, .svg-container {
        width: 100% !important;
        max-width: 100% !important;
      }

      .svg-container {
        height: auto !important;
        aspect-ratio: auto;
      }
    </style>
  `;

  if (html.includes('</head>')) {
    return html.replace('</head>', `${responsiveStyles}</head>`);
  }

  if (html.includes('<body')) {
    return html.replace('<body', `<body style="margin:0;padding:0;overflow:hidden;">${responsiveStyles}`);
  }

  return `${responsiveStyles}${html}`;
};

const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({ selectedStock }) => {
  const timeframe: TimeframeType = '6M';
  const [chartHtml, setChartHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);
  const chartCacheRef = useRef<Map<string, string>>(new Map());

  const chartTitle = useMemo(
    () => (selectedStock ? `${selectedStock.name} (${selectedStock.symbol})` : 'Rendimiento del Portafolio'),
    [selectedStock],
  );

  const chartKey = useMemo(
    () => (selectedStock ? selectedStock.symbol.trim().toUpperCase() : 'portfolio'),
    [selectedStock],
  );

  const loadChart = useCallback(
    async (tf: TimeframeType, targetKey: string) => {
      setLoading(true);
      setError(null);

      const requestId = requestRef.current + 1;
      requestRef.current = requestId;

      const cacheKey = `${targetKey}::${tf}`;
      if (chartCacheRef.current.has(cacheKey)) {
        const cachedHtml = chartCacheRef.current.get(cacheKey) ?? '';
        if (requestRef.current === requestId) {
          setChartHtml(cachedHtml);
          setLoading(false);
        }
        return;
      }

      try {
        const html = await fetchPortfolioChartHtml(targetKey);
        if (requestRef.current !== requestId) {
          return;
        }
        const enhancedHtml = enhanceChartHtml(html);
        setChartHtml(enhancedHtml);
        chartCacheRef.current.set(cacheKey, enhancedHtml);
      } catch (err) {
        if (requestRef.current !== requestId) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Error desconocido al cargar el gráfico.';
        setError(message);
        setChartHtml('');
      } finally {
        if (requestRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    loadChart(timeframe, chartKey);
  }, [chartKey, timeframe, loadChart]);

  return (
    <div className="w-full flex flex-col overflow-hidden">
      <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[420px] overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 bg-white/70 z-20">
            Cargando gráfico…
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-red-500 z-20 text-center px-4">
            {error}
          </div>
        )}

        {chartHtml && !error && (
          <iframe
            key={`${chartKey}-${timeframe}`}
            title={chartTitle}
            srcDoc={chartHtml}
            className="absolute inset-0 w-full h-full border-0"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {!chartHtml && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 z-10">
            No hay gráfico disponible para esta vista.
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPerformanceChart;
