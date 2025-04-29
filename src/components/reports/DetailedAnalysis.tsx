import React from 'react';
import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';

const DetailedAnalysis: React.FC = () => {
  // Datos de ejemplo para el Treemap
  const ids = [
    "Portafolio", "Tecnología", "Finanzas", "Consumo",
    "AAPL", "MSFT", "JPM", "BAC", "AMZN", "WMT"
  ];
  const labels = [
    "Portafolio Total", "Tecnología", "Finanzas", "Consumo Cíclico",
    "Apple (AAPL)", "Microsoft (MSFT)", "JPMorgan (JPM)", "Bank of America (BAC)",
    "Amazon (AMZN)", "Walmart (WMT)"
  ];
  const parents = [
    "", "Portafolio", "Portafolio", "Portafolio",
    "Tecnología", "Tecnología", "Finanzas", "Finanzas", "Consumo", "Consumo"
  ];
  const values = [
    100, 40, 25, 35, 25, 15, 10, 15, 20, 15
  ];
  const contribution = [
    1.5, 0.8, -0.3, 1.0, 0.6, 0.2, -0.1, -0.2, 0.7, 0.3
  ];

  // Generar colores basados en la contribución
  const colors = contribution.map(c => {
    if (c > 0.1) return 'rgba(34, 197, 94, 0.8)'; // green-500
    if (c > 0) return 'rgba(134, 239, 172, 0.8)'; // green-300
    if (c < -0.1) return 'rgba(239, 68, 68, 0.8)'; // red-500
    if (c < 0) return 'rgba(252, 165, 165, 0.8)'; // red-300
    return 'rgba(156, 163, 175, 0.8)'; // gray-400
  });
  colors[0] = 'rgba(107, 114, 128, 0.8)'; // gray-500 para la raíz

  const plotData: Data[] = [{
    type: "treemap",
    ids: ids,
    labels: labels,
    parents: parents,
    values: values,
    customdata: contribution.map(c => `${c.toFixed(2)}%`),
    textinfo: "label+value%",
    hoverinfo: "label+customdata",
    hovertemplate: '<b>%{label}</b><br>Peso: %{value}%<br>Contribución: %{customdata}<extra></extra>',
    pathbar: { visible: true },
    marker: {
      colors: colors,
      line: { width: 1, color: '#fff' }
    },
    branchvalues: 'total',
    tiling: { packing: 'squarify' }
  }];

  const plotLayout: Partial<Layout> = {
    // Título eliminado para dar más espacio, ya está en el contenedor
    // title: 'Desglose de Composición (Peso) y Contribución al Rendimiento',
    margin: { t: 20, l: 10, r: 10, b: 10 }, // Margen superior reducido
    autosize: true, // Importante para que se ajuste al div
    paper_bgcolor: '#FFFFFF', // Fondo del gráfico blanco
    plot_bgcolor: '#FFFFFF', // Fondo del área de trazado blanco
    font: {
        color: '#374151' // Color de fuente gris oscuro
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-1 text-gray-800">
        Análisis Detallado de Composición y Atribución (IA)
      </h2>
      <p className="text-xs text-gray-600 mb-2">
        Composición (tamaño) y Contribución al Rendimiento (color). Pase el cursor para detalles.
      </p>
      {/* Contenedor que permite al gráfico crecer */}
      <div className="flex-grow w-full h-full min-h-[400px]">
        <Plot
          data={plotData}
          layout={plotLayout}
          useResizeHandler={true} // Permite que react-plotly.js maneje el redimensionamiento
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true }} // Configuración adicional de Plotly para responsividad
        />
      </div>
    </div>
  );
};

export default DetailedAnalysis;
