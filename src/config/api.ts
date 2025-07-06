// Configuración del API
export const API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-domain.com' 
        : 'http://localhost:8000',
    ENDPOINTS: {
        CHAT: '/api/ai/chat',
        CHAT_UPLOAD: '/api/ai/chat/upload',
        SEARCH_NEWS: '/api/ai/search-news',
        ANALYZE_URL: '/api/ai/analyze-url',
        PREDICT: '/api/ai/predict',
        STATUS: '/api/ai/status',
        HEALTH: '/api/ai/health'
    }
};

// Función helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
