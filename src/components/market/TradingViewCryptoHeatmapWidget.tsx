import React, { useEffect, useRef, memo } from 'react';

function TradingViewCryptoHeatmapWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      // Limpiar el contenedor si ya existe un script
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "dataSource": "Crypto",
          "blockSize": "market_cap_calc",
          "blockColor": "24h_close_change|5",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "light",
          "hasTopBar": true,
          "isDataSetEnabled": true,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "isMonoSize": false,
          "width": "100%",
          "height": "100%"
        }`;
      
      if (container.current) {
        container.current.appendChild(script);
      }

      // Cleanup function para remover el script cuando el componente se desmonte
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
      {/* El copyright se puede manejar directamente por el script de TradingView */}
    </div>
  );
}

export default memo(TradingViewCryptoHeatmapWidget);
