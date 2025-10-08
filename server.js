require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./database.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Inicializar el servidor
async function startServer() {
  try {
    // Conexión a la base de datos
    const db = await connectToDatabase();
    app.locals.db = db; 

    // Cargar rutas (todas sin pasar db manualmente)
    app.use('/api', require('./routes/users'));
    app.use('/api', require('./routes/products'));
    app.use('/api', require('./routes/sales'));
    app.use('/api', require('./routes/analytics'));

    // Ruta base
    app.get('/', (req, res) => {
      res.send(`API de Dashboard funcionando en el puerto ${PORT}`);
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`📡 Servidor Express escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
