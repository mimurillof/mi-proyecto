export const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Datos modificados para mostrar mayores diferencias entre ganancias y pérdidas
export const portfolioValueData = [10000, 9200, 9800, 11400, 11700, 10600, 11900, 12500, 12100, 11500, 13000, 14000];
export const investmentValueData = [10000, 10000, 10000, 10500, 10500, 10500, 11000, 11000, 11000, 11500, 11500, 11500];

// Calcular la ganancia/pérdida para cada mes
export const profitLossData = portfolioValueData.map((value, index) => {
    return value - investmentValueData[index];
});

// Crear fechas para los datos mensuales (para facilitar el filtrado)
const currentYear = new Date().getFullYear();
export const dataDates = labels.map((month, index) => {
    const monthIndex = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].indexOf(month);
    return new Date(currentYear, monthIndex, 1);
});

// Formatear fechas para los inputs
export function formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
