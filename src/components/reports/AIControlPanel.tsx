import React, { useState } from 'react';
import Modal from '../Modal';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../../config/api';

type RibbonKey = 'summary' | 'performance' | 'forecast' | 'alerts' | 'customReport';

interface BackendResponse {
  title?: string;
  message?: string;
  report_id?: string;
}

interface PortfolioReportResponse {
  report: any;
  session_id?: string;
  model_used?: string;
  metadata?: Record<string, any>;
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
  const [reportData, setReportData] = useState<PortfolioReportResponse | null>(null);
  const [progress, setProgress] = useState<string>('');

  async function callBackend(key: RibbonKey) {
    setLoading(true);
    setReportData(null);
    setProgress('');
    
    try {
      const url = getApiUrl(endpointFor[key]);
      const isCustomReport = key === 'customReport';
      const isAlerts = key === 'alerts';
      const isProjections = key === 'forecast';

      if (isCustomReport) {
        // Abrir modal INMEDIATAMENTE para mostrar progreso
        setTitle('🔄 Generando Reporte');
        setMessage('Iniciando proceso de generación...');
        setProgress('Preparando solicitud al servidor...');
        setOpen(true);
        
        // Nuevo flujo asíncrono para custom report
        await handleCustomReportAsync();
      } else if (isAlerts) {
        // Abrir modal INMEDIATAMENTE para mostrar progreso
        setTitle('🔍 Analizando Alertas y Oportunidades');
        setMessage('Espere un momento mientras el agente genera la respuesta...');
        setProgress('Conectando con el servidor...');
        setOpen(true);
        
        // Nuevo flujo asíncrono para alertas
        await handleAlertsAsync();
      } else if (isProjections) {
        // Abrir modal INMEDIATAMENTE para mostrar progreso
        setTitle('🔮 Generando Proyecciones Futuras');
        setMessage('Espere un momento mientras el agente analiza los datos...');
        setProgress('Conectando con el servidor...');
        setOpen(true);
        
        // Nuevo flujo asíncrono para proyecciones
        await handleProjectionsAsync();
      } else {
        // Flujo normal para otros endpoints
        const res = await fetch(url, { method: 'GET' });
        const contentType = res.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await res.json() : await res.text();

        if (!res.ok) throw new Error(data?.message || 'Error desconocido');

        const parsedData = data as BackendResponse;
        setTitle(parsedData.title || 'Información');
        setMessage(parsedData.message || '');
        setOpen(true);
        setLoading(false);
      }
    } catch (e: any) {
      setTitle('Error');
      setMessage(e?.message || 'No se pudo conectar con el servidor');
      setOpen(true);
      setLoading(false);
    }
  }

  async function handleCustomReportAsync() {
    try {
      // 1. Iniciar generación del reporte
      setProgress('📤 Enviando solicitud al backend...');
      setMessage('Conectando con el servidor...');
      
      const startUrl = getApiUrl(API_CONFIG.ENDPOINTS.RIBBON_CUSTOM_REPORT_START);
      const startRes = await fetch(startUrl, {
        method: 'POST',
        headers: getAuthHeaders(),  // ✅ AGREGADO: Autenticación JWT
        body: JSON.stringify({})
      });

      if (!startRes.ok) {
        const errorText = await startRes.text();
        throw new Error(`Error al iniciar la generación del reporte: ${startRes.status} - ${errorText}`);
      }

      const { report_id } = await startRes.json();
      
      // 2. Hacer polling para verificar el estado
      setProgress('⏳ Generando reporte con IA (Gemini 2.5 Pro)...');
      setMessage('Este proceso puede tomar entre 1 y 2 minutos. Por favor no cierre esta ventana.');
      await pollReportStatus(report_id);

    } catch (error: any) {
      setTitle('❌ Error');
      setMessage(error?.message || 'Error generando el reporte');
      setProgress('');
      setLoading(false);
    }
  }

  async function pollReportStatus(reportId: string) {
    const maxAttempts = 60; // 60 intentos * 3 segundos = 3 minutos máximo
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      try {
        attempts++;
        const statusUrl = getApiUrl(`${API_CONFIG.ENDPOINTS.RIBBON_CUSTOM_REPORT_STATUS}/${reportId}`);
        const statusRes = await fetch(statusUrl, {
          headers: getAuthHeaders()  // ✅ AGREGADO: Autenticación JWT
        });

        if (!statusRes.ok) {
          throw new Error('Error al consultar el estado del reporte');
        }

        const statusData = await statusRes.json();

        if (statusData.status === 'completed') {
          // Reporte completado exitosamente
          setTitle('✅ Informe Generado Exitosamente');
          setMessage('El reporte ha sido generado con éxito usando Gemini 2.5 Pro.');
          setReportData(statusData.result as PortfolioReportResponse);
          setProgress('');
          setLoading(false);
        } else if (statusData.status === 'error') {
          // Error en la generación
          setTitle('❌ Error en la Generación');
          setMessage(statusData.error || 'Error desconocido al generar el reporte');
          setProgress('');
          setLoading(false);
        } else if (statusData.status === 'processing') {
          // Aún procesando
          const elapsed = attempts * 3;
          setProgress(`⏳ Generando reporte con IA (Gemini 2.5 Pro)... ${elapsed}s transcurridos`);
          setMessage('El modelo de IA está analizando tu portafolio. Esto puede tomar 1-2 minutos.');
          
          if (attempts >= maxAttempts) {
            throw new Error('Tiempo de espera excedido. El reporte puede estar aún procesándose.');
          }
          
          // Continuar polling después de 3 segundos
          setTimeout(() => checkStatus(), 3000);
        } else if (statusData.status === 'pending') {
          // Pendiente de iniciar
          setProgress('⏳ Reporte en cola... Iniciando generación.');
          setMessage('Tu solicitud está siendo procesada...');
          
          if (attempts >= maxAttempts) {
            throw new Error('Tiempo de espera excedido.');
          }
          
          // Continuar polling después de 2 segundos
          setTimeout(() => checkStatus(), 2000);
        }
      } catch (error: any) {
        setTitle('❌ Error de Conexión');
        setMessage(error?.message || 'Error consultando el estado del reporte');
        setProgress('');
        setLoading(false);
      }
    };

    // Iniciar el polling
    await checkStatus();
  }

  async function handleAlertsAsync() {
    try {
      // 1. Iniciar análisis de alertas
      setProgress('📤 Enviando solicitud al backend...');
      setMessage('Conectando con el servidor...');
      
      const startUrl = getApiUrl(API_CONFIG.ENDPOINTS.RIBBON_ALERTS_START);
      const startRes = await fetch(startUrl, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({})
      });

      if (!startRes.ok) {
        const errorText = await startRes.text();
        throw new Error(`Error al iniciar el análisis: ${startRes.status} - ${errorText}`);
      }

      const { report_id } = await startRes.json();
      
      // 2. Hacer polling para verificar el estado
      setProgress('⏳ Analizando alertas con IA (Gemini 2.5 Pro)...');
      setMessage('El agente está analizando tus archivos de análisis. Este proceso puede tomar entre 30 y 90 segundos.');
      await pollAlertsStatus(report_id);

    } catch (error: any) {
      setTitle('❌ Error');
      setMessage(error?.message || 'Error generando el análisis de alertas');
      setProgress('');
      setLoading(false);
    }
  }

  async function pollAlertsStatus(reportId: string) {
    const maxAttempts = 60; // 60 intentos * 3 segundos = 3 minutos máximo
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      try {
        attempts++;
        const statusUrl = getApiUrl(`${API_CONFIG.ENDPOINTS.RIBBON_ALERTS_STATUS}/${reportId}`);
        const statusRes = await fetch(statusUrl, {
          headers: getAuthHeaders()
        });

        if (!statusRes.ok) {
          throw new Error('Error al consultar el estado del análisis');
        }

        const statusData = await statusRes.json();

        if (statusData.status === 'completed') {
          // Análisis completado exitosamente
          setTitle('✅ Análisis de Alertas y Oportunidades');
          setMessage(statusData.analysis || 'Análisis completado exitosamente.');
          setProgress('');
          setLoading(false);
        } else if (statusData.status === 'error') {
          // Error en el análisis
          setTitle('❌ Error en el Análisis');
          setMessage(statusData.error || 'Error desconocido al generar el análisis');
          setProgress('');
          setLoading(false);
        } else if (statusData.status === 'processing') {
          // Aún procesando
          const elapsed = attempts * 3;
          setProgress(`⏳ Analizando alertas con IA (Gemini 2.5 Pro)... ${elapsed}s transcurridos`);
          setMessage('El agente está analizando tus archivos de análisis. Esto puede tomar entre 30 y 90 segundos.');
          
          if (attempts >= maxAttempts) {
            throw new Error('Tiempo de espera excedido. El análisis puede estar aún procesándose.');
          }
          
          // Continuar polling después de 3 segundos
          setTimeout(() => checkStatus(), 3000);
        } else if (statusData.status === 'pending') {
          // Pendiente de iniciar
          setProgress('⏳ Análisis en cola... Iniciando procesamiento.');
          setMessage('Tu solicitud está siendo procesada...');
          
          if (attempts >= maxAttempts) {
            throw new Error('Tiempo de espera excedido.');
          }
          
          // Continuar polling después de 2 segundos
          setTimeout(() => checkStatus(), 2000);
        }
      } catch (error: any) {
        setTitle('❌ Error de Conexión');
        setMessage(error?.message || 'Error consultando el estado del análisis');
        setProgress('');
        setLoading(false);
      }
    };

    // Iniciar el polling
    await checkStatus();
  }

  async function handleProjectionsAsync() {
    try {
      // 1. Iniciar análisis de proyecciones
      setProgress('📤 Enviando solicitud al backend...');
      setMessage('Conectando con el servidor...');
      
      const startUrl = getApiUrl(API_CONFIG.ENDPOINTS.RIBBON_PROJECTIONS_START);
      const startRes = await fetch(startUrl, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({})
      });

      if (!startRes.ok) {
        const errorText = await startRes.text();
        throw new Error(`Error al iniciar el análisis: ${startRes.status} - ${errorText}`);
      }

      const { task_id } = await startRes.json();
      
      // 2. Hacer polling para verificar el estado
      setProgress('⏳ Generando proyecciones con IA (Gemini 2.5 Pro)...');
      setMessage('El agente está analizando tus archivos financieros. Este proceso puede tomar entre 30 y 90 segundos.');
      await pollProjectionsStatus(task_id);
      
    } catch (error: any) {
      console.error('Error en handleProjectionsAsync:', error);
      setTitle('❌ Error');
      setMessage(error.message || 'Error al procesar las proyecciones');
      setProgress('');
      setLoading(false);
    }
  }

  async function pollProjectionsStatus(taskId: string) {
    const maxAttempts = 60; // 60 intentos * 3 segundos = 3 minutos máximo
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      try {
        attempts++;
        const statusUrl = getApiUrl(`${API_CONFIG.ENDPOINTS.RIBBON_PROJECTIONS_STATUS}/${taskId}`);
        const statusRes = await fetch(statusUrl, {
          headers: getAuthHeaders()
        });

        if (!statusRes.ok) {
          throw new Error('Error al consultar el estado de las proyecciones');
        }

        const statusData = await statusRes.json();

        if (statusData.status === 'completed') {
          // Proyecciones completadas exitosamente
          setTitle('✅ Proyecciones Futuras Generadas');
          const projectionsText = statusData.result?.projections || 'Proyecciones completadas';
          setMessage(projectionsText);
          setProgress('');
          setLoading(false);
        } else if (statusData.status === 'error') {
          // Error en la generación
          setTitle('❌ Error en las Proyecciones');
          setMessage(statusData.error || 'Error desconocido al generar las proyecciones');
          setProgress('');
          setLoading(false);
        } else if (statusData.status === 'processing') {
          // Aún procesando
          const elapsed = attempts * 3;
          setProgress(`⏳ Generando proyecciones con IA (Gemini 2.5 Pro)... ${elapsed}s transcurridos`);
          setMessage('El agente está procesando y analizando tus datos financieros. Esto puede tomar entre 30 y 90 segundos.');
          
          if (attempts >= maxAttempts) {
            throw new Error('Tiempo de espera excedido. Las proyecciones pueden estar aún procesándose.');
          }
          
          // Continuar polling después de 3 segundos
          setTimeout(() => checkStatus(), 3000);
        } else if (statusData.status === 'pending') {
          // Pendiente de iniciar
          setProgress('⏳ Proyecciones en cola... Iniciando.');
          setMessage('Tu solicitud está siendo procesada...');
          
          if (attempts >= maxAttempts) {
            throw new Error('Tiempo de espera excedido.');
          }
          
          // Continuar polling después de 2 segundos
          setTimeout(() => checkStatus(), 2000);
        }
      } catch (error: any) {
        setTitle('❌ Error de Conexión');
        setMessage(error?.message || 'Error consultando el estado de las proyecciones');
        setProgress('');
        setLoading(false);
      }
    };

    // Iniciar el polling
    await checkStatus();
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
        {loading ? (
          <>
            <p className="text-sm leading-6">{message}</p>
            <div className="mt-4">
              <p className="text-blue-500">{progress || 'Cargando...'}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          </>
        ) : (
          <>
            {reportData ? (
              <pre className="mt-4 max-h-72 overflow-y-auto rounded bg-gray-100 p-3 text-xs text-gray-800">
{JSON.stringify(reportData, null, 2)}
              </pre>
            ) : (
              <div 
                className="text-sm leading-6 whitespace-pre-wrap max-h-96 overflow-y-auto prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/# (.*?)\n/g, '<h1 class="text-lg font-bold mt-4 mb-2">$1</h1>').replace(/## (.*?)\n/g, '<h2 class="text-base font-semibold mt-3 mb-2">$1</h2>').replace(/### (.*?)\n/g, '<h3 class="text-sm font-semibold mt-2 mb-1">$1</h3>') }}
              />
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default AIControlPanel;
