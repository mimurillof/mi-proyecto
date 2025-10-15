import { useEffect, useState } from 'react';
import { fetchHomeDashboard, HomeDashboardResponse } from '../services/homeService';

interface UseHomeDashboardResult {
  data: HomeDashboardResponse | null;
  loading: boolean;
  error: string | null;
}

export const useHomeDashboard = (): UseHomeDashboardResult => {
  const [data, setData] = useState<HomeDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHomeDashboard = async () => {
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
  }, []);

  return { data, loading, error };
};
