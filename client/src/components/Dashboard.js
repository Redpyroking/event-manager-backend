import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EventList from './EventList';

function Dashboard({ events, user, setEvents }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter events based on search term (case-insensitive)
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Callback to update events when one is deleted
  const handleDelete = (id) => {
    setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
  };

  return (
    <div>
      <h1>Event Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <Link to="/create-event">Create New Event</Link>
      
      <div>
        <input 
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <EventList events={filteredEvents} onDelete={handleDelete} />
    </div>
  );
}

export default Dashboard;
