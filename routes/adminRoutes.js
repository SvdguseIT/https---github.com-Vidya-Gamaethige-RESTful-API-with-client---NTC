// ----------------- Swagger Documentation First -----------------

/**
 * @swagger
 * tags:
 *   - name: Managing Bus
 *     description: Admin bus management endpoints
 *   - name: Managing Route
 *     description: Admin route management endpoints
 *   - name: Managing Trip
 *     description: Admin trip management endpoints
 */

// Buses
/**
 * @swagger
 * /api/admin/buses:
 *   post:
 *     tags:
 *       - Managing Bus
 *     summary: Add a new bus
 *     description: Admin can add a new bus.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ntcNo
 *               - busNo
 *               - driverId
 *               - conductorId
 *               - busType
 *               - busName
 *               - routeId
 *             properties:
 *               ntcNo:
 *                 type: string
 *               busNo:
 *                 type: string
 *               driverId:
 *                 type: string
 *               conductorId:
 *                 type: string
 *               busType:
 *                 type: string
 *                 enum: [AC, Semi, Non-AC]
 *               busName:
 *                 type: string
 *               routeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bus added successfully
 *       400:
 *         description: Bus already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/buses:
 *   get:
 *     tags:
 *       - Managing Bus
 *     summary: Get all buses
 *     description: Admin can view all buses.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server error
 */

// Routes
/**
 * @swagger
 * /api/admin/routes:
 *   post:
 *     tags:
 *       - Managing Route
 *     summary: Add a new route
 *     description: Admin can add new routes.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - start
 *               - end
 *               - totalDistance
 *             properties:
 *               number:
 *                 type: string
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 *               totalDistance:
 *                 type: string
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Route already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/routes:
 *   get:
 *     tags:
 *       - Managing Route
 *     summary: Search routes
 *     description: Search routes by start and end.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of routes
 *       500:
 *         description: Server error
 */

// Trips
/**
 * @swagger
 * /api/admin/trips:
 *   post:
 *     tags:
 *       - Managing Trip
 *     summary: Add a new trip
 *     description: Admin schedules a new trip.
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
 *               - routeId
 *               - busId
 *               - startTime
 *               - endTime
 *               - date
 *               - totalSeats
 *             properties:
 *               tripId:
 *                 type: string
 *               routeId:
 *                 type: string
 *               busId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               date:
 *                 type: string
 *                 format: date
 *               totalSeats:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Trip added successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/trips:
 *   get:
 *     tags:
 *       - Managing Trip
 *     summary: Get all trips
 *     description: Admin can view all trips.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips
 *       500:
 *         description: Server error
 */

// ----------------- Normal Express Code Below -----------------

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// --- Bus Management Routes ---
router.post('/buses', authMiddleware, adminMiddleware, adminController.addBus);
router.get('/buses', authMiddleware, adminMiddleware, adminController.getAllBuses);
router.get('/buses/:ntcNo', authMiddleware, adminMiddleware, adminController.getBusByNtcNo);
router.put('/buses/:ntcNo', authMiddleware, adminMiddleware, adminController.updateBusByNtcNo);
router.delete('/buses/:ntcNo', authMiddleware, adminMiddleware, adminController.deleteBusByNtcNo);

// --- Route Management Routes ---
router.get('/routes', authMiddleware, adminMiddleware, adminController.searchRoutes);
router.post('/routes', authMiddleware, adminMiddleware, adminController.createRoute);
router.put('/routes/:id', authMiddleware, adminMiddleware, adminController.updateRoute);
router.delete('/routes/:id', authMiddleware, adminMiddleware, adminController.deleteRoute);

// --- Trip Management Routes ---
router.post('/trips', authMiddleware, adminMiddleware, adminController.addTrip);
router.get('/trips', authMiddleware, adminMiddleware, adminController.getAllTrips);
router.put('/trips/:tripId', authMiddleware, adminMiddleware, adminController.updateTrip);
router.put('/trips/:tripId/cancel', authMiddleware, adminMiddleware, adminController.cancelTrip);

// --- Operator Management Routes ---
router.post('/operators', authMiddleware, adminMiddleware, adminController.addOperator);
router.put('/operators/:id', authMiddleware, adminMiddleware, adminController.updateOperator);
router.delete('/operators/:id', authMiddleware, adminMiddleware, adminController.deleteOperator);

module.exports = router;