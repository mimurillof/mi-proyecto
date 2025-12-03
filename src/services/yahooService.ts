/**
 * Servicio para búsqueda de activos financieros usando Yahoo Finance API
 */

import { getApiUrl, getAuthHeaders, handleAuthResponse } from '../config/api';

// Tipos para resultados de búsqueda
export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  exchangeShortName: string;
  type: string;
  typeDisp?: string;
}

// Tipos para perfil de activo
export interface AssetProfile {
  symbol: string;
  companyName: string;
  price: number;
  previousClose: number;
  changes: number;
  changesPercentage: number;
  exchange: string;
  exchangeShortName: string;
  currency: string;
  marketCap: number;
  regularMarketVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  instrumentType: string;
  timezone: string;
}

// Respuestas de la API
interface SearchResponse {
  success: boolean;
  data: SearchResult[];
  count: number;
  query: string;
}

interface ProfileResponse {
  success: boolean;
  data: AssetProfile;
}

/**
 * Busca activos financieros por símbolo o nombre
 * @param query Texto de búsqueda (mínimo 1 carácter)
 * @param limit Número máximo de resultados (1-20, default: 10)
 * @returns Lista de activos coincidentes
 */
export const searchAssets = async (
  query: string,
  limit: number = 10
): Promise<SearchResult[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    query: query.trim(),
    limit: String(Math.min(Math.max(limit, 1), 20)),
  });

  const url = getApiUrl(`/api/yahoo/search?${params}`);

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(`Error en búsqueda: ${response.status} ${response.statusText}`);
    }

    const data: SearchResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('❌ [Yahoo] Error buscando activos:', error);
    throw error;
  }
};

/**
 * Obtiene el perfil detallado de un activo financiero
 * @param symbol Símbolo del activo (ej: AAPL, MSFT, BTC-USD)
 * @returns Información detallada del activo
 */
export const getAssetProfile = async (symbol: string): Promise<AssetProfile> => {
  if (!symbol || symbol.trim().length === 0) {
    throw new Error('El símbolo es requerido');
  }

  const url = getApiUrl(`/api/yahoo/profile/${encodeURIComponent(symbol.trim().toUpperCase())}`);

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      if (response.status === 404) {
        throw new Error(`No se encontró información para el símbolo '${symbol}'`);
      }
      throw new Error(`Error al obtener perfil: ${response.status} ${response.statusText}`);
    }

    const data: ProfileResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ [Yahoo] Error obteniendo perfil:', error);
    throw error;
  }
};

/**
 * Formatea el precio según la moneda
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Formatea el cambio porcentual
 */
export const formatChangePercent = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};
