import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  ArrowLeft, ArrowRight, Settings2, Filter, 
  ArrowUpRight, Bell, Sun, Search, HelpCircle 
} from 'lucide-react';



// Importaciones de iconos
import iconoHome from './images/icons/home.svg';
import iconoDashboard from './images/icons/dashboard.svg';
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
import { Card, CardHeader, CardFooter, Image, Button } from '@heroui/react';

// Importar CSS de UserProfilePage
import './pages/UserProfilePage/UserProfilePage.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('inicio');
  const tradingViewWidgetContainerRef = useRef<HTMLDivElement>(null);
  const mentionsContainerRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (itemName: string) => {
    setActiveItem(itemName);
  };

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

  return (
    <>
      <div className="flex h-screen bg-[#F5F7FB] text-white overflow-hidden">
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
        <div className="flex-1 flex flex-col overflow-hidden"> 
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
                    <div className="bg-white rounded-lg shadow p-4 text-black overflow-hidden news-component-container">
                      <div className="product-list">
                        <a href="#" aria-label="Título de la Noticia 1" className="product-list-item">
                          <div className="product-description-container">
                            <p>Resumen de la Noticia 1.</p>
                            <p className="product-number">Fuente 1</p>
                          </div>
                          <div className="product-icon-container">
                            <img className="product-hover-video" src="/Captura de pantalla 2025-04-11 102543.png" alt="Noticia 1 Imagen"/>
                          </div>
                          <div className="product-title-container">
                            <h3>Título de la Noticia 1</h3>
                            <p className="product-number">Subtítulo o Detalle 1</p>
                          </div>
                        </a>
                        <a href="#" aria-label="Título de la Noticia 2" className="product-list-item">
                          <div className="product-description-container">
                            <p>Resumen de la Noticia 2.</p>
                            <p className="product-number">Fuente 2</p>
                          </div>
                          <div className="product-icon-container">
                            <img className="product-hover-video" src="/Captura de pantalla 2025-04-11 102543.png" alt="Noticia 2 Imagen"/>
                          </div>
                          <div className="product-title-container">
                            <h3>Título de la Noticia 2</h3>
                            <p className="product-number">Subtítulo o Detalle 2</p>
                          </div>
                        </a>
                        <a href="#" aria-label="Título de la Noticia 3" className="product-list-item">
                          <div className="product-description-container">
                            <p>Resumen de la Noticia 3.</p>
                            <p className="product-number">Fuente 3</p>
                          </div>
                          <div className="product-icon-container">
                            <img className="product-hover-video" src="/Captura de pantalla 2025-04-11 102543.png" alt="Noticia 3 Imagen"/>
                          </div>
                          <div className="product-title-container">
                            <h3>Título de la Noticia 3</h3>
                            <p className="product-number">Subtítulo o Detalle 3</p>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div ref={mentionsContainerRef} className="bg-white rounded-lg shadow text-black overflow-hidden flex-grow p-4">
                      <div className="flex h-full flex-col gap-3">
                          <h3 className="component-title">Menciones Recientes</h3>
                        <div className="grid flex-1 min-h-0 grid-cols-12 gap-3 auto-rows-[140px] sm:auto-rows-[170px]">
                          <Card className="relative col-span-12 md:col-span-6 xl:col-span-4">
                            <span className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/30 to-transparent" aria-hidden="true" />
                            <CardHeader className="absolute z-10 top-2 flex-col items-start gap-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-white">Reddit • r/wallstreetbets</span>
                              <h4 className="text-white text-xs font-semibold">"$XYZ se perfila para romper resistencias"</h4>
                              <p className="text-[11px] text-white/80">Usuarios coordinan una entrada agresiva antes del cierre semanal.</p>
                            </CardHeader>
                            <CardFooter className="absolute bottom-2 left-2 right-2 z-10 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                              <div className="flex w-full items-center justify-between text-[11px] text-white/80">
                                <span>Upvotes • 12.4k</span>
                                <span className="text-emerald-200">+18% sentimiento</span>
                              </div>
                            </CardFooter>
                            <Image
                              removeWrapper
                              alt="Operador observando pantallas con gráficos volátiles"
                              className="z-0 w-full h-full object-cover"
                              src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80"
                            />
                          </Card>
                          <Card className="relative col-span-12 md:col-span-6 xl:col-span-4">
                            <span className="absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-slate-900/30 to-transparent" aria-hidden="true" />
                            <CardHeader className="absolute z-10 top-2 flex-col items-start gap-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/80 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-white">X • @InversorPro</span>
                              <h4 className="text-white text-xs font-semibold">Mercado atento a la decisión de tasas</h4>
                              <p className="text-[11px] text-white/80">"Powell sugiere pausa prolongada. Liquidez se mueve a bonos cortos."</p>
                            </CardHeader>
                            <CardFooter className="absolute bottom-2 left-2 right-2 z-10 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                              <div className="flex items-center justify-between text-[11px] text-white/80">
                                <span>Reposts • 2.1k</span>
                                <span className="text-amber-200">🛈 Riesgo moderado</span>
                              </div>
                            </CardFooter>
                            <Image
                              removeWrapper
                              alt="Panel de control financiero con gráficas y boletines"
                              className="z-0 w-full h-full object-cover"
                              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80"
                            />
                          </Card>
                          <Card className="relative col-span-12 md:col-span-6 xl:col-span-4">
                            <span className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-slate-800/25 to-transparent" aria-hidden="true" />
                            <CardHeader className="absolute z-10 top-2 flex-col items-start gap-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/80 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-white">Foro Private Equity</span>
                              <h4 className="text-white text-xs font-semibold">Rotación hacia energía limpia</h4>
                              <p className="text-[11px] text-white/85">Gestores reportan récord de capital entrando en ETF solares para Q4.</p>
                            </CardHeader>
                            <CardFooter className="absolute bottom-2 left-2 right-2 z-10 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                              <div className="flex items-center justify-between text-[11px] text-white/80">
                                <span>Gestores • 38</span>
                                <span className="text-emerald-200">Flujos +9.3%</span>
                          </div>
                            </CardFooter>
                            <Image
                              removeWrapper
                              alt="Panel solar iluminado al atardecer"
                              className="z-0 w-full h-full object-cover"
                              src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80"
                            />
                          </Card>
                          <Card isFooterBlurred className="col-span-12 xl:col-span-5">
                            <CardHeader className="absolute z-10 top-2 flex-col items-start gap-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-gray-900">Breaking • Último minuto</span>
                              <h4 className="text-black font-medium text-base">"TechMega" anuncia split 3:1</h4>
                              <p className="text-[11px] text-gray-800/80">CEO confirma resultados por encima del consenso y recompras por 4B USD.</p>
                            </CardHeader>
                            <Image
                              removeWrapper
                              alt="Analistas celebrando resultados tecnológicos"
                              className="z-0 w-full h-full object-cover"
                              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                            />
                            <CardFooter className="absolute bg-white/75 bottom-2 left-2 right-2 border border-white/60 z-10 justify-between rounded-xl px-3 py-2">
                              <div>
                                <p className="text-[11px] font-semibold text-gray-900">After hours: +6.3%</p>
                                <p className="text-[11px] text-gray-700">Volumen 3x promedio</p>
                              </div>
                              <Button className="text-[11px]" color="primary" radius="full" size="sm">
                                Seguir ticker
                              </Button>
                            </CardFooter>
                          </Card>
                          <Card isFooterBlurred className="col-span-12 xl:col-span-7">
                            <CardHeader className="absolute z-10 top-2 flex-col items-start gap-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/80 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-white">Podcast • MarketTalk</span>
                              <h4 className="text-white text-sm font-semibold">Episodio especial: "Cómo navegar la volatilidad"</h4>
                              <p className="text-[11px] text-white/80">Invitados revisan estrategias defensivas, coberturas y sectores refugio.</p>
                            </CardHeader>
                            <Image
                              removeWrapper
                              alt="Estudio de podcast financiero con micrófonos y gráficos"
                              className="z-0 w-full h-full object-cover"
                              src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80"
                            />
                            <CardFooter className="absolute bg-black/50 bottom-2 left-2 right-2 z-10 border border-white/20 px-3 py-2">
                              <div className="flex grow gap-3 items-center text-[11px] text-white/80">
                                <Image
                                  alt="Icono del podcast"
                                  className="rounded-full w-8 h-8 border border-white/40"
                                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=200&q=80"
                                />
                                <div className="flex flex-col">
                                  <p>Duración: 24 min • Transcripción disponible</p>
                                  <p className="text-white">Escúchalo ahora ↗</p>
                                </div>
                              </div>
                              <Button radius="full" size="sm" color="secondary">
                                Reproducir
                              </Button>
                            </CardFooter>
                          </Card>
                          </div>
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
                    <div className="bg-white rounded-lg shadow text-black overflow-hidden flex-grow min-h-0 p-4 flex flex-col items-center justify-center">
                      <SentimentCard /> 
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