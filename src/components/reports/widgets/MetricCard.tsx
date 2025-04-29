import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface MetricData {
  id: string;
  name: string;
  value: string; // Valor formateado como string
  change?: number; // Cambio numérico (positivo o negativo)
}

interface MetricCardProps {
  metric: MetricData;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const hasChange = typeof metric.change === 'number';
  const isPositive = hasChange && metric.change > 0;
  const isNegative = hasChange && metric.change < 0;

  return (
    <div className="flex-shrink-0 w-48 bg-gray-50 border border-gray-200 rounded-lg p-3 scroll-snap-align-start">
      <p className="text-xs text-gray-500 mb-1 truncate">{metric.name}</p>
      <p className="text-lg font-semibold text-gray-800 mb-1">{metric.value}</p>
      <div className="flex items-center text-xs">
        {isPositive && (
          <>
            <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{metric.change?.toFixed(2)}%</span>
          </>
        )}
        {isNegative && (
          <>
            <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
            <span className="text-red-600 font-medium">{metric.change?.toFixed(2)}%</span>
          </>
        )}
        {!hasChange && (
           <span className="text-gray-400">-</span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
