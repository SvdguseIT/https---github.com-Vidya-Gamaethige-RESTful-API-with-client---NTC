const express = require('express');
const router = express.Router();
const commuterController = require('../controllers/commuterController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { commuterMiddleware } = require('../middleware/commuterMiddleware');

/**
 * @swagger
 * /api/commuter/book:
 *   post:
 *     tags:
 *       - Managing Booking
 *     summary: Book a seat for a trip
 *     description: Commuter books a seat on a specific trip.
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
 *               seatNumber:
 *                 type: integer
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
 *     description: View all bookings for the logged-in commuter.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/commuter/pay:
 *   post:
 *     tags:
 *       - Managing Booking
 *     summary: Pay for a booking (mock payment)
 *     description: Mock payment to confirm a booking.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment successful
 *       400:
 *         description: Payment already confirmed
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/commuter/cancel-booking:
 *   post:
 *     tags:
 *       - Managing Booking
 *     summary: Cancel a booking
 *     description: Commuter can cancel their seat booking if payment is still pending.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking to cancel
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 *       400:
 *         description: Cannot cancel a confirmed booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

// 🚀 Routes
router.post('/book', authMiddleware, commuterMiddleware, commuterController.bookSeat);
router.get('/bookings', authMiddleware, commuterMiddleware, commuterController.getMyBookings);
router.post('/pay', authMiddleware, commuterMiddleware, commuterController.payBooking);
router.post('/cancel-booking', authMiddleware, commuterMiddleware, commuterController.cancelBooking);

module.exports = router;
