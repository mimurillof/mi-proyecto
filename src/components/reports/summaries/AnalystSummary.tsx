import React from 'react';

const AnalystSummary: React.FC = () => {
  // Datos del analista (pueden venir de props o estado si es dinámico)
  const analyst = {
    name: 'Elena García',
    title: 'Analista Senior de Inversiones',
    imageUrl: 'https://via.placeholder.com/150/771796', // URL de ejemplo
  };

  // URL del PDF (puede venir de props o estado)
  const pdfUrl = "https://files.elfsightcdn.com/_assets/pdf-embed/files/research.pdf";

  return (
    // Contenedor principal que ocupa todo el espacio disponible (h-full, w-full)
    // y usa flexbox para distribuir el espacio entre la info y el iframe.
    <div className="w-full h-full bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">

      {/* Información del Analista */}
      {/* flex-shrink-0 evita que esta sección se encoja */}
      <div className="flex items-center mb-4 pb-4 border-b border-gray-200 space-x-4 flex-shrink-0">
        <img
          src={analyst.imageUrl}
          alt={`Foto de ${analyst.name}`}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0" // Tamaño ajustado
        />
        <div>
          <p className="text-sm font-medium text-gray-900">{analyst.name}</p>
          <p className="text-xs text-gray-500">{analyst.title}</p>
        </div>
      </div>

      {/* Área de Visualización del PDF */}
      {/* flex-grow permite que esta sección ocupe el espacio vertical restante */}
      <div className="w-full flex-grow">
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%" // Ocupa toda la altura del div padre (flex-grow)
          style={{ border: 'none' }} // Estilo inline para el borde
          title="Resumen Ejecutivo PDF"
        >
          Tu navegador no soporta iframes. Puedes descargar el PDF <a href={pdfUrl}>aquí</a>.
        </iframe>
      </div>

    </div>
  );
};

export default AnalystSummary;
