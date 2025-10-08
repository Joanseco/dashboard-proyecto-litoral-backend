// 📁 routes/analytics.js
const express = require('express');
const router = express.Router();

// ✅ Productos más vendidos
router.get('/analytics/top-products', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const result = await db.query(`
      SELECT p.name, COUNT(s.id) AS ventas
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE s.status = 'Completada'
      GROUP BY p.name
      ORDER BY ventas DESC
      LIMIT 6
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en /analytics/top-products:', error);
    res.status(500).json({ message: 'Error al obtener productos más vendidos' });
  }
});

// ✅ Estadísticas reales del dashboard
router.get('/stats', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const usersResult = await db.query('SELECT COUNT(*) AS total_users FROM users');
    const salesResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_sales,
             COUNT(*) AS total_orders
      FROM sales
      WHERE status = 'Completada'
    `);

    res.json({
      totalUsers: parseInt(usersResult.rows[0].total_users) || 0,
      totalSales: parseFloat(salesResult.rows[0].total_sales) || 0,
      totalOrders: parseInt(salesResult.rows[0].total_orders) || 0
    });
  } catch (error) {
    console.error('❌ Error en /stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

// ✅ Datos de gráfico de ventas (mock)
router.get('/analytics/sales-data', async (req, res) => {
  const mockSalesData = [
    { name: 'Ene', ventas: 4000, usuarios: 2400 },
    { name: 'Feb', ventas: 3000, usuarios: 1398 },
    { name: 'Mar', ventas: 2000, usuarios: 9800 },
    { name: 'Abr', ventas: 2780, usuarios: 3908 },
    { name: 'May', ventas: 1890, usuarios: 4800 },
    { name: 'Jun', ventas: 2390, usuarios: 3800 },
    { name: 'Jul', ventas: 3490, usuarios: 4300 },
  ];
  res.json(mockSalesData);
});

// ✅ Datos del gráfico de dispositivos (mock)
router.get('/analytics/pie-data', async (req, res) => {
  const mockPieData = [
    { name: 'Desktop', value: 400, color: '#8b5cf6' },
    { name: 'Mobile', value: 300, color: '#06b6d4' },
    { name: 'Tablet', value: 200, color: '#10b981' },
    { name: 'Otros', value: 100, color: '#f59e0b' },
  ];
  res.json(mockPieData);
});

// ✅ Actividad reciente
router.get('/analytics/activity', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const result = await db.query(`
      SELECT 
        ra.id, 
        u.name AS user, 
        ra.description AS action, 
        ra.amount, 
        ra.activity_time
      FROM recentactivity ra
      LEFT JOIN users u ON ra.user_id = u.id
      ORDER BY ra.activity_time DESC
      LIMIT 10
    `);

    const formattedActivity = result.rows.map(item => ({
      id: item.id,
      user: item.user || 'Sistema',
      action: item.action,
      amount: item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : null,
      time: 'Justo ahora'
    }));

    res.json(formattedActivity);
  } catch (error) {
    console.error('❌ Error en /analytics/activity:', error);
    res.status(500).json({ message: 'Error al obtener actividad reciente' });
  }
});

module.exports = router;
