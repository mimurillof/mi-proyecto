import React, { useEffect, useState } from 'react';
import { getApiUrl, getAuthHeaders } from '../../config/api';

interface AlertCard {
  id: string;
  title: string;
  description: string;
  color_theme: 'success' | 'warning' | 'error' | 'info';
  icon: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

const AnomalyDetection: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
          console.log('⏸️ AnomalyDetection: No hay token, esperando autenticación...');
          setLoading(false);
          return;
        }

        const response = await fetch(getApiUrl('/api/dashboard/alerts'), {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error(`❌ Error ${response.status}: No autorizado`);
            window.dispatchEvent(new CustomEvent('authError', {
              detail: {
                status: response.status,
                message: 'Sesión expirada o no autorizada'
              }
            }));
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          }
          throw new Error(`Error al obtener alertas: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as AlertCard[];
        setAlerts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido al cargar alertas';
        setError(message);
        console.error('Error al cargar alertas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();

    // Recargar alertas cada 15 minutos (cuando se actualizan los JSONs)
    const interval = setInterval(loadAlerts, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (colorTheme: string) => {
    switch (colorTheme) {
      case 'success':
        return {
          border: 'border-green-500',
          bg: 'bg-green-50',
          icon: 'text-green-600',
          title: 'text-green-800',
          text: 'text-gray-700'
        };
      case 'error':
        return {
          border: 'border-red-500',
          bg: 'bg-red-50',
          icon: 'text-red-600',
          title: 'text-red-800',
          text: 'text-gray-700'
        };
      case 'warning':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-50',
          icon: 'text-amber-600',
          title: 'text-amber-800',
          text: 'text-gray-700'
        };
      case 'info':
      default:
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          text: 'text-gray-700'
        };
    }
  };

  const formatDescription = (description: string): React.ReactNode => {
    // Convertir markdown básico (**texto**) a negrita
    const parts = description.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 text-left">
        Detección de Anomalías y Oportunidades (IA)
      </h2>

      <div className="space-y-3 overflow-y-auto flex-grow pr-2">
        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="text-gray-500 text-sm">Cargando alertas...</div>
          </div>
        )}

        {error && (
          <div className="flex items-start p-3 border rounded-md border-l-4 border-red-500 bg-red-50">
            <span className="text-red-600 mr-3 text-xl">⚠️</span>
            <div>
              <p className="font-medium text-red-800 text-sm text-left">Error</p>
              <p className="text-xs text-gray-700 text-left">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && alerts.length === 0 && (
          <div className="flex items-center justify-center p-4">
            <div className="text-gray-500 text-sm">No hay alertas disponibles en este momento.</div>
          </div>
        )}

        {!loading && !error && alerts.map((alert) => {
          const colors = getColorClasses(alert.color_theme);
          return (
            <div
              key={alert.id}
              className={`flex items-start p-3 border rounded-md border-l-4 ${colors.border} ${colors.bg}`}
            >
              <span className={`${colors.icon} mr-3 text-xl`}>{alert.icon}</span>
              <div className="flex-1">
                <p className={`font-medium ${colors.title} text-sm text-left`}>
                  {alert.title}
                </p>
                <p className={`text-xs ${colors.text} text-left`}>
                  {formatDescription(alert.description)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyDetection;
