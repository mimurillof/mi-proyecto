import React, { useEffect, useRef, useState } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables'; // Asegúrate de instalar tabulator-tables y @types/tabulator-tables
import 'tabulator-tables/dist/css/tabulator_modern.min.css'; // Importa el CSS del tema

// Datos de ejemplo para la tabla (con campo 'domain' añadido)
const tableData = [
    { id: 1, nombre: "Apple Inc.", ticker: "AAPL", cantidad: 150, valorActual: 25500.75, porcentajePortafolio: 15.50, rendimientoPeriodo: 5.20, contribucionRetorno: 0.81, domain: "apple.com" },
    { id: 2, nombre: "Microsoft Corp.", ticker: "MSFT", cantidad: 100, valorActual: 30100.50, porcentajePortafolio: 18.25, rendimientoPeriodo: 7.10, contribucionRetorno: 1.30, domain: "microsoft.com" },
    { id: 3, nombre: "Amazon.com, Inc.", ticker: "AMZN", cantidad: 50, valorActual: 15000.00, porcentajePortafolio: 9.10, rendimientoPeriodo: -1.50, contribucionRetorno: -0.14, domain: "amazon.com" },
    { id: 4, nombre: "Alphabet Inc. (Class A)", ticker: "GOOGL", cantidad: 25, valorActual: 68750.00, porcentajePortafolio: 41.70, rendimientoPeriodo: 8.00, contribucionRetorno: 3.34, domain: "google.com" },
    { id: 5, nombre: "Tesla, Inc.", ticker: "TSLA", cantidad: 30, valorActual: 21000.00, porcentajePortafolio: 12.73, rendimientoPeriodo: 15.30, contribucionRetorno: 1.95, domain: "tesla.com" },
    { id: 6, nombre: "Meta Platforms, Inc.", ticker: "META", cantidad: 75, valorActual: 18750.25, porcentajePortafolio: 11.37, rendimientoPeriodo: 2.10, contribucionRetorno: 0.24, domain: "meta.com" },
    { id: 7, nombre: "NVIDIA Corporation", ticker: "NVDA", cantidad: 40, valorActual: 24000.00, porcentajePortafolio: 14.55, rendimientoPeriodo: 25.50, contribucionRetorno: 3.71, domain: "nvidia.com" },
    { id: 8, nombre: "Berkshire Hathaway Inc. (Class B)", ticker: "BRK.B", cantidad: 60, valorActual: 19800.00, porcentajePortafolio: 12.00, rendimientoPeriodo: 3.00, contribucionRetorno: 0.36, domain: "berkshirehathaway.com" },
    { id: 9, nombre: "JPMorgan Chase & Co.", ticker: "JPM", cantidad: 120, valorActual: 16800.00, porcentajePortafolio: 10.18, rendimientoPeriodo: 1.80, contribucionRetorno: 0.18, domain: "jpmorganchase.com" },
    { id: 10, nombre: "Johnson & Johnson", ticker: "JNJ", cantidad: 90, valorActual: 15300.00, porcentajePortafolio: 9.27, rendimientoPeriodo: -0.50, contribucionRetorno: -0.05, domain: "jnj.com" },
    { id: 11, nombre: "Visa Inc.", ticker: "V", cantidad: 80, valorActual: 17600.00, porcentajePortafolio: 10.67, rendimientoPeriodo: 4.50, contribucionRetorno: 0.48, domain: "visa.com" },
    { id: 12, nombre: "Procter & Gamble Co.", ticker: "PG", cantidad: 110, valorActual: 16500.00, porcentajePortafolio: 10.00, rendimientoPeriodo: 1.20, contribucionRetorno: 0.12, domain: "pg.com" },
];

// Formateadores (se pueden definir fuera si no usan props/state)
const moneyFormatter = (cell: Tabulator.CellComponent) => {
    let value = cell.getValue();
    if (value === null || value === undefined) return "";
    return "$" + parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const percentageFormatter = (cell: Tabulator.CellComponent) => {
    let value = cell.getValue();
    if (value === null || value === undefined) return "";
    return parseFloat(value).toFixed(2) + "%";
};

const performanceFormatter = (cell: Tabulator.CellComponent) => {
    let value = cell.getValue();
    if (value === null || value === undefined) return "";
    const formattedValue = parseFloat(value).toFixed(2) + "%";
    const cellElement = cell.getElement();
    if (value > 0) {
        cellElement.style.color = "#10b981"; // Tailwind green-500
    } else if (value < 0) {
        cellElement.style.color = "#ef4444"; // Tailwind red-500
    } else {
        cellElement.style.color = "#6b7280"; // Tailwind gray-500
    }
    // Asegurar alineación vertical (puede que no sea necesario con el tema moderno)
    cellElement.style.verticalAlign = 'middle';
    return formattedValue;
};

const nameAndLogoFormatter = (cell: Tabulator.CellComponent) => {
    const data = cell.getRow().getData();
    const name = data.nombre;
    const domain = data.domain;
    let logoHtml = '';

    if (domain) {
        const logoUrl = `https://logo.clearbit.com/${domain}`;
        // Usamos clases de Tailwind para estilizar el logo y el contenedor
        logoHtml = `<img src="${logoUrl}" alt="" class="h-5 w-5 mr-2 inline-block align-middle rounded bg-gray-100" onerror="this.style.display='none'; this.onerror=null;">`;
    }

    // Contenedor span para asegurar alineación
    return `<span class="inline-flex items-center">${logoHtml}<span class="align-middle">${name}</span></span>`;
};


const AssetDetailTable: React.FC = () => {
    const tableRef = useRef<HTMLDivElement | null>(null);
    const tabulatorInstanceRef = useRef<Tabulator | null>(null);
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        if (tableRef.current) {
            tabulatorInstanceRef.current = new Tabulator(tableRef.current, {
                data: tableData,
                height: "400px", // Ajustar altura según sea necesario dentro del widget
                layout: "fitColumns",
                responsiveLayout: "hide",
                columns: [
                    { title: "Nombre", field: "nombre", sorter: "string", widthGrow: 2.5, hozAlign:"left", frozen:true, minWidth: 200, formatter: nameAndLogoFormatter, headerSortTristate: true },
                    { title: "Ticker", field: "ticker", sorter: "string", hozAlign:"left", width: 90, headerSortTristate: true },
                    { title: "Cantidad", field: "cantidad", sorter: "number", hozAlign:"right", minWidth: 80, headerSortTristate: true },
                    { title: "Valor Actual", field: "valorActual", sorter: "number", hozAlign:"right", formatter: moneyFormatter, minWidth: 120, headerSortTristate: true },
                    { title: "% Portafolio", field: "porcentajePortafolio", sorter: "number", hozAlign:"right", formatter: percentageFormatter, minWidth: 110, headerSortTristate: true },
                    { title: "Rend. Período", field: "rendimientoPeriodo", sorter: "number", hozAlign:"right", formatter: performanceFormatter, minWidth: 110, headerSortTristate: true },
                    { title: "Contrib. Retorno", field: "contribucionRetorno", sorter: "number", hozAlign:"right", formatter: performanceFormatter, minWidth: 120, headerSortTristate: true }
                ],
                // Aplicar estilos similares a los del HTML original usando opciones de Tabulator y/o clases globales si es necesario
                // Nota: El tema 'modern' ya aplica muchos estilos. Ajustes finos pueden requerir CSS adicional.
                // Por ejemplo, para el hover, el tema moderno ya tiene un efecto.
                // Para zebra striping, podrías añadir una clase CSS global o usar CSS Modules si prefieres.
            });
        }

        // Cleanup function to destroy the table instance
        return () => {
            tabulatorInstanceRef.current?.destroy();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Effect for filtering
    useEffect(() => {
        const filterTerm = filterValue.toLowerCase();
        if (tabulatorInstanceRef.current) {
            if (filterTerm === "") {
                tabulatorInstanceRef.current.clearFilter();
            } else {
                tabulatorInstanceRef.current.setFilter([
                    [
                        { field: "nombre", type: "like", value: filterTerm },
                        { field: "ticker", type: "like", value: filterTerm }
                    ]
                ]);
            }
        }
    }, [filterValue]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    return (
        <div className="p-1 sm:p-2"> {/* Añadido padding aquí en lugar del widget padre */}
            {/* Campo de Filtro */}
            <div className="mb-4">
                <input
                    type="text"
                    value={filterValue}
                    onChange={handleFilterChange}
                    placeholder="🔍 Filtrar por Nombre o Ticker..."
                    className="p-2 border border-gray-300 rounded-md w-full md:w-1/2 lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            {/* Contenedor para la Tabla Tabulator */}
            {/* Aplicar estilos de borde y redondeo directamente aquí si es necesario */}
            <div ref={tableRef} className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm"></div>

            {/* Disclaimer (Opcional, si se quiere mantener) */}
            {/*
            <p className="text-xs sm:text-sm text-gray-500 mt-4 italic">
                Nota: Los datos son de ejemplo.
            </p>
            */}
        </div>
    );
};

export default AssetDetailTable;
