import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CandlestickController, OhlcController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
import './AssetDetailChart.css';

Chart.register(...registerables, CandlestickController, OhlcController, CandlestickElement, OhlcElement);

interface AssetData {
    iconSVG: JSX.Element;
    name: string;
    ticker: string;
    market: string;
    status: string;
    currentPrice: number;
    priceChangeValue: number;
    priceChangePercent: number;
    isPositiveChange: boolean;
    afterClosingPrice: number;
    afterClosingChangeValue: number;
    afterClosingChangePercent: number;
    isPositiveAfterClosingChange: boolean;
    priceRangeDate: string;
    priceRangeLow: number;
    priceRangeHigh: number;
    previousClose: number;
}

const ICONS = {
    AAPL: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-300"><path d="M18.665 15.351c-.686.956-1.258 2.037-1.963 2.995-.634.865-1.313 1.721-2.219 1.721-.891 0-1.488-.804-2.219-1.721-.759-.956-1.416-2.089-2.147-3.16-.766-1.123-1.963-2.037-2.559-2.037-.559 0-1.258.652-1.848 1.383-.766.956-1.453 2.139-2.037 3.186-.188.34-.449.628-.766.865.634.929 1.525 1.93 2.559 2.461.963.516 2.024.723 2.873.723.849 0 1.591-.207 2.219-.652.627-.445.999-1.017 1.626-1.017.627 0 1.211.572 1.848 1.017.627.445 1.37.652 2.219.652.849 0 1.91-.207 2.873-.723 1.034-.531 1.925-1.532 2.559-2.461-.317-.237-.578-.525-.766-.865-.584-1.047-1.271-2.23-2.037-3.186-.59-.731-1.289-1.383-1.848-1.383-.596 0-1.793.914-2.559 2.037-.731 1.071-1.388 2.204-2.147 3.16zm-5.993-12.001c1.519 0 2.873-1.172 2.873-2.487 0-1.341-1.209-2.513-2.873-2.513s-2.873 1.172-2.873 2.513c0 1.315 1.354 2.487 2.873 2.487z"/></svg>,
    MSFT: <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 22.5H2.6V13.7h8.8v8.8zm0-9.9H2.6V3.8h8.8v8.8zm9.9 9.9h-8.8V13.7h8.8v8.8zm0-9.9h-8.8V3.8h8.8v8.8z"/></svg>,
    GOOGL: <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2.18 12.19,2.18C6.42,2.18 2.03,6.8 2.03,12C2.03,17.05 6.16,21.82 12.19,21.82C17.03,21.82 21.54,18.07 21.54,12.81C21.54,11.9 21.35,11.1 21.35,11.1V11.1Z"/></svg>,
    Clock: <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
    DropdownArrow: <svg className="w-5 h-5 ml-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    CandlestickIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 5h2v2H7V5zm0 3h2v11H7V8zm3-3h2v5H10V5zm0 6h2v5H10v-5zm3-5h2v2H13V3zm0 3h2v9H13V6z"/></svg>, // Reemplazado con un icono de velas más estándar
    LineChartIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17.5l6-6.5 4 4L21 7.5V10h-2V5.5l-6.5 7-4-4L3 15.5z"/></svg>, // Reemplazado con un icono de línea más estándar
    FullscreenIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zM4 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" clipRule="evenodd" /></svg>,
};

const assetsCollection: Record<string, AssetData> = {
    "AAPL": { iconSVG: ICONS.AAPL, name: "Apple Inc.", ticker: "AAPL", market: "Nasdaq", status: "Closed 09/12", currentPrice: 191.24, priceChangeValue: 1.29, priceChangePercent: 0.68, isPositiveChange: true, afterClosingPrice: 191.21, afterClosingChangeValue: -0.03, afterClosingChangePercent: -0.02, isPositiveAfterClosingChange: false, priceRangeDate: "December 9th", priceRangeLow: 173.66, priceRangeHigh: 236.72, previousClose: 174.25 },
    "MSFT": { iconSVG: ICONS.MSFT, name: "Microsoft Corp.", ticker: "MSFT", market: "Nasdaq", status: "Closed 09/12", currentPrice: 425.52, priceChangeValue: -2.30, priceChangePercent: -0.54, isPositiveChange: false, afterClosingPrice: 425.80, afterClosingChangeValue: 0.28, afterClosingChangePercent: 0.07, isPositiveAfterClosingChange: true, priceRangeDate: "December 9th", priceRangeLow: 400.10, priceRangeHigh: 430.82, previousClose: 427.82 },
    "GOOGL": { iconSVG: ICONS.GOOGL, name: "Alphabet Inc. (Google)", ticker: "GOOGL", market: "Nasdaq", status: "Closed 09/12", currentPrice: 170.11, priceChangeValue: 0.85, priceChangePercent: 0.50, isPositiveChange: true, afterClosingPrice: 170.00, afterClosingChangeValue: -0.11, afterClosingChangePercent: -0.06, isPositiveAfterClosingChange: false, priceRangeDate: "December 9th", priceRangeLow: 165.00, priceRangeHigh: 175.20, previousClose: 169.26 }
};

const AssetDetailChart: React.FC = () => {
    const [currentAssetKey, setCurrentAssetKey] = useState<string>(Object.keys(assetsCollection)[0]);
    const [currentSelectedTimeRange, setCurrentSelectedTimeRange] = useState<string>('1D');
    const [currentChartType, setCurrentChartType] = useState<'line' | 'candlestick'>('line');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const dropdownButtonRef = useRef<HTMLButtonElement>(null);
    const dropdownMenuRef = useRef<HTMLDivElement>(null);

    const currentAssetDisplayData = assetsCollection[currentAssetKey];

    const generateChartData = useCallback((range: string, assetData: AssetData, type: 'line' | 'candlestick') => {
        const dataPoints: any[] = [];
        let numDataPoints = 30;
        let basePrice = assetData.currentPrice - (assetData.currentPrice * 0.05) + Math.random() * (assetData.currentPrice * 0.02);
        let priceFluctuation = assetData.currentPrice * 0.01;
        const now = new Date();

        const timeRangesConf: Record<string, { points: number, fluctMultiplier: number, unit: 'minute' | 'hour' | 'day' | 'week' | 'month', interval?: number }> = {
            "1": { points: 12, fluctMultiplier: 0.0005, unit: 'minute', interval: 1 * 60000 / 12 },
            "5": { points: 20, fluctMultiplier: 0.001, unit: 'minute', interval: 5 * 60000 / 20 },
            "15": { points: 30, fluctMultiplier: 0.002, unit: 'minute', interval: 15 * 60000 / 30 },
            "30": { points: 30, fluctMultiplier: 0.003, unit: 'minute', interval: 30 * 60000 / 30 },
            "1H": { points: 24, fluctMultiplier: 0.005, unit: 'hour', interval: 1 * 3600000 / 24 },
            "5H": { points: 30, fluctMultiplier: 0.008, unit: 'hour', interval: 5 * 3600000 / 30 },
            "1D": { points: 24, fluctMultiplier: 0.01, unit: 'day', interval: 24 * 3600000 / 24 }, 
            "1W": { points: 7, fluctMultiplier: 0.02, unit: 'week', interval: 24 * 3600000 }, 
            "1M": { points: 30, fluctMultiplier: 0.03, unit: 'month', interval: 24 * 3600000 }, 
        };
        
        const conf = timeRangesConf[range] || timeRangesConf["1D"];
        numDataPoints = conf.points;
        priceFluctuation = assetData.currentPrice * conf.fluctMultiplier;

        for (let i = 0; i < numDataPoints; i++) {
            let date;
            if (range === "1D") { 
                 date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 0);
            } else { 
                 date = new Date(now.getTime() - (numDataPoints - 1 - i) * (conf.interval || (24 * 3600000 / conf.points)));
            }

            if (type === 'line') {
                basePrice += (Math.random() - 0.48) * priceFluctuation;
                dataPoints.push({ x: date.valueOf(), y: parseFloat(basePrice.toFixed(2)) });
            } else { 
                const open = basePrice + (Math.random() - 0.5) * priceFluctuation;
                const close = open + (Math.random() - 0.5) * priceFluctuation * 2;
                const high = Math.max(open, close) + Math.random() * priceFluctuation;
                const low = Math.min(open, close) - Math.random() * priceFluctuation;
                basePrice = close;
                dataPoints.push({ x: date.valueOf(), o: open, h: high, l: low, c: close });
            }
        }
        
        if (dataPoints.length > 0) {
            if (type === 'line') {
                dataPoints[dataPoints.length - 1].y = assetData.currentPrice;
            } else {
                dataPoints[dataPoints.length - 1].c = assetData.currentPrice;
            }
        } else { 
            const fallbackTime = now.valueOf();
            if (type === 'line') dataPoints.push({ x: fallbackTime, y: assetData.currentPrice });
            else dataPoints.push({ x: fallbackTime, o: assetData.currentPrice, h: assetData.currentPrice, l: assetData.currentPrice, c: assetData.currentPrice });
        }
        return { dataPoints };
    }, []);


    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const { dataPoints } = generateChartData(currentSelectedTimeRange, currentAssetDisplayData, currentChartType);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height * 0.7);
        gradient.addColorStop(0, 'rgba(255, 165, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0.05)');

        let timeUnitConfig: 'minute' | 'hour' | 'day' = 'day';
        if (['1', '5', '15', '30'].includes(currentSelectedTimeRange)) {
            timeUnitConfig = 'minute';
        } else if (currentSelectedTimeRange.includes('H') || currentSelectedTimeRange === '1D') {
            timeUnitConfig = 'hour';
        }

        const chartConfig: ChartConfiguration = {
            type: currentChartType === 'line' ? 'line' : 'candlestick',
            data: {
                datasets: [{
                    label: 'Precio',
                    data: dataPoints,
                    ...(currentChartType === 'line' && {
                        borderColor: 'rgba(255, 165, 0, 1)',
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHitRadius: 10,
                        pointBackgroundColor: 'rgba(255, 165, 0, 1)',
                        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
                        borderWidth: 1.5
                    }),
                    ...(currentChartType === 'candlestick' && {
                         color: {
                            up: 'rgba(16,185,129,0.9)',      
                            down: 'rgba(239,68,68,0.9)',    
                            unchanged: 'rgba(156,163,175,0.9)' 
                        },
                        borderColor: 'rgba(107, 114, 128, 0.7)', 
                    })
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: timeUnitConfig,
                             displayFormats: {
                                minute: 'HH:mm', 
                                hour: 'HH:mm',   
                                day: 'MMM d'     
                            }
                        },
                        grid: { display: false, borderColor: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(156, 163, 175, 0.9)', maxTicksLimit: 7, font: { size: 10 } }
                    },
                    y: {
                        position: 'right',
                        grid: { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(156, 163, 175, 0.9)', callback: (value) => typeof value === 'number' ? value.toLocaleString('de-DE') : value, font: { size: 10 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index', intersect: false, backgroundColor: 'rgba(31, 41, 55, 0.9)', titleColor: 'rgba(229, 231, 235, 1)', bodyColor: 'rgba(209, 213, 219, 1)', borderColor: 'rgba(255, 165, 0, 0.7)', borderWidth: 1, padding: 10, titleFont: { size: 12, weight: 'bold' }, bodyFont: { size: 12 },
                        callbacks: {
                            label: (context) => {
                                if (currentChartType === 'line') {
                                    let label = context.dataset.label || '';
                                    if (label) label += ': ';
                                    if (typeof context.parsed.y === 'number') label += context.parsed.y.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                    return label;
                                } else { 
                                    const dp = context.raw as {o:number, h:number, l:number, c:number};
                                    return `O:${dp.o.toFixed(2)} H:${dp.h.toFixed(2)} L:${dp.l.toFixed(2)} C:${dp.c.toFixed(2)}`;
                                }
                            }
                        }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }
        };
        
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new Chart(ctx, chartConfig);

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };

    }, [currentAssetKey, currentSelectedTimeRange, currentChartType, currentAssetDisplayData, generateChartData]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target as Node) &&
                dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleTimeRangeChange = (range: string) => {
        setCurrentSelectedTimeRange(range);
    };

    const handleChartTypeChange = (type: 'line' | 'candlestick') => {
        setCurrentChartType(type);
    };
    
    const timeRanges = ["1", "5", "15", "30", "1H", "5H", "1D", "1W", "1M"];

    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-4 md:p-6 h-full flex flex-col text-gray-300">
            {/* Sección de Información del Activo */}
            <div className="mb-6 flex-shrink-0">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                        <div className="mr-3">{currentAssetDisplayData.iconSVG}</div>
                        <div className="relative">
                            <button 
                                ref={dropdownButtonRef}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-gray-300 focus:outline-none"
                            >
                                <span>{currentAssetDisplayData.name} ({currentAssetDisplayData.ticker})</span>
                                {ICONS.DropdownArrow}
                            </button>
                            {isDropdownOpen && (
                                <div ref={dropdownMenuRef} className="asset-dropdown-menu">
                                    {Object.keys(assetsCollection).map(key => (
                                        <a
                                            key={key}
                                            href="#"
                                            className={`block px-4 py-2 text-sm hover:bg-gray-600 ${currentAssetKey === key ? 'bg-gray-600 text-white font-semibold' : 'text-gray-200 hover:text-white'}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentAssetKey(key);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {assetsCollection[key].name} ({assetsCollection[key].ticker})
                                        </a>
                                    ))}
                                </div>
                            )}
                            <div className="text-xs sm:text-sm text-gray-400">
                                <span>{currentAssetDisplayData.market}</span> <span className="mx-1">&middot;</span> <span>Price in USD</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 text-right whitespace-nowrap">
                        {ICONS.Clock}
                        {currentAssetDisplayData.status}
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row justify-between items-start mt-3">
                    <div className="w-full xl:w-auto mb-4 xl:mb-0">
                        <div>
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{currentAssetDisplayData.currentPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className={`${currentAssetDisplayData.isPositiveChange ? 'text-green-400' : 'text-red-400'} ml-2 text-base sm:text-lg`}>
                                {currentAssetDisplayData.isPositiveChange ? '+' : ''}{currentAssetDisplayData.priceChangeValue.toFixed(2)} ({currentAssetDisplayData.isPositiveChange ? '+' : ''}{currentAssetDisplayData.priceChangePercent.toFixed(2)}%)
                                {currentAssetDisplayData.isPositiveChange ? '▲' : '▼'}
                            </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400 mt-1">
                            After closing:
                            <span className={`${currentAssetDisplayData.isPositiveAfterClosingChange ? 'text-green-400' : 'text-red-400'}`}>
                                {currentAssetDisplayData.afterClosingPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                {currentAssetDisplayData.isPositiveAfterClosingChange ? '+' : ''}{currentAssetDisplayData.afterClosingChangeValue.toFixed(2)} ({currentAssetDisplayData.isPositiveAfterClosingChange ? '+' : ''}{currentAssetDisplayData.afterClosingChangePercent.toFixed(2)}%)
                                {currentAssetDisplayData.isPositiveAfterClosingChange ? '▲' : '▼'}
                            </span>
                        </div>
                    </div>
                    <div className="w-full xl:w-auto flex flex-col md:flex-row md:items-start md:justify-end">
                        <div className="flex flex-col sm:flex-row md:flex-col gap-x-4 sm:gap-x-8 gap-y-2 text-left sm:text-left md:text-right mb-4 md:mb-0 md:mr-6">
                            <div className="text-xs sm:text-sm text-gray-400">
                                <div>Price range as of {currentAssetDisplayData.priceRangeDate}</div>
                                <div className="text-white text-sm sm:text-base">{currentAssetDisplayData.priceRangeLow.toFixed(2)} <span className="text-gray-500 mx-1">-</span> {currentAssetDisplayData.priceRangeHigh.toFixed(2)}</div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400">
                                <div>Closing of the previous day</div>
                                <div className="text-white text-sm sm:text-base">{currentAssetDisplayData.previousClose.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Encabezado del Gráfico */}
            <div className="flex flex-wrap justify-between items-center mb-2 flex-shrink-0">
                <div className="text-white text-sm sm:text-base">
                    <span className="font-semibold">{currentAssetDisplayData.name}</span>
                    <span className={`${currentAssetDisplayData.isPositiveChange ? 'text-green-400' : 'text-red-400'} ml-1 sm:ml-2`}>
                        {currentAssetDisplayData.currentPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {currentAssetDisplayData.isPositiveChange ? '+' : ''}{currentAssetDisplayData.priceChangeValue.toFixed(2)} ({currentAssetDisplayData.isPositiveChange ? '+' : ''}{currentAssetDisplayData.priceChangePercent.toFixed(2)}%)
                    </span>
                </div>
                <span className="text-xs sm:text-sm text-gray-400">Streaming chart</span>
            </div>

            {/* Selector de Rango de Tiempo y Tipo de Gráfico */}
            <div className="flex flex-wrap space-x-1 sm:space-x-2 mb-4 items-center flex-shrink-0">
                <button title="Candlestick chart" onClick={() => handleChartTypeChange('candlestick')} className={`p-1 sm:p-1.5 rounded-md transition-colors ${currentChartType === 'candlestick' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}>
                    {ICONS.CandlestickIcon}
                </button>
                <button title="Line chart" onClick={() => handleChartTypeChange('line')} className={`p-1 sm:p-1.5 rounded-md transition-colors ${currentChartType === 'line' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}>
                    {ICONS.LineChartIcon}
                </button>
                <span className="text-gray-700 mx-1">|</span>
                {timeRanges.map(range => (
                    <button
                        key={range}
                        onClick={() => handleTimeRangeChange(range)}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm rounded-md transition-colors ${currentSelectedTimeRange === range ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}
                    >
                        {range}
                    </button>
                ))}
                <span className="text-gray-700 mx-1">|</span>
                <button title="Fullscreen" className="p-1 sm:p-1.5 rounded-md hover:bg-gray-700 transition-colors text-gray-400">
                    {ICONS.FullscreenIcon}
                </button>
            </div>

            {/* Área de Visualización del Gráfico */}
            <div className="bg-gray-800 p-0 rounded-lg flex-grow min-h-0">
                <div className="asset-chart-canvas-container">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500 flex-shrink-0">
                <p>Los datos mostrados son únicamente con fines ilustrativos y no representan información financiera en tiempo real.</p>
            </div>
        </div>
    );
};

export default AssetDetailChart;
