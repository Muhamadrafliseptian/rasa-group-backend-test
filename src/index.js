const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const bookRoutes = require('./routes/book/BookRoutes');
const studentRoutes = require('./routes/student/StudentRoutes');
const inventoryRoutes = require('./routes/inventory/InventoryRoutes');
const transactionRoutes = require('./routes/transactions/TransactionsRoutes');
const reportRoutes = require('./routes/report/ReportRoutes');
app.use('/api/books', bookRoutes);
app.use('/api/student', studentRoutes)
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
