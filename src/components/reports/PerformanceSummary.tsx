import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getAuthenticatedUrl } from '../../config/api';

const PerformanceSummary: React.FC = () => {
  const iframeSrc = getAuthenticatedUrl('/api/analizer/file/portfolio_growth_interactive.html');

  // Dimensiones nativas del HTML (definidas en el script): 1000x600
  const BASE_WIDTH = 1000;
  const BASE_HEIGHT = 600;
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;

    const updateScale = () => {
      const availableWidth = el.clientWidth;
      const newScale = Math.max(0.5, Math.min(1, availableWidth / BASE_WIDTH));
      setScale(newScale);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledHeight = useMemo(() => Math.round(BASE_HEIGHT * scale), [scale]);

  return (
    // Contenedor principal adaptado para tema claro y dimensiones
    <div className="w-full h-full bg-white p-4 rounded-lg flex flex-col md:flex-row gap-4 min-h-[560px]">
      {/* Área del Gráfico */}
      <div className="md:w-3/5 h-full flex flex-col">
        {/* Título accesible sin ocupar espacio visual */}
        <h2 className="sr-only">Evolución del Portafolio</h2>
        <div ref={chartContainerRef} className="relative w-full overflow-hidden rounded-md border border-gray-100" style={{ height: scaledHeight }}>
          <div
            style={{
              width: BASE_WIDTH,
              height: BASE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <iframe
              src={iframeSrc}
              title="Evolución del Portafolio (Interactivo)"
              className="border-0 block"
              scrolling="no"
              style={{ width: BASE_WIDTH, height: BASE_HEIGHT, overflow: 'hidden' }}
            />
          </div>
        </div>
      </div>

      {/* Área de la Narrativa Automatizada */}
      <div className="md:w-2/5 flex flex-col">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Resumen del Periodo</h2>
        <p className="text-sm font-semibold text-blue-600 mb-1">Análisis Generado por IA:</p>
        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 overflow-y-auto flex-grow"> {/* Scroll si es necesario */}
          <p>Durante el último trimestre, el portafolio experimentó una volatilidad moderada, cerrando con un rendimiento neto del 2.5%. Los activos tecnológicos lideraron las ganancias, especialmente las acciones de 'TechCorp', que subieron un 15% tras resultados positivos.</p>
          <p className="mt-2">Sin embargo, la exposición al sector energético restó 0.8% al rendimiento total debido a la caída de los precios del crudo. En comparación, el benchmark de referencia (S&P 500) obtuvo un 3.1% en el mismo periodo, indicando un ligero rendimiento inferior del portafolio ajustado por riesgo.</p>
          <p className="mt-2">Se recomienda revisar la ponderación en el sector energético y considerar aumentar la exposición a mercados emergentes para diversificación.</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;
