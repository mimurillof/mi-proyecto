import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CandlestickController, OhlcController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
import './FinancialPortfolioChart.css'; // Importar los estilos CSS

Chart.register(...registerables, CandlestickController, OhlcController, CandlestickElement, OhlcElement);

// --- DATOS DE EJEMPLO ---
const sampleLineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [{
        label: 'Valor del Portafolio',
        data: [10000, 10200, 10100, 10500, 10300, 10800, 11000],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
    }]
};

const sampleCandlestickData = {
    datasets: [{
        label: 'Variación del Portafolio (OHLC)',
        data: [
            { x: new Date('2023-01-01').valueOf(), o: 10000, h: 10100, l: 9950, c: 10050 },
            { x: new Date('2023-01-02').valueOf(), o: 10050, h: 10250, l: 10000, c: 10200 },
            { x: new Date('2023-01-03').valueOf(), o: 10200, h: 10300, l: 10150, c: 10100 },
            { x: new Date('2023-01-04').valueOf(), o: 10100, h: 10550, l: 10080, c: 10500 },
            { x: new Date('2023-01-05').valueOf(), o: 10500, h: 10600, l: 10250, c: 10300 },
        ],
        color: {
            up: 'rgb(59, 130, 246)',
            down: 'rgb(239, 68, 68)',
            unchanged: 'rgb(156, 163, 175)'
        },
        borderColor: 'rgb(107, 114, 128)'
    }]
};


const FinancialPortfolioChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const loadingIndicatorRef = useRef<HTMLDivElement>(null);
    const customDateRangeDropdownPanelRef = useRef<HTMLDivElement>(null);

    const [chartTitle, setChartTitle] = useState('Rendimiento del Portafolio');
    const [currentChartType, setCurrentChartType] = useState<'line' | 'candlestick'>('line');
    const [currentTimeRange, setCurrentTimeRange] = useState('1M');
    const [isCustomRangePanelOpen, setIsCustomRangePanelOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const showLoading = () => {
        if (loadingIndicatorRef.current) loadingIndicatorRef.current.style.display = 'block';
    };

    const hideLoading = () => {
        if (loadingIndicatorRef.current) loadingIndicatorRef.current.style.display = 'none';
    };

    useEffect(() => {
        const renderChart = () => {
            if (!chartRef.current) return;
            showLoading();

            setTimeout(() => {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                let config: ChartConfiguration;
                let dataToUse;
                const dataMultiplier = Math.random() * 0.1 + 0.95;

                if (currentChartType === 'line') {
                    dataToUse = JSON.parse(JSON.stringify(sampleLineData));
                    dataToUse.datasets[0].data = dataToUse.datasets[0].data.map((d: number) => Math.round(d * dataMultiplier));
                    dataToUse.datasets[0].label = `Valor del Portafolio (${currentTimeRange})`;
                    config = {
                        type: 'line',
                        data: dataToUse,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: { title: { display: true, text: 'Tiempo', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(100, 116, 139, 0.2)' } },
                                y: { title: { display: true, text: 'Valor (USD)', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(100, 116, 139, 0.2)' }, beginAtZero: false }
                            },
                            plugins: {
                                legend: { labels: { color: '#D1D5DB' } },
                                title: { display: false },
                                tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(31, 41, 55, 0.9)', titleColor: '#F3F4F6', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1 }
                            }
                        }
                    };
                } else { // candlestick
                    dataToUse = JSON.parse(JSON.stringify(sampleCandlestickData));
                    dataToUse.datasets[0].data = dataToUse.datasets[0].data.map((d: any) => ({
                        x: d.x, o: Math.round(d.o * dataMultiplier), h: Math.round(d.h * dataMultiplier), l: Math.round(d.l * dataMultiplier), c: Math.round(d.c * dataMultiplier),
                    }));
                    dataToUse.datasets[0].label = `Variación del Portafolio OHLC (${currentTimeRange})`;
                    config = {
                        type: 'candlestick',
                        data: dataToUse,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: { type: 'time', time: { unit: 'day' }, title: { display: true, text: 'Fecha', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(100, 116, 139, 0.2)' } },
                                y: { title: { display: true, text: 'Valor (USD)', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(100, 116, 139, 0.2)' }, beginAtZero: false }
                            },
                            plugins: {
                                legend: { labels: { color: '#D1D5DB' } },
                                title: { display: false },
                                tooltip: {
                                    mode: 'index', intersect: false, backgroundColor: 'rgba(31, 41, 55, 0.9)', titleColor: '#F3F4F6', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1,
                                    callbacks: {
                                        label: (context: any) => {
                                            const datapoint = context.raw;
                                            return [`Fecha: ${new Date(datapoint.x).toLocaleDateString()}`, `Apertura: ${datapoint.o.toLocaleString()}`, `Máximo: ${datapoint.h.toLocaleString()}`, `Mínimo: ${datapoint.l.toLocaleString()}`, `Cierre: ${datapoint.c.toLocaleString()}`];
                                        }
                                    }
                                }
                            }
                        }
                    };
                }
                setChartTitle(`Rendimiento del Portafolio (${currentTimeRange})`);
                chartInstanceRef.current = new Chart(chartRef.current as ChartItem, config);
                hideLoading();
            }, 500);
        };

        renderChart();
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [currentChartType, currentTimeRange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (customDateRangeDropdownPanelRef.current && !customDateRangeDropdownPanelRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('#customDateRangeToggle')) {
                setIsCustomRangePanelOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleChartTypeChange = (type: 'line' | 'candlestick') => {
        setCurrentChartType(type);
    };

    const handleTimeRangeChange = (range: string) => {
        setCurrentTimeRange(range);
        setStartDate('');
        setEndDate('');
        setIsCustomRangePanelOpen(false);
    };

    const toggleCustomDatePanel = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsCustomRangePanelOpen(prev => !prev);
        if (!isCustomRangePanelOpen) { // If opening, deselect predefined ranges
             // This logic is slightly different, active class is managed by currentTimeRange state
        }
    };
    
    const handleApplyCustomDateRange = () => {
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return;
            }
            setCurrentTimeRange(`${startDate} a ${endDate}`);
            setIsCustomRangePanelOpen(false);
        } else {
            alert("Por favor, seleccione una fecha de inicio y una fecha de fin.");
        }
    };

    return (
        <div className="bg-slate-800 shadow-xl rounded-lg p-6 text-gray-300 flex flex-col h-full">
            <header className="mb-4 flex-shrink-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-100">{chartTitle}</h1>
            </header>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 flex-shrink-0">
                {/* Selector de Tipo de Gráfico */}
                <div className="flex items-center space-x-1 p-0.5 bg-slate-700 rounded-md">
                    <button
                        title="Gráfico de Velas"
                        className={`chart-icon-btn p-1.5 rounded-md ${currentChartType === 'candlestick' ? 'active' : ''}`}
                        onClick={() => handleChartTypeChange('candlestick')}
                    >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 5h2v2H7V5zm0 3h2v11H7V8zm3-3h2v5H10V5zm0 6h2v5H10v-5zm3-5h2v2H13V3zm0 3h2v9H13V6z"/></svg>
                    </button>
                    <button
                        title="Gráfico de Línea"
                        className={`chart-icon-btn p-1.5 rounded-md ${currentChartType === 'line' ? 'active' : ''}`}
                        onClick={() => handleChartTypeChange('line')}
                    >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.5l6-6.5 4 4L21 7.5V10h-2V5.5l-6.5 7-4-4L3 15.5z"/></svg>
                    </button>
                </div>
                
                <div className="h-6 w-px bg-slate-600 hidden sm:block"></div>

                {/* Selector de Rango de Tiempo */}
                <div className="flex flex-wrap items-center space-x-1 bg-slate-700 p-1 rounded-md">
                    {['1D', '1S', '1M', '1A', 'Máx'].map(range => (
                        <button
                            key={range}
                            data-range={range === '1S' ? '1W' : (range === 'Máx' ? 'MAX' : range)} // Ajustar '1S' a '1W' y 'Máx' a 'MAX' para la lógica interna
                            className={`time-range-btn-style ${currentTimeRange === (range === '1S' ? '1W' : (range === 'Máx' ? 'MAX' : range)) && !isCustomRangePanelOpen && !(startDate && endDate) ? 'time-range-btn-active' : ''}`}
                            onClick={() => handleTimeRangeChange(range === '1S' ? '1W' : (range === 'Máx' ? 'MAX' : range))}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-slate-600 hidden sm:block"></div>
                
                {/* Botón para Desplegable de Rango Personalizado */}
                <div className="relative">
                    <button
                        id="customDateRangeToggle"
                        onClick={toggleCustomDatePanel}
                        className={`time-range-btn-style flex items-center space-x-1 p-1.5 bg-slate-700 rounded-md hover:bg-slate-600 ${startDate && endDate ? 'time-range-btn-active' : ''}`}
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M1 4c0-.552.448-1 1-1h16c.552 0 1 .448 1 1v12c0 .552-.448 1-1 1H2c-.552 0-1-.448-1-1V4zm2 2v2h14V6H3zm0 4v2h14v-2H3zm0 4v2h14v-2H3z"></path></svg>
                        <span>Personalizado</span>
                    </button>
                    {isCustomRangePanelOpen && (
                        <div ref={customDateRangeDropdownPanelRef} className="date-range-dropdown-panel">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-400">Fecha de Inicio:</label>
                                    <input type="date" id="startDate" name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm rounded-md p-2"/>
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-400">Fecha de Fin:</label>
                                    <input type="date" id="endDate" name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm rounded-md p-2"/>
                                </div>
                            </div>
                            <button onClick={handleApplyCustomDateRange} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm text-sm">Aplicar Rango</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="chart-container bg-slate-800 p-1 md:p-2 rounded-md shadow-inner">
                <div ref={loadingIndicatorRef} className="loader"></div>
                <canvas ref={chartRef}></canvas>
            </div>

            <div className="mt-4 text-xs text-gray-400 overflow-y-auto flex-shrink-0" style={{ maxHeight: '80px' }}>
                <p className="mb-1"><strong>Fuente de los datos:</strong> Datos simulados del portafolio total con fines de demostración...</p>
                <p className="mb-1"><strong>Divisa:</strong> USD (Dólar estadounidense) - Ejemplo.</p>
                <p className="mb-1"><strong>Zona Horaria:</strong> UTC - Ejemplo.</p>
                <hr className="my-2 border-slate-700"/>
                <p className="font-semibold text-red-400"><strong>Advertencia:</strong> El rendimiento pasado no garantiza resultados futuros...</p>
            </div>
        </div>
    );
};

export default FinancialPortfolioChart;
