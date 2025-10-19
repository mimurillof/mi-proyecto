import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getAuthenticatedUrl } from '../../config/api';

const DetailedAnalysis: React.FC = () => {
  const iframeSrc = getAuthenticatedUrl('/api/analizer/file/msr_portfolio_treemap_original.html');
  // Dimensiones base del HTML exportado por el script
  const BASE_WIDTH = 1000;
  const BASE_HEIGHT = 600;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const availableWidth = el.clientWidth;
      const availableHeight = el.clientHeight;
      const sx = availableWidth / BASE_WIDTH;
      const sy = availableHeight / BASE_HEIGHT;
      const s = Math.max(0.5, Math.min(1, Math.min(sx, sy)));
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledHeight = useMemo(() => Math.round(BASE_HEIGHT * scale), [scale]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-1 text-gray-800">
        Análisis Detallado de Composición y Atribución (IA)
      </h2>
      <p className="text-xs text-gray-600 mb-2">
        Composición (tamaño) y Contribución al Rendimiento (color). Pase el cursor para detalles.
      </p>
      {/* Contenedor que permite al gráfico crecer (altura objetivo ~525px) */}
      <div
        ref={containerRef}
        className="flex-grow w-full h-full min-h-[400px] flex items-start justify-center overflow-hidden"
        style={{ height: 525 }}
      >
        <div
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            src={iframeSrc}
            title="Treemap MSR (Interactivo)"
            className="border-0 block"
            scrolling="no"
            style={{ width: BASE_WIDTH, height: BASE_HEIGHT, overflow: 'hidden' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis;
