/**
 * Servicio para la integración con el Portfolio Analyzer
 * Proporciona métodos para obtener métricas en vivo y gráficos del backend FastAPI
 */

import { API_CONFIG, getAuthHeaders, getAuthenticatedUrl } from '../config/api';

// Configuración de la API - Usa la configuración centralizada
const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PORTFOLIO_BASE}`;

// Interfaces TypeScript para los datos del Portfolio Analyzer
export interface PerformanceMetrics {
  annualized_return: number;
  annualized_volatility: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  calmar_ratio: number;
  max_drawdown: number;
  var_daily: number;
  skewness: number;
  kurtosis: number;
}

export interface RiskAnalysis {
  risk_percentiles: {
    percentile_1: number;
    percentile_5: number;
    percentile_10: number;
    percentile_25: number;
    percentile_75: number;
    percentile_90: number;
    percentile_95: number;
    percentile_99: number;
  };
  drawdown_analysis: {
    current_drawdown: number;
    max_drawdown: number;
    drawdown_duration_days: number;
    recovery_periods: Array<{
      start_date: string;
      end_date: string;
      duration_days: number;
      max_drawdown: number;
    }>;
  };
  volatility_analysis: {
    daily_vol: number;
    weekly_vol: number;
    monthly_vol: number;
    annual_vol: number;
  };
}

export interface Correlations {
  assets: string[];
  matrix: Array<Array<{
    asset1: string;
    asset2: string;
    correlation: number;
  }>>;
  summary: {
    avg_correlation: number;
    max_correlation: number;
    min_correlation: number;
  };
}

export interface PortfolioComposition {
  [symbol: string]: number;
}

export interface AnalysisPeriod {
  start_date: string;
  end_date: string;
  total_days: number;
}

export interface LiveMetricsResponse {
  timestamp: string;
  analysis_period: AnalysisPeriod;
  portfolio_composition: PortfolioComposition;
  performance_metrics: PerformanceMetrics;
  risk_analysis: RiskAnalysis;
  correlations: Correlations;
}

export interface LatestTimestampResponse {
  file_modification_time: string;
  internal_timestamp: string;
  file_path: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'warning' | 'error';
  outputs_directory_exists: boolean;
  outputs_directory_path: string;
  has_recent_analysis: boolean;
  latest_file_age_hours: number | null;
  available_charts: string[];
  error?: string;
}

// Interfaces para Métricas Avanzadas
export interface MetricItem {
  value: number;
  label: string;
  unit: string;
}

export interface TrackingErrorMetric extends MetricItem {
  benchmark: number;
}

export interface CVaRMetric extends MetricItem {
  period: string;
}

export interface SharpeRatioMetric extends MetricItem {
  peer_group: number;
}

export interface CorrelationMetric extends MetricItem {}

export interface ValueFactorMetric extends MetricItem {
  benchmark_deviation: number;
}

export interface AdvancedMetricsResponse {
  tracking_error: TrackingErrorMetric;
  cvar_95: CVaRMetric;
  sharpe_ratio: SharpeRatioMetric;
  correlation_msci: CorrelationMetric;
  value_factor_exposure: ValueFactorMetric;
  source: string;
  user_id: string;
  retrieved_at: string;
}

/**
 * Obtener las métricas en vivo del portfolio
 */
export const fetchLiveMetrics = async (): Promise<LiveMetricsResponse> => {
  try {
    const response = await fetch(`${API_URL}/live-metrics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Sesión expirada')) {
      throw error;
    }
    console.error('Error al obtener métricas en vivo:', error);
    throw error;
  }
};

/**
 * Obtener el timestamp del último análisis
 */
export const fetchLatestAnalysisTimestamp = async (): Promise<LatestTimestampResponse> => {
  try {
    const response = await fetch(`${API_URL}/latest-analysis-timestamp`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Sesión expirada')) {
      throw error;
    }
    console.error('Error al obtener timestamp del análisis:', error);
    throw error;
  }
};

/**
 * Obtener la URL del gráfico dinámico
 */
export const getChartUrl = (chartName: string): string => {
  const endpoint = `${API_CONFIG.ENDPOINTS.PORTFOLIO_BASE}/charts/${encodeURIComponent(chartName)}`;
  return getAuthenticatedUrl(endpoint);
};

/**
 * Verificar el estado de salud del Portfolio Analyzer
 */
export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Sesión expirada')) {
      throw error;
    }
    console.error('Error al verificar estado de salud:', error);
    throw error;
  }
};

/**
 * Obtener las métricas avanzadas del portfolio
 * Lee la sección analizer_info del archivo api_response_B.json del usuario
 */
export const fetchAdvancedMetrics = async (): Promise<AdvancedMetricsResponse> => {
  try {
    const response = await fetch(`${API_URL}/advanced-metrics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Sesión expirada')) {
      throw error;
    }
    console.error('Error al obtener métricas avanzadas:', error);
    throw error;
  }
};

/**
 * Hook personalizado para el polling automático de actualizaciones
 */
import { useState, useEffect, useCallback } from 'react';

export const usePortfolioPolling = (intervalMs: number = 30000) => {
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = useCallback(async () => {
    try {
      setError(null);
      const timestampData = await fetchLatestAnalysisTimestamp();
      
      if (lastTimestamp && timestampData.internal_timestamp !== lastTimestamp) {
        // Se detectó una actualización
        console.log('Nueva actualización de portfolio detectada');
        setLastTimestamp(timestampData.internal_timestamp);
        return true; // Indica que hay una actualización
      } else if (!lastTimestamp) {
        // Primera carga
        setLastTimestamp(timestampData.internal_timestamp);
      }
      
      return false; // No hay actualización
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  }, [lastTimestamp]);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(checkForUpdates, intervalMs);
    
    return () => clearInterval(interval);
  }, [isPolling, intervalMs, checkForUpdates]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    // Verificar inmediatamente al iniciar
    checkForUpdates();
  }, [checkForUpdates]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    isPolling,
    error,
    lastTimestamp,
    startPolling,
    stopPolling,
    checkForUpdates
  };
};

/**
 * Hook para obtener y manejar las métricas en vivo
 */
export const useLiveMetrics = (autoRefresh: boolean = false) => {
  const [metrics, setMetrics] = useState<LiveMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { checkForUpdates } = usePortfolioPolling();

  const refreshMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLiveMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cargar métricas al montar el componente
    refreshMetrics();
  }, [refreshMetrics]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      const hasUpdate = await checkForUpdates();
      if (hasUpdate) {
        refreshMetrics();
      }
    }, 30000); // Verificar cada 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, checkForUpdates, refreshMetrics]);

  return {
    metrics,
    loading,
    error,
    refreshMetrics
  };
};

// Utilidades para formatear datos
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Hook para obtener y manejar las métricas avanzadas
 */
export const useAdvancedMetrics = () => {
  const [metrics, setMetrics] = useState<AdvancedMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdvancedMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cargar métricas al montar el componente
    refreshMetrics();
  }, [refreshMetrics]);

  return {
    metrics,
    loading,
    error,
    refreshMetrics
  };
};
