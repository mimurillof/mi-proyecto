import React, { useState, useEffect } from 'react';
import { getChartUrl } from '../../../services/portfolioService';

const LivePortfolioCompositionChart: React.FC = () => {
    const [chartUrl, setChartUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        <div className="w-full h-full">
            <iframe
                src={chartUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Gráfico de Composición del Portfolio"
                className="rounded-lg"
                style={{ minHeight: '350px' }}
            />
        </div>
    );
};

export default LivePortfolioCompositionChart;
