const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Telehealth Platform API is running');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const healthContentRoutes = require('./routes/healthContent');
const ussdRoutes = require('./routes/ussd');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-content', healthContentRoutes);
app.use('/api/ussd', ussdRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join consultation room
  socket.on('joinRoom', (appointmentId) => {
    socket.join(appointmentId);
    console.log(`User joined room: ${appointmentId}`);
  });

  // Handle messages in consultation
  socket.on('sendMessage', (data) => {
    io.to(data.appointmentId).emit('message', data);
  });

  // Handle video/audio signals
  socket.on('signal', (data) => {
    io.to(data.appointmentId).emit('signal', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB with improved error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/telehealth';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    
    // Start server only after successful DB connection
    startServer();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Starting server without MongoDB connection...');
    
    // Start server even if DB connection fails
    startServer();
  }
};

// Function to start the server with a specific port
const startServer = () => {
  // Use environment variable PORT or default to 4000
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    console.error('Server error:', err);
  });
};

// Initialize connection
connectDB();