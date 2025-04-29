import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';

type TimeframeType = '1D' | '1W' | '1M' | '6M' | '1Y';

const PortfolioPerformanceChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('6M');
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Función para generar datos de ejemplo basados en el timeframe
  const generateData = (selectedTimeframe: TimeframeType) => {
    let labels: Date[] = [];
    let dataPoints: number[] = [];
    const baseValue = 150000;
    const volatility = 0.15; // 15% de volatilidad

    let numPoints: number;
    let startDate = new Date();

    switch (selectedTimeframe) {
      case '1D':
        numPoints = 24; // Horas
        startDate.setDate(startDate.getDate() - 1);
        labels = Array.from({ length: numPoints }, (_, i) => {
          const d = new Date(startDate);
          d.setHours(d.getHours() + i);
          return d;
        });
        break;
      case '1W':
        numPoints = 7; // Días
        startDate.setDate(startDate.getDate() - 7);
        labels = Array.from({ length: numPoints }, (_, i) => {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          return d;
        });
        break;
      case '1M':
        numPoints = 30; // Días
        startDate.setMonth(startDate.getMonth() - 1);
        labels = Array.from({ length: numPoints }, (_, i) => {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          return d;
        });
        break;
      case '6M':
        numPoints = 6; // Meses
        startDate.setMonth(startDate.getMonth() - 6);
        labels = Array.from({ length: numPoints }, (_, i) => {
          const d = new Date(startDate);
          d.setMonth(d.getMonth() + i);
          return d;
        });
        break;
      case '1Y':
        numPoints = 12; // Meses
        startDate.setFullYear(startDate.getFullYear() - 1);
        labels = Array.from({ length: numPoints }, (_, i) => {
          const d = new Date(startDate);
          d.setMonth(d.getMonth() + i);
          return d;
        });
        break;
      default:
        numPoints = 6; // Default a 6M
        startDate.setMonth(startDate.getMonth() - 6);
        labels = Array.from({ length: numPoints }, (_, i) => {
          const d = new Date(startDate);
          d.setMonth(d.getMonth() + i);
          return d;
        });
    }

    let currentValue = baseValue;
    dataPoints = labels.map(() => {
      const change = (Math.random() - 0.48) * baseValue * volatility / Math.sqrt(numPoints);
      currentValue += change;
      return Math.max(0, currentValue); // Evitar valores negativos
    });

    return { labels, dataPoints };
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        const { labels, dataPoints } = generateData(timeframe);

        // Crear gradiente para el fondo
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.4)'); // Azul más intenso arriba
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)'); // Transparente abajo

        // Destruir gráfico anterior si existe
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Crear nueva instancia del gráfico
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Valor del Portafolio',
              data: dataPoints,
              borderColor: '#2563eb', // Azul brillante
              borderWidth: 2,
              pointRadius: 0, // Sin puntos visibles
              pointHoverRadius: 6, // Punto al pasar el cursor
              pointHoverBackgroundColor: '#2563eb',
              pointHoverBorderColor: '#FFFFFF',
              pointHoverBorderWidth: 2,
              tension: 0.3, // Línea ligeramente curvada
              fill: true,
              backgroundColor: gradient,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: timeframe === '1D' ? 'hour' : (timeframe === '1W' || timeframe === '1M' ? 'day' : 'month'),
                  tooltipFormat: timeframe === '1D' ? 'dd MMM, HH:mm' : 'dd MMM, yyyy',
                  displayFormats: {
                    hour: 'HH:mm',
                    day: 'dd MMM',
                    month: 'MMM',
                    year: 'yyyy'
                  }
                },
                grid: {
                  display: false,
                  color: '#e5e7eb', // Cambiado a gris claro (Tailwind gray-200)
                },
                ticks: {
                  color: '#94a3b8', // Color tailwind slate-400
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 7
                },
                border: {
                  display: false,
                  color: '#e5e7eb', // Cambiado a gris claro (Tailwind gray-200)
                }
              },
              y: {
                beginAtZero: false,
                grid: {
                  color: '#e5e7eb', // Cambiado a gris claro (Tailwind gray-200)
                  drawOnChartArea: true,
                  drawBorder: false
                },
                ticks: {
                  color: '#6b7280', // Gris medio para etiquetas Y
                  padding: 10,
                  callback: function(value: number | string) {
                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                    if (numValue >= 1000000) return '$' + (numValue / 1000000).toFixed(1) + 'M';
                    if (numValue >= 1000) return '$' + (numValue / 1000).toFixed(0) + 'K';
                    return '$' + numValue;
                  },
                  maxTicksLimit: 5
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#f8fafc', // Color claro para tooltip
                titleColor: '#334155', // Texto oscuro para mejor contraste
                bodyColor: '#334155', // Texto oscuro para mejor contraste
                borderColor: '#e2e8f0', // Borde sutil
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                  title: function(tooltipItems: any[]) {
                    const date = new Date(tooltipItems[0].parsed.x);
                    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                  },
                  label: function(context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += '$' + context.parsed.y.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    }
                    return label;
                  }
                }
              }
            },
            interaction: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            }
          }
        });
      }
    }

    // Cleanup: destruir el gráfico al desmontar
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [timeframe]); // Re-ejecutar cuando cambie timeframe

  return (
    <div className="w-full h-full flex flex-col" style={{ height: '365.896px' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Rendimiento del Portafolio</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-full p-1">
          {(['1D', '1W', '1M', '6M', '1Y'] as TimeframeType[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              } transition-colors`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 pb-6">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default PortfolioPerformanceChart;
