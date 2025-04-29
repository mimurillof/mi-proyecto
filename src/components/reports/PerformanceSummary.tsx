import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceSummary: React.FC = () => {
  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Valor del Portafolio (€)',
        data: [10000, 10200, 10150, 10500, 10450, 10700, 10800, 10750, 11000, 10900, 11200, 11300],
        borderColor: 'rgb(59, 130, 246)', // Azul más acorde con tema claro
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Benchmark (MSCI World)',
        data: [10000, 10100, 10200, 10350, 10500, 10600, 10750, 10900, 10950, 11100, 11150, 11400],
        borderColor: 'rgb(239, 68, 68)', // Rojo más acorde
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.1,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Importante para que el gráfico llene el contenedor
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: number | string) {
            // Asegurarse de que value es número antes de llamar a toLocaleString
            if (typeof value === 'number') {
              return '€' + value.toLocaleString('es-ES');
            }
            return value;
          },
          color: '#374151', // Color de texto gris oscuro para ejes
        },
        grid: {
            color: '#e5e7eb', // Color de la cuadrícula gris claro
        },
      },
      x: {
          ticks: {
              color: '#374151', // Color de texto gris oscuro para ejes
          },
          grid: {
              color: '#e5e7eb', // Color de la cuadrícula gris claro
          },
      }
    },
    plugins: {
      legend: {
          labels: {
              color: '#1f2937', // Color de texto para la leyenda
          }
      },
      tooltip: {
        mode: 'index' as const, // Tipo correcto para mode
        intersect: false,
        titleColor: '#ffffff', // Color del título en tooltip
        bodyColor: '#ffffff', // Color del cuerpo en tooltip
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo del tooltip
      },
      title: {
        display: false, // El título se maneja fuera
      },
    },
    hover: {
      mode: 'nearest' as const, // Tipo correcto para mode
      intersect: true,
    },
  };

  return (
    // Contenedor principal adaptado para tema claro y dimensiones
    <div className="w-full h-full bg-white p-4 rounded-lg flex flex-col md:flex-row gap-4">
      {/* Área del Gráfico */}
      <div className="md:w-3/5 h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Evolución del Portafolio</h2>
        <div className="relative flex-grow"> {/* flex-grow para que ocupe el espacio restante */}
          <Line options={chartOptions} data={chartData} />
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
