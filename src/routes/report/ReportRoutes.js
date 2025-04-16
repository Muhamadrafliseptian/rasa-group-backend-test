const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/report/ReportController');

router.get('/history', reportController.getLoanHistory);

module.exports = router;
