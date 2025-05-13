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
    tax_id_number,
    tax_id_country,
    residential_address,
    about_me,
    birth_date,
    id_expedition_date
  } = req.body; // Datos enviados desde el frontend

  if (isNaN(parseInt(userId))) {
    return res.status(400).json({ error: 'User ID inválido.' });
  }

  // Aquí deberías añadir validación para los datos recibidos en req.body

  try {
    const updateProfileQuery = `
      UPDATE user_profiles
      SET 
        first_name = $1,
        last_name = $2,
        avatar_url = $3,
        mobile_number = $4,
        gender = $5,
        tax_id_number = $6,
        tax_id_country = $7,
        residential_address = $8,
        about_me = $9,
        birth_date = $10,
        id_expedition_date = $11
      WHERE user_id = $12
      RETURNING *;
    `;

    const values = [
      first_name,
      last_name,
      avatar_url,
      mobile_number,
      gender,
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
      return res.status(404).json({ error: 'Perfil de usuario no encontrado para actualizar o sin cambios.' });
    }

    res.json({ message: 'Perfil actualizado exitosamente.', profile: rows[0] });
  } catch (err) {
    console.error('Error al actualizar el perfil del usuario:', err);
    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({ error: 'El usuario especificado no existe.' });
    }
    if (err.code === '22P02' && err.routine === 'enum_in') { // Invalid enum value
        return res.status(400).json({ error: 'Valor inválido para el campo gender.' });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- Endpoint para OBTENER la configuración de notificaciones de un usuario ---
// GET /api/users/:userId/notifications
router.get('/:userId/notifications', async (req, res) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    return res.status(400).json({ error: 'User ID inválido.' });
  }

  try {
    const query = 'SELECT * FROM user_notification_settings WHERE user_id = $1;';
    const { rows } = await db.query(query, [userId]);

    if (rows.length === 0) {
      return res.json({
        price_limit_notifications: true,
        new_report_notifications: false,
        important_news_notifications: true,
        event_notifications: false,
        app_notifications: true,
        email_notifications: true,
        browser_notifications: false,
        google_sync_enabled: true,
        linkedin_sync_enabled: false,
        facebook_sync_enabled: false,
      });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener la configuración de notificaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- Endpoint para ACTUALIZAR la configuración de notificaciones de un usuario ---
// PUT /api/users/:userId/notifications
router.put('/:userId/notifications', async (req, res) => {
  const { userId } = req.params;
  const {
    price_limit_notifications,
    new_report_notifications,
    important_news_notifications,
    event_notifications,
    app_notifications,
    email_notifications,
    browser_notifications,
    google_sync_enabled,
    linkedin_sync_enabled,
    facebook_sync_enabled
  } = req.body;

  if (isNaN(parseInt(userId))) {
    return res.status(400).json({ error: 'User ID inválido.' });
  }

  try {
    const upsertQuery = `
      INSERT INTO user_notification_settings (
        user_id, 
        price_limit_notifications, 
        new_report_notifications, 
        important_news_notifications, 
        event_notifications, 
        app_notifications, 
        email_notifications, 
        browser_notifications, 
        google_sync_enabled, 
        linkedin_sync_enabled, 
        facebook_sync_enabled
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (user_id) DO UPDATE SET
        price_limit_notifications = EXCLUDED.price_limit_notifications,
        new_report_notifications = EXCLUDED.new_report_notifications,
        important_news_notifications = EXCLUDED.important_news_notifications,
        event_notifications = EXCLUDED.event_notifications,
        app_notifications = EXCLUDED.app_notifications,
        email_notifications = EXCLUDED.email_notifications,
        browser_notifications = EXCLUDED.browser_notifications,
        google_sync_enabled = EXCLUDED.google_sync_enabled,
        linkedin_sync_enabled = EXCLUDED.linkedin_sync_enabled,
        facebook_sync_enabled = EXCLUDED.facebook_sync_enabled
      RETURNING *;
    `;
    const values = [
      userId,
      price_limit_notifications,
      new_report_notifications,
      important_news_notifications,
      event_notifications,
      app_notifications,
      email_notifications,
      browser_notifications,
      google_sync_enabled,
      linkedin_sync_enabled,
      facebook_sync_enabled
    ];

    const { rows } = await db.query(upsertQuery, values);
    res.json({ message: 'Configuración de notificaciones actualizada exitosamente.', settings: rows[0] });
  } catch (err) {
    console.error('Error al actualizar la configuración de notificaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
