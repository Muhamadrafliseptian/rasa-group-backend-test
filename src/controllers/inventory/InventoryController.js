const pool = require('../../models/db');

exports.addBookStock = async (req, res) => {
  const { book_id, location, stock } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventory (book_id, location, stock)
       VALUES ($1, $2, $3) RETURNING *`,
      [book_id, location, stock]
    );
    res.status(201).json({
      statusCode: 201,
      message: 'Stok buku berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Gagal menambahkan stok buku',
      error: err.message
    });
  }
};

exports.getAllInventory = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const offset = (page - 1) * limit;

    const query = `
      SELECT i.*, b.title 
      FROM inventory i 
      JOIN books b ON i.book_id = b.id 
      WHERE b.title ILIKE $1
      ORDER BY i.id DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [`%${search}%`, limit, offset]);

    const totalQuery = `
      SELECT COUNT(*) AS total 
      FROM inventory i 
      JOIN books b ON i.book_id = b.id 
      WHERE b.title ILIKE $1
    `;
    const totalResult = await pool.query(totalQuery, [`%${search}%`]);

    res.status(200).json({
      statusCode: 200,
      message: 'Data inventaris berhasil diambil',
      data: result.rows,
      total: parseInt(totalResult.rows[0].total)
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Gagal mengambil data inventaris',
      error: err.message
    });
  }
};

exports.getInventoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT i.*, b.title 
       FROM inventory i 
       JOIN books b ON i.book_id = b.id 
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Stok tidak ditemukan'
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Detail stok berhasil diambil',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Gagal mengambil data stok',
      error: err.message
    });
  }
};

exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const { book_id, location, stock } = req.body;

  try {
    const result = await pool.query(
      `UPDATE inventory 
       SET book_id = $1, location = $2, stock = $3 
       WHERE id = $4 RETURNING *`,
      [book_id, location, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Stok tidak ditemukan'
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Stok buku berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Gagal memperbarui stok',
      error: err.message
    });
  }
};

// ✅ DELETE
exports.deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM inventory WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Stok tidak ditemukan'
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Stok buku berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: 'Gagal menghapus stok',
      error: err.message
    });
  }
};
