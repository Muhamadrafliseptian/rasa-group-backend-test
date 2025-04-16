const pool = require("../../models/db");

exports.getAllBooks = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM books
      WHERE 
        title ILIKE $1 OR
        author ILIKE $1 OR
        publisher ILIKE $1 OR
        isbn ILIKE $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [`%${search}%`, limit, offset]);

    const totalQuery = `
      SELECT COUNT(*) AS total FROM books
      WHERE 
        title ILIKE $1 OR
        author ILIKE $1 OR
        publisher ILIKE $1 OR
        isbn ILIKE $1
    `;
    const totalResult = await pool.query(totalQuery, [`%${search}%`]);

    res.status(200).json({
      statusCode: 200,
      message: true,
      data: result.rows,
      total: parseInt(totalResult.rows[0].total),
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: false,
        error: "Book not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: true,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};

exports.createBook = async (req, res) => {
  const { title, author, publisher, year, isbn } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, publisher, year, isbn)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, author, publisher, year, isbn]
    );
    res.status(201).json({
      statusCode: 201,
      message: true,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, publisher, year, isbn } = req.body;
  try {
    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, publisher = $3, year = $4, isbn = $5
       WHERE id = $6 RETURNING *`,
      [title, author, publisher, year, isbn, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: false,
        error: "Book not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: true,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: false,
        error: "Book not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: true,
      data: "Book deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};
