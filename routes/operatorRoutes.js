const express = require('express');
const router = express.Router();

// Import controller properly
const operatorController = require('../controllers/operatorController');

// Import middlewares properly
const { authMiddleware } = require('../middleware/authMiddleware');
const { operatorMiddleware } = require('../middleware/operatorMiddleware');

// View operator's own buses
router.get('/my-buses', authMiddleware, operatorMiddleware, operatorController.getMyBuses);

// View operator's own trips
router.get('/my-trips', authMiddleware, operatorMiddleware, operatorController.getMyTrips);

module.exports = router;

