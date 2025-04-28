const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server (for Socket.IO)
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Save io instance inside app for access anywhere
app.set('io', io);

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Swagger Setup
const setupSwagger = require('./config/swagger');
setupSwagger(app);

// Import middlewares
const { authMiddleware } = require('./middleware/authMiddleware');
const { adminMiddleware } = require('./middleware/adminMiddleware');
const { operatorMiddleware } = require('./middleware/operatorMiddleware');
const { commuterMiddleware } = require('./middleware/commuterMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const commuterRoutes = require('./routes/commuterRoutes');
const operatorRoutes = require('./routes/operatorRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // 📢 Add notification routes

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes);
app.use('/api/operator', authMiddleware, operatorMiddleware, operatorRoutes);
app.use('/api/commuter', authMiddleware, commuterMiddleware, commuterRoutes);
app.use('/api/commuter/notifications', authMiddleware, commuterMiddleware, notificationRoutes); // 📢 notification API

// Root API
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to NTC Seat Reservation API (with Real-time 🔥)' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running with Real-time WebSocket on http://localhost:${PORT}`);
});

