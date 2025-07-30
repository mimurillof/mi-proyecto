import React, { useState, useEffect } from 'react';
import { fetchLiveMetrics, getChartUrl, type LiveMetricsResponse } from '../../../services/portfolioService';
import ChartWithFullscreen from '../ChartWithFullscreen';

const DrawdownAnalysis: React.FC = () => {
    const [liveMetrics, setLiveMetrics] = useState<LiveMetricsResponse | null>(null);
    const [drawdownChartUrl, setDrawdownChartUrl] = useState<string>('');
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
                
                // Obtener URL del gráfico de drawdown
                const drawdownUrl = getChartUrl('drawdown_underwater');
                setDrawdownChartUrl(drawdownUrl);
                
            } catch (err) {
                console.error('Error cargando datos de drawdown:', err);
                setError('Error al cargar el análisis de drawdown');
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
                <div className="text-gray-500">Cargando análisis de drawdown...</div>
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
            <h3 className="text-lg font-semibold mb-3 text-gray-800 px-4 pt-4">Análisis de Drawdown</h3>
            
            {/* Gráfico de Drawdown */}
            <div className="flex-1 px-4 pb-4">
                <div className="h-full bg-white rounded-lg border border-gray-200 p-3">
                    <div className="h-64 mb-3">
                        <ChartWithFullscreen
                            chartUrl={drawdownChartUrl}
                            title="Análisis de Drawdown Underwater"
                            height="100%"
                            className="w-full h-full"
                            additionalInfo={
                                <div className="text-sm text-gray-600">
                                    <p>El gráfico de drawdown muestra las pérdidas desde el pico más alto del portafolio.</p>
                                    <p className="mt-1">Areas rojas indican períodos de pérdidas, permitiendo evaluar el riesgo temporal del portafolio.</p>
                                    <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="font-medium">Drawdown Actual:</span> {liveMetrics.risk_analysis.drawdown_analysis.current_drawdown.toFixed(2)}%
                                        </div>
                                        <div>
                                            <span className="font-medium">Máximo Drawdown:</span> {liveMetrics.risk_analysis.drawdown_analysis.max_drawdown.toFixed(2)}%
                                        </div>
                                        <div>
                                            <span className="font-medium">Duración:</span> {liveMetrics.risk_analysis.drawdown_analysis.drawdown_duration_days} días
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                    
                    {/* Métricas de drawdown */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-gray-500 text-xs">Drawdown Actual</div>
                            <div className="font-semibold text-orange-600 text-lg">
                                {liveMetrics.risk_analysis.drawdown_analysis.current_drawdown.toFixed(2)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">Máximo Drawdown</div>
                            <div className="font-semibold text-red-600 text-lg">
                                {liveMetrics.risk_analysis.drawdown_analysis.max_drawdown.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                    
                    {/* Información adicional */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                            Duración del drawdown: {liveMetrics.risk_analysis.drawdown_analysis.drawdown_duration_days} días
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawdownAnalysis;
