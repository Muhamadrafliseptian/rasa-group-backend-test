const pool = require('../../models/db');

exports.getAllStudents = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM students
      WHERE name ILIKE $1 OR nim ILIKE $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [`%${search}%`, limit, offset]);

    res.status(200).json({
      statusCode: 200,
      message: true,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};

exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: false,
        error: 'Student not found'
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message
    });
  }
};

exports.createStudent = async (req, res) => {
  const { nim, name, active } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO students (nim, name, active)
       VALUES ($1, $2, $3) RETURNING *`,
      [nim, name, active]
    );
    res.status(201).json({
      statusCode: 201,
      message: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message
    });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { nim, name, active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE students
       SET nim = $1, name = $2, active = $3
       WHERE id = $4 RETURNING *`,
      [nim, name, active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: false,
        error: 'Student not found'
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message
    });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: false,
        error: 'Student not found'
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: true,
      data: { message: 'Student deleted successfully' }
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message
    });
  }
};
