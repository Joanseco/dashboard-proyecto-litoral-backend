const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Productos más vendidos
  router.get('/analytics/top-products', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT P.name, COUNT(S.id) AS ventas
        FROM Sales S
        JOIN Products P ON S.product_id = P.id
        WHERE S.status = 'Completada'
        GROUP BY S.product_id
        ORDER BY ventas DESC
        LIMIT 6
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener productos más vendidos' });
    }
  });

  // Estadísticas reales para dashboard
  router.get('/stats', async (req, res) => {
    try {
      const [users] = await db.query('SELECT COUNT(*) AS totalUsers FROM Users');
      const [sales] = await db.query('SELECT SUM(amount) AS totalSales, COUNT(*) AS totalOrders FROM Sales WHERE status = "Completada"');
      res.json({
        totalUsers: users[0].totalUsers || 0,
        totalSales: sales[0].totalSales || 0,
        totalOrders: sales[0].totalOrders || 0
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
  });

  // Datos de gráfico de ventas (dummy)
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

  // Datos de gráfico de dispositivos (dummy)
  router.get('/analytics/pie-data', async (req, res) => {
    const mockPieData = [
      { name: 'Desktop', value: 400, color: '#8b5cf6' },
      { name: 'Mobile', value: 300, color: '#06b6d4' },
      { name: 'Tablet', value: 200, color: '#10b981' },
      { name: 'Otros', value: 100, color: '#f59e0b' },
    ];
    res.json(mockPieData);
  });

  // Actividad reciente
  router.get('/analytics/activity', async (req, res) => {
    try {
      const query = `
        SELECT 
          RA.id, 
          U.name AS user, 
          RA.description AS action, 
          RA.amount, 
          RA.activity_time
        FROM RecentActivity RA
        LEFT JOIN Users U ON RA.user_id = U.id
        ORDER BY RA.activity_time DESC
        LIMIT 10
      `;
      const [rows] = await db.query(query);
      const formattedActivity = rows.map(item => ({
        id: item.id,
        user: item.user || 'Sistema',
        action: item.action,
        amount: item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : null,
        time: 'Justo ahora'
      }));
      res.json(formattedActivity);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener actividad reciente' });
    }
  });

  return router;
};
