export interface PortfolioAsset {
    claseActivo: string;
    porcentaje: number; // Decimal (e.g., 0.35 for 35%)
    valorNominal: number;
}

export const portfolioData: PortfolioAsset[] = [
    { claseActivo: 'Acciones Tecnológicas', porcentaje: 0.35, valorNominal: 35000 },
    { claseActivo: 'Acciones Sector Bancario', porcentaje: 0.20, valorNominal: 20000 },
    { claseActivo: 'Oro (ETF)', porcentaje: 0.15, valorNominal: 15000 },
    { claseActivo: 'Bonos Corporativos High Yield', porcentaje: 0.20, valorNominal: 20000 },
    { claseActivo: 'Liquidez (Efectivo)', porcentaje: 0.10, valorNominal: 10000 },
];

// Paleta de colores (puede estar aquí o en el componente)
export const backgroundColors = [
    '#4F46E5', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#6366F1', // Violet
    '#EC4899', // Pink
    '#84CC16', // Lime
];
