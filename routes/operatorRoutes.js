/**
 * @swagger
 * tags:
 *   - name: Managing Operator
 *     description: Operator endpoints for managing their trips
 */

/**
 * @swagger
 * /api/operator/trips:
 *   get:
 *     tags:
 *       - Managing Operator
 *     summary: Get trips assigned to the operator
 *     description: Operator can view trips assigned to them.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of operator trips
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/operator/trips/{tripId}/status:
 *   put:
 *     tags:
 *       - Managing Operator
 *     summary: Update trip status
 *     description: Operator can update the status of a trip (e.g., completed or cancelled).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [completed, cancelled]
 *     responses:
 *       200:
 *         description: Trip status updated successfully
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */


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

