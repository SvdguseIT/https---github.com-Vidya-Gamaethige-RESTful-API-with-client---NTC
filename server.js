require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // MongoDB connection
const cookieParser = require('cookie-parser'); // Import cookie-parser
const http = require('http'); // Core HTTP module for integrating Socket.IO

const setupSwagger = require('./config/swagger'); // Import Swagger setup

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const commuterRoutes = require('./routes/commuterRoutes'); // Commuter routes
const operatorRoutes = require('./routes/operatorRoutes'); // Operator routes

// Create Express app
const app = express();

// Middleware setup
const commuterMiddleware = (req, res, next) => {
    const userRole = req.cookies.role || ''; // Get user role from cookies
    if (userRole !== 'commuter') {
        return res.status(403).json({ message: 'Access denied. Commuter role required.' });
    }
    next(); // If role matches, proceed to next middleware
};

const operatorMiddleware = (req, res, next) => {
    const userRole = req.cookies.role || ''; // Get user role from cookies
    if (userRole !== 'operator') {
        return res.status(403).json({ message: 'Access denied. Operator role required.' });
    }
    next(); // If role matches, proceed to next middleware
};

setupSwagger(app); // Enable Swagger UI at /api-docs

// Middleware to parse incoming JSON requests
app.use(bodyParser.json()); // Parses JSON request bodies

// Middleware to parse incoming urlencoded request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded data

// Middleware to parse JSON request bodies
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// MongoDB Connection
const connectDB = async () => {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit if database connection fails
    }
};

// Call MongoDB connection
connectDB();

// Add routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/commuter', commuterMiddleware, commuterRoutes); // Commuter routes with middleware
app.use('/api/operator', operatorMiddleware, operatorRoutes); // Operator routes with middleware

// Default route for testing
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the NTC Seat Reservation API!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
