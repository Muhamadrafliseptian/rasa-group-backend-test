const pool = require("../../models/db");

exports.getLoanHistory = async (req, res) => {
  const { nim, name, book_id, title, start_date, end_date } = req.query;
  try {
    let query = `
      SELECT t.id, s.nim, s.name, b.id AS book_id, b.title, t.loan_date, t.return_date
      FROM transactions t
      JOIN students s ON t.student_id = s.id
      JOIN transaction_books tb ON t.id = tb.transaction_id
      JOIN books b ON tb.book_id = b.id
      WHERE 1=1
    `;

    const params = [];
    let counter = 1;

    if (nim) {
      query += ` AND s.nim = $${counter++}`;
      params.push(nim);
    }
    if (name) {
      query += ` AND s.name ILIKE $${counter++}`;
      params.push(`%${name}%`);
    }
    if (book_id) {
      query += ` AND b.id = $${counter++}`;
      params.push(book_id);
    }
    if (title) {
      query += ` AND b.title ILIKE $${counter++}`;
      params.push(`%${title}%`);
    }
    if (start_date) {
      query += ` AND t.loan_date >= $${counter++}`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND t.loan_date <= $${counter++}`;
      params.push(end_date);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
