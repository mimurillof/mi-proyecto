import React from 'react';
import WatchlistCard from '../watchlist/WatchlistCard'; // Importar el nuevo componente
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importar para MUI

// Crear un tema básico de MUI si aún no tienes uno configurado globalmente
// Puedes personalizarlo según necesites
const theme = createTheme({
  // Aquí puedes añadir personalizaciones del tema si es necesario
  // Por ejemplo, paleta de colores, tipografía, etc.
});

const LowerRightContainer: React.FC = () => {
  return (
    // Eliminar h-64 para que la altura se ajuste al contenedor padre/grid
    <div className="bg-white rounded-lg shadow p-0 overflow-hidden"> 
      {/* ThemeProvider es necesario para que los componentes MUI funcionen correctamente */}
      <ThemeProvider theme={theme}>
         <WatchlistCard /> 
      </ThemeProvider>
    </div>
  );
};

export default LowerRightContainer;
