import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventItem({ event, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Callback to update events in parent component
      onDelete(event._id);
    } catch (error) {
      console.error('Error deleting event:', error.response.data);
    }
  };

  const handleEdit = () => {
    // Navigate to the edit event page
    navigate(`/edit-event/${event._id}`);
  };

  const handleAttend = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:5000/api/events/${event._id}/attend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The Socket.IO listener in App.js will update the attendee count in real time.
    } catch (error) {
      console.error('Error attending event:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Attendees: {event.attendees ? event.attendees.length : 0}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleAttend}>Attend</button>
    </div>
  );
}

export default EventItem;
