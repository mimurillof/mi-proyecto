import React, { useState, useRef, useEffect } from 'react';
import StockCard from './StockCard';
import './PortfolioCarousel.css'; // Import styles
import { ChevronLeft, ChevronRight, Settings, Eye } from 'lucide-react'; // Importa iconos

// Datos de ejemplo (puedes mover esto a un estado, props o API)
const stocksData = [
    { symbol: 'AAPL', name: 'Apple', price: 172.13, change: +0.45, units: 10 },
    { symbol: 'TSLA', name: 'Tesla', price: 182.58, change: -1.23, units: 20 }, // Precio actualizado
    { symbol: 'MSFT', name: 'Microsoft', price: 427.87, change: +0.85, units: 15 }, // Precio actualizado
    { symbol: 'GOOG', name: 'Google', price: 177.94, change: -0.55, units: 5 }, // Precio actualizado
    { symbol: 'AMZN', name: 'Amazon', price: 183.63, change: +1.15, units: 8 }, // Precio actualizado
    // Puedes añadir más acciones aquí si quieres probar el scroll
    { symbol: 'AAPL', name: 'Apple', price: 172.13, change: +0.45, units: 10 },
    { symbol: 'TSLA', name: 'Tesla', price: 182.58, change: -1.23, units: 20 }, 
    { symbol: 'MSFT', name: 'Microsoft', price: 427.87, change: +0.85, units: 15 },
];

const PortfolioCarousel: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 300; // Ajusta según necesites
            const currentScroll = carouselRef.current.scrollLeft;
            const newPosition = direction === 'left' 
                ? Math.max(0, currentScroll - scrollAmount)
                : currentScroll + scrollAmount;
            
            carouselRef.current.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
        }
    };

    // Controlar visibilidad de botones de scroll
    const checkScrollButtons = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftButton(scrollLeft > 0);
            // Muestra el botón derecho si hay más contenido por desplazar
            setShowRightButton(scrollLeft < (scrollWidth - clientWidth - 1)); // -1 para margen de error
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            // Comprobar botones al montar y al cambiar tamaño
            checkScrollButtons();
            carousel.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);

            return () => {
                carousel.removeEventListener('scroll', checkScrollButtons);
                window.removeEventListener('resize', checkScrollButtons);
            };
        }
    }, [stocksData]); // Re-evaluar si los datos cambian

    return (
        <div className="portfolio-container">
            <div className="portfolio-header">
                <div className="portfolio-title">Mi Portafolio</div>
                <div className="portfolio-buttons-container">
                    <button className="portfolio-action-button">
                        <Eye size={16} className="mr-1" /> {/* Icono lucide */}
                        <span>Ver todo</span>
                    </button>
                    <button className="portfolio-action-button icon-only">
                        <Settings size={16} /> {/* Icono lucide */}
                    </button>
                </div>
            </div>

            <div className="carousel-container">
                {showLeftButton && (
                    <button
                        className="carousel-button left"
                        onClick={() => scroll('left')}
                        aria-label="Desplazar a la izquierda"
                    >
                        <ChevronLeft size={20} /> {/* Icono lucide */}
                    </button>
                )}

                <div className="cards-carousel" ref={carouselRef}>
                    {stocksData.map((stock, index) => (
                        // Usar index como parte de la key si los símbolos pueden repetirse
                        <StockCard key={`${stock.symbol}-${index}`} stock={stock} />
                    ))}
                </div>

                {showRightButton && (
                    <button
                        className="carousel-button right"
                        onClick={() => scroll('right')}
                        aria-label="Desplazar a la derecha"
                    >
                        <ChevronRight size={20} /> {/* Icono lucide */}
                    </button>
                )}
            </div>
        </div>
    );
}

export default PortfolioCarousel;
