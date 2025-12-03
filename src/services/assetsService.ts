/**
 * Servicio para gestionar activos del portafolio en la base de datos
 */

import { getApiUrl, getAuthHeaders, handleAuthResponse } from '../config/api';

// Tipos para activos
export interface PortfolioAssetDB {
  asset_id: number;
  portfolio_id: number;
  asset_symbol: string;
  quantity: number;
  acquisition_price: number;
  acquisition_date: string | null;
  added_at: string | null;
}

export interface AssetCreateRequest {
  asset_symbol: string;
  quantity: number;
  acquisition_price: number;
  acquisition_date?: string; // YYYY-MM-DD
}

export interface AssetUpdateRequest {
  quantity?: number;
  acquisition_price?: number;
  acquisition_date?: string; // YYYY-MM-DD
}

// Respuestas de la API
interface AssetsListResponse {
  success: boolean;
  data: PortfolioAssetDB[];
  count: number;
}

interface AssetSingleResponse {
  success: boolean;
  message?: string;
  data: PortfolioAssetDB;
}

/**
 * Lista todos los activos del portafolio del usuario autenticado
 */
export const listPortfolioAssets = async (): Promise<PortfolioAssetDB[]> => {
  const url = getApiUrl('/api/assets');

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(`Error al listar activos: ${response.status} ${response.statusText}`);
    }

    const data: AssetsListResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('❌ [Assets] Error listando activos:', error);
    throw error;
  }
};

/**
 * Añade un nuevo activo al portafolio
 */
export const createPortfolioAsset = async (
  asset: AssetCreateRequest
): Promise<PortfolioAssetDB> => {
  const url = getApiUrl('/api/assets');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(asset),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear el activo');
      }
      throw new Error(`Error al crear activo: ${response.status} ${response.statusText}`);
    }

    const data: AssetSingleResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ [Assets] Error creando activo:', error);
    throw error;
  }
};

/**
 * Actualiza un activo existente en el portafolio
 */
export const updatePortfolioAsset = async (
  symbol: string,
  updates: AssetUpdateRequest
): Promise<PortfolioAssetDB> => {
  const url = getApiUrl(`/api/assets/${encodeURIComponent(symbol.toUpperCase())}`);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      if (response.status === 404) {
        throw new Error(`Activo ${symbol} no encontrado en tu portafolio`);
      }
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar el activo');
      }
      throw new Error(`Error al actualizar activo: ${response.status} ${response.statusText}`);
    }

    const data: AssetSingleResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ [Assets] Error actualizando activo:', error);
    throw error;
  }
};

/**
 * Elimina un activo del portafolio
 */
export const deletePortfolioAsset = async (symbol: string): Promise<void> => {
  const url = getApiUrl(`/api/assets/${encodeURIComponent(symbol.toUpperCase())}`);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      if (response.status === 404) {
        throw new Error(`Activo ${symbol} no encontrado en tu portafolio`);
      }
      throw new Error(`Error al eliminar activo: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ [Assets] Error eliminando activo:', error);
    throw error;
  }
};

/**
 * Obtiene los detalles de un activo específico
 */
export const getPortfolioAsset = async (symbol: string): Promise<PortfolioAssetDB> => {
  const url = getApiUrl(`/api/assets/${encodeURIComponent(symbol.toUpperCase())}`);

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
        throw new Error(`Activo ${symbol} no encontrado en tu portafolio`);
      }
      throw new Error(`Error al obtener activo: ${response.status} ${response.statusText}`);
    }

    const data: AssetSingleResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ [Assets] Error obteniendo activo:', error);
    throw error;
  }
};

/**
 * Formatea una fecha ISO a formato legible
 */
export const formatAssetDate = (dateStr: string | null): string => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Formatea un precio a moneda
 */
export const formatAssetPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
