import React, { useState, useEffect } from 'react';
import { getChartUrl } from '../../../services/portfolioService';
import FullscreenModal from '../FullscreenModal';

const LivePortfolioCompositionChart: React.FC = () => {
    const [chartUrl, setChartUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    useEffect(() => {
        const loadChart = () => {
            try {
                setLoading(true);
                setError(null);
                const url = getChartUrl('composition_donut');
                setChartUrl(url);
            } catch (err) {
                console.error('Error cargando gráfico de composición:', err);
                setError('Error al cargar el gráfico de composición');
            } finally {
                setLoading(false);
            }
        };

        loadChart();
        
        // Actualizar cada 5 minutos
        const interval = setInterval(loadChart, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const openFullscreen = () => {
        setIsFullscreenOpen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreenOpen(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Cargando gráfico de composición...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-full relative group">
                <iframe
                    src={chartUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Gráfico de Composición del Portfolio"
                    className="rounded-lg"
                    style={{ minHeight: '400px' }}
                />
                
                {/* Fullscreen Button - appears on hover */}
                <button
                    onClick={openFullscreen}
                    className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                    title="Ver en pantalla completa"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </button>
            </div>

            {/* Fullscreen Modal */}
            <FullscreenModal
                isOpen={isFullscreenOpen}
                onClose={closeFullscreen}
                title="Composición del Portafolio"
                chartUrl={chartUrl}
            >
                <div className="text-sm text-gray-600">
                    <p>Este gráfico donut muestra la distribución porcentual de los activos en el portafolio.</p>
                    <p className="mt-1">Cada sector representa la asignación de capital a cada activo individual.</p>
                </div>
            </FullscreenModal>
        </>
    );
};

export default LivePortfolioCompositionChart;
