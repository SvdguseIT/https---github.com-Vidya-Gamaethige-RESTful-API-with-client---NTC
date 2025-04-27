/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints (Login, Register, Logout)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account (admin, operator, commuter).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, operator, commuter]
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Invalid input or user already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Authenticate user and receive JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout a user
 *     description: Logout user and clear session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Invalid or expired token
 */


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User Registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

// User Logout
router.post('/logout', authController.logout);

module.exports = router;


