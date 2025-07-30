import React, { useState, useEffect } from 'react';
import { fetchLiveMetrics, getChartUrl, type LiveMetricsResponse } from '../../../services/portfolioService';
import ChartWithFullscreen from '../ChartWithFullscreen';

const CorrelationAnalysis: React.FC = () => {
    const [liveMetrics, setLiveMetrics] = useState<LiveMetricsResponse | null>(null);
    const [correlationChartUrl, setCorrelationChartUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Cargar métricas
                const metricsData = await fetchLiveMetrics();
                setLiveMetrics(metricsData);
                
                // Obtener URL del gráfico de correlación
                const correlationUrl = getChartUrl('correlation_matrix');
                setCorrelationChartUrl(correlationUrl);
                
            } catch (err) {
                console.error('Error cargando datos de correlación:', err);
                setError('Error al cargar el análisis de correlación');
            } finally {
                setLoading(false);
            }
        };

        loadData();
        
        // Actualizar cada 5 minutos
        const interval = setInterval(loadData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Cargando análisis de correlación...</div>
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

    if (!liveMetrics) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">No hay datos disponibles</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Título */}
            <h3 className="text-lg font-semibold mb-3 text-gray-800 px-4 pt-4">Matriz de Correlación</h3>
            
            {/* Gráfico de correlación */}
            <div className="flex-1 px-4 pb-4">
                <div className="h-full bg-white rounded-lg border border-gray-200 p-3">
                    <div className="h-64 mb-3">
                        <ChartWithFullscreen
                            chartUrl={correlationChartUrl}
                            title="Matriz de Correlación de Activos"
                            height="100%"
                            className="w-full h-full"
                            additionalInfo={
                                <div className="text-sm text-gray-600">
                                    <p>Esta matriz muestra las correlaciones entre los diferentes activos del portafolio.</p>
                                    <p className="mt-1">Valores cercanos a 1 indican correlación positiva fuerte, valores cercanos a -1 indican correlación negativa fuerte.</p>
                                    <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                                        <div>
                                            <span className="font-medium">Media:</span> {liveMetrics.correlations.summary?.avg_correlation?.toFixed(2) || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Máxima:</span> {liveMetrics.correlations.summary?.max_correlation?.toFixed(2) || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Mínima:</span> {liveMetrics.correlations.summary?.min_correlation?.toFixed(2) || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                    
                    {/* Resumen de correlación */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-gray-500 text-xs">Correlación Media</div>
                            <div className="font-semibold text-blue-600 text-lg">
                                {liveMetrics.correlations.summary?.avg_correlation?.toFixed(2) || 'N/A'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-500 text-xs">Máxima</div>
                            <div className="font-semibold text-red-600 text-lg">
                                {liveMetrics.correlations.summary?.max_correlation?.toFixed(2) || 'N/A'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-500 text-xs">Mínima</div>
                            <div className="font-semibold text-green-600 text-lg">
                                {liveMetrics.correlations.summary?.min_correlation?.toFixed(2) || 'N/A'}
                            </div>
                        </div>
                    </div>
                    
                    {/* Información adicional */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                            Matriz de correlación entre activos del portafolio
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Actualizado automáticamente cada 5 minutos
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorrelationAnalysis;
