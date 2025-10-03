const mysql = require('mysql2/promise');

async function connectToDatabase() {
    try {
        const pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('✅ Conexión a MySQL establecida correctamente.');
        return pool; // Retorna el pool
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        // Lanza el error o permite que el código que llama maneje la salida
        throw error; 
    }
}

module.exports = { connectToDatabase };