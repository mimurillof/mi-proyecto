import React, { useRef, useEffect } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { portfolioData, backgroundColors } from '../../../data/portfolioCompositionData';

// Registrar los componentes necesarios de Chart.js
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const PortfolioCompositionChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Destruir instancia anterior si existe
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                // Preparar datos para Chart.js
                const labels = portfolioData.map(item => item.claseActivo);
                const percentages = portfolioData.map(item => item.porcentaje * 100); // Convertir a %
                const nominalValues = portfolioData.map(item => item.valorNominal);

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Composición del Portafolio',
                            data: percentages,
                            backgroundColor: backgroundColors.slice(0, portfolioData.length),
                            borderColor: '#ffffff',
                            borderWidth: 2,
                            // Pasar datos adicionales para tooltips
                            nominalValues: nominalValues,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 15, // Ajustar padding
                                    boxWidth: 12,
                                    usePointStyle: true,
                                }
                            },
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleFont: { size: 14 },
                                bodyFont: { size: 12 },
                                padding: 10,
                                boxPadding: 4,
                                callbacks: {
                                    label: function(context: any) {
                                        const label = context.label || '';
                                        const dataset = context.dataset;
                                        const dataIndex = context.dataIndex;

                                        const percentageValue = dataset.data[dataIndex];
                                        const nominalValue = dataset.nominalValues[dataIndex];

                                        const formattedPercentage = percentageValue.toFixed(1) + '%';
                                        const formattedNominal = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(nominalValue);

                                        return `${label}: ${formattedPercentage} (${formattedNominal})`;
                                    }
                                }
                            }
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        }
                    }
                });
            }
        }

        // Cleanup
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, []); // Ejecutar solo una vez al montar

    return (
        <div className="w-full h-full p-4 flex flex-col items-center">
             <h2 className="text-md font-semibold text-gray-700 mb-3 text-center">
                Composición Actual del Portafolio
            </h2>
            {/* Contenedor para el canvas con altura relativa/absoluta */}
            <div className="relative flex-grow w-full max-w-md"> {/* Limitar ancho máximo si es necesario */}
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default PortfolioCompositionChart;
