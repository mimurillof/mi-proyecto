export interface MetricChange {
    direction: 'up' | 'down' | 'neutral';
    value: string;
}

export interface InvestmentMetric {
    id: number;
    name: string;
    value: string;
    change?: MetricChange; // Hacer opcional por si alguna métrica no tiene cambio
}

export const metricsData: InvestmentMetric[] = [
    { id: 1, name: 'Retorno Total', value: '12.5%', change: { direction: 'up', value: '+1.2%' } },
    { id: 2, name: 'Volatilidad', value: '8.2%', change: { direction: 'down', value: '-0.5%' } },
    { id: 3, name: 'Sharpe Ratio', value: '1.15', change: { direction: 'up', value: '+0.05' } },
    { id: 4, name: 'Max Drawdown', value: '-15.0%', change: { direction: 'down', value: '-2.0%' } },
    { id: 5, name: 'Alpha', value: '2.1%', change: { direction: 'up', value: '+0.3%' } },
    { id: 6, name: 'Beta', value: '0.95', change: { direction: 'neutral', value: '-' } },
    { id: 7, name: 'Dividend Yield', value: '3.1%', change: { direction: 'down', value: '-0.5%' } },
    { id: 8, name: 'Tracking Error', value: '1.5%', change: { direction: 'down', value: '-0.1%' } },
    { id: 9, name: 'Information Ratio', value: '0.75', change: { direction: 'up', value: '+0.1' } },
];
