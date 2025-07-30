import React, { useState, useEffect } from 'react';
import { getChartUrl } from '../../../services/portfolioService';
import ChartWithFullscreen from '../ChartWithFullscreen';

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
        <ChartWithFullscreen
            chartUrl={chartUrl}
            title="Rendimiento Acumulado del Portafolio"
            height="100%"
            className="w-full h-full"
            additionalInfo={
                <div className="text-sm text-gray-600">
                    <p>Este gráfico muestra la evolución del rendimiento acumulado del portafolio a lo largo del tiempo.</p>
                    <p className="mt-1">Los datos se actualizan automáticamente cada 5 minutos.</p>
                </div>
            }
        />
    );
};

export default LivePortfolioChart;
