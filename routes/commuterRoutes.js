const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const { commuterMiddleware } = require('../middleware/commuterMiddleware');
const commuterController = require('../controllers/commuterController');

// Book a seat
router.post('/book', authMiddleware, commuterMiddleware, commuterController.bookSeat);

module.exports = router;




