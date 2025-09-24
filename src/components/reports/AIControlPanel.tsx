import React, { useState } from 'react';
import Modal from '../Modal';
import { API_CONFIG, getApiUrl } from '../../config/api';

type RibbonKey = 'summary' | 'performance' | 'forecast' | 'alerts' | 'customReport';

interface BackendResponse {
  title?: string;
  message?: string;
  report_id?: string;
}

const endpointFor: Record<RibbonKey, string> = {
  summary: API_CONFIG.ENDPOINTS.RIBBON_SUMMARY,
  performance: API_CONFIG.ENDPOINTS.RIBBON_PERFORMANCE,
  forecast: API_CONFIG.ENDPOINTS.RIBBON_FORECAST,
  alerts: API_CONFIG.ENDPOINTS.RIBBON_ALERTS,
  customReport: API_CONFIG.ENDPOINTS.RIBBON_CUSTOM_REPORT,
};

const AIControlPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function callBackend(key: RibbonKey) {
    setLoading(true);
    try {
      const url = getApiUrl(endpointFor[key]);
      const res = await fetch(url);
      const data: BackendResponse = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Error desconocido');

      setTitle(data.title || 'Información');
      setMessage(data.message || '');
      setOpen(true);
    } catch (e: any) {
      setTitle('Error');
      setMessage(e?.message || 'No se pudo conectar con el servidor');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg flex items-center justify-center">
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => callBackend('summary')}
          disabled={loading}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
        >
          <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Resumen Diario/Semanal</span>
        </button>

        <button
          onClick={() => callBackend('performance')}
          disabled={loading}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
        >
          <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Análisis Rendimiento</span>
        </button>

        <button
          onClick={() => callBackend('forecast')}
          disabled={loading}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
        >
          <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Proyecciones Futuras</span>
        </button>

        <button
          onClick={() => callBackend('alerts')}
          disabled={loading}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
        >
          <svg className="w-8 h-8 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Alertas y Oportunidades</span>
        </button>

        <button
          onClick={() => callBackend('customReport')}
          disabled={loading}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[160px] text-center h-[120px]"
        >
          <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          <span className="text-gray-800 font-semibold text-sm">Generar Reporte</span>
        </button>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={title}>
        <p className="text-sm leading-6">{message}</p>
        {loading && <p className="mt-4 text-blue-500">Cargando...</p>}
      </Modal>
    </div>
  );
};

export default AIControlPanel;
