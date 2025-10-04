const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Crear usuario
  router.post('/users', async (req, res) => {
    const { name, email, password, role, status } = req.body;
    if (!name || !email || !password || !role || !status) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
      // Hash de contraseña (ejemplo; usa bcrypt en producción)
      const password_hash = password;
      const joined_date = new Date().toISOString().slice(0, 10);

      const query = `
        INSERT INTO users (name, email, password_hash, role, status, joined_date)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await db.query(query, [name, email, password_hash, role, status, joined_date]);

      res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation (email duplicado)
        return res.status(400).json({ message: 'El email ya está registrado.' });
      }
      console.error(error);
      res.status(500).json({ message: 'Error al crear usuario' });
    }
  });

  // Obtener todos los usuarios
  router.get('/users', async (req, res) => {
    try {
      const query = `
        SELECT id, name, email, role, status, joined_date
        FROM users
        ORDER BY joined_date DESC
      `;
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor al obtener usuarios' });
    }
  });

  // Editar usuario
  router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    if (!name || !email || !role || !status) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
      const query = `
        UPDATE users
        SET name = $1, email = $2, role = $3, status = $4
        WHERE id = $5
      `;
      await db.query(query, [name, email, role, status, id]);
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar usuario' });
    }
  });

  // Eliminar usuario
  router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      await db.query(query, [id]);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation
        return res.status(400).json({ message: 'Este usuario realizó una compra y no puede ser eliminado.' });
      }
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar usuario' });
    }
  });

  return router;
};
