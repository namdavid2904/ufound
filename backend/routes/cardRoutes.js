const express = require('express');
const { reportFoundCard, searchLostCard } = require('../controller/cardController');
const authMW = require('../middleware/authMW');
const router = express.Router();

router.post('/report-found', reportFoundCard);
router.get('/search-lost', searchLostCard);

module.exports = router;