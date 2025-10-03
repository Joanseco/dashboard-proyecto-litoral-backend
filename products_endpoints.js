// Endpoints para editar y eliminar productos

// Editar producto
app.put('/api/products/:id', async (req, res) => {
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
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM Products WHERE id = ?';
        await db.query(query, [id]);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
});
