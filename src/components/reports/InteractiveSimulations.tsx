import React, { useState, useEffect, useRef } from 'react';
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
  Filler,
} from 'chart.js';

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
  const [riskLevel, setRiskLevel] = useState<number>(5);
  const [contribution, setContribution] = useState<number>(200);
  const [inflation, setInflation] = useState<number>(2.0);
  const [retirementYear, setRetirementYear] = useState<number>(2050);
  const [chartData, setChartData] = useState(initialData);

  // Simular actualización del gráfico basado en el riesgo
  useEffect(() => {
    if (riskLevel > 7) {
      setChartData(updatedDataHighRisk);
    } else if (riskLevel < 4) {
      setChartData(updatedDataLowRisk);
    } else {
      setChartData(initialData);
    }
    // En una app real, aquí se haría la llamada al backend con todos los parámetros
    // console.log("Simulating backend call with params:", { riskLevel, contribution, inflation, retirementYear });
  }, [riskLevel, contribution, inflation, retirementYear]); // Re-ejecutar si cambia algún parámetro

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h1 className="text-xl font-bold mb-2 text-center text-blue-700">Simulaciones Interactivas</h1>
      <p className="text-xs text-center text-gray-600 mb-4">Ajusta los parámetros para ver proyecciones simuladas.</p>

      {/* Sección de Controles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="riskLevel" className="block text-xs font-medium text-gray-700">Nivel de Riesgo:</label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="range" id="riskLevel" name="riskLevel" min="1" max="10" value={riskLevel}
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-xs font-semibold text-blue-600 min-w-[2em] text-right">{riskLevel}</span>
          </div>
        </div>
        <div>
          <label htmlFor="monthlyContribution" className="block text-xs font-medium text-gray-700">Aportación Mensual (€):</label>
          <input
            type="number" id="monthlyContribution" name="monthlyContribution" value={contribution}
            onChange={(e) => setContribution(Number(e.target.value))}
            min="0" step="50"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-1"
          />
        </div>
        <div>
          <label htmlFor="inflationRate" className="block text-xs font-medium text-gray-700">Inflación Anual (%):</label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="range" id="inflationRate" name="inflationRate" min="0" max="5" value={inflation} step="0.1"
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-xs font-semibold text-blue-600 min-w-[3em] text-right">{inflation.toFixed(1)}%</span>
          </div>
        </div>
        <div>
          <label htmlFor="retirementYear" className="block text-xs font-medium text-gray-700">Año Jubilación:</label>
          <input
            type="number" id="retirementYear" name="retirementYear" value={retirementYear}
            onChange={(e) => setRetirementYear(Number(e.target.value))}
            min="2025" max="2070"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-1"
          />
        </div>
      </div>

      {/* Área de Visualización del Gráfico */}
      <div className="flex-grow relative mb-2 min-h-[250px]"> {/* Altura mínima para el gráfico */}
        <Line options={chartOptions} data={chartData} />
      </div>
      <p className="text-xs text-center text-gray-500">El gráfico se actualiza según tus selecciones (simulado).</p>

      {/* Advertencia omitida según solicitud */}

    </div>
  );
};

export default InteractiveSimulations;
