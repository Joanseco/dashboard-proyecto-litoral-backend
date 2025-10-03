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
      // Hash de contraseña (en producción usa bcrypt, aquí solo para ejemplo)
      const password_hash = password; // Reemplaza por bcrypt.hashSync(password, 10) si tienes bcrypt
      const joined_date = new Date().toISOString().slice(0, 10);
      const query = 'INSERT INTO Users (name, email, password_hash, role, status, joined_date) VALUES (?, ?, ?, ?, ?, ?)';
      await db.query(query, [name, email, password_hash, role, status, joined_date]);
      res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'El email ya está registrado.' });
      }
      res.status(500).json({ message: 'Error al crear usuario' });
    }
  });

  // Obtener todos los usuarios (incluyendo status)
  router.get('/users', async (req, res) => {
    try {
      const query = 'SELECT id, name, email, role, status, joined_date FROM Users ORDER BY joined_date DESC';
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor al obtener usuarios' });
    }
  });

  // Editar usuario (incluyendo status)
  router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    if (!name || !email || !role || !status) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    try {
      const query = 'UPDATE Users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?';
      await db.query(query, [name, email, role, status, id]);
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario' });
    }
  });

  // Eliminar usuario
  router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const query = 'DELETE FROM Users WHERE id = ?';
      await db.query(query, [id]);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      // Error de clave foránea (MySQL: ER_ROW_IS_REFERENCED_2)
      if (error && error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ message: 'Este usuario realizó una compra y no puede ser eliminado.' });
      }
      res.status(500).json({ message: 'Error al eliminar usuario' });
    }
  });

  return router;
};
