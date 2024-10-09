const express = require('express');
const { initializeDatabase, getTransactions, getStatistics, getBarChartData, getPieChartData } = require('../controllers/transactionController');
const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChartData);
router.get('/piechart', getPieChartData);

module.exports = router;
