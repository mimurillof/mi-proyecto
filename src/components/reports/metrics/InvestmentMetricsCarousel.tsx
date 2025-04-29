import React, { useState, useRef, useEffect } from 'react';
import { metricsData } from '../../../data/investmentMetrics';
import MetricCard from './MetricCard';
import './metrics.css'; // Importar los estilos CSS

const InvestmentMetricsCarousel: React.FC = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(5); // Valor inicial para desktop
    const containerRef = useRef<HTMLDivElement>(null);

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
