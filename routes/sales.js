const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Obtener todas las ventas
  router.get('/sales', async (req, res) => {
    try {
      const query = `
        SELECT 
          S.id, 
          P.name AS product, 
          U.name AS customer, 
          U.email AS customer_email,
          S.amount,
          DATE_FORMAT(S.sale_date, '%Y-%m-%d') AS date
        FROM Sales S
        JOIN Products P ON S.product_id = P.id
        JOIN Users U ON S.customer_id = U.id
        ORDER BY S.sale_date DESC
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor al obtener ventas' });
    }
  });

  return router;
};
