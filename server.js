require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./database');

const app = express();
const PORT = process.env.API_PORT || 5000;

let db;

app.use(cors());
app.use(express.json());

// Inicializar el Servidor y cargar rutas modularizadas
async function startServer() {
    try {
        db = await connectToDatabase();
        app.use('/api', require('./routes/users')(db));
        app.use('/api', require('./routes/products')(db));
        app.use('/api', require('./routes/sales')(db));
        app.use('/api', require('./routes/analytics')(db));
        app.get('/', (req, res) => {
            res.send(`API de Dashboard funcionando en el puerto ${PORT}`);
        });
        app.listen(PORT, () => {
            console.log(`📡 Servidor Express escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();