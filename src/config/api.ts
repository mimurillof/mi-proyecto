// Configuración del API
// En producción (Vercel), usa la variable de entorno VITE_API_URL
// En desarrollo, usa localhost
const getBaseUrl = (): string => {
    // 1. Si hay una variable de entorno VITE_API_URL (configurada en Vercel), úsala
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // 2. Si estamos en producción pero no hay VITE_API_URL, usa Heroku
    if (import.meta.env.PROD) {
        return 'https://horizon-backend-316b23e32b8b.herokuapp.com';
    }
    
    // 3. En desarrollo, usa localhost
    return 'http://localhost:8000';
};

export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    ENDPOINTS: {
        CHAT: '/api/ai/chat',
        CHAT_UPLOAD: '/api/ai/chat/upload',
        SEARCH_NEWS: '/api/ai/search-news',
        ANALYZE_URL: '/api/ai/analyze-url',
        PREDICT: '/api/ai/predict',
        STATUS: '/api/ai/status',
        HEALTH: '/api/ai/health',
        RIBBON_SUMMARY: '/api/ribbon/summary',
        RIBBON_PERFORMANCE: '/api/ribbon/performance',
        RIBBON_FORECAST: '/api/ribbon/forecast',
        RIBBON_ALERTS: '/api/ribbon/alerts',
        RIBBON_CUSTOM_REPORT: '/api/ribbon/custom-report',
        RIBBON_CUSTOM_REPORT_START: '/api/ribbon/custom-report/start',
        RIBBON_CUSTOM_REPORT_STATUS: '/api/ribbon/custom-report/status',
        PORTFOLIO_BASE: '/api/portfolio',
        PORTFOLIO_MANAGER_BASE: '/api/portfolio-manager',
        HOME_DASHBOARD: '/api/home/dashboard'
    }
};

// Función helper para obtener headers con autenticación
export const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Función helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función helper para construir URLs autenticadas con token en query string (para iframes)
export const getAuthenticatedUrl = (endpoint: string): string => {
    const token = localStorage.getItem('token');
    const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    if (token) {
        const separator = endpoint.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
    }
    
    return baseUrl;
};

// Log de la URL en desarrollo (útil para debugging)
if (import.meta.env.DEV) {
    console.log('🔧 API Base URL:', API_CONFIG.BASE_URL);
}
