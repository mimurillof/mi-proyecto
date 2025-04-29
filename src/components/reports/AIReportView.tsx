import React from 'react'; // Importa React
import AIControlPanel from './AIControlPanel'; // Importa el nuevo componente
import PerformanceSummary from './PerformanceSummary'; // Importa el nuevo componente de resumen
import AdvancedMetrics from './AdvancedMetrics'; // Importa el nuevo componente de métricas
import PredictiveChart from './PredictiveChart'; // Importa el nuevo componente de gráfico predictivo
import AnomalyDetection from './AnomalyDetection'; // Importa el nuevo componente de detección
import DetailedAnalysis from './DetailedAnalysis'; // Importa el nuevo componente de análisis detallado
import InteractiveSimulations from './InteractiveSimulations'; // Importa el nuevo componente de simulaciones
import TopRightActions from './TopRightActions'; // Importa el nuevo contenedor de acciones

const AIReportView: React.FC = () => {
  // Devuelve un fragmento vacío o un elemento placeholder
  return (
    <>
      {/* Contenedor para la primera fila */}
      <div style={{ display: 'flex' }}>
        {/* Panel de Control - Ahora contiene el componente AIControlPanel */}
        <div
          style={{
            width: '1200px', // Ancho fijo
            height: '192px',
            backgroundColor: '#FFFFFF', // Fondo blanco
            color: 'black', // Color de texto por defecto (aunque el hijo lo define)
            padding: '0px' // Añadir padding si es necesario, o dejar que el hijo lo maneje
          }}
        >
          <AIControlPanel /> {/* Renderiza el nuevo componente aquí */}
        </div>

        {/* Nuevo div - Ahora contiene TopRightActions */}
        <div
          style={{
            width: '520px', // Mismo ancho que "Componente 2.4"
            height: '192px', // Altura ajustada para coincidir con el Panel de Control
            backgroundColor: '#FFFFFF', // Cambiado a blanco
            marginLeft: '20px', // Espacio entre los divs de la primera fila
            color: 'black', // Color por defecto
            padding: '0px' // Sin padding extra
          }}
        >
          <TopRightActions /> {/* Renderiza el contenedor de acciones aquí */}
        </div>
      </div>

      {/* Contenedor para la fila con Grafico y la nueva caja */}
      <div style={{ display: 'flex', marginTop: '20px' }}>
        {/* Div Grafico preditivo - Ahora contiene PerformanceSummary */}
        <div
          style={{
            width: '1200px', // Mantiene el ancho
            height: '398px', // Mantiene la altura
            backgroundColor: '#FFFFFF', // Fondo blanco
            color: 'black', // Color por defecto
            padding: '0px' // Sin padding extra, el hijo lo maneja
          }}
        >
          <PerformanceSummary /> {/* Renderiza el componente de resumen aquí */}
        </div>

        {/* Nuevo div - Ahora contiene AdvancedMetrics */}
        <div
          style={{
            width: '520px',
            height: '398px', // Misma altura que "Grafico preditivo"
            backgroundColor: '#FFFFFF', // Fondo blanco
            marginLeft: '20px', // Espacio entre los divs
            color: 'black', // Color por defecto
            padding: '0px' // Sin padding extra, el hijo lo maneja
          }}
        >
          <AdvancedMetrics /> {/* Renderiza el componente de métricas aquí */}
        </div>
      </div>

      {/* Contenedor para la tercera fila */}
      <div style={{ display: 'flex', marginTop: '20px' }}>
        {/* Componente 2.5: Gráficos Predictivos - Ahora contiene PredictiveChart */}
        <div
          style={{
            flex: '1', // Permite crecer/encogerse
            minWidth: '300px', // Ancho mínimo
            maxWidth: '900px', // Ancho máximo original
            height: '399px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF', // Fondo blanco
            color: 'black', // Color por defecto
            padding: '0px' // Sin padding extra
          }}
        >
          <PredictiveChart /> {/* Renderiza el componente de gráfico predictivo aquí */}
        </div>

        {/* Componente 2.6: Detección de Anomalías y Oportunidades (IA) - Ahora contiene AnomalyDetection */}
        <div
          style={{
            flex: '1', // Permite crecer/encogerse
            minWidth: '300px', // Ancho mínimo
            maxWidth: '816px', // Ancho máximo original
            height: '399px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF', // Fondo blanco
            marginLeft: '20px', // Espacio entre los divs
            color: 'black', // Color por defecto
            padding: '0px' // Sin padding extra
          }}
        >
          <AnomalyDetection /> {/* Renderiza el componente de detección aquí */}
        </div>
      </div>

      {/* Contenedor para la cuarta fila */}
      <div style={{ display: 'flex', marginTop: '20px', marginBottom: '40px' }}>
        {/* Componente 2.7: Análisis Detallado - Ahora contiene DetailedAnalysis */}
        <div
          style={{
            flex: '1', // Permite crecer/encogerse
            minWidth: '300px', // Ancho mínimo
            maxWidth: '900px', // Ancho máximo original
            height: '525px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF', // Fondo blanco
            color: 'black', // Color por defecto
            padding: '0px' // Sin padding extra
          }}
        >
          <DetailedAnalysis /> {/* Renderiza el componente de análisis detallado aquí */}
        </div>

        {/* Componente 2.8: Simulaciones Interactivas */}
        <div
          style={{
            flex: '1', // Permite crecer/encogerse
            minWidth: '300px', // Ancho mínimo (ajustar si es necesario)
            maxWidth: '816px', // Ancho máximo original
            height: '525px',
            flexShrink: 0, // Mantenido
            backgroundColor: '#FFFFFF', // Cambiado a blanco
            marginLeft: '20px', // Añade espacio entre los dos divs
            color: 'black', // Color por defecto
            padding: '0px' // Sin padding extra
          }}
        >
          <InteractiveSimulations /> {/* Renderiza el componente de simulaciones aquí */}
        </div>
      </div>
    </>
  );
};

export default AIReportView;
