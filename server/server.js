const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Socket.io connection for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

// Make io accessible to routes
app.set('socketio', io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
