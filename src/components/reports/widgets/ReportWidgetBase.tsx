import React from 'react';

interface ReportWidgetBaseProps {
  children: React.ReactNode;
  className?: string;
  widgetNumber: number; // Para mostrar el número como en la imagen
}

const ReportWidgetBase: React.FC<ReportWidgetBaseProps> = ({ children, className = '', widgetNumber }) => {
  // Estilos base: fondo blanco, sombra, borde redondeado, texto oscuro. Padding eliminado (p-0).
  const baseStyle = "bg-white shadow rounded-lg p-0 text-gray-800 relative"; 
  
  return (
    <div className={`${baseStyle} ${className}`}>
      {/* Número del widget para referencia visual */}
      <span className="absolute top-1 right-1 text-xs font-bold text-gray-300 bg-gray-50 px-1 rounded z-10">
        {widgetNumber}
      </span>
      {children} {/* Renderiza el contenido directamente */}
    </div>
  );
};

export default ReportWidgetBase;
