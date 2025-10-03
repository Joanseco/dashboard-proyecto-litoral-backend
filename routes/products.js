const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Obtener todos los productos
  router.get('/products', async (req, res) => {
    try {
      const query = 'SELECT id, name, price, stock FROM Products ORDER BY created_at DESC';
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener productos' });
    }
  });

  // Crear un producto
  router.post('/products', async (req, res) => {
    const { name, price, stock } = req.body;
    if (!name || !price || stock == null) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    try {
      const query = 'INSERT INTO Products (name, price, stock) VALUES (?, ?, ?)';
      await db.query(query, [name, price, stock]);
      res.status(201).json({ message: 'Producto creado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear producto' });
    }
  });

  // Editar producto
  router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    if (!name || !price || stock == null) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    try {
      const query = 'UPDATE Products SET name = ?, price = ?, stock = ? WHERE id = ?';
      await db.query(query, [name, price, stock, id]);
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar producto' });
    }
  });

  // Eliminar producto
  router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const query = 'DELETE FROM Products WHERE id = ?';
      await db.query(query, [id]);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar producto' });
    }
  });

  return router;
};
