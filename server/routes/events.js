const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../config/authMiddleware');

const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', ['name', 'email']);
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('date', 'Valid date is required').isISO8601()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, description, date } = req.body;
    try {
      const newEvent = new Event({
        title,
        description,
        date,
        createdBy: req.user.id
      });
      const event = await newEvent.save();

      // Emit real-time event creation
      const io = req.app.get('socketio');
      console.log("New event created:", event);
      io.emit('newEvent', event);

      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, date } = req.body;
  const eventFields = {};
  if (title) eventFields.title = title;
  if (description) eventFields.description = description;
  if (date) eventFields.date = date;

  try {
    let event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ msg: 'Event not found' });

    // Check user ownership
    if (event.createdBy.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    // Emit real-time event update
    const io = req.app.get('socketio');
    io.emit('updateEvent', event);

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ msg: 'Event not found' });

    // Check user ownership
    if (event.createdBy.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    await Event.findByIdAndDelete(req.params.id);

    // Emit real-time event deletion
    const io = req.app.get('socketio');
    io.emit('deleteEvent', { id: req.params.id });

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
