const pool = require("../../models/db");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await pool.query(`
      SELECT 
        t.id AS transaction_id,
        t.loan_date,
        t.return_date,
        t.return_date_at,
        t.status,
        s.id AS student_id,
        s.name AS student_name
      FROM transactions t
      JOIN students s ON t.student_id = s.id
      ORDER BY t.loan_date DESC
    `);

    const transactionIds = transactions.rows.map((trx) => trx.transaction_id);

    const books = await pool.query(
      `
      SELECT 
        tb.transaction_id,
        b.id AS book_id,
        b.title AS book_title
      FROM transaction_books tb
      JOIN books b ON tb.book_id = b.id
      WHERE tb.transaction_id = ANY($1::int[])
    `,
      [transactionIds]
    );

    const result = transactions.rows.map((trx) => {
      const trxBooks = books.rows.filter(
        (b) => b.transaction_id === trx.transaction_id
      );
      return {
        ...trx,
        books: trxBooks.map((b) => ({
          book_id: b.book_id,
          title: b.book_title,
        })),
      };
    });

    res.status(200).json({
      statusCode: 200,
      message: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};

exports.createTransaction = async (req, res) => {
  const { student_id, books, duration } = req.body;

  try {
    const studentResult = await pool.query(
      "SELECT * FROM students WHERE id = $1 AND active = true",
      [student_id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: false,
        error: "Mahasiswa tidak aktif atau tidak ditemukan",
      });
    }

    const loanDuration = Math.min(Number(duration) || 14, 14);
    const loanDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(loanDate.getDate() + loanDuration);

    const transactionResult = await pool.query(
      `INSERT INTO transactions (student_id, loan_date, return_date, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [student_id, loanDate, returnDate, "dipinjam"]
    );

    const transactionId = transactionResult.rows[0].id;

    for (const item of books) {
      const { inventory_id, book_id } = item;

      const stockResult = await pool.query(
        "SELECT stock FROM inventory WHERE id = $1 AND book_id = $2",
        [inventory_id, book_id]
      );

      if (stockResult.rows.length === 0 || stockResult.rows[0].stock <= 0) {
        return res.status(400).json({
          statusCode: 400,
          message: false,
          error: `Stok tidak tersedia untuk buku ID ${book_id} di rak ID ${inventory_id}`,
        });
      }

      await pool.query("UPDATE inventory SET stock = stock - 1 WHERE id = $1", [
        inventory_id,
      ]);

      await pool.query(
        `INSERT INTO transaction_books (transaction_id, book_id, inventory_id)
         VALUES ($1, $2, $3)`,
        [transactionId, book_id, inventory_id]
      );
    }

    res.status(201).json({
      statusCode: 201,
      message: true,
      transactionId,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["dipinjam", "dikembalikan"].includes(status)) {
    return res.status(400).json({
      statusCode: 400,
      message: false,
      error: 'Status tidak valid. Gunakan "dipinjam" atau "dikembalikan".',
    });
  }

  try {
    const check = await pool.query("SELECT * FROM transactions WHERE id = $1", [
      id,
    ]);

    if (check.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: false,
        error: "Transaksi tidak ditemukan",
      });
    }

    if (status === "dikembalikan" && check.rows[0].status !== "dikembalikan") {
      const books = await pool.query(
        "SELECT inventory_id FROM transaction_books WHERE transaction_id = $1",
        [id]
      );

      for (const { inventory_id } of books.rows) {
        await pool.query(
          "UPDATE inventory SET stock = stock + 1 WHERE id = $1",
          [inventory_id]
        );
      }

      await pool.query(
        "UPDATE transactions SET status = $1, return_date_at = NOW() WHERE id = $2",
        [status, id]
      );
    } else {
      await pool.query("UPDATE transactions SET status = $1 WHERE id = $2", [
        status,
        id,
      ]);
    }

    res.status(200).json({
      statusCode: 200,
      message: true,
      info: `Status transaksi ${id} berhasil diubah ke "${status}"`,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: false,
      error: err.message,
    });
  }
};
