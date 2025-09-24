import React, { useEffect, useState } from 'react';
import AIControlPanel from './AIControlPanel';
import PerformanceSummary from './PerformanceSummary';
import AdvancedMetrics from './AdvancedMetrics';
import PredictiveChart from './PredictiveChart';
import AnomalyDetection from './AnomalyDetection';
import DetailedAnalysis from './DetailedAnalysis';
import InteractiveSimulations from './InteractiveSimulations';
import TopRightActions from './TopRightActions';

const AIReportView: React.FC = () => {
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('aiReportId');
    setReportId(id);
  }, []);

  return (
    <>

      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '1200px',
            height: '192px',
            backgroundColor: '#FFFFFF',
            color: 'black',
            padding: '0px'
          }}
        >
          <AIControlPanel />
        </div>

        <div
          style={{
            width: '520px',
            height: '192px',
            backgroundColor: '#FFFFFF',
            marginLeft: '20px',
            color: 'black',
            padding: '0px'
          }}
        >
          <TopRightActions />
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div
          style={{
            width: '1200px',
            height: '398px',
            backgroundColor: '#FFFFFF',
            color: 'black',
            padding: '0px'
          }}
        >
          <PerformanceSummary />
        </div>

        <div
          style={{
            width: '520px',
            height: '398px',
            backgroundColor: '#FFFFFF',
            marginLeft: '20px',
            color: 'black',
            padding: '0px'
          }}
        >
          <AdvancedMetrics />
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div
          style={{
            flex: '1',
            minWidth: '300px',
            maxWidth: '900px',
            height: '399px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF',
            color: 'black',
            padding: '0px'
          }}
        >
          <PredictiveChart />
        </div>

        <div
          style={{
            flex: '1',
            minWidth: '300px',
            maxWidth: '816px',
            height: '399px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF',
            marginLeft: '20px',
            color: 'black',
            padding: '0px'
          }}
        >
          <AnomalyDetection />
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: '20px', marginBottom: '40px' }}>
        <div
          style={{
            flex: '1',
            minWidth: '300px',
            maxWidth: '900px',
            height: '525px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF',
            color: 'black',
            padding: '0px'
          }}
        >
          <DetailedAnalysis />
        </div>

        <div
          style={{
            flex: '1',
            minWidth: '300px',
            maxWidth: '816px',
            height: '525px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF',
            marginLeft: '20px',
            color: 'black',
            padding: '0px'
          }}
        >
          <InteractiveSimulations />
              </div>
            </div>

            {/* Placeholder para contenido adicional del reporte */}
            <div className="bg-white rounded-lg shadow p-6 text-gray-800 mb-4">
              <h2 className="text-xl font-semibold mb-2">Reporte Personalizado (Demo)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Este es un contenedor de vista para el reporte personalizado generado por el backend.
              </p>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm">ID de reporte: {reportId || 'demo-123'}</p>
                <p className="mt-2 text-sm">Contenido del reporte se integrará aquí.</p>
              </div>
            </div>
          </>
        );
      };
      
      export default AIReportView;
