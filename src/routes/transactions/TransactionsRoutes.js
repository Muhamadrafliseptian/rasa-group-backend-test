const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transactions/TransactionController');

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.put('/:id/status', transactionController.updateTransactionStatus);

module.exports = router;
