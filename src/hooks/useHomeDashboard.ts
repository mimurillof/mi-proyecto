import { useEffect, useState } from 'react';
import { fetchHomeDashboard, HomeDashboardResponse } from '../services/homeService';

interface UseHomeDashboardResult {
  data: HomeDashboardResponse | null;
  loading: boolean;
  error: string | null;
}

export const useHomeDashboard = (enabled: boolean = true): UseHomeDashboardResult => {
  const [data, setData] = useState<HomeDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no está habilitado, no ejecutar
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;

    const loadHomeDashboard = async () => {
      // **CRÍTICO: Verificar que hay token ANTES de hacer la petición**
      const rawToken = localStorage.getItem('token');
      const token = rawToken ? rawToken.trim() : '';
      
      if (!token || token === 'undefined' || token === 'null') {
        console.log('⏸️ useHomeDashboard: No hay token, esperando autenticación...');
        if (isMounted) {
          setLoading(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetchHomeDashboard();

        if (!isMounted) {
          return;
        }

        setData(response);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message = err instanceof Error ? err.message : 'Error desconocido al cargar el panel de inicio';
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomeDashboard();

    return () => {
      isMounted = false;
    };
  }, [enabled]); // Re-ejecutar cuando enabled cambie

  return { data, loading, error };
};
