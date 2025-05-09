import React, { useEffect, useRef, memo } from 'react';

function TradingViewTimelineWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      // Limpiar el contenedor si ya existe un script
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.async = true;
      script.innerHTML = `
        {
          "feedMode": "all_symbols",
          "isTransparent": false,
          "displayMode": "regular",
          "width": "100%",
          "height": "100%",
          "colorTheme": "light",
          "locale": "en"
        }`;
      
      if (container.current) {
        container.current.appendChild(script);
      }

      // Cleanup function para remover el script cuando el componente se desmonte
      return () => {
        if (container.current) {
          // Intentar remover el script y el iframe si TradingView los crea directamente
          const tvEmbedWidget = container.current.querySelector('.tradingview-widget-container__widget');
          if (tvEmbedWidget) {
            container.current.removeChild(tvEmbedWidget);
          }
          // Limpiar cualquier otro hijo, como el script mismo o el div de copyright
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

export default memo(TradingViewTimelineWidget);
