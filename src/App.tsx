import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  ArrowLeft, ArrowRight, Settings2, Filter, 
  ArrowUpRight, Bell, Sun, Search, HelpCircle 
} from 'lucide-react';

// Importaciones de iconos
import iconoHome from './images/icons/home.svg';
import iconoDashboard from './images/icons/dashboard.svg';
import iconoPortafolio from './images/icons/Portafolio.svg';
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
import PortfolioLayout from './components/portfolio/PortfolioLayout';
import MarketPage from './pages/MarketPage'; // <-- Importar MarketPage
import AIAgentPage from './pages/AIAgentPage'; // <-- Nueva importación
import UserProfilePage from './pages/UserProfilePage/UserProfilePage'; // <-- Importar UserProfilePage
import AccountSettingsPage from './pages/AccountSettingsPage/AccountSettingsPage'; // <-- Nueva importación

// Importar CSS de UserProfilePage
import './pages/UserProfilePage/UserProfilePage.css';
// import './pages/AccountSettingsPage/AccountSettingsPage.css'; // Elimina o comenta esta línea

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
  }, [activeItem]);

  return (
    <div className="flex h-screen bg-[#F5F7FB] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#1a1d24] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto`}>
        <div className="p-4 flex-1">
          <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'items-center space-x-2'} mb-8`}>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className={`font-semibold text-lg transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              Dashboard
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
                <img src={iconoDashboard} alt="Dashboard" className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Dashboard</span>
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
            
            <li className={`list-none ${activeItem === 'cartera' ? 'active' : ''}`}>
              <a 
                href="#" 
                onClick={() => handleMenuClick('cartera')}
                className={`flex items-center py-3 rounded-lg ${
                  sidebarCollapsed ? 'justify-center w-full px-0' : 'space-x-3 px-3'
                } ${activeItem === 'cartera' ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <img src={iconoCartera} alt="Portafolio" className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Portafolio</span>
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
                  <div className="bg-white rounded-lg shadow p-4 text-black overflow-y-auto news-component-container"> 
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
                  <div ref={mentionsContainerRef} className="bg-white rounded-lg shadow text-black overflow-y-auto flex-grow">
                    <div className="post-card-container">
                        <h3 className="component-title">Menciones Recientes</h3>
                        <div className="post-card">
                            <div className="post-header">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-reddit"> <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.17-10.157a.75.75 0 00-1.06-1.06l-1.007 1.007a.75.75 0 101.06 1.06l1.007-1.007zm-4.34 5.78a.75.75 0 00-1.06 1.06l-1.5-1.5a.75.75 0 00-1.06 0l-1.5 1.5a.75.75 0 101.06 1.06l1.22-1.22 1.22 1.22a.75.75 0 001.06 0l1.5-1.5a.75.75 0 000-1.06l-1.5-1.5zM10 12a2 2 0 100-4 2 2 0 000 4zm-4.17-4.157a.75.75 0 10-1.06 1.06l1.007 1.007a.75.75 0 101.06-1.06L5.83 7.843z" clipRule="evenodd" /></svg>
                                <span>r/wallstreetbets · hace 2h</span>
                            </div>
                            <p className="post-content">"Creo que $XYZ va a explotar la próxima semana. ¡Todos a bordo! 🚀🚀 #ToTheMoon"</p>
                        </div>
                        <div className="post-card">
                            <div className="post-header">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-twitter"> <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 4.774a8.317 8.317 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" /></svg>
                                <span>@Inversor_Pro · hace 15m</span>
                            </div>
                            <p className="post-content">"Mucha incertidumbre en el mercado ahora mismo. Mejor ser cauteloso y esperar a ver qué pasa con las tasas de interés. #Finanzas #Trading"</p>
                        </div>
                        <div className="post-card">
                            <div className="post-header">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-reddit"> <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.17-10.157a.75.75 0 00-1.06-1.06l-1.007 1.007a.75.75 0 101.06 1.06l1.007-1.007zm-4.34 5.78a.75.75 0 00-1.06 1.06l-1.5-1.5a.75.75 0 00-1.06 0l-1.5 1.5a.75.75 0 101.06 1.06l1.22-1.22 1.22 1.22a.75.75 0 001.06 0l1.5-1.5a.75.75 0 000-1.06l-1.5-1.5zM10 12a2 2 0 100-4 2 2 0 000 4zm-4.17-4.157a.75.75 0 10-1.06 1.06l1.007 1.007a.75.75 0 101.06-1.06L5.83 7.843z" clipRule="evenodd" /></svg>
                                <span>r/investing · hace 5h</span>
                            </div>
                            <p className="post-content">"No me gusta cómo se ven los gráficos técnicos. Parece que viene una corrección fuerte. Vendiendo algunas posiciones. $SPY"</p>
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

          {activeItem === 'cartera' && (
            <PortfolioLayout />
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
           activeItem !== 'cartera' &&
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
  );
}

export default App;