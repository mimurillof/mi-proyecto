/**
 * Servicio para gestión de perfil de usuario
 * Maneja la comunicación con el backend para obtener/actualizar perfil e imagen
 */

import { getAuthHeaders, getApiUrl, handleAuthResponse } from '../config/api';

// ============================================================
// Tipos e Interfaces
// ============================================================

export type GenderEnum = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserProfile {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    birth_date: string | null;
    gender: GenderEnum | null;
    mobile: string | null;
    country: string | null;
    identification_number: string | null;
    bio: string | null;
    profile_image_url: string | null;
    created_at: string;
    has_completed_onboarding: boolean;
}

export interface UserProfileUpdate {
    first_name?: string;
    last_name?: string;
    birth_date?: string | null;
    gender?: GenderEnum | null;
    mobile?: string | null;
    country?: string | null;
    identification_number?: string | null;
    bio?: string | null;
}

export interface UserAvatar {
    avatar_url: string;
    is_default: boolean;
    gender: GenderEnum | null;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
}

// ============================================================
// Mapeo de género para mostrar
// ============================================================

export const GENDER_LABELS: Record<GenderEnum, string> = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
    prefer_not_to_say: 'Prefiero no decir'
};

export const getGenderLabel = (gender: GenderEnum | null): string => {
    if (!gender) return 'No especificado';
    return GENDER_LABELS[gender] || gender;
};

// ============================================================
// Funciones del Servicio
// ============================================================

/**
 * Obtiene el perfil completo del usuario autenticado
 */
export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await fetch(getApiUrl('/api/users/profile'), {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al obtener perfil' }));
        throw new Error(error.detail || 'Error al obtener perfil del usuario');
    }

    return response.json();
};

/**
 * Actualiza el perfil del usuario autenticado
 */
export const updateUserProfile = async (profileData: UserProfileUpdate): Promise<UserProfile> => {
    const response = await fetch(getApiUrl('/api/users/profile'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al actualizar perfil' }));
        throw new Error(error.detail || 'Error al actualizar perfil del usuario');
    }

    return response.json();
};

/**
 * Obtiene solo la URL del avatar (más ligero, para el navbar)
 */
export const getUserAvatar = async (): Promise<UserAvatar> => {
    const response = await fetch(getApiUrl('/api/users/profile/avatar'), {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al obtener avatar' }));
        throw new Error(error.detail || 'Error al obtener avatar del usuario');
    }

    return response.json();
};

/**
 * Sube una nueva imagen de perfil
 */
export const uploadProfileImage = async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    // Para multipart/form-data, no incluir Content-Type en headers
    const rawToken = localStorage.getItem('token');
    const token = rawToken ? rawToken.trim() : '';
    const headers: HeadersInit = {};
    
    if (token && token.toLowerCase() !== 'undefined' && token.toLowerCase() !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(getApiUrl('/api/users/profile/avatar'), {
        method: 'POST',
        headers,
        body: formData,
    });

    await handleAuthResponse(response);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al subir imagen' }));
        throw new Error(error.detail || 'Error al subir imagen de perfil');
    }

    return response.json();
};

/**
 * Elimina la imagen de perfil del usuario
 */
export const deleteProfileImage = async (): Promise<ApiResponse> => {
    const response = await fetch(getApiUrl('/api/users/profile/avatar'), {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al eliminar imagen' }));
        throw new Error(error.detail || 'Error al eliminar imagen de perfil');
    }

    return response.json();
};

/**
 * Marca el onboarding como completado
 */
export const completeOnboarding = async (): Promise<ApiResponse> => {
    const response = await fetch(getApiUrl('/api/users/profile/complete-onboarding'), {
        method: 'POST',
        headers: getAuthHeaders(),
    });

    await handleAuthResponse(response);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al completar onboarding' }));
        throw new Error(error.detail || 'Error al completar onboarding');
    }

    return response.json();
};
