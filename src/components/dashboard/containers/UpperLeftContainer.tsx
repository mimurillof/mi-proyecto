import React, { useCallback, useEffect, useState } from 'react';
import TotalHoldingCard from '../holding/TotalHoldingCard';
import {
  fetchPortfolioSummary,
  PortfolioSummary,
} from '../../../services/portfolioManagerService';

const DEFAULT_PERIOD = '6mo';

const UpperLeftContainer: React.FC = () => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>(DEFAULT_PERIOD);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const response = await fetchPortfolioSummary();

      if (response.enabled === false) {
        setError(response.message ?? 'El resumen del Portafolio Manager está deshabilitado.');
        setSummary(null);
        setPeriod(DEFAULT_PERIOD);
        setLastUpdated(null);
        return;
      }

      setPeriod(response.period ?? DEFAULT_PERIOD);
      
      // Priorizar 'generated_at' del JSON, luego 'last_refresh', y finalmente el timestamp del resumen.
      const updateTimestamp = response.generated_at ?? response.last_refresh ?? response.summary?.timestamp ?? null;
      setLastUpdated(updateTimestamp);

      if (!response.summary) {
        setSummary(null);
        setStatusMessage(response.message ?? 'No hay datos disponibles del portafolio.');
      } else {
        setSummary(response.summary);
        setStatusMessage(null);
      }
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Error desconocido al cargar el resumen del portafolio.';
      setError(message);
      setSummary(null);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <TotalHoldingCard
      total={summary?.total_value ?? null}
      percentageChange={summary?.total_change_percent ?? null}
      absoluteChange={summary?.total_change_absolute ?? null}
      timePeriod={period}
      loading={loading}
      error={error}
      statusMessage={statusMessage}
      lastUpdated={lastUpdated ?? summary?.timestamp ?? null}
      onRefresh={loadSummary}
    />
  );
};

export default UpperLeftContainer;
