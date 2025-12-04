import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchHomeDashboard, HomeDashboardResponse } from '../services/homeService';



interface UseHomeDashboardResult {
  data: HomeDashboardResponse | null;
  loading: boolean;
  error: string | null;
  isBuilding: boolean;
}

export const useHomeDashboard = (enabled: boolean = true): UseHomeDashboardResult => {
  const [data, setData] = useState<HomeDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const loadHomeDashboard = useCallback(async () => {
    // **CRÍTICO: Verificar que hay token ANTES de hacer la petición**
    const rawToken = localStorage.getItem('token');
    const token = rawToken ? rawToken.trim() : '';
    
    if (!token || token === 'undefined' || token === 'null') {
      console.log('⏸️ useHomeDashboard: No hay token, esperando autenticación...');
      setLoading(false);
      return;
    }
    
    try {
      // Solo mostrar loading la primera vez o si no hay datos previos
      if (!data) {
        setLoading(true);
      }
      
      const response = await fetchHomeDashboard();

      if (!isMountedRef.current) {
        return;
      }

      setData(response);
      setError(null);

      // Si el estado es 'building', configurar polling
      if (response.status === 'building') {
        console.log('🏗️ Dashboard en construcción. Reintentando en 10s...');
        setIsBuilding(true);
        
        // Limpiar intervalo anterior si existe
        if (pollIntervalRef.current) {
          clearTimeout(pollIntervalRef.current);
        }
        
        // Configurar nuevo polling
        pollIntervalRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            loadHomeDashboard();
          }
        }, 10000);
      } else {
        console.log('✅ Dashboard listo');
        setIsBuilding(false);
        
        // Limpiar polling si el estado ya no es building
        if (pollIntervalRef.current) {
          clearTimeout(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }

    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }

      const message = err instanceof Error ? err.message : 'Error desconocido al cargar el panel de inicio';
      setError(message);
      setIsBuilding(false);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [data]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Si no está habilitado, no ejecutar
    if (!enabled) {
      setLoading(false);
      return;
    }

    loadHomeDashboard();

    return () => {
      isMountedRef.current = false;
      if (pollIntervalRef.current) {
        clearTimeout(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [enabled]); // Re-ejecutar cuando enabled cambie

  return { data, loading, error, isBuilding };
};
