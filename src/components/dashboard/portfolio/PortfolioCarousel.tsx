import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import StockCard, { StockData } from './StockCard';
import './PortfolioCarousel.css'; // Import styles
import { ChevronLeft, ChevronRight, Settings, Eye } from 'lucide-react'; // Importa iconos
import {
    fetchPortfolioReport,
    PortfolioManagerApiResponse,
    PortfolioAsset,
} from '../../../services/portfolioManagerService';

const DEFAULT_PERIOD = '6mo';

const FALLBACK_STOCKS: StockData[] = [];

interface PortfolioCarouselProps {
    onStockSelect: (stock: StockData) => void;
    onPortfolioView: () => void;
}

const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({ 
    onStockSelect, 
    onPortfolioView 
}) => {
    const [stocks, setStocks] = useState<StockData[]>(FALLBACK_STOCKS);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [marketOpen, setMarketOpen] = useState<boolean | null>(null);
    const [nextOpenIso, setNextOpenIso] = useState<string | null>(null);
    const [lastUpdatedIso, setLastUpdatedIso] = useState<string | null>(null);

    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    const formatDateTime = (isoString: string | null): string | null => {
        if (!isoString) return null;
        const date = new Date(isoString);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return date.toLocaleString();
    };

    const handleApiResponse = useCallback((response: PortfolioManagerApiResponse): boolean => {
        console.log('🔍 API Response:', response);
        console.log('🔍 Market Open:', response.market_open);
        console.log('🔍 Next Open:', response.next_open_est);
        
        setMarketOpen(response.market_open ?? null);
        setNextOpenIso(response.next_open_est ?? null);

        const report = response.data;
        if (report?.generated_at) {
            setLastUpdatedIso(report.generated_at);
        } else if (response.last_refresh) {
            setLastUpdatedIso(response.last_refresh);
        }

        const allocationMap = new Map<string, number>();
        report?.allocation?.forEach((item) => {
            allocationMap.set(item.symbol, item.allocation_percent);
        });

        const mappedAssets: StockData[] = (report?.assets ?? []).map((asset: PortfolioAsset) => ({
            symbol: asset.symbol,
            name: asset.name ?? asset.symbol,
            price: asset.current_price ?? 0,
            change: asset.change_percent ?? 0,
            units: asset.units ?? 0,
            logoUrl: asset.logo_url ?? undefined,
            positionValue: asset.position_value ?? undefined,
            allocationPercent: allocationMap.get(asset.symbol),
        }));

        if (mappedAssets.length > 0) {
            setStocks(mappedAssets);
            return true;
        }

        return false;
    }, []);

    const loadPortfolio = useCallback(
        async (forceRefresh = false) => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchPortfolioReport({ period: DEFAULT_PERIOD, force: forceRefresh });

                if (response.enabled === false) {
                    setError(response.message ?? 'El servicio del Portfolio Manager está deshabilitado.');
                    setStocks(FALLBACK_STOCKS);
                    setMarketOpen(null);
                    setNextOpenIso(null);
                    return;
                }

                const hasDynamicData = handleApiResponse(response);

                if (!hasDynamicData && !forceRefresh) {
                    await loadPortfolio(true);
                } else if (!hasDynamicData) {
                    setStocks(FALLBACK_STOCKS);
                }
            } catch (err) {
                console.error('Error al cargar el portafolio:', err);
                const message = err instanceof Error ? err.message : 'Error desconocido al cargar el portafolio.';
                setError(message);
                setStocks(FALLBACK_STOCKS);
                setMarketOpen(null);
                setNextOpenIso(null);
            } finally {
                setLoading(false);
            }
        },
        [handleApiResponse]
    );

    useEffect(() => {
        let isMounted = true;

        const executeInitialLoad = async () => {
            if (!isMounted) {
                return;
            }
            await loadPortfolio(false);
        };

        executeInitialLoad();

        return () => {
            isMounted = false;
        };
    }, [loadPortfolio]);

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
    }, []); // Solo ejecutar en el montaje inicial

    const formattedNextOpen = useMemo(() => formatDateTime(nextOpenIso), [nextOpenIso]);
    const formattedLastUpdated = useMemo(() => formatDateTime(lastUpdatedIso), [lastUpdatedIso]);

    // Log de debug para verificar el estado
    useEffect(() => {
        console.log('🎯 Estado actual:', {
            loading,
            error,
            marketOpen,
            nextOpenIso,
            lastUpdatedIso,
        });
    }, [loading, error, marketOpen, nextOpenIso, lastUpdatedIso]);

    return (
        <div className="portfolio-container">
            <div className="portfolio-header">
                <div 
                    className="portfolio-title cursor-pointer hover:text-blue-600 transition-colors" 
                    onClick={onPortfolioView}
                >
                    Mi Portafolio
                </div>
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

            <div className="portfolio-status-wrapper">
                {loading && (
                    <div className="portfolio-status portfolio-status--loading">Cargando portafolio…</div>
                )}
                {!loading && error && (
                    <div className="portfolio-status portfolio-status--error">{error}</div>
                )}
                {!loading && !error && marketOpen !== null && (
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                marketOpen
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                        >
                            {marketOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                        {!marketOpen && formattedNextOpen && (
                            <span className="text-xs text-gray-500">
                                Próxima apertura: {formattedNextOpen}
                            </span>
                        )}
                        {formattedLastUpdated && (
                            <span className="text-xs text-gray-500">
                                • Actualizado: {formattedLastUpdated}
                            </span>
                        )}
                    </div>
                )}
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
                    {stocks.map((stock, index) => (
                        <StockCard 
                            key={`${stock.symbol}-${index}`} 
                            stock={stock} 
                            onStockSelect={onStockSelect}
                        />
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
