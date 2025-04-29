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
  Filler, // Importar Filler para el relleno entre líneas
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js, incluyendo Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PredictiveChart: React.FC = () => {
  // Datos de ejemplo para el gráfico
  const years = ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5', 'Año 6', 'Año 7', 'Año 8', 'Año 9', 'Año 10'];
  const projectionLine = [10000, 11500, 13200, 15000, 17000, 19500, 22000, 25000, 28500, 32000];
  const lowerBound = [9000, 10000, 11000, 12500, 14000, 16000, 18000, 20500, 23000, 26000];
  const upperBound = [11000, 13000, 15500, 17800, 20500, 23500, 26500, 30000, 34000, 39000];

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Límite Inferior', // Leyenda simplificada
        data: lowerBound,
        borderColor: 'rgba(173, 216, 230, 0.3)',
        backgroundColor: 'rgba(173, 216, 230, 0.2)',
        pointRadius: 0,
        borderWidth: 1,
        fill: '+1', // Rellena hasta el siguiente dataset (upperBound)
        tension: 0.1,
        order: 1 // Asegurar que se dibuje antes de la línea superior
      },
      {
        label: 'Límite Superior', // Leyenda simplificada
        data: upperBound,
        borderColor: 'rgba(173, 216, 230, 0.3)',
        backgroundColor: 'rgba(173, 216, 230, 0.2)', // Mismo color de fondo que el inferior
        pointRadius: 0,
        borderWidth: 1,
        fill: false, // No rellenar este independientemente
        tension: 0.1,
        order: 2 // Asegurar que se dibuje después de la línea inferior
      },
      {
        label: 'Proyección Media', // Leyenda simplificada
        data: projectionLine,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        order: 3 // Asegurar que se dibuje encima de las bandas
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          color: '#374151', // Color de texto para leyenda
          // Opcional: filtrar leyendas si aún se muestran las de los límites
           filter: function(legendItem: any) {
             return !legendItem.text.includes('Límite');
           }
        }
      },
      title: {
        display: true,
        text: 'Proyección del Valor del Portafolio (€)',
        font: { size: 14 }, // Tamaño ajustado
        color: '#1f2937' // Color de título oscuro
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Años Futuros', color: '#4b5563' }, // Color de título de eje
        ticks: { color: '#4b5563' }, // Color de ticks de eje
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Valor Proyectado (€)', color: '#4b5563' },
        ticks: { color: '#4b5563' },
        grid: { color: '#e5e7eb' }, // Color de rejilla claro
        beginAtZero: false
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    // Contenedor principal adaptado para tema claro y dimensiones
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      {/* Contenedor del Gráfico con altura flexible */}
      {/* Ajustar margen superior si es necesario después de eliminar títulos */}
      <div className="relative flex-grow mb-3 mt-2"> {/* Añadido mt-2 para compensar títulos eliminados */}
        <Line options={chartOptions} data={chartData} />
      </div>

      {/* Controles de Supuestos (Estructura Estática) */}
      <div className="border-t border-gray-200 pt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <label htmlFor="aportacion" className="block text-xs text-gray-600 mb-1">Aportación Anual (€):</label>
            <input type="range" id="aportacion" name="aportacion" min="0" max="10000" defaultValue="2000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
            <span className="text-xs text-gray-500">Valor: 2000 €</span>
          </div>
          <div>
            <label htmlFor="volatilidad" className="block text-xs text-gray-600 mb-1">Volatilidad Esperada:</label>
            <select id="volatilidad" name="volatilidad" defaultValue="media" className="w-full p-1 border border-gray-300 rounded text-xs bg-white">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">(Controles no funcionales en esta vista)</p>
      </div>
    </div>
  );
};

export default PredictiveChart;
