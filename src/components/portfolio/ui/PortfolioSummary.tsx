import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';
import './PortfolioSummary.css'; // Importar los estilos CSS

Chart.register(...registerables);

interface Activo {
    icono: string;
    nombre: string;
    precio: string;
    rendimientoValor?: string;
    rendimientoPorcentaje?: string;
    esPositivo: boolean;
    tasaRendimiento?: string;
    vencimiento?: string;
    cambioDiaValor?: string;
    cambioDiaPorcentaje?: string;
    dividendoYieldAnual?: string;
}

interface GrupoActivo {
    tipo: string;
    activos: Activo[];
}

const portfolioData: GrupoActivo[] = [
    {
        tipo: "Acciones",
        activos: [
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`, nombre: "Apple Inc. (AAPL)", precio: "$175.50", rendimientoValor: "+$2.50", rendimientoPorcentaje: "+1.40%", esPositivo: true },
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.737 11l-.546 2.727A2.25 2.25 0 009.441 16h5.118a2.25 2.25 0 002.249-2.273L16.263 11M12 16v4m-4-4v4m8-4v4" /></svg>`, nombre: "Tesla Inc. (TSLA)", precio: "$180.20", rendimientoValor: "+$1.15", rendimientoPorcentaje: "+0.64%", esPositivo: true },
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 8v8m-3-5v5m-3-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`, nombre: "Microsoft Corp. (MSFT)", precio: "$420.30", rendimientoValor: "-$1.20", rendimientoPorcentaje: "-0.28%", esPositivo: false }
        ]
    },
    {
        tipo: "Bonos",
        activos: [
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0H5z" /></svg>`, nombre: "Bonos del Tesoro EEUU 10Y", precio: "98.50 (Valor Nominal $100)", tasaRendimiento: "4.25%", vencimiento: "15/05/2034", cambioDiaValor: "-0.05 ptos", cambioDiaPorcentaje: "-0.05%", esPositivo: false }
        ]
    },
    {
        tipo: "Criptomonedas",
        activos: [
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`, nombre: "Ethereum (ETH)", precio: "$3,500.00", rendimientoValor: "+$150.00", rendimientoPorcentaje: "+4.48%", esPositivo: true },
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402-2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`, nombre: "Bitcoin (BTC)", precio: "$65,120.50", rendimientoValor: "+$1,200.75", rendimientoPorcentaje: "+1.88%", esPositivo: true }
        ]
    },
    {
        tipo: "Fondos de Inversión / ETFs",
        activos: [
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>`, nombre: "Fondo Indexado S&P 500 (VOO)", precio: "$450.75", rendimientoValor: "-$5.10", rendimientoPorcentaje: "-1.12%", esPositivo: false }
        ]
    },
    {
        tipo: "Bienes Raíces (REITs)",
        activos: [
            { icono: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`, nombre: "REIT Global Inmobiliario (VNQ)", precio: "$85.60", dividendoYieldAnual: "3.50%", rendimientoValor: "+$0.50", rendimientoPorcentaje: "+0.59%", esPositivo: true }
        ]
    }
];

const datosGrafico = {
    labels: ['Acciones', 'Bonos', 'Bienes Raíces', 'Criptomonedas', 'Fondos/ETFs'], // Ajustado a los tipos de portfolioData
    datasets: [{
        label: 'Distribución del Portafolio',
        data: [40, 20, 15, 15, 10], // Ajustar para que sumen 100% y coincidan con labels
        backgroundColor: [
            'rgba(255, 99, 132, 0.8)',  // Rojo
            'rgba(54, 162, 235, 0.8)', // Azul
            'rgba(75, 192, 192, 0.8)', // Verde Azulado (para Bienes Raíces)
            'rgba(255, 206, 86, 0.8)', // Amarillo (para Cripto)
            'rgba(153, 102, 255, 0.8)' // Púrpura (para Fondos/ETFs)
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 8
    }]
};

const PortfolioSummary: React.FC = () => {
    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({ 0: true });
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    const toggleGroup = (index: number) => {
        setExpandedGroups(prev => ({ ...prev, [index]: !prev[index] }));
    };

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            const configGrafico: ChartConfiguration = {
                type: 'doughnut',
                data: datosGrafico,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 15, boxWidth: 12, font: { size: 11 }, color: '#4A5568' } // text-gray-700
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) label += ': ';
                                    if (context.parsed !== null) label += context.parsed + '%';
                                    return label;
                                }
                            }
                        }
                    }
                }
            };
            chartInstanceRef.current = new Chart(chartRef.current as ChartItem, configGrafico);
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    const getGroupBgColor = (grupo: GrupoActivo): string => {
        let positivos = 0;
        let negativos = 0;
        grupo.activos.forEach(activo => {
            if (activo.esPositivo) positivos++;
            else negativos++;
        });

        if (positivos > 0 && negativos === 0) return 'bg-green-200 hover:bg-green-300';
        if (negativos > 0 && positivos === 0) return 'bg-red-200 hover:bg-red-300';
        if (positivos > 0 || negativos > 0) return 'bg-yellow-200 hover:bg-yellow-300';
        return 'bg-gray-200 hover:bg-gray-300';
    };
    
    const getGroupBorderColor = (grupo: GrupoActivo): string => {
        let positivos = 0;
        let negativos = 0;
        grupo.activos.forEach(activo => {
            if (activo.esPositivo) positivos++;
            else negativos++;
        });

        if (positivos > 0 && negativos === 0) return 'border-green-400';
        if (negativos > 0 && positivos === 0) return 'border-red-400';
        if (positivos > 0 || negativos > 0) return 'border-yellow-400';
        return 'border-gray-300';
    };


    return (
        <div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-xl rounded-lg p-6 h-full overflow-y-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Resumen de Mi Portafolio</h1>

            <div className="flex flex-col gap-6 lg:gap-8">
                {/* Sección Lista de Activos */}
                <div className="w-full">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Mis Activos</h2>
                    <div className="space-y-3">
                        {portfolioData.map((grupo, index) => (
                            <div key={index} className="mb-3">
                                <button
                                    className={`flex justify-between items-center w-full p-3 ${getGroupBgColor(grupo)} rounded-md focus:outline-none transition-colors duration-150 text-gray-700`}
                                    onClick={() => toggleGroup(index)}
                                    aria-expanded={!!expandedGroups[index]}
                                    aria-controls={`grupo-contenido-${index}`}
                                >
                                    <h3 className="text-lg font-semibold">{grupo.tipo}</h3>
                                    <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${expandedGroups[index] ? 'accordion-arrow-rotate' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {expandedGroups[index] && (
                                    <div id={`grupo-contenido-${index}`} className={`mt-2 space-y-2 pl-4 border-l-2 ${getGroupBorderColor(grupo)}`}>
                                        {grupo.activos.map((activo, activoIndex) => {
                                            const rendimientoColor = activo.esPositivo ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
                                            let detallesExtra = '';
                                            if (grupo.tipo === "Bonos") {
                                                detallesExtra = `
                                                    <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tasa Rend: ${activo.tasaRendimiento}</p>
                                                    ${activo.vencimiento ? `<p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Venc: ${activo.vencimiento}</p>` : ''}
                                                `;
                                            } else if (grupo.tipo === "Bienes Raíces (REITs)" && activo.dividendoYieldAnual) {
                                                detallesExtra = `<p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Div. Yield: ${activo.dividendoYieldAnual}</p>`;
                                            }

                                            return (
                                                <div key={activoIndex} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
                                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                                        <div className="flex-shrink-0" dangerouslySetInnerHTML={{ __html: activo.icono }}></div>
                                                        <div>
                                                            <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100">{activo.nombre}</p>
                                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{activo.precio}</p>
                                                            {detallesExtra && <div dangerouslySetInnerHTML={{ __html: detallesExtra }} />}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0 ml-2">
                                                        <p className={`font-semibold text-sm sm:text-base ${rendimientoColor}`}>{grupo.tipo === "Bonos" ? activo.cambioDiaValor : activo.rendimientoValor}</p>
                                                        <p className={`text-xs sm:text-sm ${rendimientoColor}`}>{grupo.tipo === "Bonos" ? activo.cambioDiaPorcentaje : activo.rendimientoPorcentaje}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección Gráfico de Distribución */}
                <div className="w-full mt-8 md:mt-0">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Distribución del Portafolio</h2>
                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg shadow">
                        <div className="summary-chart-container">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-8 text-center">
                Los datos mostrados son únicamente con fines ilustrativos y no representan información financiera en tiempo real.
            </p>
        </div>
    );
};

export default PortfolioSummary;
