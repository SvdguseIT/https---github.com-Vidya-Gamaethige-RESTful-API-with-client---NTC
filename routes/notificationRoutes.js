/**
 * @swagger
 * tags:
 *   - name: Managing Notification
 *     description: Commuter endpoints for viewing and managing their notifications
 */

/**
 * @swagger
 * /api/commuter/notifications:
 *   get:
 *     tags:
 *       - Managing Notification
 *     summary: Get commuter's notifications
 *     description: Retrieve all notifications sent to the logged-in commuter.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/commuter/notifications/mark-read:
 *   post:
 *     tags:
 *       - Managing Notification
 *     summary: Mark all notifications as read
 *     description: Mark all unread notifications of the commuter as read.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       500:
 *         description: Server error
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { commuterMiddleware } = require('../middleware/commuterMiddleware');

// Get my notifications
router.get('/', authMiddleware, commuterMiddleware, notificationController.getMyNotifications);

// Mark notifications as read
router.post('/mark-read', authMiddleware, commuterMiddleware, notificationController.markAllAsRead);

module.exports = router;
