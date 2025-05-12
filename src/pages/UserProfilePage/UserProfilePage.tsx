import React from 'react';
import './UserProfilePage.css'; // Importar los estilos específicos

const UserProfilePage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto p-0 max-w-4xl"> {/* Ajustado p-0 si el padding ya está en profile-card */}
        <div className="profile-card p-6 sm:p-8">
          
          <h1 className="text-2xl sm:text-3xl font-bold text-sky-700 mb-8 text-center sm:text-left">Perfil de Usuario</h1>

          {/* Sección de Foto de Perfil */}
          <div className="flex flex-col sm:flex-row items-start mb-8">
            <div className="mb-4 sm:mb-0 sm:mr-8 flex-shrink-0">
              <img 
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-sky-100" 
                src="https://via.placeholder.com/150" // Idealmente, esta URL vendría de props o estado
                alt="Foto de Perfil"
              />
            </div>
            
            {/* Información Personal en dos columnas */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <label className="info-label block text-sm">Nombre:</label>
                <p className="info-value text-sm">Miguel Ángel</p> {/* Datos de ejemplo, idealmente de props/estado */}
              </div>
              <div>
                <label className="info-label block text-sm">Apellidos:</label>
                <p className="info-value text-sm">Murillo</p>
              </div>
              <div>
                <label className="info-label block text-sm">Email:</label>
                <p className="info-value text-sm">miguel.murillo@example.com</p>
              </div>
              <div>
                <label className="info-label block text-sm">Móvil:</label>
                <p className="info-value text-sm">+57 300 123 4567</p>
              </div>
              <div>
                <label className="info-label block text-sm">Género:</label>
                <p className="info-value text-sm">Masculino</p>
              </div>
              <div>
                <label className="info-label block text-sm">País:</label>
                <p className="info-value text-sm">Colombia</p>
              </div>
              <div className="md:col-span-2">
                <label className="info-label block text-sm">ID (Número de Identificación):</label>
                <p className="info-value text-sm">1020XXXXXX</p>
              </div>
            </div>
          </div>

          {/* Sección "Acerca de mí" */}
          <div className="mt-8">
            <label className="info-label block text-sm mb-2">Acerca de mí:</label>
            <p className="info-value text-sm leading-relaxed">
              Estudiante de Ciencia de Datos y Desarrollo de Software, apasionado por la tecnología, la estadística y los juegos de estrategia. Siempre buscando aprender y aplicar nuevos conocimientos en proyectos innovadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;