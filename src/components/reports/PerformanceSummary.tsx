import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getAuthenticatedUrl } from '../../config/api';
import { useAgentSummary } from '../../services/portfolioService';

// Componente para renderizar una sección del resumen
interface SummarySection {
  title: string;
  content: string;
}

const SummarySectionCard: React.FC<{ section: SummarySection; isOpen: boolean; onToggle: () => void }> = ({ 
  section, 
  isOpen, 
  onToggle 
}) => (
  <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
    >
      <span className="font-medium text-gray-800 text-sm">{section.title}</span>
      <svg
        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="p-3 text-sm text-gray-700 bg-white border-t border-gray-100">
        {section.content.split('\n').map((line, idx) => {
          // Renderizar bullets
          if (line.trim().startsWith('*   ') || line.trim().startsWith('-   ')) {
            const content = line.trim().replace(/^[\*\-]\s+/, '');
            // Manejar negritas **texto**
            const parts = content.split(/(\*\*[^*]+\*\*)/g);
            return (
              <div key={idx} className="flex items-start gap-2 mb-1">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>
                  {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </span>
              </div>
            );
          }
          // Líneas normales
          if (line.trim()) {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={idx} className="mb-1">
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </p>
            );
          }
          return null;
        })}
      </div>
    )}
  </div>
);

// Parser para convertir markdown a secciones
const parseMarkdownToSections = (markdown: string): SummarySection[] => {
  const sections: SummarySection[] = [];
  const lines = markdown.split('\n');
  
  let currentTitle = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // Detectar encabezados ### (nivel 3)
    if (line.startsWith('### ')) {
      // Guardar sección anterior si existe
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n').trim()
        });
      }
      currentTitle = line.replace('### ', '').trim();
      currentContent = [];
    } else if (currentTitle) {
      // Agregar contenido a la sección actual
      currentContent.push(line);
    }
  }
  
  // Guardar última sección
  if (currentTitle && currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n').trim()
    });
  }
  
  return sections;
};

const PerformanceSummary: React.FC = () => {
  const iframeSrc = getAuthenticatedUrl('/api/analizer/file/portfolio_growth_interactive.html');
  const { summaryContent, loading, error, hasSummary, refreshSummary } = useAgentSummary();

  // Dimensiones nativas del HTML (definidas en el script): 1000x600
  const BASE_WIDTH = 1000;
  const BASE_HEIGHT = 600;
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0])); // Primera sección abierta por defecto

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;

    const updateScale = () => {
      const availableWidth = el.clientWidth;
      const newScale = Math.max(0.5, Math.min(1, availableWidth / BASE_WIDTH));
      setScale(newScale);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledHeight = useMemo(() => Math.round(BASE_HEIGHT * scale), [scale]);

  // Parsear el resumen en secciones
  const sections = useMemo(() => {
    if (!summaryContent?.summary) return [];
    return parseMarkdownToSections(summaryContent.summary);
  }, [summaryContent]);

  const toggleSection = (index: number) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Formatear fecha
  const formatDate = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoDate;
    }
  };

  return (
    // Contenedor principal adaptado para tema claro y dimensiones
    <div className="w-full h-full bg-white p-4 rounded-lg flex flex-col md:flex-row gap-4 min-h-[560px]">
      {/* Área del Gráfico */}
      <div className="md:w-3/5 h-full flex flex-col">
        {/* Título accesible sin ocupar espacio visual */}
        <h2 className="sr-only">Evolución del Portafolio</h2>
        <div ref={chartContainerRef} className="relative w-full overflow-hidden rounded-md border border-gray-100" style={{ height: scaledHeight }}>
          <div
            style={{
              width: BASE_WIDTH,
              height: BASE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <iframe
              src={iframeSrc}
              title="Evolución del Portafolio (Interactivo)"
              className="border-0 block"
              scrolling="no"
              style={{ width: BASE_WIDTH, height: BASE_HEIGHT, overflow: 'hidden' }}
            />
          </div>
        </div>
      </div>

      {/* Área de la Narrativa Automatizada */}
      <div className="md:w-2/5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Resumen del Periodo</h2>
          {hasSummary && (
            <button
              onClick={refreshSummary}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              title="Actualizar resumen"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          )}
        </div>
        
        {/* Estado de carga */}
        {loading && (
          <div className="flex-grow flex items-center justify-center bg-gray-50 rounded border border-gray-200">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Cargando resumen...</span>
            </div>
          </div>
        )}

        {/* Estado de error */}
        {error && !loading && (
          <div className="flex-grow flex items-center justify-center bg-red-50 rounded border border-red-200 p-4">
            <div className="text-center">
              <p className="text-sm text-red-600 mb-2">Error al cargar el resumen</p>
              <button
                onClick={refreshSummary}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Sin resumen disponible */}
        {!loading && !error && !hasSummary && (
          <div className="flex-grow flex items-center justify-center bg-gray-50 rounded border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">No hay resumen disponible</p>
              <p className="text-xs text-gray-400">Genera un resumen desde el panel de acciones</p>
            </div>
          </div>
        )}

        {/* Contenido del resumen */}
        {!loading && !error && hasSummary && summaryContent && (
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Header con tipo y fecha */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {summaryContent.report_type}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(summaryContent.generated_at)}
              </span>
            </div>
            
            {/* Secciones colapsables con scroll */}
            <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
              {sections.map((section, index) => (
                <SummarySectionCard
                  key={index}
                  section={section}
                  isOpen={openSections.has(index)}
                  onToggle={() => toggleSection(index)}
                />
              ))}
            </div>
            
            {/* Footer con modelo usado */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Generado con {summaryContent.model_used}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceSummary;
