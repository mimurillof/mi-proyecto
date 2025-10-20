import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Bell, Sun, Search, HelpCircle } from 'lucide-react';



// Importaciones de iconos
import iconoHome from './images/icons/home.svg';
import iconoReportes from './images/icons/Reportes.svg';
import iconoCartera from './images/icons/Cartera.svg';
import iconoMercado from './images/icons/Mercado.svg';
import iconoAI from './images/icons/AI.svg';
import iconoPerfil from './images/icons/Perfil.svg';
import iconoConfiguracion from './images/icons/Configuracion.svg';
import iconoBarCollapse from './images/icons/Bar Collapse.svg';

// Importaciones de componentes
import SentimentCard from './components/SentimentCard';
import DashboardGrid from './components/dashboard/DashboardGrid';
import ReportsPage from './pages/ReportsPage'; // <-- Importar ReportsPage
import MarketPage from './pages/MarketPage'; // <-- Importar MarketPage
import AIAgentPage from './pages/AIAgentPage'; // <-- Nueva importación
import UserProfilePage from './pages/UserProfilePage/UserProfilePage'; // <-- Importar UserProfilePage
import AccountSettingsPage from './pages/AccountSettingsPage/AccountSettingsPage'; // <-- Nueva importación
import { Card, CardHeader, CardFooter, Button } from '@heroui/react';
import { useHomeDashboard } from './hooks/useHomeDashboard';

// Importar CSS de UserProfilePage
import './pages/UserProfilePage/UserProfilePage.css';

const NEWS_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80';
const HIGHLIGHT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('inicio');
  const tradingViewWidgetContainerRef = useRef<HTMLDivElement>(null);
  const mentionsContainerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { data: homeData, loading: homeLoading, error: homeError } = useHomeDashboard();

  const portfolioNews = homeData?.portfolio_news ?? [];
  const largeHighlights = homeData?.highlights?.large_cards ?? [];
  const smallHighlights = homeData?.highlights?.small_cards ?? [];
  const sentimentInfo = homeData?.market_sentiment;

  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return null;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleString('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatBadge = (type: 'reddit' | 'tradingview', fallback?: string) => {
    if (fallback) {
      return fallback;
    }

    return type === 'reddit' ? 'Reddit' : 'TradingView';
  };

  const getBadgeStyle = (type: 'reddit' | 'tradingview') => {
    return type === 'reddit'
      ? 'bg-black/60 text-white'
      : 'bg-sky-500/80 text-white';
  };

  const getOverlayGradient = (type: 'reddit' | 'tradingview') => {
    return type === 'reddit'
      ? 'from-black/70 via-black/35 to-transparent'
      : 'from-black/75 via-slate-900/30 to-transparent';
  };

  const isValidImageUrl = (source?: string | null) => {
    if (!source) {
      return false;
    }

    try {
      const parsedUrl = new URL(source);
      const extensionPattern = /\.(jpg|jpeg|png|webp|avif|gif)$/i;
      return extensionPattern.test(parsedUrl.pathname);
    } catch {
      return false;
    }
  };

  const getHighlightImageSrc = (url?: string | null) => {
    return isValidImageUrl(url) ? (url as string) : HIGHLIGHT_PLACEHOLDER_IMAGE;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  // **Auth Guard: Verificar autenticación al cargar**
  useEffect(() => {
    const checkAuth = () => {
      // **1. Verificar si hay token en la URL (viene de Next.js login)**
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      
      if (tokenFromUrl) {
        console.log('🔑 Token recibido desde URL de login');
        // Guardar token en localStorage
        localStorage.setItem('token', tokenFromUrl);
        
        // Limpiar URL (quitar el parámetro ?token=...)
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        console.log('✅ Token guardado y URL limpiada');
        setIsAuthenticated(true);
        return;
      }
      
      // **2. Verificar si ya hay token en localStorage**
      const rawToken = localStorage.getItem('token');
      const token = rawToken ? rawToken.trim() : '';
      
      if (!token || token === 'undefined' || token === 'null') {
        console.warn('⚠️ No hay token válido. Redirigiendo a login...');
        setIsAuthenticated(false);
        // Redirigir a la app de login en Next.js
        window.location.href = 'https://horizon-login.vercel.app/';
        return;
      }
      
      console.log('✅ Token encontrado, usuario autenticado');
      setIsAuthenticated(true);
    };
    
    checkAuth();
  }, []);

  // Interceptar errores 403/401 y redirigir
  useEffect(() => {
    const handleAuthError = (event: any) => {
      if (event.detail?.status === 401 || event.detail?.status === 403) {
        console.error('❌ Error de autenticación detectado. Limpiando sesión...');
        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
        window.location.href = 'https://horizon-login.vercel.app/';
      }
    };
    
    window.addEventListener('authError', handleAuthError);
    return () => window.removeEventListener('authError', handleAuthError);
  }, []);

  useEffect(() => {
    function handleNavigateToReportsAI() {
      setActiveItem('reportes');
      // ReportsPage leerá sessionStorage y abrirá la pestaña AI
    }

    window.addEventListener('navigateToReportsAI' as any, handleNavigateToReportsAI);

    if (tradingViewWidgetContainerRef.current) {
        tradingViewWidgetContainerRef.current.innerHTML = '';
    }

    if (activeItem === 'inicio' && tradingViewWidgetContainerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        "symbols": [
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500 Index" },
          { "proName": "FOREXCOM:NSXUSD", "title": "US 100 Cash CFD" },
          { "proName": "FX_IDC:EURUSD", "title": "EUR to USD" },
          { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
          { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "displayMode": "adaptive",
        "colorTheme": "light",
        "locale": "en"
      });

      tradingViewWidgetContainerRef.current.appendChild(script);

      const copyrightDiv = document.createElement('div');
      copyrightDiv.className = 'tradingview-widget-copyright';
      copyrightDiv.style.fontSize = '10px';
      copyrightDiv.style.textAlign = 'center';
      copyrightDiv.style.color = '#888';
      copyrightDiv.innerHTML = `<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" style="color: #3BB3E4; text-decoration: none;"><span class="blue-text">Track all markets on TradingView</span></a>`;
    }
    return () => {
      window.removeEventListener('navigateToReportsAI' as any, handleNavigateToReportsAI);
    };
  }, [activeItem]);

  // Mostrar loading mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-700 font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (ya se redirigió)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
  <div className="flex min-h-screen bg-[#F5F7FB] text-white overflow-x-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#1a1d24] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto`}>
          <div className="p-4 flex-1">
            <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'items-center space-x-2'} mb-8`}>
              <img src="/favicon.ico" alt="Horizon" className="w-8 h-8" />
              <span className={`transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                <span className="font-semibold text-lg text-white">Horizon</span>
                <span className="text-sm text-gray-400 ml-1">Dash</span>
              </span>
            </div>
            
            <nav className="space-y-1 relative">
              <li className={`list-none ${activeItem === 'inicio' ? 'active' : ''}`}>
                <a 
                  href="#" 
                  onClick={() => handleMenuClick('inicio')}
                  className={`flex items-center py-3 rounded-lg ${
                    sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                  } ${activeItem === 'inicio' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <img src={iconoHome} alt="Inicio" className="w-5 h-5 flex-shrink-0" />
                  <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Inicio</span>
                </a>
              </li>
              
              <li className={`list-none ${activeItem === 'portafolio' ? 'active' : ''}`}>
                <a 
                  href="#" 
                  onClick={() => handleMenuClick('portafolio')}
                  className={`flex items-center py-3 rounded-lg ${
                    sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                  } ${activeItem === 'portafolio' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <img src={iconoCartera} alt="Portafolio" className="w-5 h-5 flex-shrink-0" />
                  <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Portafolio</span>
                </a>
              </li>
              
              <li className={`list-none ${activeItem === 'reportes' ? 'active' : ''}`}>
                <a 
                  href="#" 
                  onClick={() => handleMenuClick('reportes')}
                  className={`flex items-center py-3 rounded-lg ${
                    sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                  } ${activeItem === 'reportes' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <img src={iconoReportes} alt="Reportes" className="w-5 h-5 flex-shrink-0" />
                  <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Reportes</span>
                </a>
              </li>
              
              <li className={`list-none ${activeItem === 'mercado' ? 'active' : ''}`}>
                <a 
                  href="#" 
                  onClick={() => handleMenuClick('mercado')}
                  className={`flex items-center py-3 rounded-lg ${
                    sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                  } ${activeItem === 'mercado' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <img src={iconoMercado} alt="Mercado" className="w-5 h-5 flex-shrink-0" />
                  <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Mercado</span>
                </a>
              </li>
              
              <li className={`list-none ${activeItem === 'ai' ? 'active' : ''}`}>
                <a 
                  href="#" 
                  onClick={() => handleMenuClick('ai')}
                  className={`flex items-center py-3 rounded-lg ${
                    sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                  } ${activeItem === 'ai' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <img src={iconoAI} alt="AI Agent" className="w-5 h-5 flex-shrink-0" />
                  <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>AI Agent</span>
                </a>
              </li>
            </nav>
          </div>
          
          <div className="mt-auto p-4"> 
            <nav className="space-y-1">
              <li className={`list-none ${activeItem === 'perfil' ? 'active' : ''}`}>
                <a 
                  href="#" 
                  onClick={() => handleMenuClick('perfil')}
                  className={`flex items-center py-3 rounded-lg ${
                    sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                  } ${activeItem === 'perfil' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                > 
                  <img src={iconoConfiguracion} alt="Perfil" className="w-5 h-5 flex-shrink-0" /> 
                  <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Perfil</span>
                </a>
              </li>
              
              <li className={`list-none ${activeItem === 'configuracion' ? 'active' : ''}`}>
                <a 
                  href="#" 
                  onClick={() => handleMenuClick('configuracion')}
                  className={`flex items-center py-3 rounded-lg ${
                    sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                  } ${activeItem === 'configuracion' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <img src={iconoPerfil} alt="Configuración" className="w-5 h-5 flex-shrink-0" /> 
                  <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Configuración</span>
                </a>
              </li>
              
              <li className="list-none">
                <button 
                  onClick={toggleSidebar} 
                  className={`flex items-center py-2 rounded-lg hover:bg-gray-800 w-full ${
                    sidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'
                  } text-gray-400`}
                > 
                  <img 
                    src={iconoBarCollapse} 
                    alt="Colapsar barra" 
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      sidebarCollapsed ? 'transform rotate-180' : ''
                    }`} 
                  />
                  <span className={`transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Colapsar</span>
                </button>
              </li>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
  <div className="flex-1 flex flex-col overflow-x-hidden"> 
          {/* Top Navigation */}
          <nav className="flex items-center justify-between p-4 bg-white shadow-sm flex-shrink-0">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="search"
                  placeholder="Search anything..."
                  className="bg-white border border-gray-200 rounded-lg pl-10 pr-16 py-2 w-[280px] text-[15px] text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <div className="absolute right-3 px-1.5 py-0.5 rounded bg-gray-100 text-[13px] text-gray-500">
                  ⌘K
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Sun className="w-5 h-5 text-gray-500" />
              </button>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </nav>

          {/* Contenedor para el TradingView Widget */}
          {activeItem === 'inicio' && (
            <div ref={tradingViewWidgetContainerRef} className="tradingview-widget-container bg-white flex-shrink-0">
            </div>
          )}

          {/* Main Content Area */}
          <div className="px-6 pb-6 pt-1.5 flex-1 overflow-auto"> 
            {/* Renderizado condicional del contenido principal */}
            {activeItem === 'inicio' && (
              <> 
                <div className="flex flex-col lg:flex-row gap-6 w-full h-full"> 
                  <div className="flex flex-col gap-6 w-full lg:w-1/2 flex-grow"> 
                    <div className="bg-white rounded-lg shadow p-6 text-black news-component-container">
                      <div className="product-list">
                        {homeLoading
                          ? Array.from({ length: 3 }).map((_, index) => (
                              <div key={`news-skeleton-${index}`} className="product-list-item animate-pulse pointer-events-none">
                                <div className="product-description-container">
                                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                                  <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                                </div>
                                <div className="product-icon-container">
                                  <div className="product-hover-video bg-gray-200" />
                                </div>
                                <div className="product-title-container">
                                  <div className="h-5 w-2/3 rounded bg-gray-200" />
                                  <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
                                </div>
                              </div>
                            ))
                          : homeError
                          ? (
                              <div className="p-4 text-sm text-red-600">
                                {homeError}
                              </div>
                            )
                          : portfolioNews.length === 0
                          ? (
                              <div className="p-4 text-sm text-gray-500">
                                No hay noticias disponibles en este momento.
                              </div>
                            )
                          : (
                              portfolioNews.map((newsItem, index) => {
                                const newsKey = newsItem.uuid ?? `${newsItem.title ?? 'noticia'}-${index}`;
                                const publishedAt = formatDateTime(newsItem.published_at);
                                const summary = newsItem.summary ?? newsItem.subtitle ?? 'Sin resumen disponible.';
                                const imageSrc = newsItem.image_url ?? NEWS_PLACEHOLDER_IMAGE;
                                const subtitle = newsItem.subtitle ?? newsItem.type ?? '';
                                const sourceElements = [newsItem.source, publishedAt].filter(Boolean).join(' • ');

                                return (
                                  <a
                                    key={newsKey}
                                    href={newsItem.url ?? '#'}
                                    target={newsItem.url ? '_blank' : undefined}
                                    rel={newsItem.url ? 'noopener noreferrer' : undefined}
                                    aria-label={newsItem.title ?? 'Noticia del portafolio'}
                                    className="product-list-item group"
                                  >
                                    <div className="product-description-container">
                                      <p>{summary}</p>
                                      {sourceElements && (
                                        <p className="product-number">{sourceElements}</p>
                                      )}
                                    </div>
                                    <div className="product-icon-container">
                                      <img
                                        className="product-hover-video object-cover"
                                        src={imageSrc}
                                        alt={newsItem.title ?? 'Imagen de la noticia'}
                                      />
                                    </div>
                                    <div className="product-title-container">
                                      <h3>{newsItem.title ?? 'Título no disponible'}</h3>
                                      {subtitle && (
                                        <p className="product-number">{subtitle}</p>
                                      )}
                                    </div>
                                  </a>
                                );
                              })
                            )}
                      </div>
                    </div>
                    <div ref={mentionsContainerRef} className="bg-white rounded-lg shadow text-black overflow-hidden flex-grow p-4">
                      <div className="flex h-full flex-col gap-3">
                        {homeLoading ? (
                          <div className="grid flex-1 min-h-0 grid-cols-12 gap-3 auto-rows-[160px] sm:auto-rows-[180px]">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <Card key={`highlight-skeleton-${index}`} className="relative col-span-12 md:col-span-6 xl:col-span-4 animate-pulse">
                                <div className="absolute inset-0 bg-gray-200" />
                              </Card>
                            ))}
                          </div>
                        ) : homeError ? (
                          <div className="flex-1 flex items-center justify-center text-sm text-red-600">
                            {homeError}
                          </div>
                        ) : largeHighlights.length + smallHighlights.length === 0 ? (
                          <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                            No hay menciones destacadas por ahora.
                          </div>
                        ) : (
                          <div className="grid flex-1 min-h-0 grid-cols-12 gap-3 auto-rows-[160px] sm:auto-rows-[180px]">
                            {largeHighlights.map((cardItem, index) => {
                              const overlay = getOverlayGradient(cardItem.type);
                              const badgeStyle = getBadgeStyle(cardItem.type);
                              const statPrimary = cardItem.primary_stat_label && cardItem.primary_stat_value
                                ? `${cardItem.primary_stat_label} • ${cardItem.primary_stat_value}`
                                : null;
                              const statSecondary = cardItem.secondary_stat_label && cardItem.secondary_stat_value
                                ? `${cardItem.secondary_stat_label} • ${cardItem.secondary_stat_value}`
                                : null;
                              const publishedAt = formatDateTime(cardItem.published_at);

                              return (
                                <Card key={cardItem.id ?? `${cardItem.type}-large-${index}`} isFooterBlurred className="relative col-span-12 xl:col-span-6">
                                  <span className={`absolute inset-0 z-[1] bg-gradient-to-t ${overlay}`} aria-hidden="true" />
                                  <CardHeader className="absolute z-10 top-2 flex-col items-start gap-1">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide ${badgeStyle}`}>
                                      {formatBadge(cardItem.type, cardItem.badge)}
                                    </span>
                                    <h4 className="text-white text-sm font-semibold">{cardItem.title}</h4>
                                    {(cardItem.description || cardItem.body) && (
                                      <p className="text-[11px] text-white/80">
                                        {cardItem.description ?? cardItem.body}
                                      </p>
                                    )}
                                  </CardHeader>
                                  <img
                                    alt={cardItem.title ?? 'Idea destacada'}
                                    className="z-0 h-full w-full object-cover"
                                    loading="lazy"
                                    src={getHighlightImageSrc(cardItem.image_url)}
                                  />
                                  <CardFooter className="absolute bottom-2 left-2 right-2 z-10 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                                    <div className="flex w-full items-center justify-between gap-3 text-[11px] text-white/80">
                                      <div className="flex flex-col gap-[2px]">
                                        {statPrimary && <span>{statPrimary}</span>}
                                        {statSecondary && <span>{statSecondary}</span>}
                                        {publishedAt && <span className="text-white/60">{publishedAt}</span>}
                                      </div>
                                      {cardItem.cta_label && cardItem.url && (
                                        <Button
                                          className="text-[11px]"
                                          color="primary"
                                          radius="full"
                                          size="sm"
                                          onClick={() => window.open(cardItem.url as string, '_blank', 'noopener,noreferrer')}
                                        >
                                          {cardItem.cta_label}
                                        </Button>
                                      )}
                                    </div>
                                  </CardFooter>
                                </Card>
                              );
                            })}
                            {smallHighlights.map((cardItem, index) => {
                              const overlay = getOverlayGradient(cardItem.type);
                              const badgeStyle = getBadgeStyle(cardItem.type);
                              const statPrimary = cardItem.primary_stat_label && cardItem.primary_stat_value
                                ? `${cardItem.primary_stat_label} • ${cardItem.primary_stat_value}`
                                : null;
                              const statSecondary = cardItem.secondary_stat_label && cardItem.secondary_stat_value
                                ? `${cardItem.secondary_stat_label} • ${cardItem.secondary_stat_value}`
                                : null;
                              const publishedAt = formatDateTime(cardItem.published_at);

                              return (
                                <Card key={cardItem.id ?? `${cardItem.type}-small-${index}`} className="relative col-span-12 md:col-span-6 xl:col-span-4">
                                  <span className={`absolute inset-0 z-[1] bg-gradient-to-t ${overlay}`} aria-hidden="true" />
                                  <CardHeader className="absolute z-10 top-2 flex-col items-start gap-1">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide ${badgeStyle}`}>
                                      {formatBadge(cardItem.type, cardItem.badge)}
                                    </span>
                                    <h4 className="text-white text-xs font-semibold">{cardItem.title}</h4>
                                    {cardItem.description && (
                                      <p className="text-[11px] text-white/80 line-clamp-3">
                                        {cardItem.description}
                                      </p>
                                    )}
                                  </CardHeader>
                                  <img
                                    alt={cardItem.title ?? 'Mención destacada'}
                                    className="z-0 h-full w-full object-cover"
                                    loading="lazy"
                                    src={getHighlightImageSrc(cardItem.image_url)}
                                  />
                                  <CardFooter className="absolute bottom-2 left-2 right-2 z-10 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                                    <div className="flex w-full items-center justify-between gap-2 text-[11px] text-white/80">
                                      <div className="flex flex-col gap-[2px]">
                                        {statPrimary && <span>{statPrimary}</span>}
                                        {statSecondary && <span>{statSecondary}</span>}
                                        {publishedAt && <span className="text-white/60">{publishedAt}</span>}
                                      </div>
                                      {typeof cardItem.score === 'number' && (
                                        <span className="text-emerald-200 font-semibold">↑ {cardItem.score}</span>
                                      )}
                                    </div>
                                  </CardFooter>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 w-full lg:w-1/2 flex-grow"> 
                    <div className="bg-white rounded-lg shadow text-black overflow-hidden aspect-video">
                      <div className="ytplayer-container">
                        <div className="ytplayer-video-wrapper">
                          <iframe
                            className="ytplayer-iframe"
                            src="https://www.youtube.com/embed/iEpJwprxDdk?si=BUaSA4ZNMo-vpMVH&autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=iEpJwprxDdk"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen={false}
                            ></iframe>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow text-black overflow-hidden flex-grow min-h-0 p-4 flex flex-col">
                      <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex w-full items-start justify-between">
                          <h3 className="component-title">Sentimiento del Mercado</h3>
                          {formatDateTime(homeData?.updated_at) && (
                            <span className="text-xs text-gray-400">Actualizado {formatDateTime(homeData?.updated_at)}</span>
                          )}
                        </div>
                        <SentimentCard
                          value={sentimentInfo?.value ?? null}
                          label={sentimentInfo?.description ?? null}
                          bucket={sentimentInfo?.bucket ?? null}
                        />
                        {homeLoading && (
                          <p className="text-sm text-gray-500">Actualizando datos...</p>
                        )}
                        {homeError && !homeLoading && (
                          <p className="text-sm text-red-600 text-center">{homeError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeItem === 'portafolio' && (
              <DashboardGrid />
            )}

            {activeItem === 'reportes' && (
              <ReportsPage />
            )}

            {activeItem === 'mercado' && (
              <MarketPage />
            )}

            {activeItem === 'ai' && ( // <-- Nueva condición para AI Agent
              <AIAgentPage />
            )}

            {activeItem === 'perfil' && ( // <-- Nueva condición para Perfil
              <UserProfilePage />
            )}

            {activeItem === 'configuracion' && ( // <-- Nueva condición para Configuración
              <AccountSettingsPage />
            )}

            {activeItem !== 'inicio' && 
             activeItem !== 'portafolio' && 
             activeItem !== 'reportes' && 
             activeItem !== 'mercado' &&
             activeItem !== 'ai' &&
             activeItem !== 'perfil' && 
             activeItem !== 'configuracion' && // <-- Añadir 'configuracion' a la condición
             (
              <div className="flex justify-center items-center h-full text-gray-600">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}</h2>
                  <p>Sección en desarrollo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;