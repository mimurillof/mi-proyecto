import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AIIcon from '../../../images/icons/AI.svg';

interface DecodedToken {
  user_id: string;
  email: string;
  exp: number;
}

const AnalystSummary: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Datos del agente
  const analyst = {
    name: 'Agente Horizon',
    title: 'Agente de Finanzas',
  };

  useEffect(() => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No hay sesión activa. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      // Decodificar el token para obtener el user_id
      const decoded = jwtDecode<DecodedToken>(token);
      const userId = decoded.user_id;

      // Construir la URL del PDF con el user_id
      const supabaseUrl = 'https://tlmdrkthueicqnvbjmie.supabase.co';
      const bucket = 'portfolio-files';
      const pdfPath = `${userId}/Reporte.pdf`;
      const fullPdfUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${pdfPath}`;

      console.log('📄 URL del PDF construida:', fullPdfUrl);
      setPdfUrl(fullPdfUrl);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error al construir URL del PDF:', err);
      setError('Error al cargar el PDF. Por favor intenta de nuevo.');
      setLoading(false);
    }
  }, []);

  return (
    // Contenedor principal que ocupa todo el espacio disponible (h-full, w-full)
    // y usa flexbox para distribuir el espacio entre la info y el iframe.
    <div className="w-full h-full bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">

      {/* Información del Agente */}
      {/* flex-shrink-0 evita que esta sección se encoja */}
      <div className="flex items-center mb-4 pb-4 border-b border-gray-200 space-x-4 flex-shrink-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <img
            src={AIIcon}
            alt="Agente Horizon"
            className="w-6 h-6 md:w-7 md:h-7"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{analyst.name}</p>
          <p className="text-xs text-gray-500">{analyst.title}</p>
        </div>
      </div>

      {/* Área de Visualización del PDF */}
      {/* flex-grow permite que esta sección ocupe el espacio vertical restante */}
      <div className="w-full flex-grow">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Cargando reporte...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {!loading && !error && pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%" // Ocupa toda la altura del div padre (flex-grow)
            style={{ border: 'none' }} // Estilo inline para el borde
            title="Resumen Ejecutivo PDF"
          >
            Tu navegador no soporta iframes. Puedes descargar el PDF <a href={pdfUrl}>aquí</a>.
          </iframe>
        )}
      </div>

    </div>
  );
};

export default AnalystSummary;
