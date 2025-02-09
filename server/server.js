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

app.use('/api/upload', require('./routes/upload'));

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

// Event Creation Endpoint
app.post('/api/events', verifyToken, async (req, res) => {
  const { title, description } = req.body;
  try {
      const newEvent = new Event({
          title,
          description,
          createdBy: req.user._id, // Assume user info from token
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
      const updatedEvent = await Event.findByIdAndUpdate(id, { attendees }, { new: true });

      // Emit the 'attendeeUpdate' socket event to all clients
      io.emit('attendeeUpdate', { eventId: id, attendees: updatedEvent.attendees });

      res.status(200).json(updatedEvent);
  } catch (err) {
      res.status(500).json({ message: 'Error updating attendees', error: err.message });
  }
});
