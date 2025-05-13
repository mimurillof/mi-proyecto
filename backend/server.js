// backend/server.js
const express = require('express');
const cors = require('cors'); // Para permitir peticiones desde tu frontend
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001; // Puerto para el backend

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Para parsear JSON en el body de las peticiones

// Rutas
app.use('/api/users', userRoutes); // Todas las rutas en userRoutes estarán bajo /api/users

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del Perfil de Usuario funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
