import React, { useRef, useState, useEffect } from 'react';
import MetricCard, { MetricData } from './MetricCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- Datos de Ejemplo ---
const sampleMetrics: MetricData[] = [
  { id: 'total_return', name: 'Retorno Total', value: '12.5%', change: 1.5 },
  { id: 'volatility', name: 'Volatilidad (Anualizada)', value: '18.2%', change: -0.8 },
  { id: 'sharpe', name: 'Sharpe Ratio', value: '0.85', change: 0.12 },
  { id: 'max_drawdown', name: 'Máxima Reducción', value: '-8.3%', change: 0.5 }, // Cambio positivo significa menor reducción
  { id: 'alpha', name: 'Alpha vs S&P 500', value: '2.1%', change: 0.3 },
  { id: 'beta', name: 'Beta vs S&P 500', value: '1.05', change: -0.05 },
  { id: 'sortino', name: 'Sortino Ratio', value: '1.15', change: 0.2 },
  { id: 'tracking_error', name: 'Tracking Error', value: '3.5%', change: -0.2 },
  { id: 'info_ratio', name: 'Information Ratio', value: '0.60' }, // Sin cambio
];
// --- Fin Datos de Ejemplo ---

interface MetricsCarouselProps {
  metrics?: MetricData[]; // Permitir pasar métricas o usar las de ejemplo
  title?: string;
}

const MetricsCarousel: React.FC<MetricsCarouselProps> = ({ metrics = sampleMetrics, title = "Métricas Clave" }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cardWidth = 192 + 16; // Ancho de tarjeta (w-48 = 192px) + gap (gap-4 = 16px)
  const scrollAmount = cardWidth * 3; // Desplazar 3 tarjetas a la vez

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < maxScrollLeft - 1); // -1 para margen de error
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Comprobar al montar y al cambiar tamaño
      checkScrollability(); 
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);

      // Limpiar listeners al desmontar
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [metrics]); // Re-evaluar si las métricas cambian

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      const amount = direction === 'left' ? -scrollAmount : scrollAmount;
      container.scrollTo({
        left: currentScroll + amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {title && <h3 className="text-sm font-medium text-gray-600 mb-3 px-1">{title}</h3>}
      <div className="relative flex-1 flex items-center"> {/* Contenedor relativo para flechas */}
        {/* Flecha Izquierda */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 hover:bg-white rounded-full shadow border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity -ml-3`}
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Contenedor Deslizable */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide py-1 px-1 scroll-snap-type-x-mandatory" // scrollbar-hide es una utilidad común, si no la tienes, puedes añadirla a tu CSS o quitarla
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Flecha Derecha */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 hover:bg-white rounded-full shadow border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity -mr-3`}
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// Añadir esto a tu archivo CSS global si no tienes 'scrollbar-hide'
/*
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/

export default MetricsCarousel;
