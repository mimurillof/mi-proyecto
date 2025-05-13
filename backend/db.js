// backend/db.js
const { Pool } = require('pg');

// Configura tus credenciales de base de datos
// Es mejor usar variables de entorno para esto en producción
const pool = new Pool({
  user: 'tu_usuario_db',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña_db',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
