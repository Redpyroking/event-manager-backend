const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const Event = require('./models/Event'); 
require('dotenv').config();
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
      return res.status(403).json({ message: 'Access denied' });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded.user;
      next();
  } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
  }
}


// Routes
app.use('/api/upload', require('./routes/upload'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Socket.io connection for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

// Event Creation Endpoint
app.post('/api/events', verifyToken, async (req, res) => {
  const { title, description,date } = req.body;
  try {
      const newEvent = new Event({
          title,
          description,
          date,
          createdBy: req.user._id, 
      });
      await newEvent.save();

      // Emit the 'newEvent' socket event to all clients
      io.emit('newEvent', newEvent);

      res.status(201).json(newEvent);
  } catch (err) {
      res.status(500).json({ message: 'Error creating event', error: err.message });
  }
});

// Event Update Endpoint
app.put('/api/events/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
      const updatedEvent = await Event.findByIdAndUpdate(id, { title, description }, { new: true });

      // Emit the 'updateEvent' socket event to all clients
      io.emit('updateEvent', updatedEvent);

      res.status(200).json(updatedEvent);
  } catch (err) {
      res.status(500).json({ message: 'Error updating event', error: err.message });
  }
});

// Event Deletion Endpoint
app.delete('/api/events/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
      await Event.findByIdAndDelete(id);

      // Emit the 'deleteEvent' socket event to all clients
      io.emit('deleteEvent', { id });

      res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
      res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
});

// Attendee Update Endpoint (if needed)
app.patch('/api/events/:id/attendees', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { attendees } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $addToSet: { attendees: req.user._id } }, // Adds user ID if not present
      { new: true }
    );

      // Emit the 'attendeeUpdate' socket event to all clients
      io.emit('attendeeUpdate', { eventId: id, attendees: updatedEvent.attendees });

      res.status(200).json(updatedEvent);
  } catch (err) {
      res.status(500).json({ message: 'Error updating attendees', error: err.message });
  }
});

app.set('socketio', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});