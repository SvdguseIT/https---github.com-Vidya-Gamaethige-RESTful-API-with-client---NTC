/**
 * @swagger
 * tags:
 *   - name: Managing Booking
 *     description: Commuter endpoints for booking seats and viewing bookings
 */

/**
 * @swagger
 * /api/commuter/book:
 *   post:
 *     tags:
 *       - Managing Booking
 *     summary: Book a seat for a trip
 *     description: Commuter can book a seat on a trip.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripId
 *               - seatNumber
 *             properties:
 *               tripId:
 *                 type: string
 *                 description: Trip ID
 *               seatNumber:
 *                 type: number
 *                 description: Seat number to book
 *     responses:
 *       201:
 *         description: Seat booked successfully
 *       400:
 *         description: Seat already booked or invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/commuter/bookings:
 *   get:
 *     tags:
 *       - Managing Booking
 *     summary: View commuter's bookings
 *     description: Commuter can view their own bookings.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       500:
 *         description: Server error
 */


const express = require('express');
const router = express.Router();
const commuterController = require('../controllers/commuterController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { commuterMiddleware } = require('../middleware/commuterMiddleware');

// Book a seat
router.post('/book', authMiddleware, commuterMiddleware, commuterController.bookSeat);

// View my bookings
router.get('/bookings', authMiddleware, commuterMiddleware, commuterController.getMyBookings);

module.exports = router;





