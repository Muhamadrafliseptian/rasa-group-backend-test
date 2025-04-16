const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'rafi',
  password: 'password123',
  database: 'book_loan_system',
});

module.exports = pool;
