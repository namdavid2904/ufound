const express = require('express');
const { reportFoundCard, searchLostCard } = require('../controller/cardController');
const authMW = require('../middleware/authMW');
const router = express.Router();

router.post('/report-found', authMW, reportFoundCard);
router.get('/search-lost', authMW, searchLostCard);

module.exports = router;