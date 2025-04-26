const express = require('express');
const router = express.Router();

// Example route for commuters
router.get('/profile', (req, res) => {
    res.status(200).json({ message: 'Commuter profile data' });
});

module.exports = router;
