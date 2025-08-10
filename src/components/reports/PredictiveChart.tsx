import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getApiUrl } from '../../config/api';

const PredictiveChart: React.FC = () => {
  const iframeSrc = getApiUrl('/api/analizer/file/monte_carlo_trajectories.html');
  // Dimensiones base exportadas por el script
  const BASE_WIDTH = 1000;
  const BASE_HEIGHT = 600;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState<number>(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const availableWidth = el.clientWidth;
      const parentHeight = el.parentElement?.clientHeight ?? el.clientHeight;
      const availableHeight = Math.max(280, parentHeight - 8); // un pequeño margen
      const ratioW = availableWidth / BASE_WIDTH;
      const ratioH = availableHeight / BASE_HEIGHT;
      // margen de seguridad 0.02 para evitar cortes de ejes
      const s = Math.max(0.5, Math.min(0.95, Math.min(ratioW, ratioH) - 0.02));
      setScale(s);
      setContainerHeight(Math.round(BASE_HEIGHT * s) + 24);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledHeight = useMemo(() => Math.round(BASE_HEIGHT * scale), [scale]);
  // containerHeight se calcula en update(); fallback por si aún no corrió
  const effectiveContainerHeight = containerHeight || (scaledHeight + 28);

  return (
    // Contenedor principal: solo título y gráfico de Monte Carlo
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-md border border-gray-100 flex justify-center"
        style={{ height: effectiveContainerHeight }}
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
            title="Trayectorias de Monte Carlo (Interactivo)"
            className="border-0 block"
            scrolling="no"
            style={{ width: BASE_WIDTH, height: BASE_HEIGHT, overflow: 'hidden' }}
          />
          </div>
      </div>
    </div>
  );
};

export default PredictiveChart;
