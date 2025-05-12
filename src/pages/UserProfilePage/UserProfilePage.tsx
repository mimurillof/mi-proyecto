import React from 'react';
import './UserProfilePage.css'; // Importar los estilos específicos

const UserProfilePage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex items-start justify-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8"> {/* Añadido padding horizontal px-* */}
      <div className="profile-card p-6 sm:p-8 min-h-[80vh]"> {/* Añadida min-h-[80vh] */}
          
          {/* Estructura principal: Imagen a la izquierda, contenido a la derecha */}
          <div className="flex flex-col sm:flex-row items-start">
            
            {/* Columna de la Imagen */}
            <div className="mb-6 sm:mb-0 sm:mr-8 flex-shrink-0"> {/* Margen inferior para vista móvil, margen derecho para vista desktop */}
              <img 
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-sky-100"
                src="https://via.placeholder.com/150" // Idealmente, esta URL vendría de props o estado
                alt="Foto de Perfil"
              />
            </div>
            
            {/* Columna de Contenido Principal (Título, Info, Acerca de mí) */}
            <div className="flex-grow w-full"> {/* flex-grow para ocupar espacio, w-full para stack en móvil */}
              <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 mb-6 text-center sm:text-left">Perfil de Usuario</h1> {/* Margen inferior ajustado */}

              {/* Información Personal en dos columnas */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-8"> {/* Margen inferior para separar de "Acerca de mí" */}
                <div>
                  <label className="info-label block text-base">Nombre:</label>
                  <p className="info-value text-base">Miguel Ángel</p>
                </div>
                <div>
                  <label className="info-label block text-base">Apellidos:</label>
                  <p className="info-value text-base">Murillo</p>
                </div>
                <div>
                  <label className="info-label block text-base">Email:</label>
                  <p className="info-value text-base">miguel.murillo@example.com</p>
                </div>
                <div>
                  <label className="info-label block text-base">Móvil:</label>
                  <p className="info-value text-base">+57 300 123 4567</p>
                </div>
                <div>
                  <label className="info-label block text-base">Género:</label>
                  <p className="info-value text-base">Masculino</p>
                </div>
                <div>
                  <label className="info-label block text-base">País:</label>
                  <p className="info-value text-base">Colombia</p>
                </div>
                <div className="md:col-span-2">
                  <label className="info-label block text-base">ID (Número de Identificación):</label>
                  <p className="info-value text-base">1020XXXXXX</p>
                </div>
              </div>

              {/* Sección "Acerca de mí" */}
              <div> {/* Eliminado mt-8, el espaciado vendrá del mb-8 de la sección anterior */}
                <label className="info-label block text-base mb-2">Acerca de mí:</label>
                <p className="info-value text-base leading-relaxed min-h-48 text-left"> {/* Cambiado min-h-32 a min-h-48 */}
                  Estudiante de Ciencia de Datos y Desarrollo de Software, apasionado por la tecnología, la estadística y los juegos de estrategia. Siempre buscando aprender y aplicar nuevos conocimientos en proyectos innovadores.
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default UserProfilePage;