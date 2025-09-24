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
        HEALTH: '/api/ai/health',
        RIBBON_SUMMARY: '/api/ribbon/summary',
        RIBBON_PERFORMANCE: '/api/ribbon/performance',
        RIBBON_FORECAST: '/api/ribbon/forecast',
        RIBBON_ALERTS: '/api/ribbon/alerts',
        RIBBON_CUSTOM_REPORT: '/api/ribbon/custom-report'
    }
};

// Función helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
