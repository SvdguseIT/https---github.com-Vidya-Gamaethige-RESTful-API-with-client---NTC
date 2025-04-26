const express = require('express');
const router = express.Router();

// Example route for operators
router.get('/dashboard', (req, res) => {
    res.status(200).json({ message: 'Operator dashboard data' });
});

module.exports = router;
