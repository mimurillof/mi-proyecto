import React, { useState, useRef, useEffect } from 'react';
import { fetchLiveMetrics, type LiveMetricsResponse } from '../../../services/portfolioService';
import MetricCard from './MetricCard';
import './metrics.css'; // Importar los estilos CSS

const InvestmentMetricsCarousel: React.FC = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(5); // Valor inicial para desktop
    const containerRef = useRef<HTMLDivElement>(null);
    const [liveMetrics, setLiveMetrics] = useState<LiveMetricsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hook para cargar métricas dinámicas del Portfolio Analyzer
    useEffect(() => {
        const loadLiveMetrics = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchLiveMetrics();
                setLiveMetrics(data);
            } catch (err) {
                console.error('Error cargando métricas:', err);
                setError('Error al cargar las métricas del portfolio');
            } finally {
                setLoading(false);
            }
        };

        loadLiveMetrics();
        
        // Actualizar cada 5 minutos
        const interval = setInterval(loadLiveMetrics, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Convertir los datos del Portfolio Analyzer al formato esperado por MetricCard
    const metricsData = liveMetrics ? [
        { 
            id: 1, 
            name: 'Rendimiento Anualizado', 
            value: `${liveMetrics.performance_metrics.annualized_return.toFixed(2)}%`, 
            change: { direction: 'up' as const, value: `+${(liveMetrics.performance_metrics.annualized_return / 12).toFixed(1)}%` } 
        },
        { 
            id: 2, 
            name: 'Volatilidad Anualizada', 
            value: `${liveMetrics.performance_metrics.annualized_volatility.toFixed(2)}%`, 
            change: { direction: 'neutral' as const, value: '-' } 
        },
        { 
            id: 3, 
            name: 'Ratio de Sharpe', 
            value: liveMetrics.performance_metrics.sharpe_ratio.toFixed(2), 
            change: { direction: liveMetrics.performance_metrics.sharpe_ratio > 1 ? 'up' as const : 'down' as const, value: liveMetrics.performance_metrics.sharpe_ratio > 1 ? '+0.1' : '-0.1' } 
        },
        { 
            id: 4, 
            name: 'Máximo Drawdown', 
            value: `${liveMetrics.performance_metrics.max_drawdown.toFixed(2)}%`, 
            change: { direction: 'down' as const, value: `${(liveMetrics.performance_metrics.max_drawdown / 10).toFixed(1)}%` } 
        },
        { 
            id: 5, 
            name: 'Ratio de Sortino', 
            value: liveMetrics.performance_metrics.sortino_ratio.toFixed(2), 
            change: { direction: liveMetrics.performance_metrics.sortino_ratio > 1 ? 'up' as const : 'neutral' as const, value: liveMetrics.performance_metrics.sortino_ratio > 1 ? '+0.05' : '-' } 
        },
        { 
            id: 6, 
            name: 'Ratio de Calmar', 
            value: liveMetrics.performance_metrics.calmar_ratio.toFixed(2), 
            change: { direction: 'neutral' as const, value: '-' } 
        },
        { 
            id: 7, 
            name: 'VaR Diario', 
            value: `${liveMetrics.performance_metrics.var_daily.toFixed(2)}%`, 
            change: { direction: 'down' as const, value: `${(liveMetrics.performance_metrics.var_daily / 5).toFixed(2)}%` } 
        },
        { 
            id: 8, 
            name: 'Asimetría (Skewness)', 
            value: liveMetrics.performance_metrics.skewness.toFixed(2), 
            change: { direction: 'neutral' as const, value: '-' } 
        },
        { 
            id: 9, 
            name: 'Curtosis (Kurtosis)', 
            value: liveMetrics.performance_metrics.kurtosis.toFixed(2), 
            change: { direction: 'neutral' as const, value: '-' } 
        },
    ] : [];

    // Ajustar dinámicamente cardsToShow basado en el ancho del contenedor
    useEffect(() => {
        const calculateCardsToShow = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Ancho aproximado de tarjeta + gap (w-56 -> 224px, gap-4 -> 16px) = 240px
                // Ajustar estos valores si el diseño es diferente
                const cardWidthPlusGap = 240;
                const calculatedCards = Math.max(1, Math.floor(containerWidth / cardWidthPlusGap));
                setCardsToShow(calculatedCards);
            }
        };

        calculateCardsToShow(); // Calcular al montar
        window.addEventListener('resize', calculateCardsToShow); // Recalcular en resize

        return () => window.removeEventListener('resize', calculateCardsToShow); // Limpiar listener
    }, []);


    const totalCards = metricsData.length;
    const maxStartIndex = Math.max(0, totalCards - cardsToShow);

    const canScrollLeft = startIndex > 0;
    const canScrollRight = startIndex < maxStartIndex;

    const scroll = (direction: 'left' | 'right') => {
        const newIndex = direction === 'left'
            ? Math.max(0, startIndex - 1)
            : Math.min(maxStartIndex, startIndex + 1);
        setStartIndex(newIndex);
    };

    // Calcular el desplazamiento basado en el índice y el ancho de la tarjeta + gap
    // Usaremos CSS para el ancho (w-56) y gap (gap-4), el transform necesita el valor numérico
    // w-56 = 14rem, gap-4 = 1rem. Total shift = 15rem
    const cardWidthRem = 14;
    const gapRem = 1;
    const totalShiftRem = cardWidthRem + gapRem;

    // Mostrar estados de carga y error
    if (loading) {
        return (
            <div ref={containerRef} className="relative w-full flex items-center justify-center">
                <div className="text-gray-500">Cargando métricas del portfolio...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div ref={containerRef} className="relative w-full flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (metricsData.length === 0) {
        return (
            <div ref={containerRef} className="relative w-full flex items-center justify-center">
                <div className="text-gray-500">No hay métricas disponibles</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full"> {/* Añadir ref y w-full */}
            {/* Contenedor que oculta las tarjetas fuera de vista */}
            <div className="overflow-hidden">
                {/* Contenedor interior que se mueve con transform */}
                <div
                    className="flex gap-4 transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${startIndex * totalShiftRem}rem)` }}
                >
                    {metricsData.map((metric) => (
                        <MetricCard
                            key={metric.id}
                            name={metric.name}
                            value={metric.value}
                            change={metric.change}
                        />
                    ))}
                </div>
            </div>

            {/* Botones de navegación */}
            {/* Botón Izquierdo */}
            {canScrollLeft && ( // Mostrar solo si se puede scrollear
                 <button
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className="carousel-arrow absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 z-10 hidden md:block" // Oculto en móvil por defecto
                    aria-label="Anterior"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Botón Derecho */}
            {canScrollRight && ( // Mostrar solo si se puede scrollear
                <button
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className="carousel-arrow absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 z-10 hidden md:block" // Oculto en móvil por defecto
                    aria-label="Siguiente"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

             {/* Indicación para móvil (opcional, si no hay botones visibles) */}
             {/* <p className="text-xs text-gray-500 mt-2 text-center md:hidden">Desliza para ver más</p> */}
        </div>
    );
};

export default InvestmentMetricsCarousel;
