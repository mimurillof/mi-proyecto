import React from 'react';
import { InvestmentMetric } from '../../../data/investmentMetrics'; // Importar la interfaz

interface MetricCardProps extends Omit<InvestmentMetric, 'id'> {} // Usar la interfaz, omitir id si no se usa como prop

const MetricCard: React.FC<MetricCardProps> = ({ name, value, change }) => {
    const getChangeIndicator = () => {
        if (!change) {
            return <span className="text-gray-500 text-sm">-</span>;
        }
        let colorClass = 'text-gray-500'; // Neutral por defecto
        let arrow = '•'; // Neutral por defecto

        if (change.direction === 'up') {
            colorClass = 'text-green-600';
            arrow = '▲';
        } else if (change.direction === 'down') {
            colorClass = 'text-red-600';
            arrow = '▼';
        }

        return (
            <span className={`text-sm font-medium ${colorClass} flex items-center gap-1`}>
                <span>{arrow}</span>
                <span>{change.value}</span>
            </span>
        );
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex-shrink-0 w-48 md:w-56 flex flex-col justify-between h-full">
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 truncate">{name}</h3>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{value}</p>
            </div>
            <div className="mt-2">
                {getChangeIndicator()}
            </div>
        </div>
    );
};

export default MetricCard;
