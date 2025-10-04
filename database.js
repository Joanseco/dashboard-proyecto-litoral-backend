const { Pool } = require('pg');

async function connectToDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL.');
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error.message);
    throw error;
  }
}

module.exports = { connectToDatabase };
