import React, { useRef, useEffect, useState } from 'react';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler, // Asegúrate que Filler se importa desde 'chart.js'
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom'; // Importar plugin de zoom
import Hammer from 'hammerjs'; // Importar Hammer.js si es necesario para zoom táctil
import { labels, portfolioValueData, investmentValueData, profitLossData, dataDates, formatDateForInput } from '../../../data/portfolioChartData';
import './PortfolioChart.css'; // Importar los estilos

// Registrar los componentes y plugins necesarios
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler, // Registrar Filler importado desde 'chart.js'
    zoomPlugin // Registrar plugin de zoom
);

const PortfolioChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const [isZoomActive, setIsZoomActive] = useState(false);
    const [visibility, setVisibility] = useState({ 0: true, 1: true, 2: true }); // Visibilidad inicial de datasets

    // Estado para rango de fechas (simplificado)
    const minDate = dataDates[0];
    const maxDate = dataDates[dataDates.length - 1];
    const [startDate, setStartDate] = useState(formatDateForInput(minDate));
    const [endDate, setEndDate] = useState(formatDateForInput(maxDate));
    const [activePreset, setActivePreset] = useState('all');


    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Destruir instancia anterior si existe
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                // Filtrar datos según el rango de fechas actual
                const start = new Date(startDate);
                const end = new Date(endDate);
                const filteredIndices = dataDates
                    .map((date, index) => (date >= start && date <= end ? index : -1))
                    .filter(index => index !== -1);

                const currentLabels = filteredIndices.map(i => labels[i]);
                const currentPortfolioData = filteredIndices.map(i => portfolioValueData[i]);
                const currentInvestmentData = filteredIndices.map(i => investmentValueData[i]);
                const currentProfitLossData = filteredIndices.map(i => profitLossData[i]);


                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: currentLabels,
                        datasets: [
                            {
                                label: 'Valor del Portafolio (€)',
                                data: currentPortfolioData,
                                borderColor: 'rgb(54, 162, 235)',
                                borderWidth: 2,
                                tension: 0.1,
                                fill: {
                                    target: 1, // Rellenar hasta el dataset de inversión
                                    above: 'rgba(75, 192, 192, 0.3)',
                                    below: 'rgba(255, 99, 132, 0.3)'
                                },
                                pointRadius: 3,
                                pointHoverRadius: 6,
                                hidden: !visibility[0], // Aplicar visibilidad
                                order: 1
                            },
                            {
                                label: 'Valor Total Invertido (€)',
                                data: currentInvestmentData,
                                borderColor: 'rgb(255, 159, 64)',
                                borderWidth: 2,
                                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                                tension: 0.1,
                                fill: 'origin', // Rellenar hasta el origen
                                pointRadius: 3,
                                pointHoverRadius: 6,
                                hidden: !visibility[1], // Aplicar visibilidad
                                order: 2
                            },
                             {
                                label: 'Ganancia/Pérdida Total (€)',
                                data: currentProfitLossData,
                                borderColor: 'rgb(153, 102, 255)',
                                borderWidth: 2.5,
                                pointBackgroundColor: (context: any) => {
                                    const value = context.dataset.data[context.dataIndex];
                                    return value >= 0 ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)';
                                },
                                pointRadius: (context: any) => {
                                    const value = Math.abs(context.dataset.data[context.dataIndex]);
                                    return value > 1000 ? 5 : (value > 500 ? 4 : 3);
                                },
                                pointHoverRadius: 7,
                                tension: 0.1,
                                fill: {
                                    target: 'origin',
                                    above: 'rgba(46, 204, 113, 0.2)',
                                    below: 'rgba(231, 76, 60, 0.2)'
                                },
                                hidden: !visibility[2], // Aplicar visibilidad
                                order: 0,
                                yAxisID: 'y1' // Asociar con el segundo eje Y
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false, // Ocultar leyenda por defecto, usar toggles personalizados
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                callbacks: {
                                    label: (context: any) => {
                                        let label = context.dataset.label || '';
                                        if (label) label += ': ';
                                        if (context.parsed.y !== null) {
                                            label += new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                                        }
                                        return label;
                                    },
                                }
                            },
                            zoom: {
                                pan: {
                                    enabled: true,
                                    mode: 'x', // Pan horizontal
                                    onPanStart: () => setIsZoomActive(true),
                                    onPanComplete: () => { /* Podrías querer resetear aquí si no hay zoom */ }
                                },
                                zoom: {
                                    wheel: { enabled: true, speed: 0.1 },
                                    pinch: { enabled: true },
                                    mode: 'x', // Zoom horizontal
                                    onZoomStart: () => setIsZoomActive(true),
                                    onZoomComplete: (context: any) => {
                                        // Comprobar si el nivel de zoom volvió a 1
                                        if (context.chart.getZoomLevel() === 1) {
                                            setIsZoomActive(false);
                                        }
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                ticks: {
                                    callback: (value: any) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
                                },
                                // Ajustar dinámicamente basado en datos visibles
                                suggestedMin: Math.min(...currentPortfolioData, ...currentInvestmentData) * 0.95,
                                suggestedMax: Math.max(...currentPortfolioData, ...currentInvestmentData) * 1.05
                            },
                            y1: { // Segundo eje Y para Ganancia/Pérdida
                                position: 'right',
                                grid: { drawOnChartArea: false },
                                ticks: {
                                    callback: (value: any) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
                                },
                                title: { display: true, text: 'G/P (€)', font: { size: 10 } },
                                suggestedMin: Math.min(...currentProfitLossData) * 1.1,
                                suggestedMax: Math.max(...currentProfitLossData) * 1.1
                            },
                            x: {
                                title: { display: false } // Ocultar título del eje X
                            }
                        },
                        interaction: {
                            mode: 'index',
                            intersect: false
                        }
                    }
                });
            }
        }

        // Cleanup function para destruir el gráfico al desmontar el componente
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [startDate, endDate, visibility]); // Re-renderizar el gráfico si cambian las fechas o la visibilidad

    const handleResetZoom = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resetZoom();
            setIsZoomActive(false);
        }
    };

    const handleVisibilityToggle = (index: number) => {
        setVisibility(prev => ({ ...prev, [index]: !prev[index] }));
    };

     const handleDatePreset = (preset: string) => {
        let newStartDate = minDate;
        let newEndDate = maxDate;
        const end = new Date(maxDate); // Usar la fecha máxima de los datos como referencia

        switch (preset) {
            case '1m':
                newStartDate = new Date(end);
                newStartDate.setMonth(end.getMonth() - 1);
                break;
            case '3m':
                newStartDate = new Date(end);
                newStartDate.setMonth(end.getMonth() - 3);
                break;
            case '6m':
                newStartDate = new Date(end);
                newStartDate.setMonth(end.getMonth() - 6);
                break;
            case 'ytd':
                newStartDate = new Date(end.getFullYear(), 0, 1);
                break;
            case 'all':
            default:
                // Ya están asignadas minDate y maxDate
                break;
        }

        // Asegurarse que la fecha de inicio no sea anterior a la mínima disponible
        if (newStartDate < minDate) {
            newStartDate = minDate;
        }

        setStartDate(formatDateForInput(newStartDate));
        setEndDate(formatDateForInput(end)); // Mantener la fecha final como la máxima
        setActivePreset(preset);
    };


    return (
        <div className="portfolio-chart-container">
            <h3>Rendimiento del Portafolio</h3>

            {/* Controles de Fecha */}
            <div className="chart-controls-row">
                 <label htmlFor="startDate">Desde:</label>
                 <input type="date" id="startDate" value={startDate} onChange={e => { setStartDate(e.target.value); setActivePreset('custom'); }} />
                 <label htmlFor="endDate">Hasta:</label>
                 <input type="date" id="endDate" value={endDate} onChange={e => { setEndDate(e.target.value); setActivePreset('custom'); }} />
                 {/* <button onClick={applyDateRange}>Aplicar</button> */} {/* Aplicar al cambiar */}
            </div>
             <div className="chart-controls-row">
                <button onClick={() => handleDatePreset('1m')} className={activePreset === '1m' ? 'active' : ''}>1M</button>
                <button onClick={() => handleDatePreset('3m')} className={activePreset === '3m' ? 'active' : ''}>3M</button>
                <button onClick={() => handleDatePreset('6m')} className={activePreset === '6m' ? 'active' : ''}>6M</button>
                <button onClick={() => handleDatePreset('ytd')} className={activePreset === 'ytd' ? 'active' : ''}>YTD</button>
                <button onClick={() => handleDatePreset('all')} className={activePreset === 'all' ? 'active' : ''}>Todo</button>
            </div>


            {/* Controles de Visibilidad */}
            <div className="chart-controls-row">
                <div className={`visibility-toggle ${!visibility[0] ? 'hidden' : ''}`} onClick={() => handleVisibilityToggle(0)}>
                    <span className="color-indicator" style={{ backgroundColor: 'rgb(54, 162, 235)' }}></span>
                    <span>Portafolio</span>
                </div>
                <div className={`visibility-toggle ${!visibility[1] ? 'hidden' : ''}`} onClick={() => handleVisibilityToggle(1)}>
                    <span className="color-indicator" style={{ backgroundColor: 'rgb(255, 159, 64)' }}></span>
                    <span>Invertido</span>
                </div>
                 <div className={`visibility-toggle ${!visibility[2] ? 'hidden' : ''}`} onClick={() => handleVisibilityToggle(2)}>
                    <span className="color-indicator" style={{ backgroundColor: 'rgb(153, 102, 255)' }}></span>
                    <span>Ganancia/Pérdida</span>
                </div>
                 {isZoomActive && <span className="zoom-info">Zoom activo</span>}
                 {isZoomActive && <button onClick={handleResetZoom} style={{ marginLeft: '5px', padding: '2px 5px', fontSize: '0.7rem' }}>Reset</button>}
            </div>

            {/* Wrapper para el Canvas */}
            <div className="portfolio-chart-canvas-wrapper">
                <canvas ref={chartRef}></canvas>
                {/* Aquí irían los elementos de resaltado si se implementan */}
            </div>

            {/* Otros controles (Zoom, Resaltado - simplificado) */}
            {/* <div className="chart-controls-row">
                 <button onClick={handleResetZoom}>Reset Zoom</button>
                 <button>Iniciar Resaltado</button>
                 <button>Limpiar Resaltados</button>
            </div> */}
        </div>
    );
};

export default PortfolioChart;

