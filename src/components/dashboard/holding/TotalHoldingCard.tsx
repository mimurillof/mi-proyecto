import React, { useMemo } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import './TotalHoldingCard.css';

interface TotalHoldingCardProps {
  total: number | null;
  percentageChange: number | null;
  absoluteChange: number | null;
  timePeriod?: string;
  loading?: boolean;
  error?: string | null;
  statusMessage?: string | null;
  lastUpdated?: string | null;
  onRefresh?: () => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const TotalHoldingCard: React.FC<TotalHoldingCardProps> = ({
  total,
  percentageChange,
  absoluteChange,
  timePeriod = '6M',
  loading = false,
  error = null,
  statusMessage = null,
  lastUpdated = null,
  onRefresh,
}) => {
  const periodDisplay = useMemo(() => {
    const normalized = timePeriod.trim().toUpperCase();
    if (normalized.endsWith('MO')) {
      return normalized.replace('MO', 'M');
    }
    if (normalized.endsWith('YR')) {
      return normalized.replace('YR', 'Y');
    }
    return normalized;
  }, [timePeriod]);

  const formattedTotal = useMemo(() => {
    if (typeof total === 'number') {
      return currencyFormatter.format(total);
    }
    return '--';
  }, [total]);

  const isPositiveChange = typeof percentageChange === 'number' ? percentageChange >= 0 : true;
  const changeColor = isPositiveChange ? 'text-green-600' : 'text-red-600';

  const formattedPercentage = useMemo(() => {
    if (typeof percentageChange === 'number') {
      const sign = percentageChange > 0 ? '+' : '';
      return `${sign}${percentageChange.toFixed(2)}%`;
    }
    return '--';
  }, [percentageChange]);

  const { absoluteDisplay, absoluteSign } = useMemo(() => {
    if (typeof absoluteChange === 'number') {
      const sign = absoluteChange >= 0 ? '' : '-';
      const absValue = currencyFormatter.format(Math.abs(absoluteChange));
      return { absoluteDisplay: absValue, absoluteSign: sign };
    }
    return { absoluteDisplay: '--', absoluteSign: '' };
  }, [absoluteChange]);

  const formattedUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    const parsed = new Date(lastUpdated);
    if (Number.isNaN(parsed.getTime())) return lastUpdated;
    return parsed.toLocaleString();
  }, [lastUpdated]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="total-holding-card-container">
      <div className="holding-header-row">
        <span className="holding-title">Total Holding</span>
        <div className="holding-header-buttons">
          <button className="holding-time-button" onClick={handleRefresh} disabled={loading}>
            {periodDisplay}
          </button>
          <button className="holding-dropdown-button" disabled>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="holding-status holding-status--error">{error}</div>
      ) : (
        <>
          {loading ? (
            <div className="holding-total-amount holding-total-amount--loading">Cargando…</div>
          ) : (
            <div className="holding-total-amount">{formattedTotal}</div>
          )}
          <div className="holding-return-info">
            <span>Return</span>
            <CheckCircle size={16} className={`holding-check-icon ${isPositiveChange ? 'text-green-600' : 'text-red-500'}`} />
            <span className={`holding-return-percentage ${changeColor}`}>
              {formattedPercentage}
            </span>
            <span className="holding-return-absolute">
              (
              {absoluteDisplay === '--' ? '--' : (
                <>
                  {absoluteSign}
                  {absoluteDisplay}
                </>
              )}
              )
            </span>
          </div>
          {statusMessage && !loading && (
            <div className="holding-status holding-status--info">{statusMessage}</div>
          )}
          {formattedUpdated && (
            <div className="holding-meta">Actualizado: {formattedUpdated}</div>
          )}
        </>
      )}
    </div>
  );
};

export default TotalHoldingCard;
