import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import EventForm from './components/EventForm';
import EditEventForm from './components/EditEventForm';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Listen for real-time event updates
    socket.on('newEvent', (event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
    });

    socket.on('updateEvent', (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    socket.on('deleteEvent', ({ id }) => {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== id)
      );
    });

    socket.on('attendeeUpdate', (updateData) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updateData.eventId
            ? { ...event, attendees: updateData.attendees }
            : event
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      console.log("Fetched events:", res.data); // Debug log
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Dashboard events={events} user={user} setEvents={setEvents} />
              ) : (
                <Auth setUser={setUser} />
              )
            }
          />
          <Route path="/create-event" element={<EventForm user={user} />} />
          <Route path="/edit-event/:id" element={<EditEventForm user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
