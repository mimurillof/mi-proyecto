// backend/db.js
const { Pool } = require('pg');

// Configura tus credenciales de base de datos
// Es mejor usar variables de entorno para esto en producción
const pool = new Pool({
  user: process.env.DB_USER || 'tu_usuario_db', // Ejemplo: 'postgres'
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tu_base_de_datos', // Ejemplo: 'mi_proyecto_db'
  password: process.env.DB_PASSWORD || 'tu_contraseña_db', // Ejemplo: 'admin'
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
