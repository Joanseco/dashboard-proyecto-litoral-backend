const express = require('express');
const router = express.Router();

// ✅ Obtener todas las ventas
router.get('/sales', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const query = `
      SELECT 
        s.id,
        p.name AS product,
        u.name AS customer,
        u.email AS customer_email,
        s.amount,
        TO_CHAR(s.sale_date, 'YYYY-MM-DD') AS date
      FROM sales s
      JOIN products p ON s.product_id = p.id
      JOIN users u ON s.customer_id = u.id
      ORDER BY s.sale_date DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en /sales:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener ventas' });
  }
});

module.exports = router;
