import React, { useState, useEffect } from 'react';
import { getChartUrl } from '../../../services/portfolioService';

const LivePortfolioChart: React.FC = () => {
    const [chartUrl, setChartUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadChart = () => {
            try {
                setLoading(true);
                setError(null);
                const url = getChartUrl('cumulative_returns');
                setChartUrl(url);
            } catch (err) {
                console.error('Error cargando gráfico:', err);
                setError('Error al cargar el gráfico de rendimiento');
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
                <div className="text-gray-500">Cargando gráfico de rendimiento...</div>
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
                title="Gráfico de Rendimiento Acumulado"
                className="rounded-lg"
                style={{ minHeight: '400px' }}
            />
        </div>
    );
};

export default LivePortfolioChart;
