import React, { useEffect, useRef, memo } from 'react';

function TradingViewAdvancedChartWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      // Limpiar el contenedor si ya existe un script
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "width": "100%",
          "height": "100%",
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "allow_symbol_change": true,
          "support_host": "https://www.tradingview.com"
        }`;
      
      if (container.current) {
        container.current.appendChild(script);
      }

      // Cleanup function
      return () => {
        if (container.current) {
          while (container.current.firstChild) {
            container.current.removeChild(container.current.firstChild);
          }
        }
      };
    },
    []
  );

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
      {/* El copyright es usualmente añadido por el script de TradingView */}
    </div>
  );
}

export default memo(TradingViewAdvancedChartWidget);
