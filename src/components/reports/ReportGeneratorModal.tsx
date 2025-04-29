import React, { useState } from 'react';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setMetrics(prev => [...prev, value]);
    } else {
      setMetrics(prev => prev.filter(metric => metric !== value));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.metrics = metrics; // Añadir métricas seleccionadas

    console.log('Parámetros del Reporte:', data);
    alert('Reporte solicitado. Revisa la consola para ver los parámetros.');
    // Aquí iría la lógica para enviar 'data' al backend
    onClose(); // Cerrar modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Fondo del modal */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Contenedor para centrar */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Contenido del Modal */}
        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center pb-3">
            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              Generar Reporte Personalizado
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Cerrar</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Rango de Fechas */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Rango de Fechas</label>
              <div className="flex space-x-2 mt-1">
                <input type="date" name="startDate" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
                <span className="self-center text-gray-500">-</span>
                <input type="date" name="endDate" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              </div>
            </div>

            {/* Métricas */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Métricas a Incluir</label>
              <div className="mt-1 space-y-2">
                <div className="flex items-start">
                  <input id="metric-return" name="metrics" type="checkbox" value="total_return" onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="metric-return" className="ml-2 block text-sm text-gray-900">Retorno Total</label>
                </div>
                <div className="flex items-start">
                  <input id="metric-volatility" name="metrics" type="checkbox" value="volatility" onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="metric-volatility" className="ml-2 block text-sm text-gray-900">Volatilidad</label>
                </div>
                <div className="flex items-start">
                  <input id="metric-sharpe" name="metrics" type="checkbox" value="sharpe_ratio" onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="metric-sharpe" className="ml-2 block text-sm text-gray-900">Sharpe Ratio</label>
                </div>
              </div>
            </div>

            {/* Nivel de Detalle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nivel de Detalle</label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center">
                  <input id="detail-general" name="detailLevel" type="radio" value="general" defaultChecked className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="detail-general" className="ml-2 block text-sm text-gray-900">General</label>
                </div>
                <div className="flex items-center">
                  <input id="detail-asset-class" name="detailLevel" type="radio" value="asset_class" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="detail-asset-class" className="ml-2 block text-sm text-gray-900">Por Clase de Activo</label>
                </div>
                <div className="flex items-center">
                  <input id="detail-individual" name="detailLevel" type="radio" value="individual_asset" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="detail-individual" className="ml-2 block text-sm text-gray-900">Por Activo Individual</label>
                </div>
              </div>
            </div>

             {/* Tipo de Gráficos */}
             <div>
                <label htmlFor="chartType" className="block text-sm font-medium text-gray-700">Tipo de Gráfico Preferido (Opcional)</label>
                <select id="chartType" name="chartType" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="">Ninguno Específico</option>
                    <option value="line">Línea</option>
                    <option value="bar">Barras</option>
                    <option value="pie">Torta</option>
                </select>
            </div>

            {/* Formato de Salida */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Formato de Salida</label>
              <div className="mt-1 flex space-x-4">
                <div className="flex items-center">
                  <input id="format-screen" name="outputFormat" type="radio" value="screen" defaultChecked className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="format-screen" className="ml-2 block text-sm text-gray-900">Visualización</label>
                </div>
                <div className="flex items-center">
                  <input id="format-pdf" name="outputFormat" type="radio" value="pdf" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="format-pdf" className="ml-2 block text-sm text-gray-900">PDF</label>
                </div>
                <div className="flex items-center">
                  <input id="format-csv" name="outputFormat" type="radio" value="csv" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="format-csv" className="ml-2 block text-sm text-gray-900">CSV</label>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancelar
              </button>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Generar Reporte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorModal;
