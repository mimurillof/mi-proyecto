// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa la configuración de la base de datos

// --- Endpoint para OBTENER el perfil de un usuario ---
// GET /api/users/:userId/profile
router.get('/:userId/profile', async (req, res) => {
  const { userId } = req.params;

  // Validar que userId es un número (importante para seguridad y evitar SQL injection si no se usan parámetros)
  if (isNaN(parseInt(userId))) {
    return res.status(400).json({ error: 'User ID inválido.' });
  }

  try {
    // Consulta para obtener datos de users y user_profiles
    // Usamos un JOIN para combinar información de ambas tablas
    const profileQuery = `
      SELECT 
        u.id, 
        u.email, 
        up.first_name, 
        up.last_name, 
        up.avatar_url,
        up.mobile_number,
        up.gender,
        up.id_number,
        up.tax_id_number,
        up.tax_id_country,
        up.residential_address,
        up.about_me,
        up.birth_date,
        up.id_expedition_date
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1;
    `;
    const { rows } = await db.query(profileQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(rows[0]); // Devuelve el perfil del usuario
  } catch (err) {
    console.error('Error al obtener el perfil del usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- Endpoint para ACTUALIZAR el perfil de un usuario ---
// PUT /api/users/:userId/profile
router.put('/:userId/profile', async (req, res) => {
  const { userId } = req.params;
  const {
    first_name,
    last_name,
    avatar_url,
    mobile_number,
    gender,
    id_number,
    tax_id_number,
    tax_id_country,
    residential_address,
    about_me,
    birth_date,
    id_expedition_date
    // No incluimos email aquí, ya que podría tener su propio endpoint/lógica de actualización
  } = req.body; // Datos enviados desde el frontend

  if (isNaN(parseInt(userId))) {
    return res.status(400).json({ error: 'User ID inválido.' });
  }

  // Aquí deberías añadir validación para los datos recibidos en req.body

  try {
    // Primero, verifica si el perfil existe o si necesitas crearlo (INSERT OR UPDATE)
    // Para simplificar, asumimos que el registro en user_profiles se crea cuando se crea el usuario
    // o que se puede manejar con un UPSERT si la lógica lo requiere.
    // Aquí hacemos un UPDATE. Si el user_id no existe en user_profiles, podría fallar o no hacer nada.
    // Una mejor aproximación sería usar un UPSERT (INSERT ... ON CONFLICT ... DO UPDATE)
    // o verificar primero si existe y luego INSERT o UPDATE.

    const updateProfileQuery = `
      UPDATE user_profiles
      SET 
        first_name = $1,
        last_name = $2,
        avatar_url = $3,
        mobile_number = $4,
        gender = $5,
        id_number = $6,
        tax_id_number = $7,
        tax_id_country = $8,
        residential_address = $9,
        about_me = $10,
        birth_date = $11,
        id_expedition_date = $12
        -- updated_at se actualiza automáticamente por el trigger
      WHERE user_id = $13
      RETURNING *; -- Devuelve la fila actualizada
    `;

    const values = [
      first_name,
      last_name,
      avatar_url,
      mobile_number,
      gender,
      id_number,
      tax_id_number,
      tax_id_country,
      residential_address,
      about_me,
      birth_date,
      id_expedition_date,
      userId
    ];

    const { rows, rowCount } = await db.query(updateProfileQuery, values);

    if (rowCount === 0) {
      // Esto podría significar que el user_id no existe en user_profiles
      // O que los datos eran iguales y no hubo actualización (depende de la DB y el trigger)
      // Podrías querer crear el perfil si no existe:
      // const createProfileQuery = `INSERT INTO user_profiles (user_id, first_name, ...) VALUES ($1, $2, ...)`
      // await db.query(createProfileQuery, [userId, first_name, ...]);
      // Y luego re-intentar la consulta de selección o devolver el nuevo perfil.
      // Por ahora, devolvemos un error si no se actualizó nada.
      return res.status(404).json({ error: 'Perfil de usuario no encontrado para actualizar o sin cambios.' });
    }

    res.json({ message: 'Perfil actualizado exitosamente.', profile: rows[0] });
  } catch (err) {
    console.error('Error al actualizar el perfil del usuario:', err);
    // Manejar errores específicos de la base de datos, ej. violación de ENUM
    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({ error: 'El usuario especificado no existe.' });
    }
    if (err.code === '22P02' && err.routine === 'enum_in') { // Invalid enum value
        return res.status(400).json({ error: 'Valor inválido para el campo gender.' });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
