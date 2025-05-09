import React, { useEffect, useRef, memo } from 'react';

function TradingViewHeatmapWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      // Limpiar el contenedor si ya existe un script
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "exchanges": [],
          "dataSource": "SPX500",
          "grouping": "sector",
          "blockSize": "market_cap_basic",
          "blockColor": "change",
          "locale": "es",
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
      // Asegurarse de que el script se añade solo una vez o se gestiona correctamente en el ciclo de vida
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
    [] // El array vacío asegura que el efecto se ejecute solo una vez después del montaje inicial
  );

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
      {/* El copyright se puede manejar directamente por el script de TradingView si está configurado para ello */}
    </div>
  );
}

export default memo(TradingViewHeatmapWidget);
