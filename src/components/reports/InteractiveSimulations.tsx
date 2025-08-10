import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getApiUrl } from '../../config/api';

// Datos de ejemplo iniciales y para simulación
const initialData = {
  labels: Array.from({ length: 10 }, (_, i) => `Año ${i + 1}`),
  datasets: [{
    label: 'Valor Proyectado (€)',
    data: [1000, 1200, 1500, 1700, 2100, 2500, 2800, 3200, 3700, 4300],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.1,
    fill: true
  }]
};
const updatedDataHighRisk = {
  labels: Array.from({ length: 10 }, (_, i) => `Año ${i + 1}`),
  datasets: [{
    label: 'Valor Proyectado (€) - Mayor Riesgo',
    data: [1000, 1300, 1700, 1900, 2500, 3100, 3500, 4100, 4800, 5800],
    borderColor: 'rgb(239, 68, 68)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    tension: 0.1,
    fill: true
  }]
};
const updatedDataLowRisk = {
  labels: Array.from({ length: 10 }, (_, i) => `Año ${i + 1}`),
  datasets: [{
    label: 'Valor Proyectado (€) - Menor Riesgo',
    data: [1000, 1150, 1350, 1500, 1700, 1950, 2150, 2400, 2700, 3100],
    borderColor: 'rgb(16, 185, 129)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    tension: 0.1,
    fill: true
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: number | string) {
          if (typeof value === 'number') {
            return '€' + value.toLocaleString('es-ES');
          }
          return value;
        },
        color: '#4b5563'
      },
      grid: { color: '#e5e7eb' }
    },
    x: {
        ticks: { color: '#4b5563' },
        grid: { display: false }
    }
  },
  plugins: {
    legend: {
        position: 'bottom' as const,
        labels: { color: '#374151' }
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || '';
          if (label) { label += ': '; }
          if (context.parsed.y !== null) {
            label += '€' + context.parsed.y.toLocaleString('es-ES');
          }
          return label;
        }
      }
    }
  }
};


const InteractiveSimulations: React.FC = () => {
  const iframeSrc = getApiUrl('/api/analizer/file/efficient_frontier_interactive.html');
  const BASE_WIDTH = 1100;
  const BASE_HEIGHT = 700;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = Math.max(0.5, Math.min(0.95, Math.min(w / BASE_WIDTH, h / BASE_HEIGHT) - 0.02));
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <div
        ref={containerRef}
        className="relative w-full h-full flex-grow overflow-hidden rounded-md border border-gray-100 flex justify-center"
        style={{ minHeight: 300 }}
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
            title="Frontera Eficiente (Interactiva)"
            className="border-0 block"
            scrolling="no"
            style={{ width: BASE_WIDTH, height: BASE_HEIGHT, overflow: 'hidden' }}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveSimulations;
